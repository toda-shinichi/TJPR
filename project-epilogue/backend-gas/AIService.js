/**
 * Project Epilogue - AI 服務模組
 * 檔案：AIService.js
 * 
 * 透過相容 OpenAI 的 API 端點（https://api.banana2556.com/v1）驅動雙模型管線：
 * 1. 主要敘事模型 (Narrator: deepseek-v4-pro)
 * 2. 快速稽核模型 (Fast Auditor: gemini-3.6-flash / 備用 deepseek-v4-flash)
 */

var AIService = (function() {

  /**
   * 嚴格執行 RPM=5 頻率控制（兩次 API 呼叫之間至少間隔 12.5 秒，徹底防止 429 錯誤）
   */
  function enforceRateLimitRPM5() {
    var lock = LockService.getScriptLock();
    var minInterval = CONFIG.API.MIN_REQUEST_INTERVAL_MS || 12500;
    var waitTime = 0;
    var acquired = false;

    // 只在鎖內「預約」下一個可呼叫時點；實際 sleep 必須在鎖外進行。
    // 先前是持鎖 sleep 12.5 秒，第二位並行玩家會在 waitLock(30000) 逾時後
    // 落入 catch，接著完全繞過限速直接打 API，反而必定觸發 429。
    try {
      lock.waitLock(30000);
      acquired = true;
    } catch (lockErr) {
      console.warn('Rate limiter 取鎖失敗，改用保守間隔: ' + lockErr.message);
    }

    try {
      var cache = CacheService.getScriptCache();
      var nextAllowedTs = parseInt(cache.get('NEXT_API_CALL_TS') || '0', 10);
      var now = new Date().getTime();
      var slotTs = Math.max(now, nextAllowedTs);
      waitTime = slotTs - now;
      cache.put('NEXT_API_CALL_TS', (slotTs + minInterval).toString(), 300);
    } catch (e) {
      console.warn('Rate limiter warning: ' + e.message);
      // 取不到快取時寧可保守等待一個完整間隔，也不要無節制送出請求。
      waitTime = acquired ? 0 : minInterval;
    } finally {
      if (acquired) {
        try { lock.releaseLock(); } catch (relErr) { /* 忽略 */ }
      }
    }

    if (waitTime > 0) {
      console.info('【RPM=5 防護機制】排隊等待 ' + waitTime + ' 毫秒以符合 5 RPM 呼叫頻率限制...');
      Utilities.sleep(waitTime);
    }
  }

  /**
   * 核心 HTTP 請求分發器（具備指數退避重試、RPM=5 限速與備用模型切換）
   * @param {string} model - 目標模型名稱
   * @param {Array<Object>} messages - OpenAI 格式對話陣列 [{role, content}]
   * @param {Object} options - 包含 temperature, max_tokens, fallbackModel 等
   * @returns {Object} 模型回應結果
   */
  function callAPI(model, messages, options) {
    options = options || {};
    var secrets = getSecrets();
    var apiKey = secrets.API_KEY || CONFIG.API.API_KEY;

    if (!apiKey) {
      throw new Error('未設定 API Key，請檢查 Config.js 或 Apps Script 指令碼屬性。');
    }

    var targetModel = model || CONFIG.MODELS.NARRATOR.PRIMARY;
    var fallbackModel = options.fallbackModel || CONFIG.MODELS.NARRATOR.FALLBACK;
    var maxRetries = CONFIG.API.MAX_RETRIES;
    var delayMs = CONFIG.API.RETRY_DELAY_MS;

    var payload = {
      model: targetModel,
      messages: messages,
      temperature: options.temperature !== undefined ? options.temperature : CONFIG.MODELS.NARRATOR.TEMPERATURE,
      max_tokens: options.max_tokens || CONFIG.MODELS.NARRATOR.MAX_TOKENS,
      top_p: options.top_p !== undefined ? options.top_p : CONFIG.MODELS.NARRATOR.TOP_P
    };

    if (options.response_format) {
      payload.response_format = options.response_format;
    }

    var requestHeaders = {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    };

    var requestOptions = {
      method: 'post',
      contentType: 'application/json',
      headers: requestHeaders,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var lastError = null;

    for (var attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // 執行 RPM=5 限速節流
        enforceRateLimitRPM5();

        var response = UrlFetchApp.fetch(CONFIG.API.BASE_URL, requestOptions);
        var statusCode = response.getResponseCode();
        var responseText = response.getContentText();

        if (statusCode >= 200 && statusCode < 300) {
          var data = JSON.parse(responseText);
          if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            return {
              success: true,
              modelUsed: targetModel,
              content: data.choices[0].message.content,
              usage: data.usage || null,
              raw: data
            };
          }
          throw new Error('API 回傳資料格式異常或 choices 為空。');
        }

        // 遇到 429 頻率限制或 5xx 伺服器異常時進行重試
        if (statusCode === 429 || statusCode >= 500) {
          console.warn('API 回傳狀態碼 ' + statusCode + '（第 ' + attempt + ' 次嘗試）: ' + responseText);
          if (attempt === maxRetries && targetModel !== fallbackModel && fallbackModel) {
            console.warn('切換至備用模型：' + fallbackModel);
            payload.model = fallbackModel;
            requestOptions.payload = JSON.stringify(payload);
            // for 迴圈結尾會自動 +1，因此設為 0，讓備援模型從第 1 次開始。
            attempt = 0;
            targetModel = fallbackModel;
            Utilities.sleep(delayMs);
            continue;
          }
          Utilities.sleep(delayMs * Math.pow(2, attempt - 1));
          continue;
        }

        // 4xx 客戶端錯誤（金鑰無效、參數錯誤等）
        throw new Error('API 呼叫失敗 [' + statusCode + ']: ' + responseText);

      } catch (err) {
        lastError = err;
        console.error('AIService 第 ' + attempt + ' 次連線失敗: ' + err.toString());
        if (attempt < maxRetries) {
          Utilities.sleep(delayMs * Math.pow(2, attempt - 1));
        }
      }
    }

    throw new Error('超過最大重試次數 (' + maxRetries + ')，最後錯誤原因: ' + (lastError ? lastError.message : '未知'));
  }

  /**
   * 安全萃取 LLM 回傳字串中的 JSON 物件（支援 Markdown 程式碼區塊包裹）
   * @param {string} text - 模型回傳之原始字串
   * @returns {Object} 解析後之 JSON 物件
   */
  function extractJsonFromResponse(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('extractJsonFromResponse 輸入無效：必須為非空字串。');
    }

    var trimmed = text.trim();

    // 1. 直接嘗試 JSON.parse
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        // 進入正規表達式比對
      }
    }

    // 2. 比對 ```json ... ``` 程式碼區塊
    var jsonBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      try {
        return JSON.parse(jsonBlockMatch[1].trim());
      } catch (e) {
        // 進入最外層大括號比對
      }
    }

    // 3. 搜尋最外層 { ... }
    var firstOpenBrace = trimmed.indexOf('{');
    var lastCloseBrace = trimmed.lastIndexOf('}');
    if (firstOpenBrace !== -1 && lastCloseBrace !== -1 && lastCloseBrace > firstOpenBrace) {
      var possibleJson = trimmed.substring(firstOpenBrace, lastCloseBrace + 1);
      try {
        return JSON.parse(possibleJson);
      } catch (e) {
        throw new Error('無法解析提取的 JSON 字串: ' + e.message + '\n原始內容:\n' + possibleJson);
      }
    }

    throw new Error('模型回傳內容中未包含合法的 JSON 結構。');
  }

  /**
   * 主要敘事模型 (Narrator: deepseek-v4-pro)：
   * 生成 1,200~1,500 字的精緻章節內文、3 個互動選項以及存檔狀態更新（Delta）。
   * 順位：deepseek-v4-pro -> gemini-3.6-flash -> dolphin-mistral -> gpt-5.6-luna -> aion-3.0
   * @param {Object} promptContext - 包含 System Prompt, 角色 Markdown, 摘要池與近期對話歷史
   * @returns {Object} 章節物件 { chapterTitle, prose, choices, stateDelta, narrativeSummaryDelta }
   */
  function generateNextChapter(promptContext) {
    var messages = [
      { role: 'system', content: promptContext.systemPrompt },
      { role: 'user', content: promptContext.userPrompt }
    ];

    // 依 Config.js 實際定義的鍵名逐一列出（先前誤用 FALLBACK_2/FALLBACK_3，
    // 導致 FALLBACK_4 的 aion-3.0 永遠不會被嘗試，與錯誤訊息所述不符）。
    var narratorModels = [
      CONFIG.MODELS.NARRATOR.PRIMARY,
      CONFIG.MODELS.NARRATOR.FALLBACK,
      CONFIG.MODELS.NARRATOR.FALLBACK_2,
      CONFIG.MODELS.NARRATOR.FALLBACK_3,
      CONFIG.MODELS.NARRATOR.FALLBACK_4
    ].filter(function(m, idx, arr) { return m && arr.indexOf(m) === idx; });

    var lastError = null;
    for (var i = 0; i < narratorModels.length; i++) {
      var currentModel = narratorModels[i];
      try {
        var response = callAPI(currentModel, messages, {
          temperature: CONFIG.MODELS.NARRATOR.TEMPERATURE,
          max_tokens: CONFIG.MODELS.NARRATOR.MAX_TOKENS,
          top_p: CONFIG.MODELS.NARRATOR.TOP_P,
          // 這一層已自行輪替全部備援模型，關閉 callAPI 內建的模型切換，
          // 避免同一個備援模型被重複嘗試、把請求時間預算耗盡。
          fallbackModel: currentModel
        });
        var parsedOutput = extractJsonFromResponse(response.content);
        return {
          success: true,
          data: parsedOutput,
          modelUsed: response.modelUsed || currentModel,
          usage: response.usage
        };
      } catch (err) {
        lastError = err;
        console.warn('Narrator 模型 [' + currentModel + '] 失敗，嘗試下一順位備援: ' + err.message);
      }
    }

    throw new Error('所有敘事模型（含 aion-3.0 備援）均無法完成生成: ' + (lastError ? lastError.message : '未知'));
  }

  /**
   * 快速稽核與記憶模型 (Fast Auditor: gemini-3.6-flash)：
   * 順位：gemini-3.6-flash -> gemini-3.6-flash-lite (第一備援) -> deepseek-v4-flash (第二備援) -> mercury-2 (第三備援)
   * 每 5 回合壓縮更新滾動摘要池，嚴格維持在 2,000 字元以內。
   * @param {string} existingSummary - 現有摘要池文字
   * @param {Array<Object>} newTurns - 最新幾回合的故事摘記
   * @returns {string} 壓縮後之摘要池文字
   */
  function updateSummaryPool(existingSummary, newTurns) {
    var prompt = [
      '【角色與任務】你是一部互動小說的記憶統整引擎。',
      '【目標】將現有的摘要與最新的故事回合紀錄整合為高資訊密度的摘要池。',
      '【嚴格規則】',
      '1. 字數限制：繁體中文輸出長度必須嚴格維持在 1,500 ~ 2,000 字元以內。',
      '2. 內容重點：保留關鍵劇情進展、重要線索、道具獲得/消耗、角色好感度與關係轉折、未解謎團與當前目標。',
      '3. 風格要求：繁體中文、客觀事實記錄、時間序排列。嚴禁任何閒聊或多餘寒暄。',
      '',
      '--- 現有摘要池 ---',
      existingSummary || '（目前為章節初始，尚無歷史摘要）',
      '',
      '--- 待整合的最新回合記錄 ---',
      JSON.stringify(newTurns, null, 2),
      '',
      '【請直接輸出更新後的純摘要文字】：'
    ].join('\n');

    var messages = [
      { role: 'system', content: '你是一個精準、極致濃縮的小說記憶壓縮引擎，請一律使用繁體中文輸出。' },
      { role: 'user', content: prompt }
    ];

    var auditorModels = [
      CONFIG.MODELS.AUDITOR.PRIMARY || 'aion-3.0-mini',
      CONFIG.MODELS.AUDITOR.FALLBACK_1 || 'mistral-nemo'
    ];

    var lastError = null;
    for (var j = 0; j < auditorModels.length; j++) {
      var currentModel = auditorModels[j];
      try {
        var response = callAPI(currentModel, messages, {
          temperature: CONFIG.MODELS.AUDITOR.TEMPERATURE,
          max_tokens: 1000,
          top_p: CONFIG.MODELS.AUDITOR.TOP_P,
          fallbackModel: currentModel
        });
        return response.content.trim();
      } catch (err) {
        lastError = err;
        console.warn('Auditor 模型 [' + currentModel + '] 失敗，嘗試下一順位備援: ' + err.message);
      }
    }

    var result = existingSummary || '';
    if (result.length > CONFIG.PIPELINE.SUMMARY_POOL_MAX_CHARS) {
      result = result.substring(0, CONFIG.PIPELINE.SUMMARY_POOL_MAX_CHARS - 3) + '...';
    }
    return result;
  }

  /**
   * 快速稽核模型 (Fast Auditor: gemini-3.6-flash)：
   * 每 10 回合進行邏輯一致性檢查（角色性格 OOC、道具矛盾、地理邏輯）。
   * @param {Object} auditContext - 存檔狀態、近期對話回合與角色設定卡
   * @returns {Object} 稽核報告 { isConsistent, severity, issues, suggestedPatch }
   */
  function auditTurnConsistency(auditContext) {
    var prompt = [
      '【角色與任務】你是資深小說情節與設定一致性稽核員。',
      '【目標】檢查最新回合情節與角色卡設定、物品欄狀態及世界觀規則是否有矛盾或邏輯破綻。',
      '',
      '--- 當前存檔狀態 (Save State) ---',
      JSON.stringify(auditContext.saveState, null, 2),
      '',
      '--- 近期故事回合 (Recent Turns) ---',
      JSON.stringify(auditContext.recentTurns, null, 2),
      '',
      '--- 登場角色設定與規則 ---',
      auditContext.loreMarkdown || '（無特定設定）',
      '',
      '請嚴格回傳符合以下結構的 JSON 物件，請勿輸出其他無關文字：',
      '{',
      '  "isConsistent": true 或 false,',
      '  "severity": "none" | "low" | "medium" | "critical",',
      '  "issues": ["列出所有邏輯破綻、角色OOC違和行為或道具矛盾問題"],',
      '  "suggestedPatch": "給下一回敘事提示詞的具體修正指令，用於在後續情節中自然修復與圓融"',
      '}'
    ].join('\n');

    var messages = [
      { role: 'system', content: '你是嚴謹的小說邏輯稽核員，請一律輸出標準繁體中文 JSON 物件。' },
      { role: 'user', content: prompt }
    ];

    var response = callAPI(CONFIG.MODELS.AUDITOR.PRIMARY, messages, {
      temperature: CONFIG.MODELS.AUDITOR.TEMPERATURE,
      max_tokens: CONFIG.MODELS.AUDITOR.MAX_TOKENS,
      top_p: CONFIG.MODELS.AUDITOR.TOP_P,
      fallbackModel: CONFIG.MODELS.AUDITOR.FALLBACK
    });

    return extractJsonFromResponse(response.content);
  }

  /**
   * 幕篇重整 (Act Rebase)：
   * 將整個已結束的「幕篇（Act）」長篇內文濃縮為約 800 字的「幕篇檔案（Act Dossier）」，以供上下文視窗歸零使用。
   * @param {string} actFullText - 該幕全數章節的完整 Markdown 內文
   * @param {Object} endState - 該幕結束時的最終狀態
   * @returns {string} 800 字幕篇檔案 Markdown
   */
  function generateActDossier(actFullText, endState) {
    var prompt = [
      '【角色與任務】你是大師級小說編年史記錄官。',
      '【目標】將以下整幕（Act）的長篇小說情節濃縮為一篇約 700 ~ 800 字的「幕篇檔案（Act Dossier）」。',
      '【結構要求】',
      '1. # 幕篇核心總結：關鍵事件推進與重大轉折。',
      '2. ## 重大決策與代價：主角所做的決定及其深遠後果。',
      '3. ## 人際關係與派系局勢：各重要角色的心態轉變與派系勢力消長。',
      '4. ## 幕末狀態承接：角色目前的處境、關鍵道具與下一幕的起點目標。',
      '',
      '--- 幕末狀態數據 ---',
      JSON.stringify(endState, null, 2),
      '',
      '--- 本幕完整章節內文 ---',
      actFullText,
      '',
      '【請使用繁體中文輸出完整 Markdown 幕篇檔案】：'
    ].join('\n');

    var messages = [
      { role: 'system', content: '你是大師級文學總結官，請使用繁體中文 Markdown 撰寫高張力的幕篇檔案。' },
      { role: 'user', content: prompt }
    ];

    var response = callAPI(CONFIG.MODELS.NARRATOR.PRIMARY, messages, {
      temperature: 0.4,
      max_tokens: 2000,
      fallbackModel: CONFIG.MODELS.AUDITOR.PRIMARY
    });

    return response.content.trim();
  }

  return {
    callAPI: callAPI,
    extractJsonFromResponse: extractJsonFromResponse,
    generateNextChapter: generateNextChapter,
    updateSummaryPool: updateSummaryPool,
    auditTurnConsistency: auditTurnConsistency,
    generateActDossier: generateActDossier
  };

})();
