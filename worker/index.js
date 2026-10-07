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

/**
 * 每個模型釘選的供應商順序（由便宜到貴，且皆為實測不自我審查者）。
 *
 * 為什麼要釘選：gemma 與 dolphin 是開放權重模型，由第三方各自部署，
 * 不同供應商會套不同的內容過濾器。若只寫 sort:'price'，某天最便宜的那家
 * 換成會審查的版本，玩家就會無預警地看到模型開始拒絕生成，而我們毫無所覺。
 * deepseek 與 minimax 是官方託管、行為一致，釘選的目的單純是鎖成本。
 *
 * allow_fallbacks: false —— 寧可這一次失敗、由模型鏈換下一顆，
 * 也不要靜默掉到未驗證的供應商上。
 */
const PINNED_PROVIDERS = {
  // 2026-10-03 實測（強制 JSON＋關思考）：parasail 平均 5–7 秒、111 字／秒、3/3 完整可用，
  // 比 streamlake／sail-research 快 2.5 倍以上；novita 次之但曾只寫 128 字。
  // 2026-10-06：移除 novita（0.41／1.23 美元，約 parasail 的 3 倍）；streamlake 最便宜（0.044／0.132），較慢但可用。
  'deepseek/deepseek-v4-flash-0731': ['parasail/fp8', 'streamlake/fp8'],
  // 實測 streamlake 2/2 完整可用、分數 100、11.6 秒
  'qwen/qwen3-30b-a3b-instruct-2507': ['streamlake', 'dekallm', 'siliconflow/fp8'],
  // 2026-10-03 實測：gmicloud 12.3s／分數 100／最便宜、parasail 11.1s 最快但篇幅偏短、
  // venice 13.7s、streamlake 15.5s。排除 deepinfra／novita／nebius（51–71 秒）與
  // alibaba（JSON 0/2 可用）。
  'qwen/qwen3-235b-a22b-2507': ['gmicloud/fp8', 'parasail/fp8', 'venice/fp8', 'streamlake'],
  // 2026-10-03 實測（不強制 JSON）：deepinfra 7.9s、tencent 10.5s、atlas-cloud 10.1s，
  // 三家露骨 3/3 全過。排除 novita／gmicloud／phala：一般提示詞正常，但要求露骨內容時
  // 回傳空白，判斷有內容過濾。
  'tencent/hy3': ['deepinfra/fp4', 'tencent/fp8', 'atlas-cloud/fp8']
};

/**
 * 需要關閉思考鏈的模型。
 * minimax-m3 開著思考時會先寫一段內部推理再決定要不要生成，
 * 實測那段推理正是它頻繁自我否決、最後拒絕的地方；關掉可提高成功率，
 * 同時省下可觀的 completion token（思考也是照字數計費的）。
 */
const REASONING_DISABLED_MODELS = new Set([
  'deepseek/deepseek-v4-flash-0731',
  'tencent/hy3'
  // qwen 的 -2507 instruct 版本不帶 reasoning 參數（思考版是獨立的 model ID），
  // 列進來只會送出一個供應商看不懂的欄位。
]);

/**
 * 不套用強制 JSON 的模型。
 * 實測（2026-10-03）hy3 開啟強制 JSON 時，tencent 與 gmicloud 輸出 {"prose\":"…，
 * 多一個反斜線讓整份 JSON 失效；novita／phala／atlas-cloud 不支援該參數而被
 * OpenRouter 直接排除，六家只剩 deepinfra 可用。關閉後五家都能寫出合法 JSON，
 * 前端的寬鬆解析可處理少數格式瑕疵。
 */
const JSON_MODE_DISABLED_MODELS = new Set(['tencent/hy3']);

function resolveReasoning(model, requestedReasoning, viaSharedKey) {
  if (viaSharedKey && requestedReasoning && typeof requestedReasoning === 'object') {
    return requestedReasoning;
  }
  return REASONING_DISABLED_MODELS.has(model) ? { enabled: false } : undefined;
}
/** 單次嵌入的最大筆數與每筆字元上限（避免一次請求塞爆邊緣運算配額）。 */
const EMBED_MAX_BATCH = 64;
const EMBED_MAX_CHARS = 3000;

/**
 * 糾察隊（Decisions API）。span-01-lite 是行為評分分類器：不生成文字，
 * 只回答「這段內容是否有某種問題」的機率。免費，但走的是獨立端點。
 */
const DECISIONS_UPSTREAM = 'https://openrouter.ai/api/alpha/decisions';
const DECISION_MODELS = ['respan/span-01-lite'];
const DECISION_MAX_QUESTIONS = 12;
const DECISION_MAX_STATE_CHARS = 24000;

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

/**
 * 每個 IP（約等於每位玩家）每分鐘允許的生成類請求數。
 * 一回約 2–6 次（正文生成、模型備援、逐回摘要、偶爾的選項修補與摘要池）；
 * 記憶檢索（/embed）與糾察隊（/decide）不經過這道限制。
 * 注意：同一個對外 IP 後的多位玩家（例如同一辦公室）會共用這個額度。
 */
const RATE_LIMIT = { windowSeconds: 60, maxRequests: 15 };

/** 允許前端指定的模型白名單。避免有人拿這個端點去跑任意昂貴模型。 */
const ALLOWED_MODELS = [
  // 一般敘事鏈：主力 → 備援
  'deepseek/deepseek-v4-flash-0731',
  'qwen/qwen3-235b-a22b-2507',
  // 露骨鏈：主力 → 備援
  'qwen/qwen3-30b-a3b-instruct-2507',
  'tencent/hy3'
];

// 已移除的模型與原因（保留紀錄以免日後重蹈）：
//   gemma-4-31b-it    2026-10-07 露骨對比輸給 hy3：宣告式寫法多、人設偏強迫、錯字，速度 16–95 秒
//   gemini-3.7-flash  60% 機率被靜默降級為 3.5 Flash-Lite，且會審查情慾內容
//   gemini-3.6-flash  上游已無可用通道（No available channel）
//   gemini-3.1-pro    會審查，且供應商間歇性回傳空回應（Google 擋 egress IP）
//   dolphin-venice    22k tokens 長上下文下語意崩壞、輸出簡繁混雜
//   minimax-m2.7      L3 明確前戲即拒絕
//   minimaxai/minimax-m3  供應商基礎設施故障（system disk overloaded）
//   glm-5.2-thinking  拒絕 R-18、輸出簡體、文字重複損毀
//   gpt-5.6-luna      未納入評測，暫不開放

/** 只允許帶測試金鑰的請求使用：用來評估角色演繹品質的評審模型。 */
// 2026-10-07 依作者要求清空：不再用付費模型當評審，測試一律小規模、自行評比。
const TEST_ONLY_MODELS = [];

const MAX_TOKENS_CEILING = 6144;
const MAX_BODY_BYTES = 128 * 1024;
const AUTH_CACHE_TTL_SECONDS = 300;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Undercurrent-Token, X-Undercurrent-Key, X-Queue-Ticket, X-Request-Kind',
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
/**
 * 決定這次請求要送哪些供應商。
 * 帶測試金鑰時允許用 body.provider 直接指定 —— 逐家探測審查行為要靠它。
 */
function resolveProviderRouting(model, requestedProvider, viaSharedKey) {
  if (viaSharedKey && requestedProvider && typeof requestedProvider === 'object') {
    return requestedProvider;
  }
  const pinned = PINNED_PROVIDERS[model];
  if (pinned && pinned.length) {
    return { order: pinned, allow_fallbacks: false };
  }
  // 尚未釘選的模型仍以價格排序，並允許輪替，避免單一供應商故障就整條鏈失敗。
  return { sort: 'price', allow_fallbacks: true };
}

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
      // 快取內容是 {userId,email}；舊版快取值為 '1'（沒有身分），視為未命中重新驗證
      const cached = await env.RATE_LIMIT_KV.get(cacheKey);
      if (cached && cached !== '1') {
        const who = JSON.parse(cached);
        return { ok: true, cached: true, userId: who.userId || '', email: who.email || '' };
      }
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
        await env.RATE_LIMIT_KV.put(cacheKey, JSON.stringify({
          userId: result.data.userId || '',
          email: result.data.email || ''
        }), { expirationTtl: AUTH_CACHE_TTL_SECONDS });
      } catch (err) {
        console.warn('認證快取寫入失敗: ' + err.message);
      }
    }
    return { ok: true, userId: result.data.userId || '', email: result.data.email || '' };
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

function validateAndNormalizeBody(raw, viaSharedKey = false) {
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
  // 評審用模型只開放給測試金鑰（品質評估用），玩家的請求一律不能使用
  const testOnlyAllowed = viaSharedKey && TEST_ONLY_MODELS.includes(input.model);
  if (!input.model || (!ALLOWED_MODELS.includes(input.model) && !testOnlyAllowed)) {
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
    },
    // 白名單之外但需要轉送的兩個欄位。它們不放進 body 是因為只有帶測試金鑰的
    // 請求才准許覆寫 —— 一般玩家不該能指定供應商或自行開關思考。
    requestedProvider: input.provider,
    requestedReasoning: input.reasoning,
    // 只接受 json_object：敘事回合要求合法 JSON，摘要池等純文字請求則不帶這個欄位。
    // 不做全域強制，否則會把摘要池的純文字輸出逼成 JSON 而整個壞掉。
    responseFormat: (input.response_format && input.response_format.type === 'json_object')
      ? { type: 'json_object' }
      : undefined
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
        ? Math.max(QUEUE_MIN_INTERVAL_MS, Math.min(requestedBackoff, 15000))
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
 * 速率上限高出兩個數量級，佇列的作用退化為「避免瞬間湧入」的節流閥。
 *
 * 2026-10-05 解除封測「最多 3 人同時在線」的設計：1.5 秒的間隔等於全站每分鐘
 * 40 次，人一多就排隊。改為 50 毫秒（基本上不限制同時人數），每位玩家的用量
 * 改由 RATE_LIMIT（每分鐘 15 次）控管。
 */
const QUEUE_MIN_INTERVAL_MS = 50;
/**
 * 上游回 429 時的全域退避。先前是 30 秒且會把所有等待者往後平移 ——
 * 某個供應商限流時，全站玩家會一起被拖慢，多次累積就超過上限而回「排隊已滿」。
 * 縮短為 5 秒；各模型另有多家釘選供應商與備援模型可接手。
 */
const QUEUE_UPSTREAM_BACKOFF_MS = 5000;
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

// =========================================================================
// 用量記錄與管理後台
// 只記技術資料（玩家、時間、模型、token 數、費用），不存提示詞、人設或遊戲內容。
// =========================================================================

const REQUEST_KINDS = new Set(['chapter', 'aux', 'decide']);
/** 兩次正文回合相隔超過這個時間，視為新的一段遊玩。 */
const SESSION_GAP_MS = 30 * 60 * 1000;
/** 每段遊玩最後一回的閱讀時間（最後一次請求之後仍在閱讀）。 */
const SESSION_TAIL_MS = 3 * 60 * 1000;
const ONLINE_WINDOW_MS = 5 * 60 * 1000;

function identityOf(auth) {
  if (auth.viaSharedKey) return { userId: 'test-shared-key', email: '（測試金鑰）' };
  return { userId: auth.userId || 'unknown', email: auth.email || '' };
}

async function recordUsage(env, entry) {
  if (!env.USAGE_DB) return;
  try {
    await env.USAGE_DB.batch([
      env.USAGE_DB.prepare(
        'INSERT INTO usage (ts, user_id, email, kind, model, prompt_tokens, completion_tokens, cost, status, duration_ms, cached_tokens) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)'
      ).bind(entry.ts, entry.userId, entry.email || null, entry.kind, entry.model || null,
        entry.promptTokens || 0, entry.completionTokens || 0, entry.cost || 0, entry.status || 0, entry.durationMs || 0,
        entry.cachedTokens || 0),
      env.USAGE_DB.prepare(
        'INSERT INTO players (user_id, email, first_seen, last_seen) VALUES (?1, ?2, ?3, ?3) ON CONFLICT(user_id) DO UPDATE SET last_seen = excluded.last_seen, email = COALESCE(excluded.email, players.email)'
      ).bind(entry.userId, entry.email || null, entry.ts)
    ]);
  } catch (err) {
    console.warn('用量記錄寫入失敗: ' + err.message);
  }
}

/**
 * 原樣轉送 SSE，同時撈出最後一個 usage 區塊。回傳 [轉送用的串流, 串流結束時取得 usage 的 Promise]。
 */
function tapStreamUsage(stream) {
  let resolveUsage;
  const usagePromise = new Promise(resolve => { resolveUsage = resolve; });
  if (!stream) { resolveUsage(null); return [stream, usagePromise]; }
  const decoder = new TextDecoder();
  let buffer = '';
  let usage = null;
  const scan = line => {
    if (!line.startsWith('data: ') || !line.includes('"usage"')) return;
    try {
      const payload = JSON.parse(line.slice(6));
      if (payload && payload.usage) usage = payload.usage;
    } catch (ignore) { /* 不完整片段 */ }
  };
  const tapped = stream.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk);
      buffer += decoder.decode(chunk, { stream: true });
      let index;
      while ((index = buffer.indexOf('\n')) >= 0) {
        scan(buffer.slice(0, index).trim());
        buffer = buffer.slice(index + 1);
      }
    },
    flush() {
      scan(buffer.trim());
      resolveUsage(usage);
    }
  }));
  return [tapped, usagePromise];
}

function splitSessions(timestamps) {
  const sessions = [];
  timestamps.forEach(ts => {
    const last = sessions[sessions.length - 1];
    if (last && ts - last.end <= SESSION_GAP_MS) {
      last.end = ts;
      last.turns += 1;
    } else {
      sessions.push({ start: ts, end: ts, turns: 1 });
    }
  });
  return sessions.map(s => ({ ...s, durationMs: s.end - s.start + SESSION_TAIL_MS }));
}

/**
 * OpenRouter 金鑰的額度狀態。/key 回報這把金鑰的上限與已用量；
 * /credits 回報帳戶總儲值與總用量（部分金鑰沒有權限讀，失敗就略過）。
 */
async function fetchOpenRouterBalance(env) {
  const headers = { 'Authorization': `Bearer ${env.API_KEY}` };
  const read = async url => {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) return { error: `HTTP ${res.status}` };
      const body = await res.json();
      return body && body.data ? body.data : { error: 'empty response' };
    } catch (err) {
      return { error: err.message };
    }
  };
  const [key, credits] = await Promise.all([
    read('https://openrouter.ai/api/v1/key'),
    read('https://openrouter.ai/api/v1/credits')
  ]);
  return {
    key: key.error ? { error: key.error } : {
      label: key.label || '',
      limit: key.limit,
      usage: key.usage,
      limitRemaining: key.limit_remaining,
      usageDaily: key.usage_daily,
      usageWeekly: key.usage_weekly,
      usageMonthly: key.usage_monthly
    },
    account: credits.error ? { error: credits.error } : {
      totalCredits: credits.total_credits,
      totalUsage: credits.total_usage
    }
  };
}

async function buildAdminStats(env) {
  const db = env.USAGE_DB;
  const now = Date.now();
  const [players, totals, chapters, models, hidden, openrouter] = await Promise.all([
    db.prepare('SELECT user_id, email, first_seen, last_seen FROM players').all(),
    db.prepare(`SELECT user_id, COUNT(*) AS requests,
        SUM(CASE WHEN kind = 'chapter' AND status BETWEEN 200 AND 299 THEN 1 ELSE 0 END) AS turns,
        SUM(prompt_tokens) AS prompt_tokens, SUM(completion_tokens) AS completion_tokens,
        SUM(cost) AS cost FROM usage GROUP BY user_id`).all(),
    db.prepare(`SELECT user_id, ts FROM usage WHERE kind = 'chapter' AND status BETWEEN 200 AND 299
        AND ts >= ?1 ORDER BY user_id, ts`).bind(now - 90 * 24 * 3600 * 1000).all(),
    db.prepare(`SELECT model, COUNT(*) AS requests, SUM(prompt_tokens + completion_tokens) AS tokens,
        SUM(cost) AS cost FROM usage GROUP BY model ORDER BY cost DESC`).all(),
    db.prepare('SELECT user_id FROM admin_hidden').all().catch(() => ({ results: [] })),
    fetchOpenRouterBalance(env)
  ]);
  const byUser = new Map();
  (players.results || []).forEach(p => byUser.set(p.user_id, {
    userId: p.user_id, email: p.email || '', firstSeen: p.first_seen, lastSeen: p.last_seen,
    online: now - p.last_seen <= ONLINE_WINDOW_MS,
    requests: 0, turns: 0, promptTokens: 0, completionTokens: 0, cost: 0, sessions: [], totalPlayMs: 0
  }));
  (totals.results || []).forEach(t => {
    const u = byUser.get(t.user_id);
    if (!u) return;
    Object.assign(u, {
      requests: t.requests || 0, turns: t.turns || 0,
      promptTokens: t.prompt_tokens || 0, completionTokens: t.completion_tokens || 0, cost: t.cost || 0
    });
  });
  const tsByUser = new Map();
  (chapters.results || []).forEach(r => {
    if (!tsByUser.has(r.user_id)) tsByUser.set(r.user_id, []);
    tsByUser.get(r.user_id).push(r.ts);
  });
  tsByUser.forEach((list, userId) => {
    const u = byUser.get(userId);
    if (!u) return;
    const sessions = splitSessions(list);
    u.totalPlayMs = sessions.reduce((sum, s) => sum + s.durationMs, 0);
    u.sessions = sessions.slice(-10).reverse();
  });
  const users = [...byUser.values()].sort((a, b) => b.lastSeen - a.lastSeen);
  return {
    generatedAt: now,
    onlineWindowMinutes: ONLINE_WINDOW_MS / 60000,
    sessionGapMinutes: SESSION_GAP_MS / 60000,
    users,
    models: models.results || [],
    hiddenIds: (hidden.results || []).map(r => r.user_id),
    openrouter
  };
}

async function handleAdmin(request, env, origin, viaSharedKey) {
  const auth = await authenticateRequest(request, env, viaSharedKey);
  if (!auth.ok || viaSharedKey) {
    return json({ error: { message: '請先登入管理員帳號。' } }, auth.serverError ? 503 : 401, origin);
  }
  const adminEmail = String(env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!adminEmail || String(auth.email || '').trim().toLowerCase() !== adminEmail) {
    return json({ error: { message: '這個帳號沒有管理權限。' } }, 403, origin);
  }
  if (!env.USAGE_DB) return json({ error: { message: '尚未設定用量資料庫。' } }, 500, origin);
  // 手動隱藏／取消隱藏帳號：只影響後台顯示，不刪除帳號或紀錄
  let body = {};
  try { body = await request.json(); } catch (ignore) { /* 空 body 視為單純查詢 */ }
  const ids = list => (Array.isArray(list) ? list : []).map(String).filter(id => id && id.length <= 200).slice(0, 200);
  const toHide = ids(body.hide);
  const toUnhide = ids(body.unhide);
  if (toHide.length || toUnhide.length) {
    const now = Date.now();
    await env.USAGE_DB.batch([
      ...toHide.map(id => env.USAGE_DB.prepare('INSERT OR REPLACE INTO admin_hidden (user_id, hidden_at) VALUES (?1, ?2)').bind(id, now)),
      ...toUnhide.map(id => env.USAGE_DB.prepare('DELETE FROM admin_hidden WHERE user_id = ?1').bind(id))
    ]);
  }
  try {
    return json({ success: true, data: await buildAdminStats(env) }, 200, origin);
  } catch (error) {
    return json({ error: { message: '統計查詢失敗：' + error.message } }, 500, origin);
  }
}

export default {
  async fetch(request, env, ctx) {
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
    if (new URL(request.url).pathname === '/admin/stats') {
      return handleAdmin(request, env, origin, viaSharedKey);
    }

    if (new URL(request.url).pathname === '/decide') {
      const auth = await authenticateRequest(request, env, viaSharedKey);
      if (!auth.ok) {
        return json({ error: { message: 'Valid login token required.' } },
          auth.serverError ? 500 : 401, origin);
      }
      let payload;
      try { payload = await request.json(); }
      catch (ignore) { return json({ error: { message: 'Invalid JSON body.' } }, 400, origin); }
      if (!DECISION_MODELS.includes(payload?.model)) {
        return json({ error: { message: 'Decision model not allowed.' } }, 400, origin);
      }
      const questions = payload?.questions;
      if (!questions || typeof questions !== 'object' || Array.isArray(questions)
        || Object.keys(questions).length < 1 || Object.keys(questions).length > DECISION_MAX_QUESTIONS) {
        return json({ error: { message: `questions 需為 1–${DECISION_MAX_QUESTIONS} 題的物件。` } }, 400, origin);
      }
      const stateText = typeof payload.state === 'string' ? payload.state : JSON.stringify(payload.state || '');
      if (!stateText || stateText.length > DECISION_MAX_STATE_CHARS) {
        return json({ error: { message: `state 需為 1–${DECISION_MAX_STATE_CHARS} 字。` } }, 400, origin);
      }
      // 只轉送已知欄位，不讓呼叫端夾帶其他參數到上游
      const upstreamBody = { model: payload.model, questions, state: payload.state };
      try {
        const up = await fetch(DECISIONS_UPSTREAM, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.API_KEY}`,
            'HTTP-Referer': 'https://toda-shinichi.github.io',
            'X-Title': 'Undercurrent'
          },
          body: JSON.stringify(upstreamBody)
        });
        const text = await up.text();
        let usage = null;
        try { usage = JSON.parse(text).usage || null; } catch (ignore) { /* 非 JSON 錯誤訊息 */ }
        const who = identityOf(auth);
        const logEntry = recordUsage(env, {
          ts: Date.now(), userId: who.userId, email: who.email, kind: 'decide', model: payload.model,
          promptTokens: usage ? usage.prompt_tokens || 0 : 0,
          completionTokens: usage ? usage.completion_tokens || 0 : 0,
          cost: usage ? Number(usage.cost) || 0 : 0,
          status: up.status, durationMs: 0
        });
        if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(logEntry);
        return new Response(text, {
          status: up.status,
          headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return json({ error: { message: '糾察隊請求失敗：' + (err?.message || String(err)) } }, 502, origin);
      }
    }

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
    const normalized = validateAndNormalizeBody(raw, viaSharedKey);
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

    const startedAt = Date.now();
    const requestKind = REQUEST_KINDS.has(request.headers.get('X-Request-Kind'))
      ? request.headers.get('X-Request-Kind') : 'aux';
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
          provider: resolveProviderRouting(body.model, normalized.requestedProvider, viaSharedKey),
          reasoning: resolveReasoning(body.model, normalized.requestedReasoning, viaSharedKey),
          // 部分模型的供應商在強制 JSON 下會輸出壞掉的 JSON（見 JSON_MODE_DISABLED_MODELS），對它們略過
          response_format: JSON_MODE_DISABLED_MODELS.has(body.model) ? undefined : normalized.responseFormat,
          // 讓串流最後一個區塊帶回 token 數與實際費用，供用量記錄使用
          usage: { include: true }
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

      const [forwardBody, usagePromise] = upstream.ok ? tapStreamUsage(upstream.body) : [upstream.body, Promise.resolve(null)];
      const who = identityOf(auth);
      const logEntry = usagePromise.then(usage => recordUsage(env, {
        ts: startedAt,
        userId: who.userId,
        email: who.email,
        kind: requestKind,
        model: body.model,
        promptTokens: usage ? usage.prompt_tokens : 0,
        completionTokens: usage ? usage.completion_tokens : 0,
        cost: usage ? Number(usage.cost) || 0 : 0,
        cachedTokens: usage && usage.prompt_tokens_details ? usage.prompt_tokens_details.cached_tokens || 0 : 0,
        status: upstream.status,
        durationMs: Date.now() - startedAt
      }));
      if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(logEntry);

      return new Response(forwardBody, {
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
