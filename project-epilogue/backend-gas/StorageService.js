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
      var folderId = userFolderIdOrUserId;
      if (!folderId || folderId.indexOf('usr_') === 0 || folderId === 'usr_guest') {
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
   * 寫入或更新使用者的存檔與五大資料檔案
   */
  function saveSaveState(userFolderIdOrUserId, saveStateObj, chapterObj) {
    try {
      var folderId = userFolderIdOrUserId;
      if (!folderId || folderId.indexOf('usr_') === 0 || folderId === 'usr_guest') {
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

      // 2. 寫入 / 更新 Player_Profile.json
      if (saveStateObj.meta && saveStateObj.meta.playerProfile) {
        var profJson = JSON.stringify(saveStateObj.meta.playerProfile, null, 2);
        var profFiles = folder.getFilesByName('Player_Profile.json');
        if (profFiles.hasNext()) {
          profFiles.next().setContent(profJson);
        } else {
          folder.createFile('Player_Profile.json', profJson, MimeType.PLAIN_TEXT);
        }
      }

      // 3. 寫入 / 更新 Summary_Pool.md (長期記憶摘要池)
      if (saveStateObj.summaryPool) {
        var summaryContent = '# 長期劇情滾動摘要池 (Summary Pool)\n*更新時間：' + new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) + '*\n\n' + saveStateObj.summaryPool;
        var summaryFiles = folder.getFilesByName('Summary_Pool.md');
        if (summaryFiles.hasNext()) {
          summaryFiles.next().setContent(summaryContent);
        } else {
          folder.createFile('Summary_Pool.md', summaryContent, MimeType.PLAIN_TEXT);
        }
      }

      // 4. 寫入 / 更新 Memory_Archive.json (好感度與關鍵事件標記)
      var memoryArchive = {
        turnCount: saveStateObj.turnCount || 1,
        relationships: saveStateObj.relationships || {},
        questFlags: saveStateObj.questFlags || {},
        inventory: saveStateObj.inventory || [],
        protagonist: saveStateObj.protagonist || {},
        lastUpdated: new Date().toISOString()
      };
      var memFiles = folder.getFilesByName('Memory_Archive.json');
      if (memFiles.hasNext()) {
        memFiles.next().setContent(JSON.stringify(memoryArchive, null, 2));
      } else {
        folder.createFile('Memory_Archive.json', JSON.stringify(memoryArchive, null, 2), MimeType.PLAIN_TEXT);
      }

      // 5. 追加章節至 Full_Novel.md (若有提供 chapterObj)
      if (chapterObj && chapterObj.prose) {
        appendChapterToNovel(folderId, saveStateObj.turnCount || 1, chapterObj.chapterTitle || '最新回', chapterObj.prose);
      }

      console.log('成功寫入 Drive 存檔資料夾 (' + folderId + ') 五大核心檔案。');
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

