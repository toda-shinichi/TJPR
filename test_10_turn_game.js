const assert = require('node:assert');
const fs = require('node:fs');

const LIVE_URL = process.env.TJPR_LIVE_URL || 'https://tjpr-llm-proxy.todashinchi.workers.dev/';
const ORIGIN = 'http://localhost:8731';
const MODEL = process.env.TJPR_TEST_MODEL || 'aion-3.0';
const LIVE_TOKEN = process.env.TJPR_LIVE_TOKEN || '';
const MODEL_ATTEMPT_PLAN = [
  MODEL,
  MODEL,
  'qwen/qwen3-vl-235b-a22b-instruct'
];
const TURN_COUNT = Math.max(1, Number(process.env.TJPR_TURN_COUNT) || 10);
const LITERARY_GATE = process.env.TJPR_LITERARY_GATE === '1';
// 專案上游限制為 5 RPM；採 16 秒間隔降至約 3.75 RPM，避開共享額度與滾動窗口邊界。
const MIN_REQUEST_INTERVAL_MS = 16_000;
// The production primary model can legitimately take close to two minutes.
// Leave enough headroom for a healthy but slow response; the browser separately
// uses a first-byte timeout and a shorter between-chunk stall timeout.
const REQUEST_TIMEOUT_MS = 180_000;
const REPORT_PATH = process.env.TJPR_TEST_REPORT || '/tmp/tjpr-10-turn-live-report.json';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function stripTrailingCommas(text) {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString && ch === '\\') { out += ch + (text[i + 1] || ''); i++; continue; }
    if (ch === '"') { inString = !inString; out += ch; continue; }
    if (!inString && ch === ',') {
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j])) j++;
      if (text[j] === '}' || text[j] === ']') continue;
    }
    out += ch;
  }
  return out;
}

function escapeRawControls(text) {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString && ch === '\\') { out += ch + (text[i + 1] || ''); i++; continue; }
    if (ch === '"') { inString = !inString; out += ch; continue; }
    if (inString && ch === '\n') { out += '\\n'; continue; }
    if (inString && ch === '\r') { out += '\\r'; continue; }
    if (inString && ch === '\t') { out += '\\t'; continue; }
    out += ch;
  }
  return out;
}

function decodeJsonStringEscapes(value) {
  try {
    return JSON.parse(`"${value}"`);
  } catch (_error) {
    return value;
  }
}

// 與正式前端相同的降級策略：標準 JSON 修復失敗時，從模型文字逐欄萃取。
// 這不會再發出網路請求，只容忍模型常見的格式瑕疵。
function extractGameData(rawText) {
  const getStr = key => {
    const match = rawText.match(new RegExp('"' + key + '"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"'));
    return match ? decodeJsonStringEscapes(match[1]) : '';
  };
  const getNum = key => {
    const match = rawText.match(new RegExp('"' + key + '"\\s*:\\s*(-?\\d+)'));
    return match ? Number(match[1]) : null;
  };
  const chapter = { chapterTitle: getStr('chapterTitle'), prose: '', statusPanel: {}, choices: [] };
  for (const key of ['timeLocation', 'tensionLabel', 'intoxicationLabel', 'favorabilityReason', 'outfit', 'interaction', 'inventory', 'rumors']) {
    chapter.statusPanel[key] = getStr(key);
  }
  for (const key of ['tension', 'intoxication', 'favorabilityDelta']) {
    chapter.statusPanel[key] = getNum(key);
  }

  const proseKey = rawText.indexOf('"prose"');
  const proseStart = proseKey < 0 ? -1 : rawText.indexOf('"', proseKey + 7);
  if (proseStart >= 0) {
    let prose = '';
    for (let i = proseStart + 1; i < rawText.length; i++) {
      const ch = rawText[i];
      if (ch === '\\') {
        const next = rawText[++i];
        if (next === 'n') prose += '\n';
        else if (next === 'r') prose += '\r';
        else if (next === 't') prose += '\t';
        else prose += next || '';
      } else if (ch === '"') {
        break;
      } else {
        prose += ch;
      }
    }
    chapter.prose = prose;
  }

  const choicesKey = rawText.indexOf('"choices"');
  const choicesText = choicesKey < 0 ? '' : rawText.slice(choicesKey);
  const choicePattern = /\{[^}]*?"id"\s*:\s*"([^"]+)"[^}]*?"label"\s*:\s*"([^"]+)"[^}]*?"risk"\s*:\s*"([^"]+)"(?:[^}]*?"hint"\s*:\s*"([^"]*)")?[^}]*?\}/g;
  for (const match of choicesText.matchAll(choicePattern)) {
    chapter.choices.push({ id: match[1], label: match[2], risk: match[3], hint: match[4] || '' });
  }
  return chapter.prose.length > 20 ? chapter : null;
}

function parseModelJson(raw) {
  let clean = String(raw || '').trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  const first = clean.indexOf('{');
  const last = clean.lastIndexOf('}');
  if (first !== -1 && last > first) clean = clean.slice(first, last + 1);
  try {
    return { chapter: JSON.parse(clean), parseMode: 'json' };
  } catch (_error) {
    try {
      return { chapter: JSON.parse(stripTrailingCommas(escapeRawControls(clean))), parseMode: 'repaired-json' };
    } catch (_repairError) {
      // 部分模型會先輸出半份 JSON，再從 chapterTitle 重新輸出完整物件。
      // 從最後一個候選物件往前找，並明確標記為 recovered-json，避免掩蓋格式缺陷。
      const starts = [...clean.matchAll(/\{\s*"chapterTitle"/g)].map(match => match.index);
      for (const start of starts.reverse()) {
        const candidate = clean.slice(start, clean.lastIndexOf('}') + 1);
        try {
          return { chapter: JSON.parse(candidate), parseMode: 'recovered-json' };
        } catch (_candidateError) {
          try {
            return {
              chapter: JSON.parse(stripTrailingCommas(escapeRawControls(candidate))),
              parseMode: 'recovered-json'
            };
          } catch (_ignored) {}
        }
      }
      const extracted = extractGameData(clean);
      if (extracted) return { chapter: extracted, parseMode: 'field-extraction' };
      throw _repairError;
    }
  }
}

async function readSseContent(response) {
  assert.ok(response.body, '正式 Worker 沒有回傳串流 body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';
  let sawDone = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') { sawDone = true; continue; }
      if (!data) continue;
      const packet = JSON.parse(data);
      full += packet?.choices?.[0]?.delta?.content || packet?.choices?.[0]?.message?.content || '';
    }
  }
  return { full, sawDone };
}

function validateTurn(chapter, turn) {
  assert.ok(chapter && typeof chapter === 'object', `第 ${turn} 回不是物件`);
  assert.ok(typeof chapter.chapterTitle === 'string' && chapter.chapterTitle.trim(), `第 ${turn} 回缺少標題`);
  assert.ok(typeof chapter.prose === 'string' && chapter.prose.trim().length >= 220, `第 ${turn} 回正文過短`);
  assert.ok(chapter.statusPanel && typeof chapter.statusPanel === 'object', `第 ${turn} 回缺少狀態面板`);
  assert.ok(typeof chapter.statusPanel.timeLocation === 'string' && chapter.statusPanel.timeLocation.trim(), `第 ${turn} 回缺少時空地點`);
  assert.ok(Number.isFinite(Number(chapter.statusPanel.tension)), `第 ${turn} 回張力值不是數字`);
  assert.ok(Number(chapter.statusPanel.tension) >= 0 && Number(chapter.statusPanel.tension) <= 100, `第 ${turn} 回張力值越界`);
  assert.ok(Number.isFinite(Number(chapter.statusPanel.intoxication)), `第 ${turn} 回微醺度不是數字`);
  assert.ok(Number(chapter.statusPanel.intoxication) >= 0 && Number(chapter.statusPanel.intoxication) <= 100, `第 ${turn} 回微醺度越界`);
  assert.ok(Number(chapter.statusPanel.favorabilityDelta) >= -5 && Number(chapter.statusPanel.favorabilityDelta) <= 10, `第 ${turn} 回好感變動越界`);
  assert.strictEqual(Array.isArray(chapter.choices) ? chapter.choices.length : 0, 3, `第 ${turn} 回不是三個選項`);
  const ids = chapter.choices.map(choice => String(choice.id || '').toUpperCase());
  assert.strictEqual(new Set(ids).size, 3, `第 ${turn} 回選項 id 重複`);
}

function getValidationError(chapter, turn, history = []) {
  try {
    validateTurn(chapter, turn);
    if (LITERARY_GATE) {
      const literary = literaryMetrics(chapter, history);
      if (literary.clichéHits.length >= 3) throw new Error(`第 ${turn} 回套路語過多`);
      if (literary.simileCount > 4) throw new Error(`第 ${turn} 回比喻訊號過密`);
      if (literary.simplifiedChineseCount) throw new Error(`第 ${turn} 回混入簡體字`);
      if (literary.formulaicClosure) throw new Error(`第 ${turn} 回使用判詞式模板`);
      if (literary.repeatedSentenceCount >= 2) throw new Error(`第 ${turn} 回完整句子重複`);
      if (literary.recentEchoLength >= 12) throw new Error(`第 ${turn} 回沿用近期回合措辭`);
      if (literary.score < 65) throw new Error(`第 ${turn} 回文學品質分數過低`);
    }
    return '';
  } catch (error) {
    return error.message;
  }
}

function continuityWarnings(chapter, previous) {
  const warnings = [];
  const prose = chapter.prose || '';
  if (/徐令謙.{0,16}(?:檢察官|警察|刑警)|(?:檢察官|警察|刑警).{0,16}徐令謙/.test(prose)) {
    warnings.push('疑似混淆徐令謙職業');
  }
  if (previous && chapter.chapterTitle === previous.chapterTitle) warnings.push('章節標題重複');
  if (previous && chapter.statusPanel.timeLocation !== previous.statusPanel.timeLocation) {
    const hasTransition = /前往|抵達|離開|走進|走出|上車|下車|來到|轉場|數分鐘後|翌日|隔日|天亮/.test(prose);
    if (!hasTransition) warnings.push('地點改變但正文沒有明確轉場訊號');
  }
  if (Number(chapter.statusPanel.intoxication) > 0 && !/酒|威士忌|香檳|啤酒|紅酒|飲/.test(prose + (previous?.prose || ''))) {
    warnings.push('微醺度上升但近期正文沒有飲酒訊號');
  }
  if (!prose.includes('徐令謙')) warnings.push('正文未直接提及主要對象徐令謙');
  return warnings;
}

const LITERARY_CLICHES = [
  '空氣瞬間凝滯', '空氣凝滯', '眼底閃過一絲', '眼底閃過', '眸中掠過',
  '唇角勾起', '嘴角勾起', '心跳如鼓', '看穿靈魂', '無形的網', '無形的牆',
  '蟄伏的獸', '危險又迷人', '不容置疑', '不容拒絕', '宣告主權',
  '喉結滾動', '指尖微顫', '呼吸一滯', '渾身一僵', '電流竄過',
  '眼神銳利如刀', '銳利如刀刃', '眼神像刀', '未引爆的計時器', '未引爆計時器'
];
const RHYTHMS = ['潛流鋪陳', '言語試探', '情報揭露', '關係偏移', '壓力峰值', '餘韻留白'];

function countLiterarySimiles(prose) {
  return (String(prose || '').match(/(?:彷彿|如同|宛如|好像|像是|像被|像在|像要|像從|像一(?:個|把|張|道|場|頭|隻|枚|座|面|根|顆|條|件))/g) || []).length;
}

function countRepeatedLiterarySentences(prose) {
  const counts = new Map();
  String(prose || '').split(/[。！？!?；;\n]+/)
    .map(sentence => sentence.replace(/[「」『』“”\s，、：:—…]/g, '').trim())
    .filter(sentence => sentence.length >= 3)
    .forEach(sentence => counts.set(sentence, (counts.get(sentence) || 0) + 1));
  return Array.from(counts.values()).reduce((total, count) => total + Math.max(0, count - 1), 0);
}

function countSimplifiedChineseMarkers(prose) {
  return (String(prose || '').match(/[这为后发会门问见与东个来时说车书里边应过还从对将无现开关经处实试]/g) || []).length;
}

function getLongestRecentLiteraryEcho(prose, history = []) {
  const normalize = value => String(value || '').replace(/[\s，。！？!?；;、：「」『』“”‘’（）()—…·,.:'"\-]/g, '');
  const current = normalize(prose);
  let longest = 0;
  history.slice(-3).forEach(item => {
    const previous = normalize(item?.chapter?.prose || item?.prose || '');
    let priorRow = new Uint16Array(previous.length + 1);
    for (let i = 1; i <= current.length; i += 1) {
      const row = new Uint16Array(previous.length + 1);
      for (let j = 1; j <= previous.length; j += 1) {
        if (current[i - 1] === previous[j - 1]) {
          row[j] = priorRow[j - 1] + 1;
          if (row[j] > longest) longest = row[j];
        }
      }
      priorRow = row;
    }
  });
  return longest;
}

function literaryMetrics(chapter, history = []) {
  const prose = String(chapter?.prose || '');
  const clichéHits = LITERARY_CLICHES.filter(phrase => prose.includes(phrase));
  const simileCount = countLiterarySimiles(prose);
  const repeatedSentenceCount = countRepeatedLiterarySentences(prose);
  const simplifiedChineseCount = countSimplifiedChineseMarkers(prose);
  const recentEchoLength = getLongestRecentLiteraryEcho(prose, history);
  const longChoices = (chapter?.choices || []).filter(choice => String(choice?.label || '').length > 120).length;
  const sentences = prose.split(/[。！？!?]+/).map(item => item.trim()).filter(item => item.length >= 4);
  const tail = prose.slice(-220).replace(/\s+/g, ' ');
  const formulaicClosure = /這不是[^。！？]{1,40}[。！？][\s\S]{0,28}?這是[^。！？]{1,40}[。！？]/.test(prose)
    || /這不是[^，。！？]{1,40}[，,]\s*是[^。！？]{1,40}[。！？]/.test(prose)
    || /(?:這只是|一切才|一切只是).{0,10}(?:開始|剛開始)/.test(tail);
  const score = Math.max(0, 100 - clichéHits.length * 10 - Math.max(0, simileCount - 2) * 5 - repeatedSentenceCount * 8 - simplifiedChineseCount * 12 - Math.max(0, recentEchoLength - 11) * 3 - longChoices * 8 - (formulaicClosure ? 15 : 0));
  return { score, clichéHits, simileCount, repeatedSentenceCount, simplifiedChineseCount, recentEchoLength, longChoices, formulaicClosure, sentenceCount: sentences.length };
}

function buildMessages(turn, history, action, memory) {
  const recent = history.slice(-3).map(item => ({
    turn: item.turn,
    action: item.action,
    chapterTitle: item.chapter.chapterTitle,
    prose: item.chapter.prose,
    statusPanel: item.chapter.statusPanel
  }));

  const recentCliches = LITERARY_CLICHES.filter(phrase => recent.some(item => String(item.prose || '').includes(phrase)));
  const system = `你是連載長篇小說作者，同時維持《暗流》互動故事的狀態資料。這是一段 PG-15 台灣政商懸疑劇，不寫露骨成人內容。正文必須先像可出版小說成立，再正確填寫遊戲欄位。
固定設定：玩家林映真，29歲調查記者；主要對象徐令謙，35歲，玄辰幫天裕會首領兼德行法律事務所顧問。他不是警察、刑警或檢察官。徐令謙冷靜、自持、尊重玩家自主，不威脅或限制玩家自由。
必須緊接前情，時間、地點、物品與人物認知不可無故重置。若更換地點或時間，正文必須寫出轉場。

【文學敘事規格】
- 限知第二人稱，只寫玩家當下可察覺或合理推斷之事；台灣當代都會黑色小說質感。
- 用精準名詞、動詞與具體後果形成張力，克制形容詞，不直接宣布人物危險、迷人、強勢或充滿性張力。
- 對話須有潛台詞；不要在旁白立即解釋每句台詞。
- 長短句交錯；核心比喻最多 2 個且取材自場景；「像、彷彿、如同、宛如」合計最多 3 次。
- 交稿前逐字搜尋「像、彷彿、如同、宛如」，合計超過 3 次就刪減；這是硬性上限。
- 同一句話、同一物件狀態或「你＋動作」句型不得換字反覆描述；完整句子不可重複。
- 不可把上一回的招牌物件、收尾意象或整段動作只換幾個字重寫；物件若仍在場，必須產生新的變化或後果。
- 本回節奏：${RHYTHMS[(turn - 1) % RHYTHMS.length]}。
- 避免套路語及近義改寫：${LITERARY_CLICHES.join('、')}。近期尤其不可重用：${recentCliches.join('、') || '無'}。
- 完成一個有因果的戲劇節拍，不要求高潮或封口；以具體餘波保留下一回張力。
- 不得用「這不是 X。這是 Y。」「裂縫已經打開」「一切才剛開始」等判詞總結；以仍在發生的動作、物件、聲音或未完成對話收尾。
- 選項 label 25–60 字，hint 10–24 字，每項只有一個行動與必要對白。

只輸出合法 JSON，不要 markdown：
{"chapterTitle":"第 ${turn} 回．標題","prose":"800至1200字繁體中文正文","statusPanel":{"timeLocation":"明確時間地點","tension":0,"tensionLabel":"描述","intoxication":0,"intoxicationLabel":"描述","favorabilityDelta":0,"favorabilityReason":"原因","outfit":"服裝神態","interaction":"互動距離","inventory":"關鍵物品","rumors":"新情報"},"choices":[{"id":"A","label":"25至60字行動","risk":"low","hint":"提示"},{"id":"B","label":"25至60字行動","risk":"medium","hint":"提示"},{"id":"C","label":"25至60字行動","risk":"high","hint":"提示"}]}`;

  const user = `【長期測試記憶】\n${memory || '林映真取得一支疑似記錄政商洗錢帳目的隨身碟。'}\n\n【最近三回】\n${JSON.stringify(recent)}\n\n【第 ${turn} 回玩家行動】\n${action}\n\n請推進一個完整但不結案的場景，保留下一回可延續的線索。`;
  return [{ role: 'system', content: system }, { role: 'user', content: user }];
}

function updateMemory(memory, turn, chapter, action) {
  const fact = `第${turn}回：玩家「${action}」；${chapter.chapterTitle}；地點${chapter.statusPanel.timeLocation}；${chapter.prose.slice(0, 120)}`;
  return `${memory}\n${fact}`.slice(-2600);
}

async function requestTurn(messages, model = MODEL) {
  const startedAt = Date.now();
  let ticket = '';
  let queuedMs = 0;
  while (queuedMs <= 360_000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
    const response = await fetch(LIVE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: ORIGIN,
        'X-Undercurrent-Token': LIVE_TOKEN,
        ...(ticket ? { 'X-Queue-Ticket': ticket } : {})
      },
      // 與正式遊戲生成設定一致，避免測試本身截斷狀態面板或選項。
      body: JSON.stringify({ model, messages, temperature: 0.65, max_tokens: 6144, stream: true }),
      signal: controller.signal
    });
    if (!response.ok) {
      const body = await response.text();
      if (response.status === 429) {
        const queue = JSON.parse(body);
        if (queue?.queued && queue.ticket) {
          ticket = queue.ticket;
          const waitMs = Math.max(1000, Number(queue.waitMs) || 1000);
          queuedMs += waitMs;
          if (queuedMs > 360_000) throw new Error('排隊等待超過 6 分鐘');
          console.log(`模型 ${model} 已保留第 ${Number(queue.position) || 1} 位，${Math.ceil(waitMs / 1000)} 秒後重試……`);
          await sleep(waitMs + 250);
          continue;
        }
      }
      throw new Error(`HTTP ${response.status}: ${body.slice(0, 300)}`);
    }
    const streamed = await readSseContent(response);
    assert.ok(streamed.full.trim(), '串流完成但沒有模型內容');
    let parsed;
    try {
      parsed = parseModelJson(streamed.full);
    } catch (error) {
      const rawPath = REPORT_PATH.replace(/\.json$/i, '-raw.txt');
      fs.writeFileSync(rawPath, streamed.full);
      error.message += `；原始回應已保存至 ${rawPath}`;
      throw error;
    }
    return {
      chapter: parsed.chapter,
      parseMode: parsed.parseMode,
      model,
      raw: streamed.full,
      latencyMs: Date.now() - startedAt,
      sawDone: streamed.sawDone
    };
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error('排隊等待超過 6 分鐘');
}

async function main() {
  assert.ok(LIVE_TOKEN, '10 回合正式測試需要設定 TJPR_LIVE_TOKEN（有效登入權杖）');
  const startedAt = new Date().toISOString();
  const history = [];
  const requestStarts = [];
  let memory = '林映真取得一支疑似記錄政商洗錢帳目的隨身碟，約徐令謙在士林一間深夜咖啡館交換情報。';
  let nextAllowedAt = 0;
  const seedAction = '把隨身碟放在桌面但不交出去，要求徐令謙先證明情報來源可信。';

  console.log(`開始 ${TURN_COUNT} 回 live 遊戲測試：${MODEL}，請求起點間隔至少 ${MIN_REQUEST_INTERVAL_MS / 1000} 秒。`);

  for (let turn = 1; turn <= TURN_COUNT; turn++) {
    const previous = history[history.length - 1];
    const selectedChoice = previous?.chapter?.choices?.[(turn - 2) % 3];
    const action = turn === 1
      ? seedAction
      : selectedChoice?.label || '先整理現有線索，向徐令謙確認上一回事件的關鍵細節。';
    const messages = buildMessages(turn, history, action, memory);
    let result = null;
    let validationError = '';
    const attempts = [];
    for (let attempt = 0; attempt < MODEL_ATTEMPT_PLAN.length; attempt++) {
      const model = MODEL_ATTEMPT_PLAN[attempt];
      const waitMs = Math.max(0, nextAllowedAt - Date.now());
      if (waitMs > 0) {
        console.log(`第 ${turn} 回等待 ${Math.ceil(waitMs / 1000)} 秒，以符合速率限制……`);
        await sleep(waitMs);
      }
      const requestStartedAt = Date.now();
      requestStarts.push(requestStartedAt);
      nextAllowedAt = requestStartedAt + MIN_REQUEST_INTERVAL_MS;
      try {
        const candidate = await requestTurn(messages, model);
        validationError = getValidationError(candidate.chapter, turn, history);
        attempts.push({ model, outcome: validationError || candidate.parseMode });
        if (!validationError) {
          result = candidate;
          break;
        }
        console.warn(`第 ${turn} 回 ${model} 品質檢查未過：${validationError}`);
      } catch (error) {
        attempts.push({ model, outcome: error.message.slice(0, 180) });
        console.warn(`第 ${turn} 回 ${model} 回應不可用，依正式備援順序繼續。`);
      }
    }
    if (!result) {
      throw new Error(`第 ${turn} 回三段備援均未產生合格章節：${JSON.stringify(attempts)}`);
    }
    const literary = literaryMetrics(result.chapter, history);
    const warnings = continuityWarnings(result.chapter, previous?.chapter);
    if (literary.clichéHits.length > 1) warnings.push(`套路語偏多：${literary.clichéHits.join('、')}`);
    if (literary.simileCount > 3) warnings.push(`比喻訊號過密：${literary.simileCount}`);
    if (literary.longChoices) warnings.push(`過長選項：${literary.longChoices}`);
    if (literary.formulaicClosure) warnings.push('結尾使用判詞式總結');
    if (literary.repeatedSentenceCount) warnings.push(`完整句子重複 ${literary.repeatedSentenceCount} 次`);
    if (literary.recentEchoLength >= 12) warnings.push(`沿用近期回合措辭 ${literary.recentEchoLength} 字`);
    if (literary.simplifiedChineseCount) warnings.push(`混入簡體字 ${literary.simplifiedChineseCount} 字`);
    if (validationError) warnings.unshift(validationError);
    if (validationError || result.parseMode !== 'json') {
      fs.writeFileSync(REPORT_PATH.replace(/\.json$/i, `-turn-${turn}-raw.txt`), result.raw);
    }
    history.push({
      turn,
      action,
      chapter: result.chapter,
      model: result.model,
      latencyMs: result.latencyMs,
      warnings,
      sawDone: result.sawDone,
      parseMode: result.parseMode,
      validationPassed: !validationError,
      attempts,
      literary
    });
    fs.writeFileSync(
      REPORT_PATH.replace(/\.json$/i, '-partial.json'),
      JSON.stringify({ startedAt, turnsCompleted: history.length, turns: history }, null, 2)
    );
    memory = updateMemory(memory, turn, result.chapter, action);
    console.log(`第 ${turn}/${TURN_COUNT} 回完成｜嚴格驗證通過｜${result.model}｜${result.latencyMs}ms｜正文 ${result.chapter.prose.length} 字｜文學分 ${literary.score}｜${result.parseMode}｜警告 ${warnings.length}`);
  }

  const intervals = requestStarts.slice(1).map((value, index) => value - requestStarts[index]);
  assert.ok(intervals.every(ms => ms >= MIN_REQUEST_INTERVAL_MS), '實際請求間隔低於合規設定');
  const warnings = history.flatMap(item => item.warnings.map(warning => ({ turn: item.turn, warning })));
  const report = {
    startedAt,
    finishedAt: new Date().toISOString(),
    liveUrl: LIVE_URL,
    model: MODEL,
    modelAttemptPlan: MODEL_ATTEMPT_PLAN,
    turnsRequested: TURN_COUNT,
    turnsCompleted: history.length,
    turnsPassed: history.filter(item => item.validationPassed).length,
    nativeJsonTurns: history.filter(item => item.parseMode === 'json').length,
    recoveredJsonTurns: history.filter(item => item.parseMode === 'recovered-json').length,
    minRequestIntervalMs: intervals.length ? Math.min(...intervals) : null,
    averageLatencyMs: Math.round(history.reduce((sum, item) => sum + item.latencyMs, 0) / history.length),
    totalProseChars: history.reduce((sum, item) => sum + item.chapter.prose.length, 0),
    averageLiteraryScore: Math.round(history.reduce((sum, item) => sum + item.literary.score, 0) / history.length),
    warnings,
    turns: history.map(item => ({
      turn: item.turn,
      action: item.action,
      chapterTitle: item.chapter.chapterTitle,
      timeLocation: item.chapter.statusPanel.timeLocation,
      tension: item.chapter.statusPanel.tension,
      intoxication: item.chapter.statusPanel.intoxication,
      favorabilityDelta: item.chapter.statusPanel.favorabilityDelta,
      proseChars: item.chapter.prose.length,
      prose: item.chapter.prose,
      choices: item.chapter.choices,
      latencyMs: item.latencyMs,
      model: item.model,
      sawDone: item.sawDone,
      parseMode: item.parseMode,
      validationPassed: item.validationPassed,
      warnings: item.warnings,
      attempts: item.attempts,
      literary: item.literary
    }))
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  if (LITERARY_GATE) {
    assert.ok(report.averageLiteraryScore >= 85, `平均文學品質分數過低：${report.averageLiteraryScore}`);
    assert.ok(history.every(item => item.literary.clichéHits.length <= 1), '至少一回仍含多個套路語');
    assert.ok(history.every(item => item.literary.simileCount <= 4), '至少一回仍有過密比喻訊號');
    assert.ok(history.every(item => item.literary.longChoices === 0), '至少一回仍有過長選項');
    assert.ok(history.every(item => !item.literary.formulaicClosure), '至少一回仍以判詞式句型收尾');
    assert.ok(history.every(item => item.literary.repeatedSentenceCount < 2), '至少一回出現機械式完整句重複');
    assert.ok(history.every(item => item.literary.recentEchoLength < 12), '至少一回沿用近期回合段落措辭');
    assert.ok(history.every(item => item.literary.simplifiedChineseCount === 0), '至少一回混入簡體字');
  }
  console.log(`${TURN_COUNT} 回合全部完成；嚴格通過 ${report.turnsPassed}/${TURN_COUNT}；平均文學分 ${report.averageLiteraryScore}。報告：${REPORT_PATH}`);
}

module.exports = { parseModelJson, validateTurn, continuityWarnings, literaryMetrics };

if (require.main === module) {
  main().catch(error => {
    console.error('10 回合 live 測試失敗：', error.stack || error.message);
    process.exitCode = 1;
  });
}
