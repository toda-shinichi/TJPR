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
  function normalizeIntelLedger(saveState) {
    var source = Array.isArray(saveState.intelLedger) ? saveState.intelLedger : [];
    if (!Array.isArray(saveState.intelLedger) && Array.isArray(saveState.inventory)) {
      source = saveState.inventory.filter(function(item) {
        return !item || (item.id !== 'item_card' && item.id !== 'item_press');
      });
    }
    var seen = {};
    saveState.intelLedger = source.map(function(raw, index) {
      var item = typeof raw === 'string' ? { name: raw } : (raw || {});
      var name = String(item.name || item.label || '').trim().substring(0, 120);
      if (!name) return null;
      var id = /^[a-zA-Z0-9_-]{3,64}$/.test(String(item.id || ''))
        ? String(item.id)
        : 'intel_legacy_' + index;
      if (seen[id]) return null;
      seen[id] = true;
      return {
        id: id,
        name: name,
        type: ['evidence', 'intel', 'contact', 'access'].indexOf(item.type) >= 0 ? item.type : 'intel',
        confidence: ['unverified', 'partial', 'verified'].indexOf(item.confidence) >= 0 ? item.confidence : 'unverified',
        status: ['available', 'exposed', 'delivered', 'invalid'].indexOf(item.status) >= 0 ? item.status : 'available',
        source: String(item.source || '劇情取得').substring(0, 120),
        effect: String(item.effect || item.desc || '').substring(0, 240),
        acquiredTurn: Number(item.acquiredTurn) || saveState.turnCount || 1,
        updatedTurn: Number(item.updatedTurn) || saveState.turnCount || 1
      };
    }).filter(function(item) { return !!item; }).slice(-60);
    return saveState.intelLedger;
  }

  function applyIntelDelta(saveState, delta) {
    var ledger = normalizeIntelLedger(saveState);
    var turn = saveState.turnCount || 1;
    delta = delta && typeof delta === 'object' ? delta : {};
    (Array.isArray(delta.add) ? delta.add : []).slice(0, 8).forEach(function(raw) {
      if (!raw || !raw.name) return;
      var id = /^[a-zA-Z0-9_-]{3,64}$/.test(String(raw.id || '')) ? String(raw.id) : 'intel_turn_' + turn + '_' + ledger.length;
      var existing = ledger.filter(function(item) { return item.id === id || item.name === String(raw.name); })[0];
      var target = existing || { id: id, acquiredTurn: turn };
      target.name = String(raw.name).substring(0, 120);
      target.type = ['evidence', 'intel', 'contact', 'access'].indexOf(raw.type) >= 0 ? raw.type : 'intel';
      target.confidence = ['unverified', 'partial', 'verified'].indexOf(raw.confidence) >= 0 ? raw.confidence : 'unverified';
      target.status = 'available';
      target.source = String(raw.source || '劇情取得').substring(0, 120);
      target.effect = String(raw.effect || '').substring(0, 240);
      target.updatedTurn = turn;
      if (!existing) ledger.push(target);
    });
    (Array.isArray(delta.update) ? delta.update : []).slice(0, 8).forEach(function(change) {
      if (!change) return;
      var target = ledger.filter(function(item) {
        return (change.id && item.id === change.id) || (change.name && item.name === change.name);
      })[0];
      if (!target) return;
      if (['available', 'exposed', 'delivered', 'invalid'].indexOf(change.status) >= 0) target.status = change.status;
      if (['unverified', 'partial', 'verified'].indexOf(change.confidence) >= 0) target.confidence = change.confidence;
      if (change.effect !== undefined) target.effect = String(change.effect || '').substring(0, 240);
      target.updatedTurn = turn;
    });
    saveState.intelLedger = ledger.slice(-60);
  }

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
    normalizeIntelLedger(s);
    if (!Array.isArray(s.turnHistory)) s.turnHistory = [];
    if (!Array.isArray(s.actDossiers)) s.actDossiers = [];
    if (!Array.isArray(s.auditLog)) s.auditLog = [];
    if (!s.relationships || typeof s.relationships !== 'object') s.relationships = {};
    if (!s.questFlags || typeof s.questFlags !== 'object') s.questFlags = {};
    if (typeof s.summaryPool !== 'string') s.summaryPool = '';
    s.summaryPool = s.summaryPool.substring(0, CONFIG.PIPELINE.SUMMARY_POOL_MAX_CHARS || 2000);
    s.turnHistory = s.turnHistory.slice(-(CONFIG.PIPELINE.TURN_HISTORY_MAX || 30));
    s.actDossiers = s.actDossiers.slice(-(CONFIG.PIPELINE.ACT_DOSSIER_MAX || 6));
    s.auditLog = s.auditLog.slice(-(CONFIG.PIPELINE.AUDIT_LOG_MAX || 20));
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
    var activeIntel = saveState.intelLedger.filter(function(item) {
      return item.status === 'available';
    }).map(function(item) {
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        confidence: item.confidence,
        source: item.source,
        effect: item.effect
      };
    });

    var literaryCliches = [
      '空氣瞬間凝滯', '空氣凝滯', '眼底閃過一絲', '眼底閃過', '眸中掠過',
      '唇角勾起', '嘴角勾起', '心跳如鼓', '看穿靈魂', '無形的網', '無形的牆',
      '蟄伏的獸', '危險又迷人', '不容置疑', '不容拒絕', '宣告主權',
      '喉結滾動', '指尖微顫', '呼吸一滯', '渾身一僵', '電流竄過',
      '眼神銳利如刀', '銳利如刀刃', '眼神像刀', '未引爆的計時器', '未引爆計時器'
    ];
    var rhythmCycle = [
      '潛流鋪陳：降低表面音量，以具體物件或環境變化承載不安，不急著製造高潮。',
      '言語試探：讓台詞表層與真正目的錯開，以答非所問、停頓或動作呈現潛台詞。',
      '情報揭露：只揭開一項會改變判斷的新事實，並讓角色為知道它付出代價。',
      '關係偏移：用選擇、讓步或拒絕改變距離，不直接替讀者宣布感情升溫。',
      '壓力峰值：讓累積矛盾落到不可迴避的行動，高潮必須改變局勢而非只加重形容詞。',
      '餘韻留白：處理轉折後果，以未說完的話、物件或動作收尾。'
    ];
    var sceneRhythm = rhythmCycle[(Math.max(1, Number(saveState.turnCount) || 1) - 1) % rhythmCycle.length];
    var recentProse = recentTurns.map(function(turn) { return String(turn && turn.prose || ''); }).join('\n');
    var recentEchoes = literaryCliches.filter(function(phrase) { return recentProse.indexOf(phrase) !== -1; }).slice(0, 8);

    // 系統提示詞 (System Prompt) 整合 System_Directives.md 與 Romance_Aesthetics.md
    var systemPrompt = [
      '【核心定位】你是連載長篇小說作者，同時維持互動故事的狀態資料。正文必須先像可出版的小說成立，再正確填寫遊戲欄位。',
      '',
      globalRules,
      '',
      '【最高指導原則】',
      '1. 絕對禁止OOC：100%沉浸式角色扮演，角色絕不承認是AI，依各自MBTI、身分背景、著裝風格與微表情細膩反應。',
      '2. 純文學沉浸正文：開頭嚴禁「妳做出了抉擇」等系統語，直接從正在發生的具體動作切入；不以旁白宣告人物危險、迷人、強勢或充滿性張力。',
      '3. 篇幅與深度：正文建議 800–1200 個中文字，依場景自然增減。完成一個會改變局勢或關係的戲劇節拍即可，不要求每回高潮或封口，不截斷、不灌水。',
      '4. 嚴格身分防火牆：徐令謙是黑道玄辰幫二把手·天裕會中樞，絕非檢察官（士林地檢署檢察官是韓正寰），徐承勳是中華民國副總統，絕不可張冠李戴！',
      '5. 成人情慾文學指引（R-18）：以人物承擔的風險、允許或拒絕、物理距離、對話潛台詞與具體後果形成情慾及權力張力；不可只提高形容詞強度。使用純台灣繁體中文。',
      '6. 時空與人物連續性：必須從上一回最後的時間、地點、在場人物與物理位置接續。若 timeLocation 改變，正文必須明寫離開、移動、抵達或時間流逝；主要攻略對象若離場，必須明寫原因與未完成的關係線，嚴禁無故消失或重置已知情報。',
      '',
      '【本回文學敘事規格】',
      '- 採貼近玩家感官的限知第二人稱，只寫當下可察覺或合理推斷之事。',
      '- 台灣當代都會黑色小說質感；使用精準名詞與動詞，克制形容詞。',
      '- 台詞表面意義與真正目的之間須有距離；不要在旁白立刻解釋每句對話。',
      '- 長短句與段落密度要有變化；全回核心比喻最多 2 個且取材自當前場景；「像、彷彿、如同、宛如」合計最多 3 次。',
      '- 交稿前逐字搜尋「像、彷彿、如同、宛如」，合計超過 3 次就刪減；這是硬性上限，不是建議。',
      '- 同一句話、同一物件狀態或「你＋動作」句型不得換字反覆描述；除非是刻意設計的唯一一次回聲，完整句子不可重複。',
      '- 不可把上一回的招牌物件、收尾意象或整段動作只換幾個字再寫一次；物件若仍在場，必須寫出它因新行動產生的變化或後果。',
      '- 收尾不得用「這不是 X。這是 Y。」「裂縫已經打開」「一切才剛開始」等判詞替讀者總結；以仍在發生的動作、物件、聲音或未完成對話收尾。',
      '- 本回節奏角色：' + sceneRhythm,
      '- 避免套路語及近義改寫：' + literaryCliches.join('、') + '。整回最多只能出現其中一項。',
      '- 近期已出現、尤其不可再用：' + (recentEchoes.length ? recentEchoes.join('、') : '無；仍須遵守通用反套路') + '。',
      '- 三個選項各自只寫一個明確行動與必要對白；label 25–60 字，hint 10–24 字。',
      '',
      tieredLore.characterBlock,
      '',
      '【輸出格式規範】',
      '你必須嚴格輸出標準 JSON 格式，請勿在 JSON 外附帶任何非 JSON 字串：',
      '{',
      '  "chapterTitle": "第 N 回．[自動生成章節名稱]",',
      '  "prose": "建議 800–1200 個中文字；緊接玩家行動，完成一個有因果的戲劇節拍並保留具體餘波。不截斷、不灌水、不以旁白解釋潛台詞；對話用引號「」。",',
      '  "narrativeSummaryDelta": "本回關鍵進展的 2~3 句話濃縮摘要（供記憶池更新）",',
      '  "statusPanel": {',
      '    "timeLocation": "時空（例如：2026年5月12日 21:30 星期二 於 台北市士林區德行法律事務所頂樓制策室）",',
      '    "tension": "張力值 [X%]",',
      '    "intoxication": "微醺度 [X%]",',
      '    "interaction": "關係狀態 ｜ 雙方物理距離與肢體姿態",',
      '    "outfit": "玩家著裝與神態 ｜ 男主姓名、著裝細節、眼神與肢體小動作",',
      '    "rumors": "政媒圈或黑白兩道對當前局勢的最新議論",',
      '    "pageCode": "P.001 遞增標碼"',
      '  },',
      '  "intelDelta": {',
      '    "add": [{ "id": "intel_英文短碼", "name": "具體線索名稱", "type": "evidence|intel|contact|access", "confidence": "unverified|partial|verified", "source": "取得來源", "effect": "查證或談判用途" }],',
      '    "update": [{ "id": "既有線索ID", "status": "available|exposed|delivered|invalid", "confidence": "unverified|partial|verified", "effect": "更新後用途" }]',
      '  },',
      '  "choices": [',
      '    { "id": "option_a", "label": "[A] 25–60 字：一個明確行動與必要對白", "risk": "low", "hint": "10–24 字策略提示" },',
      '    { "id": "option_b", "label": "[B] 25–60 字：不同策略的一個行動與必要對白", "risk": "medium", "hint": "10–24 字策略提示" },',
      '    { "id": "option_c", "label": "[C] 25–60 字：高風險破局行動與必要對白", "risk": "high", "hint": "10–24 字策略提示" }',
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
      saveState.actDossiers && saveState.actDossiers.length > 0
        ? saveState.actDossiers.slice(-(CONFIG.PIPELINE.ACT_DOSSIERS_IN_PROMPT || 2)).map(function(item) {
            return String(item || '').substring(0, 1600);
          }).join('\n\n')
        : '（第 1 幕初始）',
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
      '【可用線索與談判籌碼】：',
      activeIntel.length > 0
        ? JSON.stringify(activeIntel)
        : '（目前沒有可用線索；不得憑空創造玩家已持有的證據、情報、人脈或通行權。）',
      '只有實際取得的新線索才可寫入 intelDelta.add；使用、交付、曝光或證偽既有線索時，必須用其 ID 寫入 intelDelta.update。',
      '',
      '【近期故事回顧】：',
      JSON.stringify(recentTurns),
      '',
      '【玩家在上一回做出的決策】：',
      '選擇識別碼: ' + (choiceId || 'CUSTOM_ACTION'),
      '自訂動作/具體內容: ' + (customInput || '依照選項推進'),
      '',
      '請根據完整脈絡撰寫下一回並回傳標準 JSON。正文建議 800–1200 個中文字；完成一個會改變局勢或關係的戲劇節拍並留下具體餘波，不截斷、不灌水，也不要用旁白直接宣布情緒、權力或性張力。',
      '若本回變更 timeLocation，正文必須先敘明移動或時間流逝；連續對話或同一場景原則上只能自然推進數分鐘，若時鐘跳動超過 30 分鐘，正文必須明確交代經過多久與期間事件。若主要攻略對象離場，正文必須明寫離場原因與未完成的關係線。',
      '全文「像、彷彿、如同、宛如」合計不得超過 3 次；不要使用近期列出的套路語或近義改寫。'
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

    // 線索與談判籌碼是跨回合持久狀態；先套用本回模型回傳的增修。
    applyIntelDelta(saveState, turnOutput.intelDelta);

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
    saveState.turnHistory = saveState.turnHistory.slice(-(CONFIG.PIPELINE.TURN_HISTORY_MAX || 30));

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
        saveState.auditLog = saveState.auditLog.slice(-(CONFIG.PIPELINE.AUDIT_LOG_MAX || 20));
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
    saveState.actDossiers = saveState.actDossiers.slice(-(CONFIG.PIPELINE.ACT_DOSSIER_MAX || 6));

    // 備份當前幕小說紀錄為 Full_Novel_Act_X.md
    var actNumber = saveState.meta.currentAct || 1;
    var archiveStamp = new Date().toISOString().replace(/[:.]/g, '-');
    folder.createFile('Full_Novel_Act_' + actNumber + '_Archived_' + archiveStamp + '.md', fullProse, MimeType.PLAIN_TEXT);

    // 重置即時視窗
    saveState.meta.currentAct = actNumber + 1;
    saveState.meta.contextResetTurn = saveState.turnCount || 1;
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
