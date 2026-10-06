-- 管理後台手動隱藏的帳號（只影響後台顯示，不刪除任何帳號或紀錄）
CREATE TABLE IF NOT EXISTS admin_hidden (
  user_id TEXT PRIMARY KEY,
  hidden_at INTEGER NOT NULL
);
