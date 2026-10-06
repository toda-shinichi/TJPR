-- 提示詞快取命中的輸入 token 數（OpenRouter usage.prompt_tokens_details.cached_tokens）
ALTER TABLE usage ADD COLUMN cached_tokens INTEGER DEFAULT 0;
