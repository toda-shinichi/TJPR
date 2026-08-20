/**
 * Project Epilogue - Backend Entry Point & Router
 * File: Code.js
 * 
 * Handles Google Apps Script Web App endpoints:
 * - doPost: Dispatches authenticated API actions (CORS enabled, JSON output)
 * - doGet: Health check and service status
 * - Token Authentication & Session Verification
 */

/**
 * Main Web App POST Handler
 * @param {Object} e - Event parameter containing postData
 * @returns {TextOutput} JSON response with CORS headers
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createErrorResponse('Empty request body.', 400);
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createErrorResponse('Invalid JSON payload: ' + parseErr.message, 400);
    }

    var action = payload.action;
    if (!action) {
      return createErrorResponse('Missing required parameter: "action".', 400);
    }

    // Public / Unauthenticated Actions
    if (action === 'auth/login') {
      return handleLogin(payload);
    } else if (action === 'auth/register') {
      return handleRegister(payload);
    } else if (action === 'health') {
      return createSuccessResponse({ status: 'healthy', version: CONFIG.VERSION, timestamp: new Date().toISOString() });
    } else if (action === 'telemetry/log-error') {
      var errRes = TelemetryService.logError(payload);
      return errRes && errRes.success
        ? createSuccessResponse(errRes)
        : createErrorResponse((errRes && errRes.error) || 'Telemetry logging failed.', 500);
    } else if (action === 'telemetry/submit-feedback') {
      var fbRes = TelemetryService.submitFeedback(payload);
      return fbRes && fbRes.success
        ? createSuccessResponse(fbRes)
        : createErrorResponse((fbRes && fbRes.error) || 'Feedback submission failed.', 500);
    }

    // Authenticate all protected actions
    var userSession = authenticateRequest(e, payload);
    if (!userSession.isValid) {
      return createErrorResponse(userSession.error || 'Unauthorized request.', 401);
    }

    // Administrative setup mutates shared Drive/Sheets resources and must never
    // be callable by anonymous or regular player sessions.
    if (action === 'telemetry/init' || action === 'admin/bootstrap') {
      if (userSession.userId !== 'master_admin') {
        return createErrorResponse('Administrator privileges required.', 403);
      }
      if (action === 'telemetry/init') {
        return createSuccessResponse(TelemetryService.initSpreadsheet());
      }
      var syncResult = bootstrapAllDriveFiles();
      try {
        StorageService.populateGlobalConfigsSheet();
        TelemetryService.initSpreadsheet();
      } catch (adminInitErr) {
        console.warn('populateGlobalConfigsSheet/Telemetry error: ' + adminInitErr.message);
      }
      return createSuccessResponse(syncResult);
    }

    // Router Dispatcher
    switch (action) {
      case 'auth/delete-account':
        return handleDeleteAccount(userSession, payload);

      case 'auth/verify':
        return createSuccessResponse({
          valid: true,
          userId: userSession.userId,
          email: userSession.email,
          driveFolderId: userSession.driveFolderId
        });

      case 'llm/proxy':
        return handleLLMProxy(userSession, payload);

      case 'novel/init':
        return handleNovelInit(userSession, payload);

      case 'novel/next-turn':
        return handleNextTurn(userSession, payload);

      case 'novel/audit':
        return handleAudit(userSession, payload);

      case 'novel/rebase':
        return handleActRebase(userSession, payload);

      case 'novel/save-state':
        return handleSaveState(userSession, payload);

      case 'novel/load-state':
        return handleLoadState(userSession, payload);

      case 'lore/get-characters':
        return handleGetCharacters(userSession, payload);

      default:
        return createErrorResponse('Unknown API action: ' + action, 404);
    }

  } catch (globalErr) {
    console.error('Unhandled server exception in doPost: ' + globalErr.stack);
    return createErrorResponse('Internal Server Error: ' + globalErr.message, 500);
  }
}

/**
 * 頂層測試與立即建立試算表函式（供 Apps Script 執行）
 */
function testCreateTelemetrySheet() {
  var res = TelemetryService.initSpreadsheet();
  Logger.log('Create result: ' + JSON.stringify(res));
  return res;
}

/**
 * Main Web App GET Handler (Health Check & Diagnostics & Init)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';


  if (action === 'init-telemetry' || action === 'init-sheet') {
    return createErrorResponse('Remote initialization is disabled. Run testCreateTelemetrySheet from the Apps Script editor.', 403);
  }

  var responseData = {
    service: CONFIG.APP_NAME,
    version: CONFIG.VERSION,
    status: 'ONLINE',
    env: CONFIG.ENV,
    timestamp: new Date().toISOString(),
    narratorModel: CONFIG.MODELS.NARRATOR.PRIMARY,
    auditorModel: CONFIG.MODELS.AUDITOR.PRIMARY
  };

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// AUTHENTICATION & SECURITY HELPERS
// ==========================================

/**
 * Authenticates the incoming request via Authorization header or payload token
 * @param {Object} e - GAS HTTP event
 * @param {Object} payload - Parsed JSON body
 * @returns {Object} { isValid: boolean, userId: string, driveFolderId: string, email: string, error?: string }
 */
function authenticateRequest(e, payload) {
  var token = null;

  // 1. Check Header (Authorization: Bearer <token>)
  if (e && e.headers) {
    var authHeader = e.headers['Authorization'] || e.headers['authorization'];
    if (authHeader && authHeader.indexOf('Bearer ') === 0) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Fallback to payload.token
  if (!token && payload && payload.token) {
    token = payload.token;
  }

  if (!token) {
    return { isValid: false, error: 'Missing authentication token.' };
  }

  // Master Admin Override
  var secrets = getSecrets();
  if (secrets.MASTER_ADMIN_KEY && token === secrets.MASTER_ADMIN_KEY) {
    return {
      isValid: true,
      userId: 'master_admin',
      email: 'admin@epilogue.internal',
      driveFolderId: (PropertiesService.getScriptProperties().getProperty('DEFAULT_DRIVE_FOLDER_ID') || CONFIG.DRIVE.SAVES_FOLDER_ID)
    };
  }

  // Verify against CacheService or Google Sheet registry
  return verifyUserToken(token);
}

/**
 * Generates a SHA-256 salted hash string
 * @param {string} rawString - Input string / password
 * @param {string} salt - Salt string
 * @returns {string} Hex hash
 */
function generateSaltedHash(rawString, salt) {
  var rawBytes = Utilities.newBlob(rawString + salt).getBytes();
  var hashBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, rawBytes);
  return hashBytes.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

/**
 * Generates a secure random session token
 * @param {string} userId - User identifier
 * @returns {string} Cryptographic token
 */
function generateSessionToken(userId) {
  var randomUUID = Utilities.getUuid();
  var timestamp = new Date().getTime().toString();
  // JWT_SECRET 尚未設定時也不可退回公開固定字串；此 token 最終仍會以
  // 隨機值寫入 Users 表並逐筆比對，臨時熵只用來避免可預測簽章。
  var signingSecret = getSecrets().JWT_SECRET || (Utilities.getUuid() + Utilities.getUuid());
  var signature = generateSaltedHash(userId + timestamp + randomUUID, signingSecret);
  return 'epi_' + Utilities.base64EncodeWebSafe(userId + ':' + timestamp + ':' + signature);
}

/**
 * Verifies token validity from CacheService or Google Sheets
 * @param {string} token - Session token
 * @returns {Object} User session details
 */
function verifyUserToken(token) {
  var cache = CacheService.getScriptCache();
  var cachedSession = cache.get('token_' + token);

  if (cachedSession) {
    try {
      var sessionObj = JSON.parse(cachedSession);
      return {
        isValid: true,
        userId: sessionObj.userId,
        email: sessionObj.email,
        driveFolderId: sessionObj.driveFolderId
      };
    } catch (e) {
      // Cache corrupted, fallback to Sheet lookup
    }
  }

  // Query Google Sheet user database
  var sheetResult = StorageService.findUserByToken(token);
  if (sheetResult && sheetResult.userId) {
    // Cache for fast subsequent requests (30 mins)
    cache.put('token_' + token, JSON.stringify(sheetResult), CONFIG.STORAGE.CACHE_EXPIRATION_SEC);
    return {
      isValid: true,
      userId: sheetResult.userId,
      email: sheetResult.email,
      driveFolderId: sheetResult.driveFolderId
    };
  }

  return { isValid: false, error: 'Invalid or expired session token.' };
}

// ==========================================
// CONTROLLERS & ROUTER ACTION HANDLERS
// ==========================================

/**
 * User Login Handler
 */
function handleLogin(payload) {
  var email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  var password = payload.password;

  if (!email || !password || email.length > 254 || typeof password !== 'string' || password.length > 256) {
    return createErrorResponse('Email and password are required.', 400);
  }

  var userRecord = StorageService.findUserByEmail(email);
  if (!userRecord) {
    return createErrorResponse('Invalid email or password.', 401);
  }

  var calculatedHash = generateSaltedHash(password, userRecord.salt);
  if (calculatedHash !== userRecord.passwordHash) {
    return createErrorResponse('Invalid email or password.', 401);
  }

  var newToken = generateSessionToken(userRecord.userId);
  if (userRecord.apiToken && userRecord.apiToken !== newToken) {
    try {
      CacheService.getScriptCache().remove('token_' + userRecord.apiToken);
    } catch (cacheErr) {
      console.warn('舊登入權杖快取清除失敗: ' + cacheErr.message);
    }
  }
  StorageService.updateUserToken(userRecord.userId, newToken);

  // Cache session
  var sessionData = {
    userId: userRecord.userId,
    email: userRecord.email,
    driveFolderId: userRecord.driveFolderId
  };
  CacheService.getScriptCache().put('token_' + newToken, JSON.stringify(sessionData), CONFIG.STORAGE.CACHE_EXPIRATION_SEC);

  return createSuccessResponse({
    token: newToken,
    userId: userRecord.userId,
    email: userRecord.email,
    driveFolderId: userRecord.driveFolderId
  });
}

/**
 * User Registration Handler
 */
function handleRegister(payload) {
  var email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  var password = payload.password;

  var validEmail = /^[^\s@=+\-][^\s@]*@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail || typeof password !== 'string' || password.length < 6 || password.length > 256 || email.length > 254) {
    return createErrorResponse('Email and a password of at least 6 characters are required.', 400);
  }

  var registrationLock = LockService.getScriptLock();
  var registrationLocked = false;
  var userId;
  var token;
  var userFolderId;
  try {
    registrationLock.waitLock(30000);
    registrationLocked = true;
    var existing = StorageService.findUserByEmail(email);
    if (existing) {
      return createErrorResponse('A user with this email already exists.', 409);
    }

    userId = 'usr_' + Utilities.getUuid().substring(0, 8);
    var salt = Utilities.getUuid().substring(0, 16);
    var passwordHash = generateSaltedHash(password, salt);
    token = generateSessionToken(userId);
    userFolderId = StorageService.getOrCreateUserDriveFolder(userId);

    StorageService.registerNewUser({
      userId: userId,
      email: email,
      passwordHash: passwordHash,
      salt: salt,
      apiToken: token,
      driveFolderId: userFolderId,
      createdAt: new Date().toISOString()
    });
  } finally {
    if (registrationLocked) {
      try { registrationLock.releaseLock(); } catch (releaseErr) { console.warn('註冊鎖釋放失敗: ' + releaseErr.message); }
    }
  }

  return createSuccessResponse({
    token: token,
    userId: userId,
    email: email,
    driveFolderId: userFolderId
  });
}

/**
 * Novel Turn Generation Handler (Primary LLM Call)
 */
function handleNextTurn(userSession, payload) {
  var choiceId = payload.choiceId;
  var customInput = payload.customInput;
  var currentSaveState = payload.saveState || StorageService.loadSaveState(userSession.driveFolderId);

  if (!currentSaveState) {
    return createErrorResponse('No active save state found for this session.', 404);
  }

  // 1. Build context via Memory Pipeline (Tiered Lorebook + Summary Pool + History)
  var promptContext = MemoryPipeline.buildTurnPromptContext({
    userSession: userSession,
    saveState: currentSaveState,
    choiceId: choiceId,
    customInput: customInput
  });

  // 2. Call Primary Narrator Model
  var result = AIService.generateNextChapter(promptContext);
  if (!result.success || !result.data) {
    return createErrorResponse('Failed to generate chapter prose.', 502);
  }

  var chapterOutput = result.data;

  // 3. Update Save State and Memory Pipeline
  var updatedSaveState = MemoryPipeline.applyTurnUpdate({
    userSession: userSession,
    saveState: currentSaveState,
    turnOutput: chapterOutput,
    choiceSelected: choiceId || customInput
  });

  // 4. Append to Full_Novel.md in Google Drive
  StorageService.appendChapterToNovel(
    userSession.driveFolderId,
    updatedSaveState.turnCount,
    chapterOutput.chapterTitle || ('Turn ' + updatedSaveState.turnCount),
    chapterOutput.prose
  );

  // 5. Persist updated save_slot.json
  if (!StorageService.saveSaveState(userSession.driveFolderId, updatedSaveState)) {
    return createErrorResponse('Chapter generated but save-state persistence failed.', 500);
  }

  return createSuccessResponse({
    turn: updatedSaveState.turnCount,
    chapter: chapterOutput,
    saveState: updatedSaveState,
    modelUsed: result.modelUsed
  });
}

/**
 * Fast Model Consistency Audit Handler
 */
function handleAudit(userSession, payload) {
  var saveState = payload.saveState || StorageService.loadSaveState(userSession.driveFolderId);
  if (!saveState) return createErrorResponse('No active save state found for this session.', 404);
  var auditReport = MemoryPipeline.runTurnAudit(userSession, saveState);
  return createSuccessResponse({ audit: auditReport });
}

/**
 * Act Rebase Handler (Compresses history into Act Dossier and resets window)
 */
function handleActRebase(userSession, payload) {
  var saveState = payload.saveState || StorageService.loadSaveState(userSession.driveFolderId);
  if (!saveState) return createErrorResponse('No active save state found for this session.', 404);
  var rebaseResult = MemoryPipeline.executeActRebase(userSession, saveState);
  return createSuccessResponse(rebaseResult);
}

/**
 * Novel State Save Handler
 */
function handleSaveState(userSession, payload) {
  var stateData = payload.saveState;
  if (!stateData) {
    return createErrorResponse('Missing saveState in payload.', 400);
  }
  // Keep the resumable chapter payload together with save_slot.json. Full_Novel.md
  // remains the human-readable archive, while these fields restore the live UI.
  stateData._chapterData = payload.chapter || null;
  stateData._chapterHistoryList = payload.chapterHistory || [];
  var folderId = userSession.driveFolderId || StorageService.getOrCreateUserDriveFolder(userSession.userId);
  var saved = StorageService.saveSaveState(folderId, stateData, payload.chapter, payload.playerProfile, payload.chapterHistory);
  if (!saved) return createErrorResponse('Failed to persist save state.', 500);
  return createSuccessResponse({ saved: true, folderId: folderId, timestamp: new Date().toISOString() });
}

/**
 * Novel State Load Handler
 */
function handleLoadState(userSession, payload) {
  var state = StorageService.loadSaveState(userSession.driveFolderId);
  if (!state) {
    return createSuccessResponse({ saveState: null, chapter: null, chapterHistory: [] });
  }
  var chapter = state._chapterData || null;
  var chapterHistory = state._chapterHistoryList || [];
  delete state._chapterData;
  delete state._chapterHistoryList;
  return createSuccessResponse({
    saveState: state,
    chapter: chapter,
    chapterHistory: chapterHistory
  });
}

/**
 * Novel Initialization Handler (開局角色與情境初始化)
 */
function handleNovelInit(userSession, payload) {
  var playerProfile = payload.playerProfile || {
    targetLead: payload.mainCharacterId || '01_徐令謙',
    targetLeadName: '徐令謙'
  };
  var initialStory = MemoryPipeline.initializeNewNovel(userSession, playerProfile);
  return createSuccessResponse(initialStory);
}

/**
 * Get Tiered Lorebook Characters List
 */
function handleGetCharacters(userSession, payload) {
  var characters = StorageService.listCharacters(userSession.driveFolderId);
  return createSuccessResponse({ characters: characters });
}

// ==========================================
// HTTP RESPONSE HELPERS WITH CORS
// ==========================================

/**
 * Creates standardized successful JSON output
 */
function createSuccessResponse(data) {
  var response = {
    success: true,
    data: data,
    timestamp: new Date().toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Creates standardized error JSON output
 */
function createErrorResponse(message, statusCode) {
  var response = {
    success: false,
    error: {
      message: message,
      code: statusCode || 500
    },
    timestamp: new Date().toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * 註銷帳號處理器
 */
function handleDeleteAccount(userSession, payload) {
  if (!userSession || !userSession.userId) {
    return createErrorResponse('Unauthorized.', 401);
  }
  var deleted = StorageService.deleteUserAccount(userSession.userId);
  if (!deleted) {
    return createErrorResponse('User account was not found or could not be deleted.', 404);
  }
  return createSuccessResponse({ deleted: true, message: '使用者帳號及相關雲端資料已全數清除。' });
}

/**
 * 🛠️ 一鍵全域自動修復與雲端初始化工具 (可在 GAS 編輯器上方直接選擇此函式並按「執行」)
 */
function adminPopulateEverything() {
  // ⚠️ 破壞性操作：步驟 3 會用範例資料【覆寫每一位玩家】的 save_slot.json，
  // 亦即抹除所有真實遊玩進度。除非確實是要重置測試環境，否則不要執行。
  var ui = null;
  try { ui = SpreadsheetApp.getUi(); } catch (noUiErr) { /* 非 UI 環境 */ }
  if (ui) {
    var answer = ui.alert(
      '危險操作確認',
      '此函式會用範例存檔覆寫 Player_Saves 底下【所有玩家】的 save_slot.json，\n' +
      '真實遊玩進度將無法復原。確定要繼續嗎？',
      ui.ButtonSet.YES_NO
    );
    if (answer !== ui.Button.YES) {
      console.log('使用者取消 adminPopulateEverything。');
      return { success: false, cancelled: true };
    }
  } else if (PropertiesService.getScriptProperties().getProperty('ALLOW_DESTRUCTIVE_RESEED') !== 'true') {
    // 無 UI（例如從 API 或觸發器呼叫）時必須先明確設定指令碼屬性才放行。
    throw new Error('adminPopulateEverything 為破壞性操作：請先將指令碼屬性 ALLOW_DESTRUCTIVE_RESEED 設為 true。');
  }

  console.log('=== 開始執行全域雲端修復與資料庫填充 ===');
  
  // 1. 初始化 Global_Configs 與 Master_Index 試算表
  try {
    StorageService.populateGlobalConfigsSheet();
    console.log('✅ Global_Configs 工作表已填入全域參數');
  } catch (e) {
    console.error('❌ Global_Configs 填充失敗: ' + e.message);
  }

  // 2. 初始化 Drive 規則與角色卡
  try {
    bootstrapAllDriveFiles();
    console.log('✅ Rules 與 Characters 資料夾檔案已同步');
  } catch (e) {
    console.error('❌ Rules/Characters 同步失敗: ' + e.message);
  }

  // 3. 掃描 Player_Saves 資料夾，為所有使用者資料夾寫入 5 大檔案
  try {
    var parentFolder = DriveApp.getFolderById(CONFIG.DRIVE.SAVES_FOLDER_ID);
    var subFolders = parentFolder.getFolders();
    var folderCount = 0;

    var sampleSaveState = {
      turnCount: 1,
      relationships: { "徐令謙": { favorability: 25, tension: 30, intimacy: 10 } },
      questFlags: { "first_meeting_complete": true, "night_investigation": false },
      inventory: ["德行法律事務所名片", "加密隨身碟"],
      summaryPool: "女主初抵台北政商核心圈，在德行法律事務所與玄辰幫二把手徐令謙首次會面，雙方展開第一次權力與邊界的言語交鋒。",
      meta: {
        playerProfile: {
          name: "沈清漪",
          gender: "女",
          age: 26,
          background: "調查記者 / 獨立政經分析師",
          targetLead: "01_徐令謙",
          targetLeadName: "徐令謙",
          eroticLevel: "極限張力 (R-18)"
        }
      }
    };

    var sampleChapter = {
      chapterTitle: "第 1 回：暗夜交鋒 · 初探德行",
      prose: "雨夜中的台北市士林區德行東路，霓虹燈光倒映在濕漉漉的柏油路面上。\n\n妳推開德行法律事務所厚重的黃銅大門，室內瀰漫著高級冷杉與清冽的雪松菸草香氣。坐在長型胡桃木辦公桌後的男人抬起眼眸，深黑色的三件套訂製西裝襯得他身形挺拔，鼻樑上的金絲復古眼鏡後，是一雙深沉且帶著極致掌控欲的眼眸。\n\n「沈小姐，」徐令謙修長指節輕叩著桌面上的加密卷宗，語調從容而低緩，「既然踏進了這裡，妳該明白——有些真相一旦翻開，就沒有回頭的退路。」"
    };

    while (subFolders.hasNext()) {
      var folder = subFolders.next();
      var folderId = folder.getId();
      StorageService.saveSaveState(folderId, sampleSaveState, sampleChapter);
      folderCount++;
      console.log('✅ 已為資料夾 [' + folder.getName() + '] (' + folderId + ') 寫入 5 大存檔與對話檔案');
    }

    // 若沒有任何資料夾，自動建立一個預設玩家資料夾
    if (folderCount === 0) {
      var defaultFolderId = StorageService.getOrCreateUserDriveFolder('demo_player');
      StorageService.saveSaveState(defaultFolderId, sampleSaveState, sampleChapter);
      console.log('✅ 已自動建立 User_demo_player 並寫入 5 大檔案');
    }

  } catch (e) {
    console.error('❌ Player_Saves 資料夾填充失敗: ' + e.message);
  }

  console.log('=== 全域雲端修復與資料庫填充完成 ===');
  return { success: true };
}

/**
 * Pure LLM Proxy to hide API Key
 */
function handleLLMProxy(userSession, payload) {
  try {
    var result = AIService.callAPI(payload.model, payload.messages, {
      temperature: payload.temperature,
      max_tokens: payload.max_tokens
    });
    return createSuccessResponse(result);
  } catch (e) {
    return createErrorResponse('LLM Proxy failed: ' + e.message, 502);
  }
}
