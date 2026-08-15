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
      prosePreview: (chapterData.prose || '').substring(0, 120) + '...',
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
   * 建構分層設定集 (Tiered Lorebook) 內容
   */
  function buildTieredLorebook(saveState, recentContextText) {
    var lore = {
      tier1MainChar: '',
      tier2ActiveNPCs: '',
      tier3GlobalIndex: ''
    };

    // Tier 1: 主角完整設定 Markdown
    var mainCharId = (saveState.protagonist && saveState.protagonist.id) || '01_徐令謙';
    lore.tier1MainChar = StorageService.getCharacterMarkdown(mainCharId);

    // Tier 2: 動態關鍵字比對當前場景 NPC
    var allCharacters = StorageService.listCharacters();
    var activeNPCsContent = [];
    var searchCorpus = (recentContextText + ' ' + (saveState.summaryPool || '')).toLowerCase();

    for (var i = 0; i < allCharacters.length; i++) {
      var charMeta = allCharacters[i];
      if (charMeta.id !== mainCharId) {
        if (searchCorpus.indexOf(charMeta.name.toLowerCase()) !== -1 || searchCorpus.indexOf(charMeta.id.toLowerCase()) !== -1) {
          var charMd = StorageService.getCharacterMarkdown(charMeta.id);
          if (charMd) {
            activeNPCsContent.push(charMd);
          }
        }
      }
    }
    lore.tier2ActiveNPCs = activeNPCsContent.join('\n\n---\n\n');

    // Tier 3: 全域背景索引
    lore.tier3GlobalIndex = JSON.stringify(allCharacters.map(function(c) {
      return { id: c.id, name: c.name };
    }));

    return lore;
  }

  /**
   * 組裝主要敘事模型提示詞內容 (Prompt Context)
   */
  function buildTurnPromptContext(params) {
    var saveState = params.saveState;
    var choiceId = params.choiceId;
    var customInput = params.customInput;
    var playerProfile = (saveState.meta && saveState.meta.playerProfile) || {};

    var globalRules = StorageService.getGlobalRules();
    var recentTurns = saveState.turnHistory.slice(-CONFIG.PIPELINE.RECENT_TURNS_CONTEXT_LIMIT);
    var recentTurnsText = JSON.stringify(recentTurns);

    var tieredLore = buildTieredLorebook(saveState, recentTurnsText);

    // 系統提示詞 (System Prompt) 整合 System_Directives.md 與 Romance_Aesthetics.md
    var systemPrompt = [
      '【核心定位】你是專精成人女性情感小說的頂級角色扮演敘事者，任務是扮演「台灣權謀世界」中的十三位男主（徐令謙、韓正寰、邵翊衡、楊紹宸、徐宇寧、林政修、沈湛然、江瀚文、吳衛廷、徐承勳、徐耀南、徐若宸、徐予澈等）與玩家進行融合黑幫、司法、政媒、財閥與情慾張力的沉浸式文字RPG。',
      '',
      '【最高指導原則】',
      '1. 絕對禁止OOC：100%沉浸式遊戲文本，嚴禁客服用語，角色絕不承認是AI，只依玩家外在言行反應。',
      '2. 文本品質與字數：單次正文輸出須 600–1000 字，交替使用五感渲染與對話（至少3次），字字珠璣，不總結、不斷尾。',
      '3. 語境與禁忌：全程台灣繁體中文與在地慣用語。除吳衛廷外全體禁止髒話；完全禁止酒駕描寫。',
      '4. 慢熱與推拉法則（情慾文學指引）：慾望是性格的延伸，以五感（溫度、氣味、聲音、觸感、微表情）優先於直述。日常互動維持言語交鋒、眼神試探與權力推拉。當張力值達臨界或玩家給予明確指示時，依角色專屬美學寫實描寫肉體交纏，拒絕隱晦暗喻。',
      '5. 微醺度連動機制：微醺度超過70%時，男主言行更具侵略性或卸下防備，選項[C]須帶更強烈情慾色彩。',
      '',
      '【分層設定集 (Tiered Lorebook)】',
      '=== [Tier 1: 當前主要攻略對象/男主設定卡] ===',
      tieredLore.tier1MainChar || '徐令謙（玄辰幫二把手、天裕會首領）',
      '',
      '=== [Tier 2: 當前活躍 NPC / 關係人設定卡] ===',
      tieredLore.tier2ActiveNPCs || '無其他主要關係人登場',
      '',
      '=== [Tier 3: 全域世界背景與人物索引] ===',
      tieredLore.tier3GlobalIndex,
      '',
      '【輸出格式規範】',
      '你必須嚴格輸出標準 JSON 格式，請勿在 JSON 外附帶任何非 JSON 字串：',
      '{',
      '  "chapterTitle": "第 N 回．[自動生成章節名稱]",',
      '  "prose": "600-1000字小說正文。第三人稱現在式描寫五感細節、微表情與氛圍；對話用第一人稱與引號「」。無縫銜接玩家上一回合行動，不預判下一步，直接推進劇情。",',
      '  "narrativeSummaryDelta": "本回關鍵進展的 2~3 句話濃縮摘要（供記憶池更新）",',
      '  "statusPanel": {',
      '    "timeLocation": "時空（例如：2026年5月12日 21:30 星期二 於 台北士林思慕咖啡VIP室）",',
      '    "tension": "張力值 [X%]",',
      '    "intoxication": "微醺度 [X%]",',
      '    "interaction": "關係狀態 ｜ 雙方物理距離與姿態",',
      '    "outfit": "玩家著裝狀態 ｜ 男主姓名與著裝細節",',
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
      '請根據以上完整脈絡，撰寫下一回 600~1000 字精緻長篇情節並回傳標準 JSON！'
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
    var saveState = params.saveState;
    var turnOutput = params.turnOutput;
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
          saveState.relationships[npc] = (saveState.relationships[npc] || 0) + delta.relationshipChanges[npc];
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
    if (files.hasNext()) {
      fullProse = files.next().getBlob().getDataAsString('UTF-8');
    }

    // 呼叫 AI 生成幕篇檔案
    var actDossier = AIService.generateActDossier(fullProse, saveState);

    // 封存並更新存檔狀態
    saveState.actDossiers = saveState.actDossiers || [];
    saveState.actDossiers.push(actDossier);

    // 備份當前幕小說紀錄為 Full_Novel_Act_X.md
    var actNumber = saveState.meta.currentAct || 1;
    folder.createFile('Full_Novel_Act_' + actNumber + '_Archived.md', fullProse, MimeType.PLAIN_TEXT);

    // 重置即時視窗
    saveState.meta.currentAct = actNumber + 1;
    saveState.turnHistory = []; // 上下文視窗歸零
    saveState.summaryPool = '【第 ' + actNumber + ' 幕已完結並重整】請根據幕篇檔案承接下一幕情節。';

    // 重新建立新的 Full_Novel.md
    if (files.hasNext()) {
      files.next().setContent('# Project Epilogue — 第 ' + saveState.meta.currentAct + ' 幕\n*建立時間：' + new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) + '*\n\n---\n');
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
