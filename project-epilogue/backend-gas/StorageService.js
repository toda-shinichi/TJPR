/**
 * Project Epilogue - 儲存與 Drive/Sheets 服務模組
 * 檔案：StorageService.js
 * 
 * 負責 Google Drive 檔案 I/O（Markdown 規則、角色卡、存檔 save_slot.json、章節 Full_Novel.md、摘要 Summary_Pool.md）
 * 以及 Google Sheets (Master_Index) 的使用者資料與設定集索引讀寫。
 */

var StorageService = (function() {

  /**
   * 取得 Master_Index 試算表物件
   */
  function getMasterSpreadsheet() {
    var secrets = getSecrets();
    var sheetId = secrets.SPREADSHEET_ID || CONFIG.SHEET.SPREADSHEET_ID;
    if (!sheetId) {
      throw new Error('未設定 SPREADSHEET_ID，無法連線 Master_Index 試算表。');
    }
    return SpreadsheetApp.openById(sheetId);
  }

  /**
   * 取得或初始化指定的 WorkSheet 工作表
   */
  function getOrCreateSheet(sheetName, defaultHeaders) {
    var ss = getMasterSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (defaultHeaders && defaultHeaders.length > 0) {
        sheet.appendRow(defaultHeaders);
        sheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight('bold');
      }
    }
    return sheet;
  }

  // ==========================================
  // GOOGLE SHEETS 使用者管理
  // ==========================================

  /**
   * 依據 Token 搜尋使用者資料
   */
  function findUserByToken(token) {
    var sheet = getOrCreateSheet(CONFIG.SHEET.USERS_SHEET_NAME, [
      'User_ID', 'Email', 'Password_Hash', 'Salt', 'API_Token', 'Drive_Folder_ID', 'Created_At', 'Last_Active'
    ]);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][4] === token) { // Column 5: API_Token
        // 更新最後活躍時間
        sheet.getRange(i + 1, 8).setValue(new Date().toISOString());
        return {
          userId: data[i][0],
          email: data[i][1],
          passwordHash: data[i][2],
          salt: data[i][3],
          apiToken: data[i][4],
          driveFolderId: data[i][5]
        };
      }
    }
    return null;
  }

  /**
   * 依據 Email 搜尋使用者資料
   */
  function findUserByEmail(email) {
    var sheet = getOrCreateSheet(CONFIG.SHEET.USERS_SHEET_NAME, [
      'User_ID', 'Email', 'Password_Hash', 'Salt', 'API_Token', 'Drive_Folder_ID', 'Created_At', 'Last_Active'
    ]);
    var data = sheet.getDataRange().getValues();
    var normalizedEmail = (email || '').trim().toLowerCase();
    for (var i = 1; i < data.length; i++) {
      if ((data[i][1] || '').toString().trim().toLowerCase() === normalizedEmail) {
        return {
          rowIndex: i + 1,
          userId: data[i][0],
          email: data[i][1],
          passwordHash: data[i][2],
          salt: data[i][3],
          apiToken: data[i][4],
          driveFolderId: data[i][5]
        };
      }
    }
    return null;
  }

  /**
   * 註冊新使用者至 Google Sheet
   */
  function registerNewUser(userData) {
    var sheet = getOrCreateSheet(CONFIG.SHEET.USERS_SHEET_NAME, [
      'User_ID', 'Email', 'Password_Hash', 'Salt', 'API_Token', 'Drive_Folder_ID', 'Created_At', 'Last_Active'
    ]);
    var now = new Date().toISOString();
    sheet.appendRow([
      userData.userId,
      userData.email,
      userData.passwordHash,
      userData.salt,
      userData.apiToken,
      userData.driveFolderId,
      userData.createdAt || now,
      now
    ]);
  }

  /**
   * 更新使用者的 API Token
   */
  function updateUserToken(userId, newToken) {
    // 必須帶入表頭：否則工作表不存在時會建出無表頭空表，token 不會被寫入，
    // 使用者會拿到一個伺服器端查不到的 token（登入成功卻立刻 401）。
    var sheet = getOrCreateSheet(CONFIG.SHEET.USERS_SHEET_NAME, [
      'User_ID', 'Email', 'Password_Hash', 'Salt', 'API_Token', 'Drive_Folder_ID', 'Created_At', 'Last_Active'
    ]);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        sheet.getRange(i + 1, 5).setValue(newToken);
        sheet.getRange(i + 1, 8).setValue(new Date().toISOString());
        break;
      }
    }
  }

  /**
   * 永久刪除 / 註銷使用者帳號與資料夾
   */
  function deleteUserAccount(userId) {
    var sheet = getOrCreateSheet(CONFIG.SHEET.USERS_SHEET_NAME, [
      'User_ID', 'Email', 'Password_Hash', 'Salt', 'API_Token', 'Drive_Folder_ID', 'Created_At', 'Last_Active'
    ]);
    var data = sheet.getDataRange().getValues();
    var folderIdToDelete = null;
    var rowIndexToDelete = null;

    var tokenToInvalidate = null;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        folderIdToDelete = data[i][5];
        tokenToInvalidate = data[i][4];
        rowIndexToDelete = i + 1;
        break;
      }
    }

    if (!rowIndexToDelete) return false;

    // 必須同步清除 CacheService 中的 session，否則已註銷帳號的 token
    // 在快取到期前（最長 30 分鐘）仍可通過 verifyUserToken 驗證。
    if (tokenToInvalidate) {
      try {
        CacheService.getScriptCache().remove('token_' + tokenToInvalidate);
      } catch (cacheErr) {
        console.warn('清除 token 快取失敗: ' + cacheErr.message);
      }
    }

    // 刪除 / 移至垃圾桶 Drive 資料夾
    if (folderIdToDelete) {
      var folder = DriveApp.getFolderById(folderIdToDelete);
      if (folder) folder.setTrashed(true);
    }

    // 雲端資料夾處理成功後才移除帳號索引，避免留下無法追蹤的資料。
    sheet.deleteRow(rowIndexToDelete);
    return true;
  }

  /**
   * 自動初始化並填充 Master_Index 的 Global_Configs 工作表
   */
  function populateGlobalConfigsSheet() {
    var sheet = getOrCreateSheet('Global_Configs', ['Config_Key', 'Config_Value', 'Description', 'Updated_At']);
    var data = sheet.getDataRange().getValues();
    var now = new Date().toISOString();

    var defaultConfigs = [
      ['APP_NAME', CONFIG.APP_NAME || '《暗流》沉浸式互動文字RPG引擎', '應用程式名稱', now],
      ['VERSION', CONFIG.VERSION || '1.1.0', '系統版本號', now],
      ['NARRATOR_PRIMARY', CONFIG.MODELS.NARRATOR.PRIMARY || 'aion-rp-1.0', '主筆小說敘事模型 (首選)', now],
      ['NARRATOR_FALLBACK', CONFIG.MODELS.NARRATOR.FALLBACK || 'cognitivecomputations/dolphin-mistral-24b-venice-edition', '主筆小說敘事模型 (備援)', now],
      ['AUDITOR_PRIMARY', CONFIG.MODELS.AUDITOR.PRIMARY || 'aion-3.0-mini', '記憶稽核與摘要壓縮模型 (首選)', now],
      ['AUDITOR_FALLBACK', CONFIG.MODELS.AUDITOR.FALLBACK || 'mistral-nemo', '記憶稽核模型 (備援)', now],
      ['SUMMARY_UPDATE_CADENCE', '5', '滾動摘要池壓縮更新週期 (每5回)', now],
      ['R18_MODE_DEFAULT', 'true', '成人情慾與肢體性張力模式預設值', now],
      ['RULES_FOLDER_ID', CONFIG.DRIVE.RULES_FOLDER_ID, '全域規則 Drive 資料夾 ID', now],
      ['CHARACTERS_FOLDER_ID', CONFIG.DRIVE.CHARACTERS_FOLDER_ID, '角色卡 Drive 資料夾 ID', now],
      ['SAVES_FOLDER_ID', CONFIG.DRIVE.SAVES_FOLDER_ID, '玩家存檔 Drive 資料夾 ID', now]
    ];

    if (data.length <= 1) {
      for (var j = 0; j < defaultConfigs.length; j++) {
        sheet.appendRow(defaultConfigs[j]);
      }
      console.log('Global_Configs 工作表已成功初始化並寫入 ' + defaultConfigs.length + ' 條設定。');
    }
    return true;
  }

  // ==========================================
  // GOOGLE DRIVE 檔案與資料夾操作
  // ==========================================

  /**
   * 取得或建立使用者專屬存檔資料夾
   */
  function getOrCreateUserDriveFolder(userId) {
    if (!userId) userId = 'usr_guest';
    var folderName = 'User_' + userId;
    var parentFolder = DriveApp.getFolderById(CONFIG.DRIVE.SAVES_FOLDER_ID);
    
    var subFolders = parentFolder.getFoldersByName(folderName);
    if (subFolders.hasNext()) {
      return subFolders.next().getId();
    }
    
    var newFolder = parentFolder.createFolder(folderName);
    return newFolder.getId();
  }

  /**
   * 讀取使用者的存檔 save_slot.json
   */
  function loadSaveState(userFolderIdOrUserId) {
    try {
      // 缺少識別資訊時直接放棄：先前會退回共用的 User_usr_guest 資料夾，
      // 造成不同使用者的存檔互相覆寫與外洩。
      if (!userFolderIdOrUserId) {
        console.error('loadSaveState 缺少 folderId/userId，拒絕讀取共用 guest 資料夾。');
        return null;
      }
      var folderId = userFolderIdOrUserId;
      if (folderId.indexOf('usr_') === 0) {
        folderId = getOrCreateUserDriveFolder(userFolderIdOrUserId);
      }
      var folder = DriveApp.getFolderById(folderId);
      var files = folder.getFilesByName(CONFIG.STORAGE.SAVE_FILE_NAME);
      if (files.hasNext()) {
        var file = files.next();
        var content = file.getBlob().getDataAsString('UTF-8');
        return JSON.parse(content);
      }
      return null;
    } catch (e) {
      console.error('loadSaveState 讀取失敗: ' + e.message);
      return null;
    }
  }

  /**
   * 寫入或更新使用者的存檔與五大資料檔案（接收真實前端資料）
   */
  function saveSaveState(userFolderIdOrUserId, saveStateObj, chapterObj, playerProfileObj, chapterHistoryArr) {
    try {
      // 缺少識別資訊時直接放棄：先前會退回共用的 User_usr_guest 資料夾，
      // 造成不同使用者的存檔互相覆寫與外洩。
      if (!userFolderIdOrUserId) {
        console.error('saveSaveState 缺少 folderId/userId，拒絕寫入共用 guest 資料夾。');
        return false;
      }
      var folderId = userFolderIdOrUserId;
      if (folderId.indexOf('usr_') === 0) {
        folderId = getOrCreateUserDriveFolder(userFolderIdOrUserId);
      }
      var folder = DriveApp.getFolderById(folderId);

      // 1. 寫入 / 更新 save_slot.json
      var jsonContent = JSON.stringify(saveStateObj, null, 2);
      var saveFiles = folder.getFilesByName(CONFIG.STORAGE.SAVE_FILE_NAME);
      if (saveFiles.hasNext()) {
        saveFiles.next().setContent(jsonContent);
      } else {
        folder.createFile(CONFIG.STORAGE.SAVE_FILE_NAME, jsonContent, MimeType.PLAIN_TEXT);
      }

      // 2. 寫入 / 更新 Player_Profile.json (真實玩家人設)
      var pProfile = playerProfileObj || (saveStateObj.meta && saveStateObj.meta.playerProfile) || saveStateObj.playerProfile;
      if (pProfile) {
        var profJson = JSON.stringify(pProfile, null, 2);
        var profFiles = folder.getFilesByName('Player_Profile.json');
        if (profFiles.hasNext()) {
          profFiles.next().setContent(profJson);
        } else {
          folder.createFile('Player_Profile.json', profJson, MimeType.PLAIN_TEXT);
        }
      }

      // 3. 寫入 / 更新 Summary_Pool.md (真實長期記憶摘要池)
      var summaryText = saveStateObj.summaryPool || '';
      if (summaryText) {
        var summaryContent = '# 長期劇情滾動摘要池 (Summary Pool)\n*最後同步時間：' + new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) + '*\n\n' + summaryText;
        var summaryFiles = folder.getFilesByName('Summary_Pool.md');
        if (summaryFiles.hasNext()) {
          summaryFiles.next().setContent(summaryContent);
        } else {
          folder.createFile('Summary_Pool.md', summaryContent, MimeType.PLAIN_TEXT);
        }
      }

      // 4. 寫入 / 更新 Memory_Archive.json (真實好感度、數值與關鍵事件標記)
      var memoryArchive = {
        turnCount: saveStateObj.turnCount || 1,
        targetLead: pProfile ? (pProfile.targetLeadName || pProfile.targetLead) : '主線',
        relationships: saveStateObj.relationships || {},
        questFlags: saveStateObj.questFlags || {},
        inventory: saveStateObj.inventory || [],
        tension: saveStateObj.tension || (saveStateObj.status && saveStateObj.status.tension) || 0,
        tipsy: saveStateObj.tipsy || (saveStateObj.status && saveStateObj.status.tipsy) || 0,
        lastUpdated: new Date().toISOString()
      };
      var memFiles = folder.getFilesByName('Memory_Archive.json');
      if (memFiles.hasNext()) {
        memFiles.next().setContent(JSON.stringify(memoryArchive, null, 2));
      } else {
        folder.createFile('Memory_Archive.json', JSON.stringify(memoryArchive, null, 2), MimeType.PLAIN_TEXT);
      }

      // 5. 追加至 Full_Novel.md
      //
      // ⚠️ 這裡刻意【只追加、絕不整份覆寫】。
      // 先前是用用戶端傳來的 chapterHistoryArr 重建整份檔案，這讓 Full_Novel.md
      // 的內容完全受用戶端狀態擺布 —— 一旦前端為了節省 localStorage 而裁切歷史，
      // 雲端這份唯一的完整檔案就會被截斷版覆寫，正文永久消失。
      // 現在 Full_Novel.md 是唯一的完整歸檔，只會單向成長。
      var chapterToAppend = chapterObj;
      if (!chapterToAppend && chapterHistoryArr && chapterHistoryArr.length > 0) {
        chapterToAppend = chapterHistoryArr[chapterHistoryArr.length - 1];
      }
      if (chapterToAppend && (chapterToAppend.prose || chapterToAppend.content)) {
        appendChapterToNovel(
          folderId,
          chapterToAppend.turn || saveStateObj.turnCount || 1,
          chapterToAppend.chapterTitle || '最新回',
          chapterToAppend.prose || chapterToAppend.content
        );
      }

      console.log('成功寫入真實遊戲資料至 Drive 存檔資料夾 (' + folderId + ')。');
      return true;
    } catch (err) {
      console.error('saveSaveState 寫入 Drive 失敗: ' + err.message);
      return false;
    }
  }

  /**
   * 將章節內文追加至使用者的 Full_Novel.md
   */
  function appendChapterToNovel(userFolderId, turnCount, chapterTitle, prose) {
    var folder = DriveApp.getFolderById(userFolderId);
    var files = folder.getFilesByName(CONFIG.STORAGE.NOVEL_FILE_NAME);
    var marker = '## 第 ' + turnCount + ' 回合：';
    var chapterBlock = '\n\n' + marker + chapterTitle + '\n\n' + prose + '\n\n---\n';

    if (files.hasNext()) {
      var file = files.next();
      var currentContent = file.getBlob().getDataAsString('UTF-8');
      // 幂等保護：同一回合會被同步多次（推進完成後、摘要池更新後、玩家手動同步），
      // 沒有這道檢查的話同一段正文會在歸檔裡重複出現好幾遍。
      if (currentContent.indexOf(marker) !== -1) {
        console.log('第 ' + turnCount + ' 回已存在於 Full_Novel.md，略過追加。');
        return;
      }
      file.setContent(currentContent + chapterBlock);
    } else {
      var header = '# Project Epilogue — 完整小說故事紀錄\n*建立時間：' + new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) + '*\n\n---\n';
      folder.createFile(CONFIG.STORAGE.NOVEL_FILE_NAME, header + chapterBlock, MimeType.PLAIN_TEXT);
    }
  }

  /**
   * 讀取全域核心指令與情慾文學規則 (System_Directives.md + Romance_Aesthetics.md)
   */
  function getGlobalRules() {
    var cache = CacheService.getScriptCache();
    var cachedRules = cache.get('system_global_rules_md');
    if (cachedRules) return cachedRules;

    try {
      var folder = DriveApp.getFolderById(CONFIG.DRIVE.RULES_FOLDER_ID);
      var files = folder.getFiles();
      var combinedRules = [];
      while (files.hasNext()) {
        var file = files.next();
        if (file.getName().endsWith('.md')) {
          var content = file.getBlob().getDataAsString('UTF-8');
          combinedRules.push('### 【規則文件：' + file.getName() + '】\n' + content);
        }
      }
      if (combinedRules.length > 0) {
        var merged = combinedRules.join('\n\n---\n\n');
        cache.put('system_global_rules_md', merged, 3600);
        return merged;
      }
    } catch (e) {
      console.warn('無法自 RULES_FOLDER 讀取規則，使用內建預設規則: ' + e.message);
    }

    return '# 系統核心指令\n全程台灣繁體中文、沉浸式文字RPG、嚴禁OOC、五感渲染與對話交替。';
  }

  /**
   * 取得指定角色 Markdown 檔案內容
   */
  function getCharacterMarkdown(characterFilenameOrId) {
    if (!characterFilenameOrId) return '';
    var cache = CacheService.getScriptCache();
    var cacheKey = 'char_' + encodeURIComponent(characterFilenameOrId);
    var cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      var folder = DriveApp.getFolderById(CONFIG.DRIVE.CHARACTERS_FOLDER_ID);
      var files = folder.getFiles();
      var cleanTarget = characterFilenameOrId.replace(/^0[0-9]_/, '').replace(/\.md$/, '').trim();

      while (files.hasNext()) {
        var file = files.next();
        var name = file.getName();
        if (name.indexOf(cleanTarget) !== -1 || name.indexOf(characterFilenameOrId) !== -1) {
          var content = file.getBlob().getDataAsString('UTF-8');
          cache.put(cacheKey, content, 3600);
          return content;
        }
      }
    } catch (e) {
      console.warn('讀取角色卡失敗 [' + characterFilenameOrId + ']: ' + e.message);
    }
    return '';
  }

  /**
   * 列出所有角色清單
   */
  function listCharacters() {
    var characters = [];
    try {
      var folder = DriveApp.getFolderById(CONFIG.DRIVE.CHARACTERS_FOLDER_ID);
      var files = folder.getFiles();
      while (files.hasNext()) {
        var file = files.next();
        var name = file.getName();
        if (name.endsWith('.md')) {
          var id = name.replace('.md', '');
          characters.push({
            id: id,
            name: name.replace('.md', '').replace(/_/g, ' '),
            fileId: file.getId(),
            updatedAt: file.getLastUpdated().toISOString()
          });
        }
      }
    } catch (e) {
      console.error('列出角色失敗: ' + e.message);
    }
    return characters;
  }

  return {
    getMasterSpreadsheet: getMasterSpreadsheet,
    findUserByToken: findUserByToken,
    findUserByEmail: findUserByEmail,
    registerNewUser: registerNewUser,
    updateUserToken: updateUserToken,
    deleteUserAccount: deleteUserAccount,
    populateGlobalConfigsSheet: populateGlobalConfigsSheet,
    getOrCreateUserDriveFolder: getOrCreateUserDriveFolder,
    loadSaveState: loadSaveState,
    saveSaveState: saveSaveState,
    appendChapterToNovel: appendChapterToNovel,
    getGlobalRules: getGlobalRules,
    getCharacterMarkdown: getCharacterMarkdown,
    listCharacters: listCharacters
  };

})();
