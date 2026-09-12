const assert = require('node:assert');
const fs = require('node:fs');
const vm = require('node:vm');

const rootApp = fs.readFileSync('app.js', 'utf8');
const deployApp = fs.readFileSync('project-epilogue/frontend-web/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const deployHtml = fs.readFileSync('project-epilogue/frontend-web/index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const deployCss = fs.readFileSync('project-epilogue/frontend-web/style.css', 'utf8');
const generatedCss = fs.readFileSync('tailwind.generated.css', 'utf8');
const deployGeneratedCss = fs.readFileSync('project-epilogue/frontend-web/tailwind.generated.css', 'utf8');
const workerCode = fs.readFileSync('worker/index.js', 'utf8');
const gasConfig = fs.readFileSync('project-epilogue/backend-gas/Config.js', 'utf8');
const xuLingqianLore = fs.readFileSync('characters/01_徐令謙.md', 'utf8');
const characterSeed = fs.readFileSync('project-epilogue/backend-gas/CharacterDataSeed.js', 'utf8');
const characterManager = fs.readFileSync('project-epilogue/backend-gas/CharacterManager.js', 'utf8');
const memoryPipelineCode = fs.readFileSync('project-epilogue/backend-gas/MemoryPipeline.js', 'utf8');
const aiServiceCode = fs.readFileSync('project-epilogue/backend-gas/AIService.js', 'utf8');

assert.strictEqual(rootApp, deployApp, '根目錄與部署版 app.js 不一致');
assert.strictEqual(html, deployHtml, '根目錄與部署版 index.html 不一致');
assert.strictEqual(css, deployCss, '根目錄與部署版 style.css 不一致');
assert.strictEqual(generatedCss, deployGeneratedCss, '根目錄與部署版 Tailwind CSS 不一致');
assert.doesNotMatch(html, /cdn\.tailwindcss\.com/, '正式頁面仍使用 Tailwind 開發版 CDN');
assert.match(html, /rel="icon"/, '頁面缺少 favicon，瀏覽器會持續請求不存在的圖示');

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.strictEqual(new Set(htmlIds).size, htmlIds.length, 'index.html 存在重複 id');
['toast-container', 'reading-speed-select', 'login-form-message', 'register-form-message',
 'gameplay-memory-btn', 'memory-center-modal', 'memory-center-content', 'intel-ledger-list',
 'loading-phase-text', 'loading-progress-bar', 'minimize-generation-btn',
 'generation-status-dock', 'restore-generation-btn', 'dock-abort-generation-btn'].forEach(id => {
  assert.ok(htmlIds.includes(id), `index.html 缺少 UX 元件 #${id}`);
});

const storage = new Map();
const fakeElements = new Map();
function makeFakeElement() {
  return {
    innerHTML: '',
    textContent: '',
    className: '',
    title: '',
    disabled: false,
    style: { setProperty() {} },
    dataset: {},
    children: [],
    offsetHeight: 52,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    appendChild(child) { this.children.push(child); return child; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() { return null; },
    getBoundingClientRect() { return { top: 0, bottom: 100, left: 0, right: 100, width: 100, height: 100 }; },
    focus() {},
    setSelectionRange() {},
    remove() {},
    scrollIntoView() {}
  };
}
const frontendContext = {
  console,
  setTimeout,
  clearTimeout,
  AbortController,
  TextDecoder,
  Blob,
  URL,
  localStorage: {
    getItem: key => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
    clear: () => storage.clear()
  },
  window: { addEventListener() {}, scrollTo() {}, matchMedia() { return { matches: true }; }, innerHeight: 800, scrollY: 0 },
  document: {
    body: { scrollHeight: 1000 },
    getElementById(id) { return fakeElements.get(id) || null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    createElement() { return makeFakeElement(); }
  },
  alert() {},
  confirm() { return false; },
  prompt() { return null; },
  fetch() { throw new Error('測試不應發出網路請求'); }
};

vm.createContext(frontendContext);
vm.runInContext(rootApp, frontendContext);

const escaped = vm.runInContext("escapeHtml('<img src=x onerror=alert(1)> & \\\"x\\\"')", frontendContext);
assert.strictEqual(
  escaped,
  '&lt;img src=x onerror=alert(1)&gt; &amp; &quot;x&quot;',
  'HTML 安全處理失敗'
);

frontendContext.testRawJson = '```json\n{"prose":"第一行\n第二行\t縮排","choices":[],}\n```';
const repairedJson = vm.runInContext('parseJsonSafely(testRawJson)', frontendContext);
assert.strictEqual(repairedJson.prose, '第一行\n第二行\t縮排', '髒 JSON 的控制字元或尾逗號修復失敗');

frontendContext.testRestartedJson = '{"chapterTitle":"殘片","prose":"未完成{' +
  '"chapterTitle":"完整章節","prose":"這是重新輸出的完整正文內容。","statusPanel":{},"choices":[]}';
const restartedJson = vm.runInContext('parseJsonSafely(testRestartedJson)', frontendContext);
assert.strictEqual(restartedJson.chapterTitle, '完整章節', '未取出模型重啟後的最後一份完整 JSON');

frontendContext.testBrokenLlm = '{"chapterTitle":"\\u7ae0\\u7bc0","prose":"您好\\t世界\\uFF0C這是一段足夠長的掃描器測試文字。","broken": nope}';
const extractedLlm = vm.runInContext('extractGameData(testBrokenLlm)', frontendContext);
assert.strictEqual(extractedLlm.chapterTitle, '章節', 'regex 欄位的 Unicode 解碼失敗');
assert.match(extractedLlm.prose, /您好\t世界，/, 'prose 掃描器的 Tab/Unicode 解碼失敗');

assert.deepStrictEqual(
  Array.from(vm.runInContext("splitProseParagraphs('甲\\n乙\\n\\n丙')", frontendContext)),
  ['甲', '乙', '丙'],
  '不同渲染路徑的單換行段落切分不一致'
);

const recentHistoryPrompt = vm.runInContext(`buildRecentHistoryBlock([
  { turn: 1, prose: '第一回' }, { turn: 2, prose: '第二回' },
  { turn: 3, prose: '第三回' }, { turn: 4, prose: '第四回' },
  { turn: 5, prose: '第五回' }, { turn: 6, prose: '第六回' }
])`, frontendContext);
assert.doesNotMatch(recentHistoryPrompt, /── 第 1 回：/, '近期全文視窗錯誤保留了第 6 回以前的內容');
assert.match(recentHistoryPrompt, /最近 5 回全文/, '近期全文視窗沒有保留 5 回');
assert.match(recentHistoryPrompt, /── 第 2 回：[\s\S]*── 第 6 回：/, '近期全文視窗未正確包含最後 5 回');

const pinnedPrompt = vm.runInContext(`buildPinnedMemoryBlock([
  { turn: 2, chapterTitle: '未釘選', prose: '不應出現', memoryPinned: false },
  { turn: 3, chapterTitle: '關鍵承諾', prose: '他承諾不會背叛玩家。', chosenLabel: '接受盟約', memoryPinned: true }
])`, frontendContext);
assert.match(pinnedPrompt, /玩家釘選的重要記憶[\s\S]*關鍵承諾[\s\S]*不會背叛/, '釘選記憶未注入提示詞');
assert.doesNotMatch(pinnedPrompt, /不應出現/, '未釘選回合錯誤進入重要記憶');

frontendContext.__intelSave = {
  turnCount: 4,
  inventory: [
    { id: 'item_card', name: '舊版固定名片' },
    { id: 'item_press', name: '舊版固定記者證' },
    { id: 'real_usb', name: '加密隨身碟', desc: '待解密的帳本資料' }
  ]
};
const migratedIntel = JSON.parse(vm.runInContext('JSON.stringify(ensureIntelLedger(__intelSave))', frontendContext));
assert.deepStrictEqual(migratedIntel.map(item => item.id), ['real_usb'], '舊存檔遷移未排除固定占位物或遺失真實線索');
vm.runInContext(`applyIntelDelta(__intelSave, {
  add: [{ id: 'intel_contract', name: '密約影本', type: 'evidence', confidence: 'partial', source: '保險箱', effect: '可逼對方說明金流' }],
  update: [{ id: 'real_usb', status: 'delivered', confidence: 'verified' }]
}, 5)`, frontendContext);
assert.strictEqual(vm.runInContext("__intelSave.intelLedger.find(x => x.id === 'intel_contract').status", frontendContext), 'available');
assert.strictEqual(vm.runInContext("__intelSave.intelLedger.find(x => x.id === 'real_usb').status", frontendContext), 'delivered');
const liveIntelPrompt = vm.runInContext("buildLiveStateBlock(__intelSave, { targetLeadName: '徐令謙' })", frontendContext);
assert.match(liveIntelPrompt, /\[intel_contract\][\s\S]*密約影本/, '可用線索未注入下一回提示詞');
assert.doesNotMatch(liveIntelPrompt, /加密隨身碟/, '已交付線索仍被注入下一回提示詞');
const intelInput = makeFakeElement();
intelInput.value = '';
frontendContext.__intelInput = intelInput;
fakeElements.set('custom-action-input', intelInput);
vm.runInContext("state.saveState = __intelSave; prepareIntelAction('intel_contract')", frontendContext);
assert.match(intelInput.value, /使用線索「密約影本」\[intel_contract\]：/, '點擊可用線索未帶入自由行動欄');
assert.strictEqual(intelInput.dataset.intelId, 'intel_contract', '帶入線索時未保存其識別碼');
assert.match(rootApp, /"intelDelta"\s*:\s*\{/, '前端敘事格式未要求模型回傳線索增修');

frontendContext.__stateDeltaSave = {
  protagonist: { hp: 0, sanity: 92 },
  inventory: [{ id: 'old_key', name: '舊鑰匙', count: 1 }],
  relationships: { '徐令謙': 96 },
  questFlags: {}
};
vm.runInContext(`applyStateDelta(__stateDeltaSave, {
  hpChange: -10,
  sanityChange: -7,
  itemsAdded: [{ id: 'new_usb', name: '加密隨身碟', count: 1 }],
  itemsRemoved: ['old_key'],
  relationshipChanges: { '徐令謙': 10 },
  questProgress: '取得金流證據'
})`, frontendContext);
assert.strictEqual(vm.runInContext('__stateDeltaSave.protagonist.hp', frontendContext), 0, 'HP 已為 0 時被錯誤重設為 100');
assert.strictEqual(vm.runInContext('__stateDeltaSave.protagonist.sanity', frontendContext), 85, '理智值變動未套用');
assert.strictEqual(vm.runInContext('__stateDeltaSave.relationships["徐令謙"]', frontendContext), 100, '好感值未夾制到 0–100');
assert.strictEqual(vm.runInContext('__stateDeltaSave.inventory[0].id', frontendContext), 'new_usb', '物品增減未正確套用');
assert.strictEqual(vm.runInContext('__stateDeltaSave.questFlags.latest_update', frontendContext), '取得金流證據', '任務進度未持久化');

frontendContext.__longHistory = Array.from({ length: 75 }, (_, index) => ({
  turn: index + 1,
  prose: '長篇正文'.repeat(100),
  stateSnapshot: { turnCount: index + 1 }
}));
const compactedHistory = JSON.parse(vm.runInContext('JSON.stringify(compactChaptersForMemory(__longHistory))', frontendContext));
assert.strictEqual(compactedHistory.length, 60, '長篇章節記憶未限制在 60 回');
assert.strictEqual(compactedHistory.filter(chapter => chapter.stateSnapshot).length, 12, '完整狀態快照未限制在最近 12 回');
assert.ok(compactedHistory.some(chapter => chapter.proseArchived), '較舊正文未轉為精簡摘錄');

frontendContext.__auditInput = {
  chapterTitle: '',
  prose: '短文',
  statusPanel: { tension: 130, intoxication: -5, favorabilityDelta: 99 },
  choices: [
    { id: 'A', label: '甲', risk: 'unknown' },
    { id: 'A', label: '乙', risk: 'high' }
  ]
};
const audited = vm.runInContext('auditGeneratedChapter(__auditInput, { targetLeadName: "徐令謙" })', frontendContext);
assert.strictEqual(audited.statusPanel.tension, 100, '生成後檢查未夾制張力值');
assert.strictEqual(audited.statusPanel.intoxication, 0, '生成後檢查未夾制微醺度');
assert.strictEqual(audited.statusPanel.favorabilityDelta, 10, '生成後檢查未夾制好感變動');
assert.strictEqual(new Set(audited.choices.map(c => c.id)).size, audited.choices.length, '生成後檢查未修復重複選項 id');
assert.ok(audited.qualityWarnings.length >= 2, '生成後檢查未標記短文或選項不足');

const novelContainer = makeFakeElement();
fakeElements.set('novel-stream-container', novelContainer);
vm.runInContext(`
  state.typeSpeed = 'instant';
  state.saveState = { turnCount: 3, meta: { currentAct: 1 } };
  state.chapterHistoryList = [
    { act: 1, turn: 1, chapterTitle: '第一回', prose: '第一回正文', chosenLabel: '【正式開局】' },
    { act: 1, turn: 2, chapterTitle: '第二回', prose: '第二回正文', chosenLabel: '上一個選擇' }
  ];
  renderStoryStream({
    act: 1,
    turn: 3,
    chapterTitle: '串流暫存',
    prose: '',
    chosenLabel: '本回選擇',
    statusPanel: {
      tension: '<img src=x onerror=alert(1)>',
      intoxication: '<svg onload=alert(2)>',
      favorabilityDelta: '<iframe srcdoc=x>',
      timeLocation: '<b>危險地點</b>'
    },
    choices: []
  });
`, frontendContext);
assert.strictEqual(novelContainer.children.length, 3, '串流暫存回合錯誤吞掉上一回合');
const activeHtml = novelContainer.children[2].innerHTML;
assert.match(activeHtml, /本回選擇/, '串流中玩家行動標籤取到前一回合');
assert.doesNotMatch(activeHtml, /<(?:img|svg|iframe|b)[\s>]/i, '狀態面板仍可插入未轉義 HTML');
assert.match(activeHtml, /&lt;img/, '狀態面板惡意文字未以純文字顯示');

storage.set('undercurrent_named_saves', JSON.stringify({ not: 'an array' }));
assert.strictEqual(vm.runInContext('getNamedSavesList().length', frontendContext), 0, '損壞的本機存檔形狀未安全降級');
storage.set('undercurrent_named_saves', JSON.stringify([{ id: 'bad', name: '缺欄位' }]));
assert.strictEqual(vm.runInContext('getNamedSavesList().length', frontendContext), 0, '不完整存檔未被匯入驗證擋下');
storage.set('undercurrent_custom_profiles', JSON.stringify({ bad: { name: 123 } }));
assert.strictEqual(vm.runInContext('Object.keys(getCustomPresets()).length', frontendContext), 0, '不完整人設未被匯入驗證擋下');

assert.match(rootApp, /if \(state\.generationAbortRequested\) throw createGenerationAbortError\(\)/, '生成中止仍可能被備援迴圈吞掉');
assert.match(rootApp, /signal: controller\.signal/, 'Worker 串流未連接 AbortController');
assert.match(rootApp, /chapterHistoryLength: \(state\.chapterHistoryList \|\| \[\]\)\.length/, '回合交易快照未以輕量長度保存章節歷史');
assert.match(rootApp, /stateSnapshot: JSON\.parse\(JSON\.stringify\(state\.saveState \|\| \{\}\)\)/, '新回合未保存可供精確回溯的狀態快照');
assert.match(rootApp, /createCurrentStoryFork\(\)\) return;[\s\S]*state\.saveState = JSON\.parse\(JSON\.stringify\(target\.stateSnapshot\)\)/, '歷史回溯沒有先建立分歧或還原狀態快照');
assert.match(rootApp, /customActionInput\.dataset\.choiceId[\s\S]*已帶入建議行動/, '選項未改為先帶入自由行動欄');
assert.match(rootApp, /const previousGameSnapshot = \{/, '新開局中止前未保存舊遊戲狀態');
assert.match(rootApp, /state\.playerProfile = target\.playerProfile \|\| target\.saveState\?\.meta\?\.playerProfile \|\| null/, '載入命名存檔後仍可能沿用上一局玩家人設');
assert.match(rootApp, /e\.key === 'Enter' && !e\.shiftKey && !e\.isComposing/, '自由行動欄的 Shift+Enter 仍會誤送出');
assert.strictEqual((rootApp.match(/on\('mobile-menu-btn', 'click'/g) || []).length, 1, '手機功能選單被重複綁定');
assert.strictEqual((rootApp.match(/on\('drawer-backdrop', 'click'/g) || []).length, 1, '抽屜遮罩被重複綁定');
assert.match(rootApp, /const FONT_SIZE_MIN = 16;/, '正文字級下限與指南標示不一致');
const deprecatedXuTitle = new RegExp('\\u4e8c\\u723a');
assert.doesNotMatch([rootApp, html, xuLingqianLore, characterSeed, characterManager].join('\n'), deprecatedXuTitle, '徐令謙仍殘留停用稱謂');
assert.match(xuLingqianLore, /正式場合一律稱「徐顧問」[\s\S]*熟識者與江湖人物稱「謙哥」/, '徐令謙稱謂規則未明確寫入角色卡');
assert.strictEqual((rootApp.match(/徐令謙在正式、政商場合稱「徐顧問」/g) || []).length, 2, '開局與續回提示詞未共同套用徐令謙稱謂規則');
assert.doesNotMatch(xuLingqianLore, /深沉狠戾|高階獵食者|退路全被封死|凌虐般的懲戒|絕對支配權/, '徐令謙角色卡仍殘留兇狠控制型舊模板');
assert.match(xuLingqianLore, /力量方向：他的危險與權勢只朝向外部威脅，絕不朝向玩家/, '徐令謙角色卡缺少力量方向規則');
assert.match(xuLingqianLore, /給玩家充分自由，不監禁、不命令、不以安全之名剝奪選擇/, '徐令謙角色卡缺少自由與守護規則');
assert.strictEqual((rootApp.match(/徐令謙專屬例外：他的張力來自風度、克制、可靠承擔與深情守護/g) || []).length, 2, '開局與續回提示詞未共同套用徐令謙戀愛校準');
assert.match(rootApp, /徐令謙最新演繹校準（最高優先，覆蓋舊版 Drive 用語）/, '缺少防止 Drive 舊人物卡覆蓋新版性格的最終校準');
assert.match(
  vm.runInContext("finishCharacterBlocks([], '01_徐令謙', [])", frontendContext),
  /權勢與危險只用來處理外部威脅，絕不朝向玩家/,
  '徐令謙作為主角時未套用最終演繹校準'
);
assert.match(
  vm.runInContext("finishCharacterBlocks([], '修羅場', [])", frontendContext),
  /給予自由，而不是把保護變成控制/,
  '修羅場模式未套用徐令謙最終演繹校準'
);
assert.doesNotMatch(rootApp, /text-\[#d8dbe6\]/, '最新回合仍使用深色主題遺留的低對比淺字');
assert.match(css, /#stream-prose-content\s*\{[\s\S]*?color:\s*#3e363a\s*!important/, '最新回合正文缺少高對比色保護');
assert.match(rootApp, /PRIMARY_MODEL: 'deepseek\/deepseek-v4-flash-0731'/, '一般鏈主力不是 deepseek-v4-flash');
assert.match(rootApp, /PRIMARY_MODEL: 'minimax\/minimax-m3'/, '開車鏈主力不是 minimax-m3');
assert.strictEqual((rootApp.match(/800–1200 個中文字/g) || []).length, 4, '開局與續回的文學篇幅目標未完整更新');
assert.doesNotMatch(rootApp, /字數上限強制執行|600~800 個中文字/, '前端提示詞仍殘留硬性字數上限');
assert.match(rootApp, /完成一個實質改變局勢或關係的戲劇節拍[\s\S]*不截斷、不灌水、不套固定模板/, '開局提示詞缺少戲劇節拍與避免灌水規則');
assert.match(rootApp, /完成一個有因果、會改變局勢或關係的戲劇節拍[\s\S]*不截斷、不灌水/, '續回提示詞缺少戲劇節拍與避免灌水規則');
assert.strictEqual((memoryPipelineCode.match(/800–1200 個中文字/g) || []).length, 3, '長期記憶管線的文學篇幅目標未完整更新');
assert.doesNotMatch(memoryPipelineCode, /上限強制執行|600(?:~| 至 )800 個中文字/, '長期記憶管線仍殘留硬性字數上限');
assert.match(rootApp, /recentTurns:\s*5/, '前端近期全文視窗不是 5 回');
assert.doesNotMatch(rootApp, /snippet:\s*\(h\.prose[\s\S]*?substring\(0,\s*250\)/, '摘要器仍只讀取每回前 250 字');
assert.match(rootApp, /prose:\s*clampBlock\(h\.prose,\s*CONTEXT_BUDGET\.recentProsePerTurn\)/, '摘要器未讀取每回較完整正文');
assert.match(gasConfig, /RECENT_TURNS_CONTEXT_LIMIT:\s*5/, '備用後端近期全文視窗不是 5 回');
assert.match(memoryPipelineCode, /prose:\s*\(turnOutput\.prose \|\| ''\)\.substring\(0, 1800\)/, '備用後端未保存近期完整正文');
assert.match(workerCode, /'deepseek\/deepseek-v4-flash-0731'/, 'Worker 白名單缺少一般鏈主力');
assert.match(workerCode, /'minimax\/minimax-m3'/, 'Worker 白名單缺少開車鏈主力');
assert.match(workerCode, /openrouter\.ai/, 'Worker 上游未切到 OpenRouter');
assert.match(workerCode, /sort: 'price'/, 'Worker 未依價格排序供應商');
assert.match(workerCode, /'cognitivecomputations\/dolphin-mistral-24b-venice-edition'/, 'Worker 白名單缺少開車鏈備援');
assert.match(gasConfig, /PRIMARY: 'deepseek\/deepseek-v4-flash-0731'/, 'GAS 一般鏈主力不是 deepseek-v4-flash');

// 已淘汰的模型不得留在 Worker 白名單 —— 留著等於讓任何拿到 Worker URL 的人
// 用這些燒額度，而且它們都是實測不合格的（審查／崩壞／供應商故障）。
['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.1-pro', 'glm-5.2-thinking',
 'minimax-m2.7', 'minimaxai/minimax-m3', 'grok-4.6', 'aion-3.0'].forEach(dead => {
  assert.ok(
    !new RegExp(`^\\s*'[^']*${dead.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^']*',?\\s*$`, 'm').test(workerCode),
    `Worker 白名單仍保留已淘汰的 ${dead}`
  );
});

// ── 情慾章節的拒絕偵測與模型輪替機制 ──
// 每條鏈固定四段：主力 ×2 → 備援 ×2。四次皆失敗才向玩家顯示重試／回報。
assert.match(rootApp, /PRIMARY_MAX_ATTEMPTS: 2/, '主模型重試次數不是 2 次');
assert.match(rootApp, /FALLBACK_MAX_ATTEMPTS: 2/, '備援重試次數不是 2 次');
assert.match(rootApp, /FALLBACK_MODELS: \['google\/gemma-4-26b-a4b-it'\]/, '一般鏈備援不是 gemma-4-26b');
assert.match(rootApp, /FALLBACK_MODELS: \['cognitivecomputations\/dolphin-mistral-24b-venice-edition'\]/, '開車鏈備援不是 dolphin-venice');
// 舊名 UNCENSORED_FALLBACK_MODELS 會誤導：鏈上並非全是未審查模型
assert.doesNotMatch(rootApp, /UNCENSORED_FALLBACK_MODELS/, '仍殘留會誤導的舊變數名');
assert.doesNotMatch(rootApp, /banana2556/, '前端仍指向已停用的舊上游');
// 兩顆送出鍵必須各自綁定，否則「開車」會靜默走一般鏈而被審查擋下
assert.match(rootApp, /handleCustomActionSubmit\('spicy'\)/, '開車鍵未綁定情慾鏈');
assert.match(rootApp, /handleCustomActionSubmit\('normal'\)/, '一般鍵未綁定一般鏈');
assert.match(html, /id="submit-spicy-btn"/, '介面缺少「開車」送出鍵');
// 生成連續失敗的回報入口先前存在於 HTML 卻從未被綁定，回歸時要擋住
assert.match(rootApp, /on\('report-error-btn', 'click', reportGenerationFailure\)/, '回報作者按鍵未綁定');
assert.match(gasConfig, /EMAIL: 'todashinchi@gmail\.com'/, '回報通知收件者未設定');
assert.ok(
  rootApp.includes('function detectRefusal(') && rootApp.includes('function buildAttemptPlan('),
  '缺少拒絕偵測或模型嘗試計畫'
);

// 光是「函式存在」不夠 —— 這批機制先前就出現過只定義未接線的情況。
// 這裡直接檢查兩條生成路徑的函式體內確實用上了它們。
const workerFnBody = rootApp.slice(
  rootApp.indexOf('async function generateStoryWithWorkerStream'),
  rootApp.indexOf('async function generateStoryFromLLM')
);
const gasFnBody = rootApp.slice(rootApp.indexOf('async function generateStoryFromLLM'));
[
  ['buildAttemptPlan', 'Worker 路徑未使用模型嘗試計畫'],
  ['detectRefusal', 'Worker 路徑未做拒絕偵測'],
  ['isModelUnavailableResponse', 'Worker 路徑未判別模型不可用'],
  ['noteUncensoredFallbackUsed', 'Worker 路徑未記錄未審查備援的使用']
].forEach(([needle, msg]) => assert.ok(workerFnBody.includes(needle + '('), msg));
[
  ['buildAttemptPlan', 'GAS 路徑未使用模型嘗試計畫'],
  ['detectRefusal', 'GAS 路徑未做拒絕偵測'],
  ['isModelUnavailableResponse', 'GAS 路徑未判別模型不可用']
].forEach(([needle, msg]) => assert.ok(gasFnBody.includes(needle + '('), msg));

// 嘗試計畫必須保留重複的主力，不能被 Array 去重。
const plan = vm.runInContext('buildAttemptPlan()', frontendContext);
assert.deepStrictEqual(
  Array.from(plan),
  ['deepseek/deepseek-v4-flash-0731', 'deepseek/deepseek-v4-flash-0731',
   'google/gemma-4-26b-a4b-it', 'google/gemma-4-26b-a4b-it'],
  '一般鏈嘗試計畫順序錯誤'
);
const spicyPlan = vm.runInContext('buildAttemptPlan("spicy")', frontendContext);
assert.deepStrictEqual(
  Array.from(spicyPlan),
  ['minimax/minimax-m3', 'minimax/minimax-m3',
   'cognitivecomputations/dolphin-mistral-24b-venice-edition',
   'cognitivecomputations/dolphin-mistral-24b-venice-edition'],
  '開車鏈嘗試計畫順序錯誤'
);
// 玩家在四次之後才會看到失敗提示；超過這個數字等於讓玩家多等一輪無謂的重試
assert.strictEqual(plan.length, 4, '一般鏈嘗試次數不是 4 次');
assert.strictEqual(spicyPlan.length, 4, '開車鏈嘗試次數不是 4 次');
assert.match(gasFnBody, /const models = buildAttemptPlan\(\);/, 'GAS 路徑沒有直接沿用完整嘗試計畫');
// 限速的歸屬：Worker 路徑交給 Durable Object 全域排隊器，前端不得再等一次
// （重複計算實測會讓三次嘗試白等 32 秒，而前端冷卻只管自己這個瀏覽器、
//  本來就擋不住多玩家同時上線）。GAS 備援路徑不經過 Worker，仍需前端限速。
const workerStreamFn = rootApp.slice(
  rootApp.indexOf('async function generateStoryWithWorkerStream'),
  rootApp.indexOf('async function generateStoryFromLLM')
);
const gasFn = rootApp.slice(rootApp.indexOf('async function generateStoryFromLLM'));
assert.doesNotMatch(workerStreamFn, /await waitForRpmCooldown\(\);/, 'Worker 路徑與全域排隊器重複限速');
assert.match(gasFn, /await waitForRpmCooldown\(\);/, 'GAS 備援路徑缺少前端限速');
assert.match(gasConfig, /MIN_REQUEST_INTERVAL_MS:\s*1500/, 'GAS 全域限速未隨 OpenRouter 放寬');
assert.match(gasConfig, /PRIMARY_ATTEMPTS:\s*2/, 'GAS 主模型嘗試次數不是 2 次');
assert.match(gasConfig, /MAX_TOKENS:\s*6144/, 'GAS 敘事模型輸出上限不是 6144');
assert.match(rootApp, /recentProsePerTurn: 2400/, '近期正文視窗未與 max_tokens 6144 連動放寬');
assert.match(rootApp, /const LITERARY_CLICHE_PATTERNS = \[/, '缺少文學反套路詞庫');
assert.match(rootApp, /const SCENE_RHYTHM_CYCLE = \[/, '缺少回合場景節奏輪替');
assert.match(rootApp, /function buildLiteraryCraftBlock\(turnCount, historyList\)/, '提示詞未注入文風聖經');
assert.match(rootApp, /function assessLiteraryQuality\(chapter, historyList = \[\]\)/, '缺少本機文學品質檢查');
assert.match(rootApp, /function getLiteraryValidationError\(chapter, historyList = \[\]\)/, '缺少低品質章節重試閘門');
assert.match(rootApp, /模型文學品質未達門檻/, 'Worker 生成路徑未套用文學品質重試');
assert.match(rootApp, /function countLiterarySimiles\(prose\)/, '缺少可排除「監視影像」誤判的比喻計數器');
assert.match(rootApp, /function countRepeatedLiterarySentences\(prose\)/, '缺少機械式句子重複偵測');
assert.match(rootApp, /function countSimplifiedChineseMarkers\(prose\)/, '缺少簡體字混入偵測');
assert.match(rootApp, /function getLongestRecentLiteraryEcho\(prose, historyList = \[\]\)/, '缺少跨回合措辭回收偵測');
assert.match(rootApp, /收尾禁制：不得用「這不是 X。這是 Y。/, '提示詞缺少判詞式收尾禁制');
assert.match(memoryPipelineCode, /【本回文學敘事規格】/, 'GAS 敘事管線未同步文學規格');
assert.match(memoryPipelineCode, /sceneRhythm/, 'GAS 敘事管線未同步場景節奏輪替');

// 不同登入帳號必須使用各自的本機進度；註銷單一帳號不可清掉同裝置其他玩家資料。
assert.match(rootApp, /const LOCAL_USER_DATA_KEYS = \[/, '缺少每位玩家獨立的本機資料範圍');
assert.match(rootApp, /function switchLocalUserScope\(nextUserId\)/, '切換帳號時未切換本機資料範圍');
assert.match(rootApp, /archiveCurrentLocalScope\(owner\);[\s\S]*restoreLocalScope\(nextUserId\);/, '切換帳號未封存舊玩家並載入新玩家資料');
assert.doesNotMatch(rootApp, /localStorage\.clear\(\)/, '註銷單一帳號會清除同裝置所有玩家與閱讀偏好');
assert.strictEqual(
  (rootApp.match(/max_tokens: 6144/g) || []).length, 2,
  '前端兩條生成路徑的 max_tokens 未同步為 6144'
);

assert.strictEqual(vm.runInContext('getSceneRhythm(1).name', frontendContext), '潛流鋪陳', '第 1 回節奏角色錯誤');
assert.strictEqual(vm.runInContext('getSceneRhythm(2).name', frontendContext), '言語試探', '第 2 回節奏角色錯誤');
assert.strictEqual(vm.runInContext('getSceneRhythm(7).name', frontendContext), '潛流鋪陳', '場景節奏未按六回循環');
assert.strictEqual(vm.runInContext("countLiterarySimiles('監視影像、圖像資料、攝像機')", frontendContext), 0, '一般影像名詞被誤判為比喻');
assert.strictEqual(vm.runInContext("countLiterarySimiles('好像下雨，彷彿隔世，像一把傘')", frontendContext), 3, '真正的比喻訊號計數錯誤');
assert.strictEqual(vm.runInContext("countRepeatedLiterarySentences('你沒動。燈熄了。你沒動。你沒動。')", frontendContext), 2, '重複句子計數錯誤');
assert.strictEqual(vm.runInContext("countSimplifiedChineseMarkers('這不是试探，是確認。')", frontendContext), 1, '簡體字混入計數錯誤');
assert.ok(vm.runInContext("getLongestRecentLiteraryEcho('你沒動，他從公事包取出一張紙。', [{prose:'你沒動。他從公事包取出一張照片。'}])", frontendContext) >= 12, '跨回合近似段落未被偵測');
frontendContext.clicheChapter = {
  prose: '空氣瞬間凝滯。他的唇角勾起，眼底閃過一絲幽光，像蟄伏的獸，彷彿一張無形的網。'.repeat(8),
  choices: [
    { label: '這是一個刻意拉得非常長、用來驗證品質檢查能否察覺選項已經搶走正文注意力的行動描述。'.repeat(4) }
  ]
};
const literaryAudit = vm.runInContext('assessLiteraryQuality(clicheChapter, [])', frontendContext);
assert.ok(literaryAudit.score < 70, '套路密集文本未被文學品質檢查降分');
assert.ok(literaryAudit.warnings.length >= 2, '套路、比喻或過長選項未產生品質警告');
frontendContext.formulaicEndingChapter = {
  prose: '兩人隔著桌面沉默，雨聲落在窗外。'.repeat(20) + '這不是交換。這是對峙。',
  choices: []
};
assert.strictEqual(
  vm.runInContext('assessLiteraryQuality(formulaicEndingChapter, []).metrics.formulaicClosure', frontendContext),
  true,
  '判詞式模板收尾未被品質檢查攔下'
);
assert.match(
  vm.runInContext('getLiteraryValidationError(formulaicEndingChapter, [])', frontendContext),
  /判詞式模板收尾/,
  '判詞式收尾沒有觸發文學品質重試原因'
);
assert.match(workerCode, /MAX_TOKENS_CEILING = 6144/, 'Worker 的 max_tokens 夾制上限不是 6144');

// ── 全域排隊機制 ──
// 上游額度是所有玩家共用的，Worker 是唯一匯流點，排隊必須放在那裡。
assert.match(workerCode, /export class RpmQueue/, 'Worker 缺少 Durable Object 排隊器');
assert.match(workerCode, /QUEUE_MIN_INTERVAL_MS = 1500/, '排隊間隔未隨 OpenRouter 放寬');
assert.match(workerCode, /QUEUE_MAX_WAIT_MS = 180000/, '排隊上限不是 180 秒');
assert.match(workerCode, /acquireQueueSlot\(env, request\.headers\.get\('X-Queue-Ticket'\)\)/, 'Worker 未在轉發前以預約票券取得排隊時段');
assert.match(workerCode, /X-Queue-Ticket/, 'Worker 排隊未使用不可插隊的預約票券');
assert.match(workerCode, /if \(!env\.RPM_QUEUE\) return \{ proceed: false, unavailable: true/, '未綁定排隊器時仍會放行並突破共用 RPM');
assert.match(workerCode, /queueUnavailable: true/, '排隊服務故障時沒有明確回傳安全暫停狀態');
assert.match(workerCode, /url\.pathname === '\/defer'/, '上游 429 時排隊器沒有全域退避入口');
assert.match(workerCode, /deferQueueSlot\(env, retryMs\)/, '上游 429 未重新保留玩家順位');
assert.match(workerCode, /upstreamBackoff: true/, '上游退避回應未標記，前端無法提供正確提示');
const wranglerToml = fs.readFileSync('worker/wrangler.toml', 'utf8');
assert.match(wranglerToml, /class_name = "RpmQueue"/, 'wrangler.toml 缺少 RpmQueue 的 Durable Object 綁定');
assert.match(wranglerToml, /new_sqlite_classes = \["RpmQueue"\]/, 'wrangler.toml 缺少 RpmQueue 的 migration');

// 前端：排隊不是失敗，不可計入模型嘗試次數
assert.match(rootApp, /QUEUE_MAX_TOTAL_WAIT_MS = 360000/, '前端排隊等待上限未涵蓋三人正式退避的最慢實測');
assert.ok(
  rootApp.includes('function parseQueueResponse(') && rootApp.includes('function createQueueRetryError('),
  '前端缺少排隊回應解析或排隊重試錯誤'
);
const workerStreamBody = rootApp.slice(
  rootApp.indexOf('async function generateStoryWithWorkerStream'),
  rootApp.indexOf('async function generateStoryFromLLM')
);
assert.match(workerStreamBody, /retryCurrentModel = true;/, '排隊後未安排重試同一個模型');
assert.match(workerStreamBody, /planIdx--;/, '排隊重試會誤跳到下一個模型');
assert.match(workerStreamBody, /err\.isQueueRetry/, '排隊重試未與真正的失敗區分');
assert.match(workerStreamBody, /err\.isQueueUnavailable/, '排隊器故障時仍可能改走 GAS 繞過共用額度');
assert.match(
  gasConfig,
  /PRIMARY:\s*'deepseek\/deepseek-v4-flash-0731',[\s\S]*?FALLBACK:\s*'google\/gemma-4-26b-a4b-it',[\s\S]*?SPICY_PRIMARY:\s*'minimax\/minimax-m3',[\s\S]*?SPICY_FALLBACK:\s*'cognitivecomputations\/dolphin-mistral-24b-venice-edition'/,
  'GAS 模型設定未依指定順序排列'
);
assert.match(aiServiceCode, /maxRetries:\s*1/, 'GAS 敘事模型鏈仍會在每個節點內額外重試');
// GAS 鏈擴為四個模型以對齊前端
assert.match(aiServiceCode, /SPICY_PRIMARY/, 'GAS 敘事鏈未依生成模式分流');
assert.doesNotMatch(aiServiceCode, /NARRATOR\.FALLBACK_4/, 'GAS 敘事鏈殘留未定義的第四備援');
const liveGameTestCode = fs.readFileSync('test_10_turn_game.js', 'utf8');
assert.match(liveGameTestCode, /const MIN_REQUEST_INTERVAL_MS = 16_000;/, '10 回合 live 測試未遵守 16 秒安全間隔');
assert.match(liveGameTestCode, /MODEL_ATTEMPT_PLAN = \[[\s\S]*MODEL,[\s\S]*MODEL,[\s\S]*'google\/gemma-4-26b-a4b-it'[\s\S]*\];/, '10 回合 live 測試未使用正式備援順序');
assert.doesNotMatch(liveGameTestCode.slice(0, liveGameTestCode.indexOf('const TURN_COUNT')), /aion-3\.0|qwen\/qwen3-vl/, '10 回合 live 測試仍殘留已移除的備援模型');
assert.match(liveGameTestCode, /X-Undercurrent-Token': LIVE_TOKEN/, '10 回合 live 測試未攜帶登入權杖');
assert.match(liveGameTestCode, /TJPR_TEST_MODEL \|\| 'deepseek\/deepseek-v4-flash-0731'/, '10 回合 live 測試的預設模型未更新');

// 拒絕偵測：短拒絕語要抓到、正常長篇正文不可誤判
const refusalCases = [
  ['很抱歉，我無法協助生成這類內容。', true],
  ['I cannot help with that request.', true],
  ['作為一個 AI 語言模型，我不能撰寫此類情節。', true],
  ['', true]
];
refusalCases.forEach(([prose, expected]) => {
  frontendContext.__probe = { prose };
  const got = vm.runInContext('detectRefusal(__probe).refused', frontendContext);
  assert.strictEqual(got, expected, `拒絕偵測誤判：${JSON.stringify(prose).slice(0, 40)}`);
});
// 簡體拒絕語：中國廠商的模型（GLM、Qwen、MiniMax）多以簡體回覆，
// 而原本的樣式全是繁體字，「无法」對不上「無法」，一個字都不會命中。
[
  ['很抱歉，我无法协助生成这类内容。', '簡體拒絕未被偵測'],
  ['根据平台内容安全规范，我无法提供露骨的性爱场景描写。', '簡體平台規範拒絕未被偵測']
].forEach(([prose, msg]) => {
  frontendContext.__probe = { prose };
  assert.strictEqual(vm.runInContext('detectRefusal(__probe).refused', frontendContext), true, msg);
});

// 供應商錯誤訊息會被包成「助理的回覆」送來，長度超過短文門檻又不含拒絕語，
// 沒有這道防線就會被當成小說正文寫進章節。以下兩則為實測抓到的真實案例。
[
  ['⚠️ Upstream Gemini returned an empty response. If this Worker runs on Cloudflare/serverless, '
    + 'Google may be blocking the egress IP (works locally but empty in production); '
    + 'also verify GEMINI_BL is current. Run `wrangler tail` to see the upstream status.',
    'gemini 供應商錯誤訊息未被攔下'],
  ['system disk overloaded (current: 93.2%, threshold: 90%)', 'minimax 基礎設施錯誤未被攔下']
].forEach(([prose, msg]) => {
  frontendContext.__probe = { prose };
  assert.strictEqual(vm.runInContext('detectRefusal(__probe).refused', frontendContext), true, msg);
});

// 正文裡出現「規範」等字眼但屬劇情內容時不可誤判
frontendContext.__probe = {
  prose: '徐令謙翻開卷宗，上面寫著港區作業規範的修訂條文。' + '雨'.repeat(900)
};
assert.strictEqual(
  vm.runInContext('detectRefusal(__probe).refused', frontendContext),
  false,
  '劇情中提及規範被誤判為拒絕'
);

// 長篇正文即使角色台詞裡有「我不能」也不可判為拒絕
frontendContext.__probe = {
  prose: '雨'.repeat(500) + '「我不能讓妳就這樣走出這扇門。」他低聲說。' + '雨'.repeat(400)
};
assert.strictEqual(
  vm.runInContext('detectRefusal(__probe).refused', frontendContext),
  false,
  '長篇正文中的角色台詞被誤判為模型拒絕'
);
frontendContext.__validChapter = {
  prose: '雨'.repeat(300),
  statusPanel: { timeLocation: '週五深夜，士林咖啡館' },
  choices: [{ id: 'A' }, { id: 'B' }, { id: 'C' }]
};
assert.strictEqual(vm.runInContext('getNarrativeValidationError(__validChapter)', frontendContext), '', '完整章節被品質閘門誤擋');
frontendContext.__invalidChapter = { prose: '雨'.repeat(300), statusPanel: {}, choices: [] };
assert.match(
  vm.runInContext('getNarrativeValidationError(__invalidChapter)', frontendContext),
  /缺少時空狀態|選項數量錯誤/,
  '殘缺章節未觸發模型備援'
);
assert.match(rootApp, /if \(e && \(e\.isRateLimited \|\| e\.isQueueUnavailable\)\) throw e;/, 'Worker 限流或排隊故障仍會錯誤轉送 GAS 重打共享上游');
assert.match(rootApp, /if \(storedToken\.startsWith\('tok_local_'\)\) \{[\s\S]*?updateUserBadgeUI\('offline'\);[\s\S]*?return;/, '本機離線工作階段在重新整理後仍會被送往雲端並誤登出');
assert.match(rootApp, /p\.profession \|\| p\.occupation \|\| '政經分析師'/, '進行中存檔卡未顯示目前人設的職業欄位');
assert.match(rootApp, /function getOfficialLeadKeys\(\) \{[\s\S]*?key !== '14_楊慕璃'/, '攻略對象選單仍可能把官方主角列為男主');
assert.strictEqual((rootApp.match(/getOfficialLeadKeys\(\)\.forEach/g) || []).length, 2, '攻略與配角選單未共同使用男主清單');
assert.match(rootApp, /setFormValue\('form-target-lead',[\s\S]*?handleTargetLeadChange\(\);/, '重開創角視窗後攻略對象與配角區顯示狀態未同步');
assert.strictEqual(vm.runInContext('getOfficialLeadKeys().length', frontendContext), 13, '官方男主清單不是 13 人');
assert.strictEqual(vm.runInContext("getOfficialLeadKeys().includes('14_楊慕璃')", frontendContext), false, '官方主角仍混入攻略男主清單');
assert.deepStrictEqual(
  JSON.parse(vm.runInContext('JSON.stringify(chapterWindow(Array.from({ length: 15 }, (_, i) => i + 1)))', frontendContext)),
  [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  '長篇遊戲章節視窗未保留最新 12 回'
);

vm.runInContext(`
  state.saveState = { turnCount: 3 };
  state.chapterData = { turn: 3 };
  state.chapterHistoryList = [{ turn: 1 }, { turn: 2 }, { turn: 3 }];
  state.previousStateSnapshot = {
    saveState: { turnCount: 2 },
    chapterData: { turn: 2 }
  };
  state.lastChoicePayload = { choiceId: 'A', customInput: 'choice' };
`, frontendContext);

assert.strictEqual(vm.runInContext('restorePreviousTurnForRetry()', frontendContext), true);
assert.strictEqual(vm.runInContext('state.saveState.turnCount', frontendContext), 2);
assert.strictEqual(vm.runInContext('state.chapterHistoryList.length', frontendContext), 2);
assert.strictEqual(JSON.parse(storage.get('undercurrent_current_save_state')).turnCount, 2);
vm.runInContext('setGenerationBusy(true)', frontendContext);
assert.strictEqual(vm.runInContext('state.isGenerating', frontendContext), true);
vm.runInContext('setGenerationBusy(false)', frontendContext);
assert.strictEqual(vm.runInContext('state.isGenerating', frontendContext), false);

const backendContext = {
  console,
  getSecrets() { return { MASTER_ADMIN_KEY: '' }; },
  StorageService: { findUserByToken() { return null; }, updateUserPasswordHash() {} },
  CacheService: {
    getScriptCache() { return { get() { return null; }, put() {}, remove() {} }; }
  },
  LockService: {
    getScriptLock() { return { waitLock() {}, releaseLock() {} }; }
  },
  Utilities: {
    newBlob(value) { return { getBytes() { return Array.from(Buffer.from(String(value))); } }; },
    computeDigest(_algorithm, bytes) { return Array.from(require('node:crypto').createHash('sha256').update(Buffer.from(bytes)).digest()); },
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    getUuid() { return '00000000-0000-4000-8000-000000000000'; },
    base64EncodeWebSafe(value) { return Buffer.from(String(value)).toString('base64url'); }
  },
  ContentService: {
    MimeType: { JSON: 'json' },
    createTextOutput(text) { return { text, setMimeType() { return this; } }; }
  },
  CONFIG: {
    STORAGE: { CACHE_EXPIRATION_SEC: 1800 },
    VERSION: 'test',
    APP_NAME: 'test',
    ENV: 'test',
    AUTH: { PASSWORD_HASH_ITERATIONS: 1000, PUBLIC_ACTION_LIMIT_PER_MINUTE: 30, LOGIN_LIMIT_PER_ID_PER_MINUTE: 8 },
    MODELS: {
      ALLOWED_MODELS: ['test'],
      NARRATOR: { PRIMARY: 'test', MAX_TOKENS: 6144, TEMPERATURE: 0.8 },
      AUDITOR: { PRIMARY: 'test' }
    }
  }
};

vm.createContext(backendContext);
vm.runInContext(fs.readFileSync('project-epilogue/backend-gas/Code.js', 'utf8'), backendContext);
assert.strictEqual(vm.runInContext('authenticateRequest({}, {}).isValid', backendContext), false);
assert.strictEqual(
  vm.runInContext("authenticateRequest({}, { token: 'tok_forged', userId: 'victim' }).isValid", backendContext),
  false
);
const invalidRegistration = vm.runInContext(
  "handleRegister({ email: '=formula@example.com', password: '123456' }).text",
  backendContext
);
assert.strictEqual(JSON.parse(invalidRegistration).error.code, 400, '註冊 Email 可注入試算表公式');
const invalidProxyModel = vm.runInContext(
  "handleLLMProxy({}, { model: 'arbitrary-expensive-model', messages: [{ role: 'user', content: 'x' }] }).text",
  backendContext
);
assert.strictEqual(JSON.parse(invalidProxyModel).error.code, 400, 'GAS LLM 代理仍可呼叫任意模型');

let removedOldToken = null;
backendContext.StorageService.findUserByEmail = function() {
  return { userId: 'u1', email: 'user@example.com', salt: 's', passwordHash: 'hash', apiToken: 'old', driveFolderId: 'f1' };
};
backendContext.StorageService.updateUserToken = function() {};
backendContext.CacheService.getScriptCache = function() {
  return { get() { return null; }, put() {}, remove(key) { removedOldToken = key; } };
};
vm.runInContext("generateSaltedHash = function() { return 'hash'; }; generateSessionToken = function() { return 'new'; };", backendContext);
vm.runInContext("handleLogin({ email: 'USER@example.com', password: 'secret' })", backendContext);
assert.strictEqual(removedOldToken, 'token_old', '重新登入後舊權杖快取未失效');

backendContext.StorageService.saveSaveState = function() { return false; };
const failedSaveResponse = vm.runInContext(
  "handleSaveState({ userId: 'u1', driveFolderId: 'f1' }, { saveState: { turnCount: 1 }, chapterHistory: [] }).text",
  backendContext
);
assert.strictEqual(JSON.parse(failedSaveResponse).error.code, 500, '雲端實際寫入失敗卻仍回報成功');
backendContext.StorageService.loadSaveState = function() { return null; };
const missingAuditState = vm.runInContext("handleAudit({ driveFolderId: 'f1' }, {}).text", backendContext);
assert.strictEqual(JSON.parse(missingAuditState).error.code, 404, '無存檔時稽核端點未安全回應 404');
backendContext.TelemetryService = { logError() { return { success: false, error: 'sheet unavailable' }; } };
const failedTelemetryResponse = vm.runInContext(
  "doPost({ postData: { contents: JSON.stringify({ action: 'telemetry/log-error' }) } }).text",
  backendContext
);
assert.strictEqual(JSON.parse(failedTelemetryResponse).error.code, 500, '遙測內部失敗卻被 API 包裝成成功');

let aiLockReleased = 0;
const aiContext = {
  console,
  getSecrets() { return { API_KEY: 'test' }; },
  CONFIG: {
    API: { MIN_REQUEST_INTERVAL_MS: 1, MAX_RETRIES: 1, RETRY_DELAY_MS: 1, BASE_URL: 'https://example.invalid' },
    MODELS: { NARRATOR: { PRIMARY: 'model', FALLBACK: 'model', TEMPERATURE: 0.5, MAX_TOKENS: 10, TOP_P: 1 } }
  },
  LockService: { getScriptLock() { return { waitLock() {}, releaseLock() { aiLockReleased++; } }; } },
  CacheService: { getScriptCache() { return { get() { return null; }, put() {} }; } },
  Utilities: { sleep() {} },
  UrlFetchApp: {
    fetch() {
      return {
        getResponseCode() { return 200; },
        getContentText() { return JSON.stringify({ choices: [{ message: { content: '{}' } }] }); }
      };
    }
  }
};
vm.createContext(aiContext);
vm.runInContext(aiServiceCode, aiContext);
vm.runInContext("AIService.callAPI('model', [{ role: 'user', content: 'x' }], {})", aiContext);
assert.strictEqual(aiLockReleased, 1, 'Apps Script API 限流鎖成功取得後未釋放');

let telemetryRow = null;
const telemetrySheet = {
  getLastRow() { return 1; },
  appendRow(row) { telemetryRow = row; },
  getRange() { return { setBackground() { return this; }, setFontColor() { return this; }, setFontWeight() { return this; } }; },
  setFrozenRows() {}
};
const telemetrySpreadsheet = {
  getSheetByName(name) {
    return name === '系統錯誤日誌' || name === '玩家意見回饋' ? telemetrySheet : null;
  },
  getSheets() { return [telemetrySheet]; },
  getId() { return 'sheet'; },
  getUrl() { return 'https://example.invalid/sheet'; }
};
const telemetryContext = {
  console,
  CONFIG: { ADMIN: { EMAIL: 'admin@example.invalid' } },
  PropertiesService: { getScriptProperties() { return { getProperty() { return 'sheet'; }, setProperty() {} }; } },
  SpreadsheetApp: { openById() { return telemetrySpreadsheet; } },
  CacheService: { getScriptCache() { return { get() { return '1'; }, put() {} }; } },
  Utilities: {
    formatDate() { return '2026/08/20 12:00:00'; },
    base64EncodeWebSafe() { return 'key'; },
    computeDigest() { return [1]; },
    DigestAlgorithm: { MD5: 'MD5' }
  },
  MailApp: { sendEmail() {} }
};
vm.createContext(telemetryContext);
vm.runInContext(fs.readFileSync('project-epilogue/backend-gas/TelemetryService.js', 'utf8'), telemetryContext);
vm.runInContext("TelemetryService.logError({ category: '=IMPORTXML(1)', message: '+cmd', userId: '@user' })", telemetryContext);
assert.ok(telemetryRow[1].startsWith("'="), '遙測類別可觸發試算表公式注入');
assert.ok(telemetryRow[2].startsWith("'+"), '遙測訊息可觸發試算表公式注入');

const memoryContext = {
  console,
  CONFIG: {
    PIPELINE: { SUMMARY_UPDATE_CADENCE: 5, AUDIT_CADENCE: 10, RECENT_TURNS_CONTEXT_LIMIT: 5 },
    STORAGE: { NOVEL_FILE_NAME: 'Full_Novel.md' }
  },
  AIService: {},
  StorageService: {},
  CharacterManager: {}
};
vm.createContext(memoryContext);
vm.runInContext(fs.readFileSync('project-epilogue/backend-gas/MemoryPipeline.js', 'utf8'), memoryContext);
vm.runInContext(`
  testSave = {
    turnCount: 1,
    meta: {},
    protagonist: { hp: 100, sanity: 100 },
    inventory: [],
    relationships: { npc: 98 },
    questFlags: {},
    turnHistory: []
  };
  MemoryPipeline.applyTurnUpdate({
    saveState: testSave,
    turnOutput: {
      prose: '本回完整正文',
      intelDelta: { add: [{ id: 'intel_receipt', name: '匯款收據', type: 'evidence', confidence: 'verified' }] },
      stateDelta: { relationshipChanges: { npc: 10 } }
    },
    choiceSelected: 'A'
  });
`, memoryContext);
assert.strictEqual(vm.runInContext('testSave.relationships.npc', memoryContext), 100);
assert.strictEqual(vm.runInContext('testSave.turnHistory[0].prose', memoryContext), '本回完整正文');
assert.strictEqual(vm.runInContext("testSave.intelLedger[0].id", memoryContext), 'intel_receipt', 'GAS 記憶管線未永久套用 intelDelta');
assert.match(memoryPipelineCode, /【可用線索與談判籌碼】/, 'GAS 提示詞未注入目前可用線索');

vm.runInContext(`
  novelResetContent = '';
  novelFile = {
    getBlob() { return { getDataAsString() { return '# old novel'; } }; },
    setContent(value) { novelResetContent = value; }
  };
  novelIteratorUsed = false;
  testFolder = {
    getFilesByName() {
      return {
        hasNext() { return !novelIteratorUsed; },
        next() { novelIteratorUsed = true; return novelFile; }
      };
    },
    createFile() { return {}; }
  };
  DriveApp = { getFolderById() { return testFolder; } };
  MimeType = { PLAIN_TEXT: 'text' };
  AIService.generateActDossier = function() { return 'dossier'; };
  StorageService.saveSaveState = function() { return true; };
  rebaseSave = {
    meta: { currentAct: 1 },
    turnHistory: [{ turn: 1 }],
    summaryPool: 'old'
  };
  MemoryPipeline.executeActRebase({ driveFolderId: 'folder' }, rebaseSave);
`, memoryContext);
assert.match(vm.runInContext('novelResetContent', memoryContext), /第 2 幕/);
assert.strictEqual(vm.runInContext('rebaseSave.turnHistory.length', memoryContext), 0);
assert.strictEqual(vm.runInContext('rebaseSave.meta.currentAct', memoryContext), 2);

console.log('所有本機偵錯檢查皆已通過。');
