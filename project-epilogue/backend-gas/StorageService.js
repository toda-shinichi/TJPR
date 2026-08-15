/**
 * Project Epilogue - 儲存與 Drive/Sheets 服務模組
 * 檔案：StorageService.js
 * 
 * 負責 Google Drive 檔案 I/O（Markdown 規則、角色卡、存檔 save_slot.json、章節 Full_Novel.md）
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
        
  /**
   * 永久刪除 / 註銷使用者帳號與資料夾
   */
  function deleteUserAccount(userId) {
    var sheet = getOrCreateSheet(CONFIG.SHEET.USERS_SHEET_NAME, [
      'User_ID', 'Email', 'Password_Hash', 'Salt', 'API_Token', 'Drive_Folder_ID', 'Created_At', 'Last_Active'
    ]);
    var data = sheet.getDataRange().getValues();
    var folderIdToDelete = null;

    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        folderIdToDelete = data[i][5];
        sheet.deleteRow(i + 1);
        break;
      }
    }

    // 刪除 / 移至垃圾桶 Drive 資料夾
    if (folderIdToDelete) {
      try {
        var folder = DriveApp.getFolderById(folderIdToDelete);
        if (folder) folder.setTrashed(true);
      } catch (e) {
        console.warn('Could not trash user folder: ' + e.message);
      }
    }

    return true;
  }

  return {
    deleteUserAccount: deleteUserAccount,
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
    var sheet = getOrCreateSheet(CONFIG.SHEET.USERS_SHEET_NAME);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        sheet.getRange(i + 1, 5).setValue(newToken);
        sheet.getRange(i + 1, 8).setValue(new Date().toISOString());
        break;
      }
    }
  }

  // ==========================================
  // GOOGLE DRIVE 檔案與資料夾操作
  // ==========================================

  /**
   * 在 SAVES_FOLDER_ID 下為新使用者建立專屬存檔資料夾
   */
  function createUserDriveFolder(userId) {
    var parentFolder = DriveApp.getFolderById(CONFIG.DRIVE.SAVES_FOLDER_ID);
    var folderName = 'User_' + userId;
    var userFolder = parentFolder.createFolder(folderName);
    return userFolder.getId();
  }

  /**
   * 讀取使用者的存檔 save_slot.json
   */
  function loadSaveState(userFolderId) {
    try {
      var folder = DriveApp.getFolderById(userFolderId);
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
   * 寫入或更新使用者的存檔 save_slot.json
   */
  function saveSaveState(userFolderId, saveStateObj) {
    var folder = DriveApp.getFolderById(userFolderId);
    var files = folder.getFilesByName(CONFIG.STORAGE.SAVE_FILE_NAME);
    var jsonContent = JSON.stringify(saveStateObj, null, 2);

    if (files.hasNext()) {
      var file = files.next();
      file.setContent(jsonContent);
    } else {
      folder.createFile(CONFIG.STORAGE.SAVE_FILE_NAME, jsonContent, MimeType.PLAIN_TEXT);
    }
  }

  /**
   * 將章節內文追加至使用者的 Full_Novel.md
   */
  function appendChapterToNovel(userFolderId, turnCount, chapterTitle, prose) {
    var folder = DriveApp.getFolderById(userFolderId);
    var files = folder.getFilesByName(CONFIG.STORAGE.NOVEL_FILE_NAME);
    var chapterBlock = '\n\n## 第 ' + turnCount + ' 回合：' + chapterTitle + '\n\n' + prose + '\n\n---\n';

    if (files.hasNext()) {
      var file = files.next();
      var currentContent = file.getBlob().getDataAsString('UTF-8');
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
   * 取得指定角色 Markdown 檔案內容（支援 ID 與姓名模糊比對，如 "徐令謙" 或 "01_徐令謙"）
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
   * 列出所有角色清單（供 Tiered Lorebook 檢索與前端角色選擇器使用）
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
    createUserDriveFolder: createUserDriveFolder,
    loadSaveState: loadSaveState,
    saveSaveState: saveSaveState,
    appendChapterToNovel: appendChapterToNovel,
    getGlobalRules: getGlobalRules,
    getCharacterMarkdown: getCharacterMarkdown,
    listCharacters: listCharacters
  };

})();
