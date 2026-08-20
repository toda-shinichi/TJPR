/**
 * Project Epilogue - Telemetry, Error Logging & User Feedback Service
 * 檔案：TelemetryService.js
 * 
 * 職責：
 * 1. 自動於 Google Drive 建立與維護 Google Sheets 試算表（錯誤日誌 & 玩家意見回饋）。
 * 2. 接收前端傳送之系統異常、生成中斷、同步失敗等錯誤並排程寫入試算表。
 * 3. 接收玩家提交的測試回饋、評分與建議並寫入試算表。
 * 4. 透過 MailApp 自動即時發送通知至管理員信箱。
 */

var TelemetryService = (function() {

  var TELEMETRY_SHEET_NAME = '暗流_系統遙測與意見回饋中心';

  function clampText(value, maxLength) {
    var text = value === null || value === undefined ? '' : String(value);
    return text.length > maxLength ? text.substring(0, maxLength) + '…' : text;
  }

  function clampInlineText(value, maxLength) {
    return clampText(value, maxLength).replace(/[\r\n]+/g, ' ');
  }

  // Google Sheets 會把 =、+、-、@ 開頭的外部文字當作公式解析。
  function safeSheetCell(value, maxLength) {
    var text = clampText(value, maxLength);
    return /^[=+\-@]/.test(text) ? "'" + text : text;
  }

  /**
   * 確保工作表結構（系統錯誤日誌 & 玩家意見回饋）與表頭格式健全
   */
  function ensureSheetStructure(ss) {
    // 1. 檢查/建立 工作表 1: 系統錯誤日誌
    var errSheet = ss.getSheetByName('系統錯誤日誌');
    if (!errSheet) {
      errSheet = ss.insertSheet('系統錯誤日誌');
    }
    if (errSheet.getLastRow() === 0) {
      errSheet.appendRow([
        '記錄時間 (台北時間)',
        '錯誤類別 (Category)',
        '錯誤訊息 (Message)',
        '使用模型 (Model)',
        '玩家身分 / ID',
        '進度 (幕/回)',
        '攻略對象',
        '裝置與瀏覽器',
        '詳細資訊 / Stack'
      ]);
      errSheet.getRange('A1:I1').setBackground('#7f1d1d').setFontColor('#ffffff').setFontWeight('bold');
      errSheet.setFrozenRows(1);
    }

    // 2. 檢查/建立 工作表 2: 玩家意見回饋
    var fbSheet = ss.getSheetByName('玩家意見回饋');
    if (!fbSheet) {
      fbSheet = ss.insertSheet('玩家意見回饋');
    }
    if (fbSheet.getLastRow() === 0) {
      fbSheet.appendRow([
        '提交時間 (台北時間)',
        '回饋類別 (Category)',
        '滿意度評分 (Rating)',
        '玩家建議與意見內容 (Content)',
        '玩家稱呼 / 信箱',
        '當前進度 (幕/回)',
        '攻略對象',
        '裝置與瀏覽器',
        '附帶遊戲診斷數據 (Diagnostics)'
      ]);
      fbSheet.getRange('A1:I1').setBackground('#1e3a5f').setFontColor('#ffffff').setFontWeight('bold');
      fbSheet.setFrozenRows(1);
    }

    // 3. 刪除多餘預設空白工作表 (如 "工作表1" 或 "Sheet1")
    var defaultSheet = ss.getSheetByName('工作表1') || ss.getSheetByName('Sheet1');
    if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
      try { ss.deleteSheet(defaultSheet); } catch (e) {}
    }

    return ss;
  }

  /**
   * 取得或建立專屬的 Google 試算表（全 Drive 搜尋或新建）
   */
  function getOrCreateSpreadsheet() {
    // 記住試算表 ID：先前每一筆日誌都要掃一次全 Drive，且兩個並行請求
    // 都找不到檔案時會各自 create()，產生兩份同名試算表、日誌從此分裂。
    var props = PropertiesService.getScriptProperties();
    var knownId = props.getProperty('TELEMETRY_SPREADSHEET_ID');
    if (knownId) {
      try {
        return ensureSheetStructure(SpreadsheetApp.openById(knownId));
      } catch (openErr) {
        console.warn('已記錄的遙測試算表無法開啟，重新建立: ' + openErr.message);
      }
    }

    var lock = LockService.getScriptLock();
    var locked = false;
    try {
      lock.waitLock(20000);
      locked = true;
    } catch (lockErr) {
      console.warn('遙測試算表取鎖失敗: ' + lockErr.message);
    }

    try {
      // 取得鎖之後重新確認一次，避免與同時進來的請求重複建立。
      knownId = props.getProperty('TELEMETRY_SPREADSHEET_ID');
      if (knownId) {
        return ensureSheetStructure(SpreadsheetApp.openById(knownId));
      }
      var files = DriveApp.getFilesByName(TELEMETRY_SHEET_NAME);
      var ss = files.hasNext()
        ? SpreadsheetApp.open(files.next())
        : SpreadsheetApp.create(TELEMETRY_SHEET_NAME);
      props.setProperty('TELEMETRY_SPREADSHEET_ID', ss.getId());
      return ensureSheetStructure(ss);
    } finally {
      if (locked) {
        try { lock.releaseLock(); } catch (relErr) { /* 忽略 */ }
      }
    }
  }

  /**
   * MailApp 每日配額有限（消費者帳號 100 封）。此端點免驗證，若不節流，
   * 任何人（或前端的重試迴圈）都能在幾分鐘內打爆配額，之後真正的警報就寄不出去。
   * Sheet 仍然照常記錄每一筆，只有 Email 通知受節流。
   */
  function shouldSendMailNotification(dedupKey) {
    try {
      var cache = CacheService.getScriptCache();
      var safeKey = 'mail_' + Utilities.base64EncodeWebSafe(
        Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, dedupKey)
      );
      if (cache.get(safeKey)) return false;
      cache.put(safeKey, '1', 900); // 同類事件 15 分鐘內只寄一封

      var quotaKey = 'mail_quota_' + Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyyMMddHH');
      var sentThisHour = parseInt(cache.get(quotaKey) || '0', 10);
      if (sentThisHour >= 10) {
        console.warn('本小時遙測通知信已達 10 封上限，僅寫入試算表不再寄信。');
        return false;
      }
      cache.put(quotaKey, String(sentThisHour + 1), 3900);
      return true;
    } catch (e) {
      console.warn('Mail 節流檢查失敗，保守起見不寄信: ' + e.message);
      return false;
    }
  }

  /**
   * 強制立即初始化或修復試算表分頁與表頭
   */
  function initSpreadsheet() {
    var ss = getOrCreateSpreadsheet();
    var sheetNames = ss.getSheets().map(function(s) { return s.getName(); });
    return {
      success: true,
      spreadsheetId: ss.getId(),
      url: ss.getUrl(),
      sheets: sheetNames
    };
  }

  /**
   * 取得管理員通知信箱
   */
  function getAdminEmail() {
    try {
      if (CONFIG && CONFIG.ADMIN && CONFIG.ADMIN.EMAIL && CONFIG.ADMIN.EMAIL !== 'auto') {
        return CONFIG.ADMIN.EMAIL;
      }
      return Session.getEffectiveUser().getEmail() || 'th.hsu@drn.org.tw';
    } catch (e) {
      return 'th.hsu@drn.org.tw';
    }
  }

  /**
   * 寫入一筆系統錯誤日誌並寄信通知
   */
  function logError(payload) {
    try {
      var ss = getOrCreateSpreadsheet();
      var sheet = ss.getSheetByName('系統錯誤日誌');
      if (!sheet) {
        sheet = ss.insertSheet('系統錯誤日誌');
      }

      var nowStr = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd HH:mm:ss');
      var category = clampInlineText(payload.category || 'GENERAL_ERROR', 100);
      var message = clampText(payload.message || '未知錯誤', 2000);
      var model = clampInlineText(payload.model || '-', 100);
      var userId = clampInlineText(payload.userId || payload.email || 'guest', 200);
      var progress = clampInlineText(payload.progress || ('第 ' + (payload.act || 1) + ' 幕 · 第 ' + (payload.turn || 1) + ' 回'), 200);
      var targetLead = clampInlineText(payload.targetLead || '-', 200);
      var userAgent = clampText(payload.userAgent || '-', 500);
      var detailsRaw = typeof payload.details === 'object' ? JSON.stringify(payload.details) : String(payload.details || '');
      var details = clampText(detailsRaw, 8000);

      // 寫入 Google Sheet
      sheet.appendRow([
        nowStr,
        safeSheetCell(category, 100),
        safeSheetCell(message, 2000),
        safeSheetCell(model, 100),
        safeSheetCell(userId, 200),
        safeSheetCell(progress, 200),
        safeSheetCell(targetLead, 200),
        safeSheetCell(userAgent, 500),
        safeSheetCell(details, 8000)
      ]);

      // 嘗試寄送 Email 通知管理員（失敗不阻斷流程）
      try {
        var adminEmail = getAdminEmail();
        if (adminEmail && shouldSendMailNotification('ERR|' + category + '|' + message.slice(0, 120))) {
          var subject = '🚨【暗流警報】系統異常回報 - ' + category + ' (' + nowStr + ')';
          var body = [
            '《暗流》系統監控自動警報：',
            '------------------------------------------------',
            '⏰ 發生時間：' + nowStr,
            '🏷️ 錯誤類別：' + category,
            '⚠️ 錯誤訊息：' + message,
            '🤖 調用模型：' + model,
            '👤 玩家 ID / 信箱：' + userId,
            '📖 遊戲進度：' + progress + ' ｜ 攻略對象：' + targetLead,
            '📱 玩家裝置：' + userAgent,
            '------------------------------------------------',
            '📝 詳細資訊 / 堆疊：',
            details,
            '------------------------------------------------',
            '📊 試算表完整紀錄：' + ss.getUrl()
          ].join('\n');

          MailApp.sendEmail(adminEmail, subject, body);
        }
      } catch (mailErr) {
        console.warn('Mail notification failed: ' + mailErr.message);
      }

      return { success: true, loggedAt: nowStr, sheetUrl: ss.getUrl() };
    } catch (err) {
      console.error('Telemetry logError failed: ' + err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * 寫入一筆玩家意見回饋並寄信通知
   */
  function submitFeedback(payload) {
    try {
      var ss = getOrCreateSpreadsheet();
      var sheet = ss.getSheetByName('玩家意見回饋');
      if (!sheet) {
        sheet = ss.insertSheet('玩家意見回饋');
      }

      var nowStr = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd HH:mm:ss');
      var category = clampInlineText(payload.category || '💬 一般心得', 100);
      var rating = clampInlineText(payload.rating || '未評分', 50);
      var content = clampText(payload.content || '（無填寫內容）', 5000);
      var contact = clampInlineText(payload.contact || payload.username || payload.email || '匿名玩家', 300);
      var progress = clampInlineText(payload.progress || ('第 ' + (payload.act || 1) + ' 幕 · 第 ' + (payload.turn || 1) + ' 回'), 200);
      var targetLead = clampInlineText(payload.targetLead || '-', 200);
      var userAgent = clampText(payload.userAgent || '-', 500);
      var diagnosticsRaw = typeof payload.diagnostics === 'object' ? JSON.stringify(payload.diagnostics, null, 2) : String(payload.diagnostics || '');
      var diagnostics = clampText(diagnosticsRaw, 8000);

      // 寫入 Google Sheet
      sheet.appendRow([
        nowStr,
        safeSheetCell(category, 100),
        safeSheetCell(rating, 50),
        safeSheetCell(content, 5000),
        safeSheetCell(contact, 300),
        safeSheetCell(progress, 200),
        safeSheetCell(targetLead, 200),
        safeSheetCell(userAgent, 500),
        safeSheetCell(diagnostics, 8000)
      ]);

      // 嘗試寄送 Email 通知管理員（失敗不阻斷流程）
      try {
        var adminEmail = getAdminEmail();
        if (adminEmail && shouldSendMailNotification('FB|' + contact + '|' + content.slice(0, 120))) {
          var subject = '💬【暗流回饋】收到新的玩家意見 - ' + category + ' (' + contact + ')';
          var body = [
            '《暗流》收到新的玩家意見回饋：',
            '------------------------------------------------',
            '⏰ 提交時間：' + nowStr,
            '🏷️ 回饋類別：' + category,
            '⭐ 體感評分：' + rating,
            '👤 玩家稱呼 / 信箱：' + contact,
            '📖 遊戲進度：' + progress + ' ｜ 攻略對象：' + targetLead,
            '------------------------------------------------',
            '💬 玩家具體意見與建議：',
            content,
            '------------------------------------------------',
            '🔧 附帶遊戲診斷數據：',
            diagnostics ? diagnostics.slice(0, 500) + '...' : '（未附帶數據）',
            '------------------------------------------------',
            '📊 試算表完整紀錄：' + ss.getUrl()
          ].join('\n');

          MailApp.sendEmail(adminEmail, subject, body);
        }
      } catch (mailErr) {
        console.warn('Mail notification failed: ' + mailErr.message);
      }

      return { success: true, submittedAt: nowStr, sheetUrl: ss.getUrl() };
    } catch (err) {
      console.error('Telemetry submitFeedback failed: ' + err.message);
      return { success: false, error: err.message };
    }
  }

  return {
    logError: logError,
    submitFeedback: submitFeedback,
    getOrCreateSpreadsheet: getOrCreateSpreadsheet,
    initSpreadsheet: initSpreadsheet
  };

})();
