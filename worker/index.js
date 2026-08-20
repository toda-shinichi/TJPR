/**
 * 《暗流》LLM 代理 Worker
 *
 * 職責：把前端的生成請求轉發到上游 OpenAI 相容端點，並在過程中隱藏 API 金鑰。
 * 部署目標：tjpr-llm-proxy.todashinchi.workers.dev
 *
 * 金鑰不在這個檔案裡，也絕不進版控。以下列方式設定：
 *   npx wrangler secret put API_KEY
 * 或 Cloudflare Dashboard → Workers & Pages → 該 Worker → Settings →
 * Variables and Secrets（務必選 Secret，不要選 Text）。
 */

const UPSTREAM = 'https://api.banana2556.com/v1/chat/completions';

/**
 * 允許的來源。前端部署到新網域時務必一起更新，否則會全面 403。
 * 注意 origin 不含路徑：GitHub Pages 的 project page 網址雖然是
 * https://toda-shinichi.github.io/TJPR/，但 origin 只有網域那一段。
 */
const ALLOWED_ORIGINS = [
  'https://toda-shinichi.github.io',  // 正式站（GitHub Pages）
  'http://localhost:8731',            // 本機開發（tools 的預覽 server）
  'http://127.0.0.1:8731'
];

/** 每個 IP 在時間窗內允許的請求數 */
const RATE_LIMIT = { windowSeconds: 60, maxRequests: 12 };

/** 允許前端指定的模型白名單。避免有人拿這個端點去跑任意昂貴模型。 */
const ALLOWED_MODELS = [
  'mistral-large-3',
  'gemini-3.6-flash',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition',
  'aion-3.0',
  'aion-3.0-mini',
  'mistral-nemo',
  'gpt-5.6-luna'
];

const MAX_TOKENS_CEILING = 4096;
const MAX_BODY_BYTES = 128 * 1024;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders(origin))
  });
}

/**
 * 來源檢查。curl 可以偽造 Origin，所以這【不是】真正的認證，
 * 只是把「路過看到 repo 就能直接用」的成本提高。
 * 真正的認證需要驗證 GAS session token（見 README 的後續規劃）。
 *
 * 沒有 Origin 標頭的一律拒絕：瀏覽器對跨來源 POST 必定送出 Origin，
 * 所以「缺 Origin」代表這不是從網頁來的請求（curl、腳本），正是要擋的情況。
 * 伺服器端或測試用途請帶 X-Undercurrent-Key 搭配 CLIENT_SHARED_KEY secret。
 */
function resolveOrigin(request, env) {
  const origin = request.headers.get('Origin');
  const sharedKey = request.headers.get('X-Undercurrent-Key');

  if (env.CLIENT_SHARED_KEY && sharedKey && sharedKey === env.CLIENT_SHARED_KEY) {
    return { ok: true, origin: origin || ALLOWED_ORIGINS[0], viaSharedKey: true };
  }
  if (!origin) {
    return { ok: false, origin: ALLOWED_ORIGINS[0], reason: 'missing-origin' };
  }
  return { ok: ALLOWED_ORIGINS.includes(origin), origin, reason: 'origin-not-allowed' };
}

/**
 * 以 KV 做的簡易 IP 速率限制。
 * 未綁定 RATE_LIMIT_KV 時自動略過（不因為缺少綁定就讓服務整個掛掉）。
 */
async function checkRateLimit(env, request) {
  if (!env.RATE_LIMIT_KV) return { allowed: true, skipped: true };
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const bucket = Math.floor(Date.now() / 1000 / RATE_LIMIT.windowSeconds);
  const key = `rl:${ip}:${bucket}`;
  try {
    const current = parseInt((await env.RATE_LIMIT_KV.get(key)) || '0', 10);
    if (current >= RATE_LIMIT.maxRequests) return { allowed: false, current };
    await env.RATE_LIMIT_KV.put(key, String(current + 1), {
      expirationTtl: RATE_LIMIT.windowSeconds * 2
    });
    return { allowed: true, current: current + 1 };
  } catch (err) {
    console.warn('速率限制檢查失敗，放行: ' + err.message);
    return { allowed: true, error: err.message };
  }
}

export default {
  async fetch(request, env) {
    const { ok: originOk, origin, reason } = resolveOrigin(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ error: { message: 'Method Not Allowed' } }, 405, origin);
    }
    if (!originOk) {
      return json({
        error: {
          message: reason === 'missing-origin'
            ? 'Missing Origin header. 此端點僅供已授權網域的瀏覽器呼叫。'
            : 'Origin not allowed.'
        }
      }, 403, origin);
    }
    if (!env.API_KEY) {
      // 設定錯誤要明確報出來，而不是把空金鑰送上游、換回一句看不懂的「无效的令牌」
      return json({ error: { message: 'Worker 未設定 API_KEY secret。' } }, 500, origin);
    }

    const rate = await checkRateLimit(env, request);
    if (!rate.allowed) {
      return new Response(
        JSON.stringify({ error: { message: '請求過於頻繁，請稍後再試。' } }),
        {
          status: 429,
          headers: Object.assign(
            { 'Content-Type': 'application/json', 'Retry-After': String(RATE_LIMIT.windowSeconds) },
            corsHeaders(origin)
          )
        }
      );
    }

    try {
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return json({ error: { message: 'Request body too large.' } }, 413, origin);
      }

      let body;
      try {
        body = JSON.parse(raw);
      } catch (parseErr) {
        return json({ error: { message: 'Invalid JSON body.' } }, 400, origin);
      }

      if (!body.model || !ALLOWED_MODELS.includes(body.model)) {
        return json(
          { error: { message: 'Model not allowed: ' + (body.model || '(empty)') } },
          400,
          origin
        );
      }
      if (!Array.isArray(body.messages) || body.messages.length === 0) {
        return json({ error: { message: 'messages must be a non-empty array.' } }, 400, origin);
      }

      // 夾制輸出上限，避免有人指定極大的 max_tokens 燒額度
      body.max_tokens = Math.min(Number(body.max_tokens) || MAX_TOKENS_CEILING, MAX_TOKENS_CEILING);
      body.stream = true;

      const upstream = await fetch(UPSTREAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.API_KEY}`
        },
        body: JSON.stringify(body)
      });

      // Content-Type 必須沿用上游的：先前無條件寫死 text/event-stream，
      // 上游回 JSON 錯誤（例如 401）時，前端的 SSE 解析器會拿到一段
      // 它看不懂的 JSON，錯誤原因也就跟著被吃掉。
      const upstreamType = upstream.headers.get('content-type')
        || (upstream.ok ? 'text/event-stream' : 'application/json');

      return new Response(upstream.body, {
        status: upstream.status,
        headers: Object.assign(
          { 'Content-Type': upstreamType, 'Cache-Control': 'no-store' },
          corsHeaders(origin)
        )
      });
    } catch (error) {
      return json({ error: { message: error.message } }, 500, origin);
    }
  }
};
