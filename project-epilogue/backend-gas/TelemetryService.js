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

  /**
   * 取得或建立專屬的 Google 試算表
   */
  function getOrCreateSpreadsheet() {
    var masterFolder = DriveStorage.getMasterIndexFolder();
    var files = masterFolder.getFilesByName(TELEMETRY_SHEET_NAME);
    
    var ss;
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create(TELEMETRY_SHEET_NAME);
      var ssFile = DriveApp.getFileById(ss.getId());
      masterFolder.addFile(ssFile);
      DriveApp.getRootFolder().removeFile(ssFile);

      // 初始化工作表 1: 錯誤日誌
      var errSheet = ss.getActiveSheet();
      errSheet.setName('系統錯誤日誌');
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

      // 初始化工作表 2: 玩家意見回饋
      var fbSheet = ss.insertSheet('玩家意見回饋');
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
    return ss;
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
      var category = payload.category || 'GENERAL_ERROR';
      var message = payload.message || '未知錯誤';
      var model = payload.model || '-';
      var userId = payload.userId || payload.email || 'guest';
      var progress = payload.progress || ('第 ' + (payload.act || 1) + ' 幕 · 第 ' + (payload.turn || 1) + ' 回');
      var targetLead = payload.targetLead || '-';
      var userAgent = payload.userAgent || '-';
      var details = typeof payload.details === 'object' ? JSON.stringify(payload.details) : String(payload.details || '');

      // 寫入 Google Sheet
      sheet.appendRow([
        nowStr,
        category,
        message,
        model,
        userId,
        progress,
        targetLead,
        userAgent,
        details
      ]);

      // 寄送 Email 通知管理員
      var adminEmail = getAdminEmail();
      if (adminEmail) {
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

      return { success: true, loggedAt: nowStr };
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
      var category = payload.category || '💬 一般心得';
      var rating = payload.rating || '未評分';
      var content = payload.content || '（無填寫內容）';
      var contact = payload.contact || payload.username || payload.email || '匿名玩家';
      var progress = payload.progress || ('第 ' + (payload.act || 1) + ' 幕 · 第 ' + (payload.turn || 1) + ' 回');
      var targetLead = payload.targetLead || '-';
      var userAgent = payload.userAgent || '-';
      var diagnostics = typeof payload.diagnostics === 'object' ? JSON.stringify(payload.diagnostics, null, 2) : String(payload.diagnostics || '');

      // 寫入 Google Sheet
      sheet.appendRow([
        nowStr,
        category,
        rating,
        content,
        contact,
        progress,
        targetLead,
        userAgent,
        diagnostics
      ]);

      // 寄送 Email 通知管理員
      var adminEmail = getAdminEmail();
      if (adminEmail) {
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

      return { success: true, submittedAt: nowStr, sheetUrl: ss.getUrl() };
    } catch (err) {
      console.error('Telemetry submitFeedback failed: ' + err.message);
      return { success: false, error: err.message };
    }
  }

  return {
    logError: logError,
    submitFeedback: submitFeedback,
    getOrCreateSpreadsheet: getOrCreateSpreadsheet
  };

})();
