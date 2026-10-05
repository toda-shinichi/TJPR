-- 用量記錄：只有技術資料，沒有提示詞、人設或遊戲內容
CREATE TABLE IF NOT EXISTS usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,             -- 毫秒時間戳
  user_id TEXT NOT NULL,
  email TEXT,
  kind TEXT,                       -- chapter（正文回合）、aux（摘要、改寫等）、decide
  model TEXT,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  cost REAL DEFAULT 0,             -- 美元，OpenRouter 回報的實際費用
  status INTEGER,
  duration_ms INTEGER
);
CREATE INDEX IF NOT EXISTS idx_usage_user_ts ON usage(user_id, ts);
CREATE INDEX IF NOT EXISTS idx_usage_ts ON usage(ts);

CREATE TABLE IF NOT EXISTS players (
  user_id TEXT PRIMARY KEY,
  email TEXT,
  first_seen INTEGER,
  last_seen INTEGER
);
