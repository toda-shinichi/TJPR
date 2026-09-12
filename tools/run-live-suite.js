const assert = require('node:assert');
const { randomUUID } = require('node:crypto');
const { spawn } = require('node:child_process');
const path = require('node:path');

const GAS_URL = 'https://script.google.com/macros/s/AKfycby-MudkbcVPAfVDZk2B1zznDlOfjnJOqMB2A3586Ct3ZGq_CUNteKe1lZ4bbw8HwqS9sw/exec';
const WORKER_URL = 'https://tjpr-llm-proxy.todashinchi.workers.dev/';
const ORIGIN = 'https://toda-shinichi.github.io';
const REPORT_PATH = process.env.TJPR_TEST_REPORT || '/tmp/tjpr-10-turn-live-report.json';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function gas(payload) {
  const response = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!data.success) {
    const detail = typeof data.error === 'string'
      ? data.error
      : data.error?.message || data.message || JSON.stringify(data).slice(0, 500);
    throw new Error(`GAS ${detail || `HTTP ${response.status}`}`);
  }
  return data.data;
}

function runTenTurns(token, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(__dirname, '..', 'test_10_turn_game.js')], {
      stdio: 'inherit',
      env: {
        ...process.env,
        TJPR_LIVE_TOKEN: token,
        TJPR_TEST_REPORT: REPORT_PATH,
        ...(options.turnCount ? { TJPR_TURN_COUNT: String(options.turnCount) } : {}),
        ...(options.literaryGate ? { TJPR_LITERARY_GATE: '1' } : {})
      }
    });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`十回合測試退出碼 ${code}`)));
  });
}

async function readStream(response) {
  const text = await response.text();
  assert.ok(text.includes('data:'), '正式 Worker 沒有回傳 SSE 串流');
  assert.ok(!/"error"\s*:/.test(text), '模型串流包含錯誤訊息');
  return text;
}

async function concurrentPlayer(player, token, startedAt) {
  let ticket = '';
  let firstQueue = null;
  let polls = 0;
  while (polls++ < 12) {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: ORIGIN,
        'X-Undercurrent-Token': token,
        ...(ticket ? { 'X-Queue-Ticket': ticket } : {})
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v4-flash-0731',
        messages: [{ role: 'user', content: `你是排隊測試玩家 ${player}。只回覆「玩家 ${player} 已完成」。` }],
        temperature: 0,
        max_tokens: 64,
        stream: true
      })
    });
    if (response.ok) {
      await readStream(response);
      return { player, elapsedMs: Date.now() - startedAt, firstQueue, polls };
    }
    const body = await response.json().catch(() => ({}));
    if (response.status !== 429 || body.queued !== true || !body.ticket) {
      throw new Error(`玩家 ${player} 排隊失敗：HTTP ${response.status} ${JSON.stringify(body).slice(0, 240)}`);
    }
    ticket = body.ticket;
    if (!firstQueue) firstQueue = {
      ticket,
      position: body.position,
      waitMs: body.waitMs
    };
    await sleep(Math.max(250, Number(body.waitMs) + 250));
  }
  throw new Error(`玩家 ${player} 超過排隊輪詢上限`);
}

async function runThreePlayerQueue(token) {
  console.log('開始三位玩家同時排隊的正式付費測試……');
  const startedAt = Date.now();
  const results = await Promise.all([1, 2, 3].map(player => concurrentPlayer(player, token, startedAt)));
  const tickets = results.map(item => item.firstQueue?.ticket).filter(Boolean);
  assert.ok(tickets.length >= 2, '三位玩家同時請求時，等待者不足兩位');
  assert.strictEqual(new Set(tickets).size, tickets.length, '不同玩家取得重複排隊票號');
  const waits = results.map(item => item.firstQueue?.waitMs || 0).sort((a, b) => a - b);
  assert.ok(waits[2] > waits[1], '第三位等待者沒有排在第二位之後');
  console.log('三位玩家皆完成，排隊票號獨立且完成時間依序錯開。');
  console.log(results.map(({ player, elapsedMs, firstQueue, polls }) => ({
    player,
    elapsedSeconds: Math.round(elapsedMs / 1000),
    initialPosition: firstQueue?.position || 0,
    polls
  })));
}

async function runStorageContract(token) {
  const verified = await gas({ action: 'auth/verify', token });
  assert.ok(verified.valid && verified.userId, '登入權杖驗證失敗');
  const empty = await gas({ action: 'novel/load-state', token });
  assert.equal(empty.saveState, null, '新帳號不應讀到其他玩家的存檔');
  const chapter = {turn: 1, chapterTitle: '自動測試', prose: '這是一次性測試章節，測試後清除。', choices: []};
  const saveState = {turnCount: 1, meta: {currentAct: 1, playerProfile: {name: '測試玩家'}},
    summaryPool: '測試摘要', protagonist: {hp: 100, sanity: 100}, relationships: {}, questFlags: {}, turnHistory: []};
  const saved = await gas({ action: 'novel/save-state', token, saveState, chapter, chapterHistory: [chapter] });
  assert.equal(saved.saved, true);
  const loaded = await gas({ action: 'novel/load-state', token });
  assert.equal(loaded.saveState.summaryPool, '測試摘要');
  assert.equal(loaded.chapter.prose, chapter.prose);
  assert.equal(loaded.chapterHistory.length, 1);
  console.log('正式帳號驗證、空存檔隔離與雲端存讀往返通過。');
}

async function main() {
  const storageOnly = process.argv.includes('--storage-only');
  const queueOnly = process.argv.includes('--queue-only');
  const literaryOnly = process.argv.includes('--literary-only');
  const marker = `${Date.now()}-${randomUUID().slice(0, 8)}`;
  const email = `codex-e2e-${marker}@example.com`;
  const password = `E2e-${randomUUID()}`;
  let token = '';
  try {
    console.log('建立一次性正式測試帳號……');
    const account = await gas({ action: 'auth/register', email, password });
    token = account.token;
    assert.match(token, /^epi_[A-Za-z0-9_-]{20,2048}={0,2}$/);
    if (storageOnly) {
      await runStorageContract(token);
      return;
    }
    if (literaryOnly) {
      await runTenTurns(token, { turnCount: Number(process.env.TJPR_LITERARY_TURNS) || 3, literaryGate: true });
    } else {
      if (!queueOnly) await runTenTurns(token);
      await runThreePlayerQueue(token);
    }
    console.log(literaryOnly
      ? `文學強化正式付費驗收完成，報告：${REPORT_PATH}`
      : queueOnly
        ? '三位玩家正式排隊驗收完成。'
        : `正式付費驗收完成，十回合報告：${REPORT_PATH}`);
  } finally {
    if (token) {
      try {
        await gas({ action: 'auth/delete-account', token });
        console.log('一次性測試帳號與雲端資料已清除。');
      } catch (error) {
        console.error('一次性測試帳號清除失敗：' + error.message);
        process.exitCode = 1;
      }
    }
  }
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
