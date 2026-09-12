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

const UPSTREAM = 'https://openrouter.ai/api/v1/chat/completions';

/** 檢索用嵌入模型。多語言、對中文檢索有效，1024 維。 */
const EMBEDDING_MODEL = '@cf/baai/bge-m3';
/** 單次嵌入的最大筆數與每筆字元上限（避免一次請求塞爆邊緣運算配額）。 */
const EMBED_MAX_BATCH = 64;
const EMBED_MAX_CHARS = 3000;

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
  // 一般敘事鏈：主力 → 備援
  'deepseek/deepseek-v4-flash-0731',
  'google/gemma-4-26b-a4b-it',
  // 情慾章節鏈：主力 → 備援（皆不自我審查）
  'minimax/minimax-m3',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition'
];

// 已移除的模型與原因（保留紀錄以免日後重蹈）：
//   gemini-3.7-flash  60% 機率被靜默降級為 3.5 Flash-Lite，且會審查情慾內容
//   gemini-3.6-flash  上游已無可用通道（No available channel）
//   gemini-3.1-pro    會審查，且供應商間歇性回傳空回應（Google 擋 egress IP）
//   dolphin-venice    22k tokens 長上下文下語意崩壞、輸出簡繁混雜
//   minimax-m2.7      L3 明確前戲即拒絕
//   minimaxai/minimax-m3  供應商基礎設施故障（system disk overloaded）
//   glm-5.2-thinking  拒絕 R-18、輸出簡體、文字重複損毀
//   gpt-5.6-luna      未納入評測，暫不開放

const MAX_TOKENS_CEILING = 6144;
const MAX_BODY_BYTES = 128 * 1024;
const AUTH_CACHE_TTL_SECONDS = 300;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Undercurrent-Token, X-Undercurrent-Key, X-Queue-Ticket',
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
 * 來源檢查只是第一層瀏覽器邊界；真正授權會在後續驗證 GAS session token。
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

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * 瀏覽器不能只靠 Origin 當認證。登入權杖由 GAS 驗證，成功結果短暫快取於 KV；
 * 使用共享密鑰的伺服器請求則由 resolveOrigin() 直接授權。
 */
async function authenticateRequest(request, env, viaSharedKey) {
  if (viaSharedKey) return { ok: true, viaSharedKey: true };
  const token = request.headers.get('X-Undercurrent-Token') || '';
  // GAS 的 Utilities.base64EncodeWebSafe() 會保留最多兩個結尾 padding「=」。
  // padding 只能出現在字串尾端，避免放寬成可在任意位置出現的字元。
  if (!/^epi_[A-Za-z0-9_-]{20,2048}={0,2}$/.test(token)) {
    return { ok: false, reason: 'missing-or-invalid-token' };
  }
  if (!env.AUTH_VERIFY_URL) {
    return { ok: false, reason: 'auth-not-configured', serverError: true };
  }

  const cacheKey = 'auth:' + await sha256Hex(token);
  if (env.RATE_LIMIT_KV) {
    try {
      if (await env.RATE_LIMIT_KV.get(cacheKey)) return { ok: true, cached: true };
    } catch (err) {
      console.warn('認證快取讀取失敗: ' + err.message);
    }
  }

  try {
    const response = await fetch(env.AUTH_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'auth/verify', token })
    });
    const result = await response.json();
    if (!result || result.success !== true || !result.data || result.data.valid !== true) {
      return { ok: false, reason: 'invalid-token' };
    }
    if (env.RATE_LIMIT_KV) {
      try {
        await env.RATE_LIMIT_KV.put(cacheKey, '1', { expirationTtl: AUTH_CACHE_TTL_SECONDS });
      } catch (err) {
        console.warn('認證快取寫入失敗: ' + err.message);
      }
    }
    return { ok: true, userId: result.data.userId || '' };
  } catch (err) {
    console.warn('登入權杖驗證失敗: ' + err.message);
    return { ok: false, reason: 'auth-service-unavailable', serverError: true };
  }
}

// Bound bytes while reading, including chunked requests without Content-Length.
async function readBoundedBody(request) {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        const error = new Error('Request body too large.');
        error.status = 413;
        throw error;
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

function validateAndNormalizeBody(raw) {
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return { error: 'Request body too large.', status: 413 };
  }
  let input;
  try {
    input = JSON.parse(raw);
  } catch (error) {
    return { error: 'Invalid JSON body.', status: 400 };
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'JSON body must be an object.', status: 400 };
  }
  if (!input.model || !ALLOWED_MODELS.includes(input.model)) {
    return { error: 'Model not allowed: ' + (input.model || '(empty)'), status: 400 };
  }
  if (!Array.isArray(input.messages) || input.messages.length < 1 || input.messages.length > 32) {
    return { error: 'messages must contain 1 to 32 entries.', status: 400 };
  }
  const allowedRoles = new Set(['system', 'user', 'assistant']);
  if (input.messages.some(message => !message || !allowedRoles.has(message.role)
    || typeof message.content !== 'string' || message.content.length > 100000)) {
    return { error: 'Each message must have an allowed role and string content.', status: 400 };
  }

  const requestedMaxTokens = Number(input.max_tokens);
  const temperature = Number(input.temperature);
  const topP = Number(input.top_p);
  return {
    body: {
      model: input.model,
      messages: input.messages.map(message => ({ role: message.role, content: message.content })),
      temperature: Number.isFinite(temperature) ? Math.max(0, Math.min(2, temperature)) : 0.88,
      top_p: Number.isFinite(topP) ? Math.max(0, Math.min(1, topP)) : 0.95,
      max_tokens: Number.isFinite(requestedMaxTokens)
        ? Math.max(1, Math.min(Math.floor(requestedMaxTokens), MAX_TOKENS_CEILING))
        : MAX_TOKENS_CEILING,
      stream: true
    }
  };
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


/**
 * 全域請求排隊（Durable Object）。
 *
 * 為什麼需要：上游限制是【每分鐘 5 次、跨模型且跨使用者共用】。
 * 前端的 waitForRpmCooldown() 只管自己那個瀏覽器，Worker 的 KV 限速是每 IP 的
 * —— 兩者都擋不住「三個玩家同時按下選項」的情況，封閉測試時必然一起吃 429。
 * Worker 是所有玩家的唯一匯流點，排隊必須放在這裡。
 *
 * 為什麼用 Durable Object 而非 KV：KV 是最終一致性，兩個並發請求可能讀到
 * 同一個「下一個空檔」並都認為輪到自己。DO 單執行緒、天然序列化，是唯一
 * 能正確發號的選擇。
 *
 * 等待者取得一次性預約票券，輪詢不會重新排到隊尾；過期預約會自動回收。
 */
export class RpmQueue {
  constructor(state) {
    this.state = state;
    this.nextSlotTs = 0;
    this.lastGrantTs = 0;
    this.reservations = [];
    // 從儲存還原，避免 DO 被回收後重置導致瞬間放行過多請求
    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get(['nextSlotTs', 'lastGrantTs', 'reservations']);
      this.nextSlotTs = stored.get('nextSlotTs') || 0;
      this.lastGrantTs = stored.get('lastGrantTs') || 0;
      this.reservations = stored.get('reservations') || [];
    });
  }

  async fetch(request) {
    const url = new URL(request.url);
    const now = Date.now();
    this.reservations = this.reservations.filter(item => item.readyAt > now - 60000);

    // 上游即使經本站排隊，仍可能因同一金鑰的其他流量回 429。
    // 把剛失敗的玩家放到退避後第一格，並將既有等待者依序往後平移；
    // 這樣不會讓所有票券在退避結束的同一秒一起衝向上游。
    if (url.pathname === '/defer') {
      const requestedBackoff = Number(request.headers.get('X-Backoff-Ms'));
      const backoffMs = Number.isFinite(requestedBackoff)
        ? Math.max(QUEUE_MIN_INTERVAL_MS, Math.min(requestedBackoff, 120000))
        : QUEUE_UPSTREAM_BACKOFF_MS;
      const ticket = crypto.randomUUID();
      let cursor = now + backoffMs;
      const rescheduled = [{ ticket, readyAt: cursor }];
      cursor += QUEUE_MIN_INTERVAL_MS;
      for (const item of this.reservations.slice().sort((a, b) => a.readyAt - b.readyAt)) {
        const readyAt = Math.max(cursor, item.readyAt);
        rescheduled.push({ ticket: item.ticket, readyAt });
        cursor = readyAt + QUEUE_MIN_INTERVAL_MS;
      }
      this.reservations = rescheduled;
      this.nextSlotTs = Math.max(this.nextSlotTs, cursor);
      await this.state.storage.put({ nextSlotTs: this.nextSlotTs, reservations: this.reservations });
      return Response.json({
        proceed: false,
        ticket,
        waitMs: backoffMs,
        etaSeconds: Math.ceil(backoffMs / 1000),
        position: 1,
        upstreamBackoff: true
      });
    }

    const presentedTicket = request.headers.get('X-Queue-Ticket');
    if (presentedTicket) {
      const reservation = this.reservations.find(item => item.ticket === presentedTicket);
      if (!reservation) return Response.json({ rejected: true, invalidTicket: true, waitMs: 0 });
      const waitMs = Math.max(0, reservation.readyAt - now);
      if (waitMs > 0) {
        return Response.json({ proceed: false, ticket: presentedTicket, waitMs,
          etaSeconds: Math.ceil(waitMs / 1000), position: Math.max(1, Math.ceil(waitMs / QUEUE_MIN_INTERVAL_MS)) });
      }
      // A browser may wake long after its reserved slot. Several expired slots can
      // therefore arrive together; gate the actual grants as well as reservations.
      const grantWaitMs = Math.max(0, this.lastGrantTs + QUEUE_MIN_INTERVAL_MS - now);
      if (grantWaitMs > 0) {
        return Response.json({ proceed: false, ticket: presentedTicket, waitMs: grantWaitMs,
          etaSeconds: Math.ceil(grantWaitMs / 1000), position: 1 });
      }
      this.reservations = this.reservations.filter(item => item.ticket !== presentedTicket);
      this.lastGrantTs = now;
      await this.state.storage.put({ lastGrantTs: this.lastGrantTs, reservations: this.reservations });
      return Response.json({ proceed: true });
    }

    const slot = Math.max(now, this.nextSlotTs);
    const waitMs = slot - now;

    // 管理與診斷用途：只詢問還要等多久，不佔用時段
    if (url.pathname === '/peek') {
      return Response.json({
        waitMs,
        etaSeconds: Math.ceil(waitMs / 1000),
        position: Math.ceil(waitMs / QUEUE_MIN_INTERVAL_MS)
      });
    }

    // 佇列太長：直接請玩家稍後再試，不要無限排隊
    if (waitMs > QUEUE_MAX_WAIT_MS) {
      return Response.json({ rejected: true, waitMs, etaSeconds: Math.ceil(waitMs / 1000) });
    }

    // 還沒輪到：預約時段並回傳一次性票號，避免所有等待者同時醒來搶同一格。
    if (waitMs > 0) {
      const ticket = crypto.randomUUID();
      this.reservations.push({ ticket, readyAt: slot });
      this.nextSlotTs = slot + QUEUE_MIN_INTERVAL_MS;
      await this.state.storage.put({ nextSlotTs: this.nextSlotTs, reservations: this.reservations });
      return Response.json({
        proceed: false,
        ticket,
        waitMs,
        etaSeconds: Math.ceil(waitMs / 1000),
        position: Math.ceil(waitMs / QUEUE_MIN_INTERVAL_MS)
      });
    }

    // 輪到了：佔用這一格並往後推
    this.nextSlotTs = slot + QUEUE_MIN_INTERVAL_MS;
    this.lastGrantTs = now;
    await this.state.storage.put({ nextSlotTs: this.nextSlotTs, lastGrantTs: this.lastGrantTs });
    return Response.json({ proceed: true });
  }
}

/**
 * 兩次上游請求的最小間隔。
 * 舊上游是全域共用 5 RPM，所以必須拉到 16 秒；OpenRouter 改為依額度計費、
 * 速率上限高出兩個數量級，佇列的作用退化為「避免瞬間湧入」的節流閥，
 * 因此縮到 1.5 秒 —— 再高只是白白讓玩家空等。
 */
const QUEUE_MIN_INTERVAL_MS = 1500;
/** 上游仍回 429 時的預設全域退避，退避完成後仍維持每格 16 秒。 */
const QUEUE_UPSTREAM_BACKOFF_MS = 30000;
/** 佇列超過這個長度就請玩家稍後再試，而不是無限等下去。 */
const QUEUE_MAX_WAIT_MS = 180000;

/**
 * 向排隊器要一個時段。
 * 未綁定 RPM_QUEUE 時採 fail-closed，避免部署設定遺漏後突破共用 RPM。
 */
async function acquireQueueSlot(env, ticket) {
  if (!env.RPM_QUEUE) return { proceed: false, unavailable: true };
  try {
    const id = env.RPM_QUEUE.idFromName('global');
    const stub = env.RPM_QUEUE.get(id);
    const headers = ticket
      ? { 'X-Queue-Ticket': ticket }
      : undefined;
    const res = await stub.fetch('https://queue/acquire', headers ? { headers } : undefined);
    return await res.json();
  } catch (err) {
    console.warn('排隊器異常，為保護上游 RPM 暫停放行: ' + err.message);
    return { proceed: false, unavailable: true, error: err.message };
  }
}

/** 上游回 429 時重新保留順位，並讓排隊器把所有既有票券安全往後平移。 */
async function deferQueueSlot(env, retryMs) {
  if (!env.RPM_QUEUE) return { unavailable: true };
  try {
    const id = env.RPM_QUEUE.idFromName('global');
    const stub = env.RPM_QUEUE.get(id);
    const res = await stub.fetch('https://queue/defer', {
      headers: { 'X-Backoff-Ms': String(retryMs || QUEUE_UPSTREAM_BACKOFF_MS) }
    });
    return await res.json();
  } catch (err) {
    console.warn('上游退避排程失敗: ' + err.message);
    return { unavailable: true, error: err.message };
  }
}

export default {
  async fetch(request, env) {
    const { ok: originOk, origin, reason, viaSharedKey } = resolveOrigin(request, env);

    if (request.method === 'OPTIONS') {
      if (!originOk) {
        return json({ error: { message: 'Origin not allowed.' } }, 403, origin);
      }
      return new Response(null, { headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ error: { message: 'Method Not Allowed' } }, 405, origin);
    }

    // 檢索用嵌入。與生成走同一組驗證，但不佔用生成佇列 ——
    // 嵌入跑在 Cloudflare 邊緣、不碰 OpenRouter 額度，排隊只會拖慢檢索。
    if (new URL(request.url).pathname === '/embed') {
      const auth = await authenticateRequest(request, env, viaSharedKey);
      if (!auth.ok) {
        return json({ error: { message: 'Valid login token required.' } },
          auth.serverError ? 500 : 401, origin);
      }
      if (!env.AI) {
        return json({ error: { message: 'Worker 未綁定 Workers AI。' } }, 500, origin);
      }
      let payload;
      try { payload = await request.json(); }
      catch (ignore) { return json({ error: { message: 'Invalid JSON body.' } }, 400, origin); }

      const texts = Array.isArray(payload?.text) ? payload.text
        : (typeof payload?.text === 'string' ? [payload.text] : null);
      if (!texts || !texts.length) {
        return json({ error: { message: '缺少 text（字串或字串陣列）。' } }, 400, origin);
      }
      if (texts.length > EMBED_MAX_BATCH) {
        return json({ error: { message: `一次最多 ${EMBED_MAX_BATCH} 筆。` } }, 400, origin);
      }
      // 超長輸入會被模型截斷；先自行裁切，讓「餵進去的」與「算出來的」一致。
      const clipped = texts.map(t => String(t == null ? '' : t).slice(0, EMBED_MAX_CHARS));

      try {
        const out = await env.AI.run(EMBEDDING_MODEL, { text: clipped });
        return json({ model: EMBEDDING_MODEL, data: out?.data || [] }, 200, origin);
      } catch (err) {
        return json({ error: { message: '嵌入失敗：' + (err?.message || String(err)) } }, 502, origin);
      }
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

    const contentLength = Number(request.headers.get('Content-Length'));
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return json({ error: { message: 'Request body too large.' } }, 413, origin);
    }

    let raw;
    try {
      raw = await readBoundedBody(request);
    } catch (error) {
      return json({ error: { message: error.status === 413 ? error.message : 'Unable to read request body.' } }, error.status || 400, origin);
    }
    const normalized = validateAndNormalizeBody(raw);
    if (normalized.error) return json({ error: { message: normalized.error } }, normalized.status, origin);
    const body = normalized.body;

    const auth = await authenticateRequest(request, env, viaSharedKey);
    if (!auth.ok) {
      return json({ error: { message: auth.serverError
        ? 'Authentication service is unavailable.'
        : 'Valid login token required.' } }, auth.serverError ? 503 : 401, origin);
    }

    // 全域排隊：上游額度是所有玩家共用的，這是唯一的匯流點
    const slot = await acquireQueueSlot(env, request.headers.get('X-Queue-Ticket'));
    if (slot.unavailable) {
      return new Response(JSON.stringify({
        error: { message: '排隊服務暫時無法使用，請稍後重試。', queueUnavailable: true }
      }), {
        status: 503,
        headers: Object.assign({ 'Content-Type': 'application/json', 'Retry-After': '16' }, corsHeaders(origin))
      });
    }
    if (slot.rejected) {
      return new Response(JSON.stringify({
        error: {
          message: `目前排隊人數過多（約需等待 ${slot.etaSeconds} 秒），請稍後再試。`,
          queueFull: true,
          invalidTicket: !!slot.invalidTicket,
          etaSeconds: slot.etaSeconds
        }
      }), {
        status: 429,
        headers: Object.assign(
          { 'Content-Type': 'application/json', 'Retry-After': String(Math.ceil(slot.waitMs / 1000)) },
          corsHeaders(origin)
        )
      });
    }
    if (!slot.proceed) {
      // 還沒輪到：回報等待時間，由前端睡完再重試。
      // 刻意不長時間佔住連線 —— 那樣得先以 200 開頭回應，
      // 上游後續的錯誤狀態碼就再也傳不回前端，
      // 現有的「模型不可用／限流」判別會全部失效。
      return new Response(JSON.stringify({
        queued: true,
        ticket: slot.ticket,
        waitMs: slot.waitMs,
        etaSeconds: slot.etaSeconds,
        position: slot.position
      }), {
        status: 429,
        headers: Object.assign(
          { 'Content-Type': 'application/json', 'Retry-After': String(Math.max(1, Math.ceil(slot.waitMs / 1000))) },
          corsHeaders(origin)
        )
      });
    }


    // 只有真正取得上游時段的合法請求才計入 IP 限速；排隊輪詢不消耗額度。
    const rate = await checkRateLimit(env, request);
    if (!rate.allowed) {
      return new Response(JSON.stringify({ error: { message: '請求過於頻繁，請稍後再試。' } }), {
        status: 429,
        headers: Object.assign(
          { 'Content-Type': 'application/json', 'Retry-After': String(RATE_LIMIT.windowSeconds) },
          corsHeaders(origin)
        )
      });
    }

    try {
      const upstream = await fetch(UPSTREAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.API_KEY}`,
          // OpenRouter 用這兩個標頭在排行榜標示來源應用；缺了不會失敗，但會被歸為匿名流量。
          'HTTP-Referer': 'https://toda-shinichi.github.io',
          'X-Title': 'Undercurrent'
        },
        body: JSON.stringify({
          ...body,
          // 同一個模型在 OpenRouter 上常有多家供應商。以價格排序並允許自動輪替，
          // 前一家失敗或限流時由下一家接手，不必在前端多花一次模型嘗試次數。
          provider: { sort: 'price', allow_fallbacks: true }
        })
      });

      if (upstream.status === 429) {
        const retryHeader = Number(upstream.headers.get('Retry-After'));
        const retryMs = Number.isFinite(retryHeader) && retryHeader > 0
          ? retryHeader * 1000
          : QUEUE_UPSTREAM_BACKOFF_MS;
        try { if (upstream.body) await upstream.body.cancel(); } catch (ignore) {}
        const deferred = await deferQueueSlot(env, retryMs);
        if (deferred.unavailable) {
          return json({ error: { message: '上游忙碌，且暫時無法重新保留順位。', queueUnavailable: true } }, 503, origin);
        }
        return new Response(JSON.stringify({
          queued: true,
          ticket: deferred.ticket,
          waitMs: deferred.waitMs,
          etaSeconds: deferred.etaSeconds,
          position: deferred.position,
          upstreamBackoff: true
        }), {
          status: 429,
          headers: Object.assign(
            { 'Content-Type': 'application/json', 'Retry-After': String(Math.ceil(deferred.waitMs / 1000)) },
            corsHeaders(origin)
          )
        });
      }

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
