const assert = require('node:assert');
const fs = require('node:fs');

const LIVE_URL = 'https://tjpr-llm-proxy.todashinchi.workers.dev/';
const ALLOWED_ORIGIN = 'http://localhost:8731';
const nativeFetch = globalThis.fetch;
const AUTH_VERIFY_URL = 'https://auth.test/exec';
// 正式 GAS 的 web-safe Base64 token 會保留結尾 padding；以真實格式做回歸測試。
const VALID_TOKEN = 'epi_' + 'a'.repeat(40) + '==';
const LIVE_TOKEN = process.env.TJPR_LIVE_TOKEN || '';

async function loadWorker() {
  const source = fs.readFileSync('worker/index.js', 'utf8');
  const dataUrl = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
  return await import(dataUrl);
}

function post(body, headers = {}) {
  return new Request('https://worker.test/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ALLOWED_ORIGIN,
      'X-Undercurrent-Token': VALID_TOKEN, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

const validPayload = {
  model: 'aion-3.0',
  messages: [{ role: 'user', content: 'test' }],
  max_tokens: 100,
  stream: false
};

async function runOfflineTests() {
  const workerModule = await loadWorker();
  const worker = workerModule.default;
  const passQueue = {
    idFromName() { return 'global'; },
    get() { return { async fetch() { return Response.json({ proceed: true }); } }; }
  };
  const baseEnv = { API_KEY: 'unit-test-key', AUTH_VERIFY_URL, RPM_QUEUE: passQueue };
  const withAuth = upstreamHandler => async (url, options) => {
    if (String(url) === AUTH_VERIFY_URL) {
      return Response.json({ success: true, data: { valid: true, userId: 'u1' } });
    }
    return upstreamHandler(url, options);
  };

  let res = await worker.fetch(new Request('https://worker.test/', { method: 'GET', headers: { Origin: ALLOWED_ORIGIN } }), baseEnv);
  assert.strictEqual(res.status, 405, '非 POST/OPTIONS 未被拒絕');

  res = await worker.fetch(new Request('https://worker.test/', { method: 'OPTIONS', headers: { Origin: ALLOWED_ORIGIN } }), baseEnv);
  assert.strictEqual(res.status, 200, '合法來源預檢失敗');
  assert.strictEqual(res.headers.get('access-control-allow-origin'), ALLOWED_ORIGIN);

  res = await worker.fetch(new Request('https://worker.test/', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } }), baseEnv);
  assert.strictEqual(res.status, 403, '非法來源預檢未被拒絕');

  res = await worker.fetch(new Request('https://worker.test/', { method: 'POST', body: '{}' }), baseEnv);
  assert.strictEqual(res.status, 403, '缺少 Origin 的請求未被拒絕');

  res = await worker.fetch(post(validPayload, { Origin: 'https://evil.example' }), baseEnv);
  assert.strictEqual(res.status, 403, '非法 Origin 未被拒絕');

  res = await worker.fetch(post(validPayload), {});
  assert.strictEqual(res.status, 500, '缺少 API_KEY 未明確失敗');

  res = await worker.fetch(post('{broken'), baseEnv);
  assert.strictEqual(res.status, 400, '無效 JSON 未被拒絕');

  res = await worker.fetch(post({ ...validPayload, model: 'not-allowed' }), baseEnv);
  assert.strictEqual(res.status, 400, '非白名單模型未被拒絕');

  res = await worker.fetch(post({ ...validPayload, messages: [] }), baseEnv);
  assert.strictEqual(res.status, 400, '空 messages 未被拒絕');

  res = await worker.fetch(post(validPayload, { 'X-Undercurrent-Token': '' }), baseEnv);
  assert.strictEqual(res.status, 401, '缺少登入權杖的合法來源請求未被拒絕');

  globalThis.fetch = withAuth(async () => new Response('data: [DONE]\n\n', { status: 200 }));
  res = await worker.fetch(post(validPayload), { API_KEY: 'unit-test-key', AUTH_VERIFY_URL });
  assert.strictEqual(res.status, 503, '排隊器未綁定時仍放行，可能突破共用 RPM');

  res = await worker.fetch(post({ ...validPayload, messages: [{ role: 'user', content: '界'.repeat(44000) }] }), baseEnv);
  assert.strictEqual(res.status, 413, '多位元組超大請求未依實際 bytes 拒絕');

  let cancelled = false;
  let chunksRead = 0;
  const oversizedStream = new ReadableStream({
    pull(controller) { chunksRead++; controller.enqueue(new Uint8Array(65536)); },
    cancel() { cancelled = true; }
  });
  res = await worker.fetch(new Request('https://worker.test/', {
    method: 'POST', duplex: 'half',
    headers: {Origin: ALLOWED_ORIGIN, 'X-Undercurrent-Token': VALID_TOKEN},
    body: oversizedStream
  }), baseEnv);
  assert.equal(res.status, 413, 'chunked body must stop at the byte limit');
  assert.ok(cancelled && chunksRead <= 4, 'oversized stream must be cancelled without buffering all content');

  let forwardedBody = null;
  globalThis.fetch = withAuth(async (_url, options) => {
    forwardedBody = JSON.parse(options.body);
    return new Response('data: {"ok":true}\n\n', { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  });

  res = await worker.fetch(post({ ...validPayload, max_tokens: -99, stream: false,
    temperature: 99, top_p: -1, arbitraryBillingField: 'must-not-forward' }), baseEnv);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(forwardedBody.max_tokens, 1, '負數 max_tokens 未夾制到下限');
  assert.strictEqual(forwardedBody.stream, true, 'Worker 未強制串流');
  assert.strictEqual(forwardedBody.temperature, 2, 'temperature 未夾制到上限');
  assert.strictEqual(forwardedBody.top_p, 0, 'top_p 未夾制到下限');
  assert.strictEqual(forwardedBody.arbitraryBillingField, undefined, '未核准欄位仍被轉送上游');

  res = await worker.fetch(post({ ...validPayload, max_tokens: 999999 }), baseEnv);
  assert.strictEqual(forwardedBody.max_tokens, 6144, 'max_tokens 未夾制到上限');

  globalThis.fetch = withAuth(async () => new Response('{"error":"upstream"}', { status: 401, headers: { 'Content-Type': 'application/json' } }));
  res = await worker.fetch(post(validPayload), baseEnv);
  assert.strictEqual(res.status, 401, '上游錯誤狀態未保留');
  assert.match(res.headers.get('content-type') || '', /application\/json/, '上游 JSON 錯誤類型未保留');

  let sawDefer = false;
  const backoffQueue = {
    idFromName() { return 'global'; },
    get() { return { async fetch(url) {
      if (String(url).endsWith('/defer')) {
        sawDefer = true;
        return Response.json({ proceed: false, ticket: 'retry-ticket', waitMs: 30000,
          etaSeconds: 30, position: 1, upstreamBackoff: true });
      }
      return Response.json({ proceed: true });
    } }; }
  };
  globalThis.fetch = withAuth(async () => new Response('{"error":"busy"}', {
    status: 429, headers: { 'Content-Type': 'application/json' }
  }));
  res = await worker.fetch(post(validPayload), { ...baseEnv, RPM_QUEUE: backoffQueue });
  const backoffBody = await res.json();
  assert.strictEqual(res.status, 429, '上游 429 未轉成可重試的排隊回應');
  assert.ok(sawDefer && backoffBody.queued && backoffBody.ticket === 'retry-ticket', '上游 429 未重新保留順位');

  const kvData = new Map();
  const rateEnv = {
    ...baseEnv,
    RATE_LIMIT_KV: {
      async get(key) { return kvData.get(key) || null; },
      async put(key, value) { kvData.set(key, value); }
    }
  };
  globalThis.fetch = withAuth(async () => new Response('data: [DONE]\n\n', { status: 200, headers: { 'Content-Type': 'text/event-stream' } }));
  for (let i = 0; i < 12; i++) {
    res = await worker.fetch(post(validPayload, { 'CF-Connecting-IP': '203.0.113.7' }), rateEnv);
    assert.strictEqual(res.status, 200, `速率限制過早阻擋第 ${i + 1} 次請求`);
  }
  res = await worker.fetch(post(validPayload, { 'CF-Connecting-IP': '203.0.113.7' }), rateEnv);
  assert.strictEqual(res.status, 429, '第 13 次請求未被速率限制');

  const storageData = new Map();
  const fakeState = {
    storage: {
      async get(key) {
        if (Array.isArray(key)) return new Map(key.map(k => [k, storageData.get(k)]));
        return storageData.get(key);
      },
      async put(key, value) {
        if (typeof key === 'object') Object.entries(key).forEach(([k, v]) => storageData.set(k, v));
        else storageData.set(key, value);
      }
    },
    blockConcurrencyWhile(promiseFactory) { return promiseFactory(); }
  };
  const queue = new workerModule.RpmQueue(fakeState);
  await new Promise(resolve => setTimeout(resolve, 0));
  let q1 = await (await queue.fetch(new Request('https://queue/acquire'))).json();
  let q2 = await (await queue.fetch(new Request('https://queue/acquire'))).json();
  let q3 = await (await queue.fetch(new Request('https://queue/acquire'))).json();
  assert.strictEqual(q1.proceed, true, '第一個排隊請求未立即放行');
  assert.ok(q2.ticket && q2.waitMs > 0, '第二個排隊請求未取得預約票號');
  assert.ok(q3.ticket && q3.ticket !== q2.ticket, '第三個玩家未取得獨立預約票號');
  assert.ok(q3.waitMs > q2.waitMs, '第三個玩家沒有排在第二個玩家之後');
  const deferred = await (await queue.fetch(new Request('https://queue/defer', {
    headers: { 'X-Backoff-Ms': '30000' }
  }))).json();
  assert.ok(deferred.upstreamBackoff && deferred.ticket, '上游忙碌時未建立退避票號');
  const q2Early = await (await queue.fetch(new Request('https://queue/acquire', {
    headers: { 'X-Queue-Ticket': q2.ticket }
  }))).json();
  assert.strictEqual(q2Early.ticket, q2.ticket, '排隊輪詢未保留原票號');
  assert.ok(q2Early.waitMs > deferred.waitMs, '既有等待者未在全域退避後依序平移');

  // Multiple clients can wake after all reservations are overdue. Actual grants
  // must still be spaced, otherwise they hit the upstream at the same instant.
  storageData.set('lastGrantTs', 0);
  const overdueNow = Date.now();
  const overdueData = new Map([
    ['nextSlotTs', overdueNow - 500],
    ['lastGrantTs', 0],
    ['reservations', [
      { ticket: 'late-a', readyAt: overdueNow - 1000 },
      { ticket: 'late-b', readyAt: overdueNow - 500 }
    ]]
  ]);
  const overdueState = {
    storage: {
      async get(key) {
        if (Array.isArray(key)) return new Map(key.map(k => [k, overdueData.get(k)]));
        return overdueData.get(key);
      },
      async put(key, value) {
        if (typeof key === 'object') Object.entries(key).forEach(([k, v]) => overdueData.set(k, v));
        else overdueData.set(key, value);
      }
    },
    blockConcurrencyWhile(promiseFactory) { return promiseFactory(); }
  };
  const overdueQueue = new workerModule.RpmQueue(overdueState);
  await new Promise(resolve => setTimeout(resolve, 0));
  const lateA = await (await overdueQueue.fetch(new Request('https://queue/acquire', {
    headers: { 'X-Queue-Ticket': 'late-a' }
  }))).json();
  const lateB = await (await overdueQueue.fetch(new Request('https://queue/acquire', {
    headers: { 'X-Queue-Ticket': 'late-b' }
  }))).json();
  assert.strictEqual(lateA.proceed, true, '第一張逾期票未放行');
  assert.strictEqual(lateB.proceed, false, '兩張逾期票被同時放行');
  assert.ok(lateB.waitMs > 15000 && lateB.ticket === 'late-b', '第二張逾期票未保留並延後');

  globalThis.fetch = nativeFetch;
  console.log('Worker 離線契約測試全部通過。');
}

async function runLiveTest() {
  assert.ok(LIVE_TOKEN, '正式測試需要設定 TJPR_LIVE_TOKEN（有效登入權杖）');
  const res = await nativeFetch(LIVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ALLOWED_ORIGIN, 'X-Undercurrent-Token': LIVE_TOKEN },
    body: JSON.stringify(validPayload)
  });
  const text = await res.text();
  assert.ok(res.ok, `Worker live test HTTP ${res.status}: ${text.slice(0, 300)}`);
  assert.ok(text.length > 0, 'Worker live test 收到空回應');
  console.log(`Worker live test 通過（HTTP ${res.status}，${text.length} bytes）。`);
}

(process.argv.includes('--live') ? runLiveTest() : runOfflineTests())
  .catch(err => {
    globalThis.fetch = nativeFetch;
    console.error(err);
    process.exitCode = 1;
  });
