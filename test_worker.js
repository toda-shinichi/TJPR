const assert = require('node:assert');
const fs = require('node:fs');

const LIVE_URL = 'https://tjpr-llm-proxy.todashinchi.workers.dev/';
const ALLOWED_ORIGIN = 'http://localhost:8731';
const nativeFetch = globalThis.fetch;

async function loadWorker() {
  const source = fs.readFileSync('worker/index.js', 'utf8');
  const dataUrl = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
  return (await import(dataUrl)).default;
}

function post(body, headers = {}) {
  return new Request('https://worker.test/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ALLOWED_ORIGIN, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

const validPayload = {
  model: 'gemini-3.7-flash',
  messages: [{ role: 'user', content: 'test' }],
  max_tokens: 100,
  stream: false
};

async function runOfflineTests() {
  const worker = await loadWorker();
  const baseEnv = { API_KEY: 'unit-test-key' };

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

  res = await worker.fetch(post({ ...validPayload, messages: [{ role: 'user', content: '界'.repeat(44000) }] }), baseEnv);
  assert.strictEqual(res.status, 413, '多位元組超大請求未依實際 bytes 拒絕');

  let forwardedBody = null;
  globalThis.fetch = async (_url, options) => {
    forwardedBody = JSON.parse(options.body);
    return new Response('data: {"ok":true}\n\n', { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  };

  res = await worker.fetch(post({ ...validPayload, max_tokens: -99, stream: false }), baseEnv);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(forwardedBody.max_tokens, 1, '負數 max_tokens 未夾制到下限');
  assert.strictEqual(forwardedBody.stream, true, 'Worker 未強制串流');

  res = await worker.fetch(post({ ...validPayload, max_tokens: 999999 }), baseEnv);
  assert.strictEqual(forwardedBody.max_tokens, 4096, 'max_tokens 未夾制到上限');

  globalThis.fetch = async () => new Response('{"error":"upstream"}', { status: 401, headers: { 'Content-Type': 'application/json' } });
  res = await worker.fetch(post(validPayload), baseEnv);
  assert.strictEqual(res.status, 401, '上游錯誤狀態未保留');
  assert.match(res.headers.get('content-type') || '', /application\/json/, '上游 JSON 錯誤類型未保留');

  const kvData = new Map();
  const rateEnv = {
    ...baseEnv,
    RATE_LIMIT_KV: {
      async get(key) { return kvData.get(key) || null; },
      async put(key, value) { kvData.set(key, value); }
    }
  };
  globalThis.fetch = async () => new Response('data: [DONE]\n\n', { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  for (let i = 0; i < 12; i++) {
    res = await worker.fetch(post(validPayload, { 'CF-Connecting-IP': '203.0.113.7' }), rateEnv);
    assert.strictEqual(res.status, 200, `速率限制過早阻擋第 ${i + 1} 次請求`);
  }
  res = await worker.fetch(post(validPayload, { 'CF-Connecting-IP': '203.0.113.7' }), rateEnv);
  assert.strictEqual(res.status, 429, '第 13 次請求未被速率限制');

  globalThis.fetch = nativeFetch;
  console.log('Worker 離線契約測試全部通過。');
}

async function runLiveTest() {
  const res = await nativeFetch(LIVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ALLOWED_ORIGIN },
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
