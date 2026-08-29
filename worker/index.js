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
  // 生成鏈實際使用的三個模型（主力 / 備援 / 保留）
  'aion-3.0',
  'qwen/qwen3-vl-235b-a22b-instruct',
  'mistral-large-3',
  // 稽核與摘要用的輕量模型
  'aion-3.0-mini',
  'mistral-nemo'
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
 * 設計取捨：等待中的請求【不預先佔用】時段，只回報還要等多久，由前端睡完再問。
 * 這樣不會因為玩家關掉分頁而留下無人認領的空檔（不需要逾期回收機制）。
 * 代價是多個等待者可能同時醒來搶同一格 —— DO 會序列化，只有一個拿到，
 * 其餘拿到新的短等待。三人規模下這個取捨是划算的。
 */
export class RpmQueue {
  constructor(state) {
    this.state = state;
    this.nextSlotTs = 0;
    // 從儲存還原，避免 DO 被回收後重置導致瞬間放行過多請求
    this.state.blockConcurrencyWhile(async () => {
      this.nextSlotTs = (await this.state.storage.get('nextSlotTs')) || 0;
    });
  }

  async fetch(request) {
    const url = new URL(request.url);
    const now = Date.now();
    const slot = Math.max(now, this.nextSlotTs);
    const waitMs = slot - now;

    // 只是詢問還要等多久，不佔用時段
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

    // 還沒輪到：回報等待時間，但不佔用時段
    if (waitMs > 0) {
      return Response.json({
        proceed: false,
        waitMs,
        etaSeconds: Math.ceil(waitMs / 1000),
        position: Math.ceil(waitMs / QUEUE_MIN_INTERVAL_MS)
      });
    }

    // 輪到了：佔用這一格並往後推
    this.nextSlotTs = slot + QUEUE_MIN_INTERVAL_MS;
    await this.state.storage.put('nextSlotTs', this.nextSlotTs);
    return Response.json({ proceed: true });
  }
}

/** 兩次上游請求的最小間隔。16 秒約 3.75 RPM，為 5 RPM 的滾動窗口保留緩衝。 */
const QUEUE_MIN_INTERVAL_MS = 16000;
/** 佇列超過這個長度就請玩家稍後再試，而不是無限等下去。 */
const QUEUE_MAX_WAIT_MS = 180000;

/**
 * 向排隊器要一個時段。
 * 未綁定 RPM_QUEUE 時直接放行（沿用舊行為），不因為缺少綁定就讓服務整個掛掉。
 */
async function acquireQueueSlot(env) {
  if (!env.RPM_QUEUE) return { proceed: true, skipped: true };
  try {
    const id = env.RPM_QUEUE.idFromName('global');
    const stub = env.RPM_QUEUE.get(id);
    const res = await stub.fetch('https://queue/acquire');
    return await res.json();
  } catch (err) {
    console.warn('排隊器異常，放行以免整體不可用: ' + err.message);
    return { proceed: true, error: err.message };
  }
}

export default {
  async fetch(request, env) {
    const { ok: originOk, origin, reason } = resolveOrigin(request, env);

    if (request.method === 'OPTIONS') {
      if (!originOk) {
        return json({ error: { message: 'Origin not allowed.' } }, 403, origin);
      }
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

    // 全域排隊：上游額度是所有玩家共用的，這是唯一的匯流點
    const slot = await acquireQueueSlot(env);
    if (slot.rejected) {
      return new Response(JSON.stringify({
        error: {
          message: `目前排隊人數過多（約需等待 ${slot.etaSeconds} 秒），請稍後再試。`,
          queueFull: true,
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

    try {
      const raw = await request.text();
      if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
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
      const requestedMaxTokens = Number(body.max_tokens);
      body.max_tokens = Number.isFinite(requestedMaxTokens)
        ? Math.max(1, Math.min(Math.floor(requestedMaxTokens), MAX_TOKENS_CEILING))
        : MAX_TOKENS_CEILING;
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
