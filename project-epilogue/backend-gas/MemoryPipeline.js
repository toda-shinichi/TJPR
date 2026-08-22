/**
 * Project Epilogue - 記憶管線與設定集注入引擎
 * 檔案：MemoryPipeline.js
 * 
 * 核心功能：
 * 1. 分層設定集 (Tiered Lorebook) 動態注入 (Tier 1: 主角 / Tier 2: 當前場景 NPC / Tier 3: 全域索引)
 * 2. 雙模型記憶迴圈：每 5 回合滾動壓縮摘要池（<= 2000 字元）、每 10 回合執行一致性審查
 * 3. 幕篇重整 (Act Rebase)：800 字幕篇檔案生成與上下文視窗歸零重置
 */

var MemoryPipeline = (function() {

  /**
   * 初始化全新小說存檔狀態（支援自訂玩家角色卡、男主目標、成人互動開關與開場情境）
   */
  function initializeNewNovel(userSession, playerProfile) {
    playerProfile = playerProfile || {};
    var targetLeadId = playerProfile.targetLead || '01_徐令謙';
    var targetLeadName = playerProfile.targetLeadName || '徐令謙';
    var isR18Allowed = playerProfile.allowR18 !== false;

    var initialSaveState = {
      meta: {
        userId: userSession.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentAct: 1,
        playerProfile: {
          name: playerProfile.name || '玩家',
          gender: playerProfile.gender || '女',
          age: playerProfile.age || '26',
          profession: playerProfile.profession || '獨立調查記者',
          background: playerProfile.background || '追查三年前未結懸案',
          appearance: playerProfile.appearance || '深色俐落套裝，眼神冷靜敏銳',
          taboos: playerProfile.taboos || '無特定雷區',
          targetLead: targetLeadId,
          targetLeadName: targetLeadName,
          allowR18: isR18Allowed,
          customScenario: playerProfile.customScenario || ''
        }
      },
      turnCount: 1,
      protagonist: {
        id: targetLeadId,
        name: targetLeadName,
        hp: 100,
        sanity: 100,
        statusEffects: []
      },
      inventory: [
        { id: 'item_press_card', name: '特許採訪證 / 密錄隨身碟', count: 1, desc: '隨身攜帶的關鍵調查底牌。' }
      ],
      relationships: {},
      questFlags: {
        main_quest: '入局：與 ' + targetLeadName + ' 的首次交鋒與權力推拉'
      },
      summaryPool: '',
      actDossiers: [],
      turnHistory: [],
      auditLog: []
    };
    initialSaveState.relationships[targetLeadName] = 15;

    // 開局自定義情境或預設啟程
    var startActionText = playerProfile.customScenario ? ('自定義開場情境：' + playerProfile.customScenario) : ('開局啟程：與主要對象 ' + targetLeadName + ' 產生命運交集');

    var promptContext = buildTurnPromptContext({
      userSession: userSession,
      saveState: initialSaveState,
      choiceId: 'START_STORY',
      customInput: startActionText
    });

    var result = AIService.generateNextChapter(promptContext);
    var chapterData = result.data;

    // 更新存檔狀態
    var turnRecord = {
      turn: 1,
      choice: 'START_STORY',
      title: chapterData.chapterTitle || ('第 1 回．初會 ' + targetLeadName),
      prose: (chapterData.prose || '').substring(0, 1800),
      summaryDelta: chapterData.narrativeSummaryDelta || ('與 ' + targetLeadName + ' 的初次交鋒')
    };
    initialSaveState.turnHistory.push(turnRecord);
    initialSaveState.summaryPool = chapterData.narrativeSummaryDelta || ('故事於此正式展開，玩家與 ' + targetLeadName + ' 產生命運交集。');

    // 寫入 Google Drive
    StorageService.appendChapterToNovel(
      userSession.driveFolderId,
      1,
      turnRecord.title,
      chapterData.prose
    );
    StorageService.saveSaveState(userSession.driveFolderId, initialSaveState);

    return {
      turn: 1,
      chapter: chapterData,
      saveState: initialSaveState,
      modelUsed: result.modelUsed
    };
  }

  /**
   * 建構分層設定集 (Tiered Lorebook) 內容，調用 CharacterManager 高速快取與動態偵測
   */
  function buildTieredLorebook(saveState, recentContextText, playerChoice) {
    var playerProfile = (saveState.meta && saveState.meta.playerProfile) || {};
    var primaryLeadKey = playerProfile.targetLead || '01_徐令謙';
    var isShura = primaryLeadKey === '修羅場' || playerProfile.targetLeadName === '修羅場';

    // 1. 調用 CharacterManager 偵測在場配角 (Tier 2)
    var activeNPCs = CharacterManager.detectActiveNPCs(recentContextText, playerChoice, primaryLeadKey);

    // 2. 組裝三層角色提示詞區塊
    var characterBlock = CharacterManager.assembleCharacterPromptBlock(primaryLeadKey, activeNPCs, isShura);

    return {
      characterBlock: characterBlock,
      activeNPCs: activeNPCs
    };
  }

  /**
   * 組裝主要敘事模型提示詞內容 (Prompt Context)
   */
  /**
   * 補齊用戶端傳來的存檔缺漏欄位。
   * saveState 來自 payload.saveState（完全由用戶端控制），先前直接讀取
   * saveState.turnHistory / protagonist.hp / meta.currentAct，任何欄位缺漏
   * 都會讓整個 doPost 以 500 收場。
   */
  function normalizeSaveState(saveState) {
    var s = saveState || {};
    s.meta = s.meta || {};
    if (typeof s.turnCount !== 'number' || !isFinite(s.turnCount) || s.turnCount < 1) {
      s.turnCount = 1;
    }
    s.protagonist = s.protagonist || {};
    if (typeof s.protagonist.hp !== 'number') s.protagonist.hp = 100;
    if (typeof s.protagonist.sanity !== 'number') s.protagonist.sanity = 100;
    if (!Array.isArray(s.inventory)) s.inventory = [];
    if (!Array.isArray(s.turnHistory)) s.turnHistory = [];
    if (!Array.isArray(s.actDossiers)) s.actDossiers = [];
    if (!Array.isArray(s.auditLog)) s.auditLog = [];
    if (!s.relationships || typeof s.relationships !== 'object') s.relationships = {};
    if (!s.questFlags || typeof s.questFlags !== 'object') s.questFlags = {};
    if (typeof s.summaryPool !== 'string') s.summaryPool = '';
    return s;
  }

  function buildTurnPromptContext(params) {
    var saveState = normalizeSaveState(params.saveState);
    var choiceId = params.choiceId;
    var customInput = params.customInput;
    var playerProfile = (saveState.meta && saveState.meta.playerProfile) || {};

    var globalRules = StorageService.getGlobalRules();
    var recentTurns = saveState.turnHistory.slice(-CONFIG.PIPELINE.RECENT_TURNS_CONTEXT_LIMIT);
    var recentTurnsText = JSON.stringify(recentTurns);

    var playerActionStr = customInput || choiceId;
    var tieredLore = buildTieredLorebook(saveState, recentTurnsText, playerActionStr);

    // 系統提示詞 (System Prompt) 整合 System_Directives.md 與 Romance_Aesthetics.md
    var systemPrompt = [
      '【核心定位】你是專精成人女性情感小說與權謀黑幫的頂級角色扮演敘事者與RPG核心引擎。',
      '',
      globalRules,
      '',
      '【最高指導原則】',
      '1. 絕對禁止OOC：100%沉浸式角色扮演，角色絕不承認是AI，依各自MBTI、身分背景、著裝風格與微表情細膩反應。',
      '2. 純文學沉浸正文：正文開頭【嚴禁出現「妳做出了抉擇」等系統破梗語】！小說正文必須宛如出版實體書，直接從劇中人物的動作、微表情、眼神交會、肢體觸摸與對話自然推進！',
      '3. 篇幅與深度：正文以 800–1000 個中文字為建議目標，但不是硬性限制；優先完整寫完一個有實質推進、情緒變化且自然收束的場景段落，可依內容需要略多或略少，不為守字數截斷場景，也不為湊字數灌水。細緻描寫環境氣味、光影、肢體距離、呼吸心跳、對話交鋒與微表情變化，且不套用固定模板。',
      '4. 嚴格身分防火牆：徐令謙是黑道玄辰幫二把手·天裕會中樞，絕非檢察官（士林地檢署檢察官是韓正寰），徐承勳是中華民國副總統，絕不可張冠李戴！',
      '5. 成人情慾文學指引（R-18）：極致性張力、高位推拉、寫實直白描寫肉體交纏、支配與臣服、五感具象（體溫、喘息、香氣、眼神壓迫、肢體撫摸）、權謀殺伐與多方博弈，使用純台灣繁體中文，拒絕隱晦暗喻！',
      '',
      tieredLore.characterBlock,
      '',
      '【輸出格式規範】',
      '你必須嚴格輸出標準 JSON 格式，請勿在 JSON 外附帶任何非 JSON 字串：',
      '{',
      '  "chapterTitle": "第 N 回．[自動生成章節名稱]",',
      '  "prose": "以 800–1000 個中文字為建議目標的純文學長篇正文，但不是硬性限制；優先完整寫完一個有推進、情緒變化且自然收束的場景段落，可依內容需要略多或略少，不為守字數截斷場景，也不為湊字數灌水。開頭嚴禁「妳選擇了」等系統語，直接由人物動作與情境切入。第三人稱現在式描寫五感細節、服裝著裝、微表情與對話交鋒；對話用引號「」。",',
      '  "narrativeSummaryDelta": "本回關鍵進展的 2~3 句話濃縮摘要（供記憶池更新）",',
      '  "statusPanel": {',
      '    "timeLocation": "時空（例如：2026年5月12日 21:30 星期二 於 台北市士林區德行法律事務所頂樓制策室）",',
      '    "tension": "張力值 [X%]",',
      '    "intoxication": "微醺度 [X%]",',
      '    "interaction": "關係狀態 ｜ 雙方物理距離與肢體姿態",',
      '    "outfit": "玩家著裝與神態 ｜ 男主姓名、著裝細節、眼神與肢體小動作",',
      '    "inventory": "特殊道具、關鍵情報清單",',
      '    "rumors": "政媒圈或黑白兩道對當前局勢的最新議論",',
      '    "pageCode": "P.001 遞增標碼"',
      '  },',
      '  "choices": [',
      '    { "id": "option_a", "label": "[A] 順應節奏／溫和／理智應對", "risk": "low", "hint": "順勢探查底牌" },',
      '    { "id": "option_b", "label": "[B] 反向推拉／保持防備／言語機鋒", "risk": "medium", "hint": "拉扯權力距離" },',
      '    { "id": "option_c", "label": "[C] 情慾暗示／主動靠近／破局點", "risk": "high", "hint": "激發性張力與情感反差" }',
      '  ],',
      '  "stateDelta": {',
      '    "hpChange": 0,',
      '    "sanityChange": 0,',
      '    "itemsAdded": [],',
      '    "relationshipChanges": {},',
      '    "questProgress": "劇情進展狀態更新"',
      '  }',
      '}'
    ].join('\n');

    // 使用者回合提示詞 (User Prompt) 注入玩家自訂角色卡與情境
    var userPromptParts = [
      '【玩家身分與角色設定卡 (Player Profile)】：',
      '- 姓名：' + (playerProfile.name || '玩家') + ' ｜ 性別：' + (playerProfile.gender || '女') + ' ｜ 年齡：' + (playerProfile.age || '26') + ' 歲',
      '- 職業與身分背景：' + (playerProfile.profession || '獨立調查記者') + '（' + (playerProfile.background || '追查懸案') + '）',
      '- 外貌與著裝風格：' + (playerProfile.appearance || '俐落知性，眼神銳利冷靜') + '',
      '- 不喜歡的字眼／雷區禁忌：' + (playerProfile.taboos || '無特定雷區') + '',
      '- 主要攻略目標：' + (playerProfile.targetLeadName || '徐令謙') + '',
      '- 成人互動 (R-18) 權限：' + (playerProfile.allowR18 ? '【允許 (慢熱推拉 + 臨界直白描寫)】' : '【關閉 (純情權謀 PG-15)】') + '',
      '',
      '【目前幕次】：第 ' + (saveState.meta.currentAct || 1) + ' 幕',
      '【當前回合】：第 ' + saveState.turnCount + ' 回合',
      '',
      '【歷史幕篇重整檔案 (Act Dossier)】：',
      saveState.actDossiers && saveState.actDossiers.length > 0 ? saveState.actDossiers.join('\n\n') : '（第 1 幕初始）',
      '',
      '【滾動高密度記憶摘要池 (Summary Pool)】：',
      saveState.summaryPool || '（暫無）',
      '',
      '【當前數值與狀態】：',
      '生命值 (HP): ' + saveState.protagonist.hp + ' / 100 | 理智值 (Sanity): ' + saveState.protagonist.sanity + ' / 100',
      '持有物品: ' + JSON.stringify(saveState.inventory),
      '人際關係: ' + JSON.stringify(saveState.relationships),
      '當前任務: ' + JSON.stringify(saveState.questFlags),
      '',
      '【近期故事回顧】：',
      JSON.stringify(recentTurns),
      '',
      '【玩家在上一回做出的決策】：',
      '選擇識別碼: ' + (choiceId || 'CUSTOM_ACTION'),
      '自訂動作/具體內容: ' + (customInput || '依照選項推進'),
      '',
      '請根據以上完整脈絡撰寫下一回精緻長篇情節並回傳標準 JSON。篇幅以 800–1000 個中文字為建議目標，但場景完整與實質推進優先，可自然略多或略少；不要截斷場景，也不要為湊字數灌水。'
    ];

    return {
      systemPrompt: systemPrompt,
      userPrompt: userPromptParts.join('\n')
    };
  }

  /**
   * 套用回合更新並觸發 5 回合摘要 / 10 回合稽核
   */
  function applyTurnUpdate(params) {
    var userSession = params.userSession;
    var saveState = normalizeSaveState(params.saveState);
    var turnOutput = params.turnOutput || {};
    var choiceSelected = params.choiceSelected;

    saveState.turnCount += 1;
    saveState.meta.updatedAt = new Date().toISOString();

    // 套用狀態變更 (stateDelta)
    if (turnOutput.stateDelta) {
      var delta = turnOutput.stateDelta;
      if (delta.hpChange) {
        saveState.protagonist.hp = Math.max(0, Math.min(100, (saveState.protagonist.hp || 100) + delta.hpChange));
      }
      if (delta.sanityChange) {
        saveState.protagonist.sanity = Math.max(0, Math.min(100, (saveState.protagonist.sanity || 100) + delta.sanityChange));
      }
      // 物品新增
      if (delta.itemsAdded && delta.itemsAdded.length > 0) {
        saveState.inventory = saveState.inventory.concat(delta.itemsAdded);
      }
      // 物品扣除
      if (delta.itemsRemoved && delta.itemsRemoved.length > 0) {
        saveState.inventory = saveState.inventory.filter(function(item) {
          return delta.itemsRemoved.indexOf(item.id) === -1;
        });
      }
      // 好感度更新
      if (delta.relationshipChanges) {
        for (var npc in delta.relationshipChanges) {
          // LLM 可能回傳字串或物件；舊存檔的 relationships 值也可能是物件
          // （{favorability:...}），直接相加會得到 NaN 並寫進存檔。
          var current = Number(saveState.relationships[npc]);
          if (!isFinite(current)) current = 0;
          var change = Number(delta.relationshipChanges[npc]);
          if (!isFinite(change)) continue;
          saveState.relationships[npc] = Math.max(0, Math.min(100, current + change));
        }
      }
      // 任務旗標更新
      if (delta.questProgress) {
        saveState.questFlags.latest_update = delta.questProgress;
      }
    }

    // 紀錄回合至歷史
    var turnRecord = {
      turn: saveState.turnCount,
      choice: choiceSelected,
      title: turnOutput.chapterTitle || ('第 ' + saveState.turnCount + ' 回合'),
      prose: (turnOutput.prose || '').substring(0, 1800),
      summaryDelta: turnOutput.narrativeSummaryDelta || ''
    };
    saveState.turnHistory.push(turnRecord);

    // 每 5 回合觸發：Fast Model 摘要池更新
    if (saveState.turnCount % CONFIG.PIPELINE.SUMMARY_UPDATE_CADENCE === 0) {
      var recentBatch = saveState.turnHistory.slice(-CONFIG.PIPELINE.SUMMARY_UPDATE_CADENCE);
      try {
        var updatedSummary = AIService.updateSummaryPool(saveState.summaryPool, recentBatch);
        saveState.summaryPool = updatedSummary;
      } catch (sumErr) {
        console.error('更新摘要池失敗: ' + sumErr.message);
      }
    }

    // 每 10 回合觸發：Fast Model 一致性稽核
    if (saveState.turnCount % CONFIG.PIPELINE.AUDIT_CADENCE === 0) {
      try {
        var auditReport = AIService.auditTurnConsistency({
          saveState: saveState,
          recentTurns: saveState.turnHistory.slice(-5),
          loreMarkdown: StorageService.getCharacterMarkdown(saveState.protagonist.id)
        });
        saveState.auditLog = saveState.auditLog || [];
        saveState.auditLog.push({
          turn: saveState.turnCount,
          timestamp: new Date().toISOString(),
          report: auditReport
        });
      } catch (auditErr) {
        console.error('執行一致性稽核失敗: ' + auditErr.message);
      }
    }

    return saveState;
  }

  /**
   * 幕篇重整 (Act Rebase) 執行器
   * 1. 讀取 Full_Novel.md
   * 2. 生成 800 字 Act Dossier
   * 3. 清空 turnHistory，歸零即時上下文視窗
   * 4. 幕次 +1
   */
  function executeActRebase(userSession, saveState) {
    var userFolderId = userSession.driveFolderId;
    var folder = DriveApp.getFolderById(userFolderId);
    var files = folder.getFilesByName(CONFIG.STORAGE.NOVEL_FILE_NAME);

    var fullProse = '';
    var currentNovelFile = null;
    if (files.hasNext()) {
      currentNovelFile = files.next();
      fullProse = currentNovelFile.getBlob().getDataAsString('UTF-8');
    }

    // 呼叫 AI 生成幕篇檔案。
    // 整幕正文會隨回合數線性膨脹（每回約 800 字），直接整份送出必定撞上
    // 模型 token 上限。此處保留頭尾兩段：開頭建立本幕基調，結尾承接下一幕。
    var MAX_DOSSIER_INPUT_CHARS = 40000; // 約當 68k tokens，仍遠低於 mistral-large 的 128k 視窗
    var dossierInput = fullProse;
    if (dossierInput.length > MAX_DOSSIER_INPUT_CHARS) {
      var headChars = Math.floor(MAX_DOSSIER_INPUT_CHARS * 0.4);
      var tailChars = MAX_DOSSIER_INPUT_CHARS - headChars;
      dossierInput = dossierInput.slice(0, headChars) +
        '\n\n……（本幕中段內容因長度過長已省略，請依前後文與下方摘要池推斷）……\n\n' +
        dossierInput.slice(-tailChars);
      console.info('executeActRebase：正文長度 ' + fullProse.length +
        ' 字元已裁切為 ' + dossierInput.length + ' 字元後送出。');
    }
    var actDossier = AIService.generateActDossier(dossierInput, saveState);

    // 封存並更新存檔狀態
    saveState.actDossiers = saveState.actDossiers || [];
    saveState.actDossiers.push(actDossier);

    // 備份當前幕小說紀錄為 Full_Novel_Act_X.md
    var actNumber = saveState.meta.currentAct || 1;
    var archiveStamp = new Date().toISOString().replace(/[:.]/g, '-');
    folder.createFile('Full_Novel_Act_' + actNumber + '_Archived_' + archiveStamp + '.md', fullProse, MimeType.PLAIN_TEXT);

    // 重置即時視窗
    saveState.meta.currentAct = actNumber + 1;
    saveState.turnHistory = []; // 上下文視窗歸零
    saveState.summaryPool = '【第 ' + actNumber + ' 幕已完結並重整】請根據幕篇檔案承接下一幕情節。';

    // 重新建立新的 Full_Novel.md
    if (currentNovelFile) {
      currentNovelFile.setContent('# Project Epilogue — 第 ' + saveState.meta.currentAct + ' 幕\n*建立時間：' + new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) + '*\n\n---\n');
    } else {
      folder.createFile(
        CONFIG.STORAGE.NOVEL_FILE_NAME,
        '# Project Epilogue — 第 ' + saveState.meta.currentAct + ' 幕\n*建立時間：' + new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) + '*\n\n---\n',
        MimeType.PLAIN_TEXT
      );
    }

    StorageService.saveSaveState(userFolderId, saveState);

    return {
      success: true,
      currentAct: saveState.meta.currentAct,
      actDossier: actDossier,
      saveState: saveState
    };
  }

  /**
   * 手動觸發一致性稽核
   */
  function runTurnAudit(userSession, saveState) {
    return AIService.auditTurnConsistency({
      saveState: saveState,
      recentTurns: saveState.turnHistory.slice(-5),
      loreMarkdown: StorageService.getCharacterMarkdown(saveState.protagonist.id)
    });
  }

  return {
    initializeNewNovel: initializeNewNovel,
    buildTieredLorebook: buildTieredLorebook,
    buildTurnPromptContext: buildTurnPromptContext,
    applyTurnUpdate: applyTurnUpdate,
    executeActRebase: executeActRebase,
    runTurnAudit: runTurnAudit
  };

})();
