const assert = require('node:assert');
const fs = require('node:fs');
const vm = require('node:vm');

const rootApp = fs.readFileSync('app.js', 'utf8');
const deployApp = fs.readFileSync('project-epilogue/frontend-web/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const deployHtml = fs.readFileSync('project-epilogue/frontend-web/index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const deployCss = fs.readFileSync('project-epilogue/frontend-web/style.css', 'utf8');
const workerCode = fs.readFileSync('worker/index.js', 'utf8');
const gasConfig = fs.readFileSync('project-epilogue/backend-gas/Config.js', 'utf8');
const xuLingqianLore = fs.readFileSync('characters/01_徐令謙.md', 'utf8');
const characterSeed = fs.readFileSync('project-epilogue/backend-gas/CharacterDataSeed.js', 'utf8');
const characterManager = fs.readFileSync('project-epilogue/backend-gas/CharacterManager.js', 'utf8');

assert.strictEqual(rootApp, deployApp, '根目錄與部署版 app.js 不一致');
assert.strictEqual(html, deployHtml, '根目錄與部署版 index.html 不一致');
assert.strictEqual(css, deployCss, '根目錄與部署版 style.css 不一致');

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.strictEqual(new Set(htmlIds).size, htmlIds.length, 'index.html 存在重複 id');
['toast-container', 'reading-speed-select', 'login-form-message', 'register-form-message'].forEach(id => {
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

frontendContext.testBrokenLlm = '{"chapterTitle":"\\u7ae0\\u7bc0","prose":"您好\\t世界\\uFF0C這是一段足夠長的掃描器測試文字。","broken": nope}';
const extractedLlm = vm.runInContext('extractGameData(testBrokenLlm)', frontendContext);
assert.strictEqual(extractedLlm.chapterTitle, '章節', 'regex 欄位的 Unicode 解碼失敗');
assert.match(extractedLlm.prose, /您好\t世界，/, 'prose 掃描器的 Tab/Unicode 解碼失敗');

assert.deepStrictEqual(
  Array.from(vm.runInContext("splitProseParagraphs('甲\\n乙\\n\\n丙')", frontendContext)),
  ['甲', '乙', '丙'],
  '不同渲染路徑的單換行段落切分不一致'
);

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
assert.match(rootApp, /chapterHistoryList: JSON\.parse\(JSON\.stringify\(state\.chapterHistoryList \|\| \[\]\)\)/, '回合交易快照未包含章節歷史');
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
assert.match(rootApp, /PRIMARY_MODEL: 'deepseek-v4-pro'/, '前端主要敘事模型未切換為 DeepSeek V4 Pro');
assert.match(workerCode, /'deepseek-v4-pro'/, 'Worker 模型白名單缺少 DeepSeek V4 Pro');
assert.match(gasConfig, /PRIMARY: 'deepseek-v4-pro'/, 'GAS 主要敘事模型未切換為 DeepSeek V4 Pro');
assert.doesNotMatch(rootApp, /deepseek\/deepseek-v4-pro/, '前端仍殘留錯誤的 DeepSeek 模型 ID');
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
  StorageService: { findUserByToken() { return null; } },
  CacheService: {
    getScriptCache() { return { get() { return null; }, put() {} }; }
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
    MODELS: { NARRATOR: { PRIMARY: 'test' }, AUDITOR: { PRIMARY: 'test' } }
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
vm.runInContext(fs.readFileSync('project-epilogue/backend-gas/AIService.js', 'utf8'), aiContext);
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
    PIPELINE: { SUMMARY_UPDATE_CADENCE: 5, AUDIT_CADENCE: 10 },
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
    turnOutput: { stateDelta: { relationshipChanges: { npc: 10 } } },
    choiceSelected: 'A'
  });
`, memoryContext);
assert.strictEqual(vm.runInContext('testSave.relationships.npc', memoryContext), 100);

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
