-- 正文字數（只計 chapter 請求的 prose；其他請求為 0）
ALTER TABLE usage ADD COLUMN output_chars INTEGER DEFAULT 0;
