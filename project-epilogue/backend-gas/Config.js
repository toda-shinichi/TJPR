/**
 * Project Epilogue - Backend Configuration
 * 專案設定檔：Config.js
 * 
 * 管理環境變數、客製 OpenAI 兼容 API、自訂模型組合、Google Drive 與 Google Sheets 整合參數。
 */

const CONFIG = {
  // 應用程式基本資訊
  APP_NAME: '《暗流》沉浸式互動文字RPG引擎',
  VERSION: '1.0.0',
  ENV: 'production',

  // API 伺服器設定 (OpenAI 兼容端點)
  API: {
    BASE_URL: 'https://api.banana2556.com/v1/chat/completions',
    API_KEY: 'sk-TcKczU9MQ5abSWYrF51eU85aQjZV6IzPqeypYYn9zVDoSram',
    RPM_LIMIT: 5,                   // 每分鐘最多 5 次請求 (Rate Limit: 5 RPM)
    MIN_REQUEST_INTERVAL_MS: 12500, // 兩次請求間隔至少 12.5 秒 (60s/5 + 0.5s 緩衝)
    TIMEOUT_MS: 55000,              // Apps Script UrlFetchApp 55 秒逾時保護
    MAX_RETRIES: 3,                 // 最大重試次數
    RETRY_DELAY_MS: 3000            // 重試基礎延遲
  },

  // 雙模型配置
  MODELS: {
        // 主要敘事模型 (Narrator: mistral-large-3 首選，gemini-3.6-flash 備援 1)
    NARRATOR: {
      PRIMARY: 'mistral-large-3',
      FALLBACK: 'gemini-3.6-flash',
      FALLBACK_2: 'cognitivecomputations/dolphin-mistral-24b-venice-edition',
      FALLBACK_3: 'gpt-5.6-luna',
      FALLBACK_4: 'aion-3.0',
      TEMPERATURE: 0.88,
      MAX_TOKENS: 3500,
      TOP_P: 0.95
    },
    // 快速稽核模型 (Fast Auditor: aion-3.0-mini 首選，mistral-nemo 備援)
    AUDITOR: {
      PRIMARY: 'aion-3.0-mini',
      FALLBACK_1: 'mistral-nemo',
      FALLBACK: 'mistral-nemo',
      TEMPERATURE: 0.2,
      MAX_TOKENS: 1500,
      TOP_P: 0.9
    }
  },

  // Google Drive 資料夾 ID 配置
  DRIVE: {
    RULES_FOLDER_ID: '1I-_R2LOJErsxuTk1ChHyffOPMpRPYiTo',       // 存放全域規則 global_rules.md
    CHARACTERS_FOLDER_ID: '1r9HQYfxeApbQLSxrTQuV6RAVTtURzTTH',  // 存放角色 Markdown 檔案
    SAVES_FOLDER_ID: '1RQEErlJE4f6eaTHlpB9OlGP5Vd0EvIKM'        // 存放使用者存檔資料夾及章節紀錄
  },

  // Google Sheets Master_Index 索引表設定
  SHEET: {
    SPREADSHEET_ID: '1lP2etciUuoE4JYfJcuDVZt9XcrdYm6409Wb9hH8DN1s',
    USERS_SHEET_NAME: 'Users',
    LORE_INDEX_SHEET_NAME: 'LoreIndex',
    AUDIT_LOG_SHEET_NAME: 'AuditLogs',
    COLUMNS: {
      USER_ID: 1,
      EMAIL: 2,
      PASSWORD_HASH: 3,
      SALT: 4,
      API_TOKEN: 5,
      DRIVE_FOLDER_ID: 6,
      CREATED_AT: 7,
      LAST_ACTIVE: 8
    }
  },

  // 記憶管線與遊戲迴圈閥值
  PIPELINE: {
    SUMMARY_UPDATE_CADENCE: 5,   // 每 5 回合觸發摘要池更新
    AUDIT_CADENCE: 10,           // 每 10 回合觸發邏輯一致性稽核
    SUMMARY_POOL_MAX_CHARS: 2000,// 滾動摘要池上限 2,000 字元
    ACT_DOSSIER_MAX_WORDS: 800,  // 幕篇重整（Act Rebase）壓縮至約 800 字
    RECENT_TURNS_CONTEXT_LIMIT: 4// 提示詞中保留的最新對話回合數
  },

  // 存檔與快取設定
  STORAGE: {
    SAVE_FILE_NAME: 'save_slot.json',
    NOVEL_FILE_NAME: 'Full_Novel.md',
    CACHE_EXPIRATION_SEC: 1800 // CacheService 快取 30 分鐘
  },

  // 權杖安全設定
  AUTH: {
    TOKEN_VALIDITY_DAYS: 30,
    SALT_BYTE_SIZE: 16
  }
};

/**
 * 取得環境變數或預設設定
 * 支援從 Apps Script 的「指令碼屬性 (Script Properties)」覆寫金鑰
 */
function getSecrets() {
  var props = PropertiesService.getScriptProperties();
  return {
    API_KEY: props.getProperty('API_KEY') || CONFIG.API.API_KEY,
    SPREADSHEET_ID: props.getProperty('SPREADSHEET_ID') || CONFIG.SHEET.SPREADSHEET_ID,
    JWT_SECRET: props.getProperty('JWT_SECRET') || 'epilogue_secret_sign_key_tw_2026',
    MASTER_ADMIN_KEY: props.getProperty('MASTER_ADMIN_KEY') || ''
  };
}
