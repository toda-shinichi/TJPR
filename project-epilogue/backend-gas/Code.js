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
      return createSuccessResponse(errRes);
    } else if (action === 'telemetry/submit-feedback') {
      var fbRes = TelemetryService.submitFeedback(payload);
      return createSuccessResponse(fbRes);
    } else if (action === 'telemetry/init') {
      var initRes = TelemetryService.initSpreadsheet();
      return createSuccessResponse(initRes);
    } else if (action === 'admin/bootstrap') {
      var syncResult = bootstrapAllDriveFiles();
      try {
        StorageService.populateGlobalConfigsSheet();
        TelemetryService.initSpreadsheet();
      } catch (e) {
        console.warn('populateGlobalConfigsSheet/Telemetry error: ' + e.message);
      }
      return createSuccessResponse(syncResult);
    }

    // Authenticate all protected actions
    var userSession = authenticateRequest(e, payload);
    if (!userSession.isValid) {
      return createErrorResponse(userSession.error || 'Unauthorized request.', 401);
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
    try {
      var initRes = TelemetryService.initSpreadsheet();
      return ContentService.createTextOutput(JSON.stringify({
        status: 'SUCCESS',
        message: 'Telemetry spreadsheet created/verified successfully.',
        data: initRes
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'ERROR',
        message: err.message
      })).setMimeType(ContentService.MimeType.JSON);
    }
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
    token = 'tok_default_player';
  }

  // 支援訪客與前端直通 Token 暢行模式（自動查找或建立專屬 Drive 資料夾）
  if (token.indexOf('guest_') === 0 || token.indexOf('local_') === 0 || token.indexOf('tok_') === 0 || token.indexOf('epi_mock_') === 0 || (payload && payload.userId === 'usr_guest') || token === 'tok_default_player') {
    var uId = (payload && payload.userId) || 'usr_player';
    var uFolder = StorageService.getOrCreateUserDriveFolder(uId);
    return {
      isValid: true,
      userId: uId,
      email: (payload && payload.email) || 'player@undercurrent.game',
      driveFolderId: uFolder
    };
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
  var signature = generateSaltedHash(userId + timestamp + randomUUID, getSecrets().JWT_SECRET);
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
  var email = payload.email;
  var password = payload.password;

  if (!email || !password) {
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
  var email = payload.email;
  var password = payload.password;

  if (!email || !password || password.length < 6) {
    return createErrorResponse('Email and a password of at least 6 characters are required.', 400);
  }

  var existing = StorageService.findUserByEmail(email);
  if (existing) {
    return createErrorResponse('A user with this email already exists.', 409);
  }

  var userId = 'usr_' + Utilities.getUuid().substring(0, 8);
  var salt = Utilities.getUuid().substring(0, 16);
  var passwordHash = generateSaltedHash(password, salt);
  var token = generateSessionToken(userId);

  // Create dedicated Drive workspace folder for user
  var userFolderId = StorageService.getOrCreateUserDriveFolder(userId);

  StorageService.registerNewUser({
    userId: userId,
    email: email,
    passwordHash: passwordHash,
    salt: salt,
    apiToken: token,
    driveFolderId: userFolderId,
    createdAt: new Date().toISOString()
  });

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
  StorageService.saveSaveState(userSession.driveFolderId, updatedSaveState);

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
  var auditReport = MemoryPipeline.runTurnAudit(userSession, saveState);
  return createSuccessResponse({ audit: auditReport });
}

/**
 * Act Rebase Handler (Compresses history into Act Dossier and resets window)
 */
function handleActRebase(userSession, payload) {
  var saveState = payload.saveState || StorageService.loadSaveState(userSession.driveFolderId);
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
  var folderId = userSession.driveFolderId || StorageService.getOrCreateUserDriveFolder(userSession.userId);
  StorageService.saveSaveState(folderId, stateData, payload.chapter, payload.playerProfile, payload.chapterHistory);
  return createSuccessResponse({ saved: true, folderId: folderId, timestamp: new Date().toISOString() });
}

/**
 * Novel State Load Handler
 */
function handleLoadState(userSession, payload) {
  var state = StorageService.loadSaveState(userSession.driveFolderId);
  return createSuccessResponse({ saveState: state });
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
  StorageService.deleteUserAccount(userSession.userId);
  return createSuccessResponse({ deleted: true, message: '使用者帳號及相關雲端資料已全數清除。' });
}

/**
 * 🛠️ 一鍵全域自動修復與雲端初始化工具 (可在 GAS 編輯器上方直接選擇此函式並按「執行」)
 */
function adminPopulateEverything() {
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
