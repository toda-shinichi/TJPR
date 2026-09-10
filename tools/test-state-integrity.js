const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const source = fs.readFileSync('app.js', 'utf8');
function setup() {
  const storage = new Map();
  const context = vm.createContext({
    console: { log() {}, warn() {}, error() {} }, crypto: webcrypto,
    AbortController, AbortSignal, TextDecoder, setTimeout, clearTimeout,
    localStorage: { getItem: k => storage.get(k) || null, setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) },
    window: { addEventListener() {} },
    document: { getElementById() { return null; }, querySelectorAll() { return []; } },
  });
  vm.runInContext(source, context);
  vm.runInContext(`
    state.token = 'epi_test'; state.userId = 'test';
    state.saveState = {turnCount: 5, summaryPool: 'old', meta: {}};
    state.chapterData = {turn: 5, prose: '原始正文', choices: []};
    state.chapterHistoryList = [{turn: 4, prose: '上一回', stateSnapshot: {turnCount: 4}}, state.chapterData];
    state.playerProfile = {name: '測試者'};
    notifyUser = () => {}; updateCloudSyncBadge = () => {};
  `, context);
  return { context, run: code => vm.runInContext(code, context), storage };
}
function deferred() { let resolve; const promise = new Promise(r => resolve = r); return { promise, resolve }; }
const tick = () => new Promise(r => setImmediate(r));
async function main() {
  for (const mutation of [
    "state.saveState = {...state.saveState, summaryPool: 'new save'}",
    "state.token = 'another-user'",
    "state.chapterHistoryList[0].prose = 'rewritten history'",
    "state.saveState.turnCount = 6",
    "state.saveState.summaryPool = 'new summary'",
  ]) {
    const {context, run} = setup(); const pending = deferred();
    context.fetch = () => pending.promise;
    run('syncStateToGoogleDriveCloud = () => {}');
    const work = run('triggerRollingSummaryUpdate(5)');
    run(mutation); const expected = run('state.saveState.summaryPool');
    pending.resolve(Response.json({ success: true, data: {content: '這是一份足夠長的新摘要，不能覆寫切換後或已改寫的故事。'} }));
    await work; assert.equal(run('state.saveState.summaryPool'), expected);
  }
  {
    const {context, run} = setup();
    context.fetch = async () => Response.json({success: true, data: {content: '這是一份足夠長且有效的摘要，必須保存到目前的故事進度中。'}});
    run('syncStateToGoogleDriveCloud = () => {}');
    await run('triggerRollingSummaryUpdate(5)');
    assert.match(run('state.saveState.summaryPool'), /有效的摘要/);
  }
  {
    const {context, run} = setup(); const pending = deferred(); const calls = [];
    context.fetch = async (_url, options) => { calls.push(JSON.parse(options.body)); return calls.length === 1 ? pending.promise : Response.json({success:true}); };
    const first = run('syncStateToGoogleDriveCloud(state.saveState, state.chapterData)');
    await tick();
    run('state.saveState.turnCount = 6');
    const second = run('syncStateToGoogleDriveCloud(state.saveState, state.chapterData)');
    await tick(); assert.equal(calls.length, 1, 'second cloud write must wait');
    assert.equal(calls[0].saveState.turnCount, 5, 'first payload must be immutable');
    pending.resolve(Response.json({success:true})); await Promise.all([first,second]);
    assert.equal(calls[1].saveState.turnCount, 6);
  }
  {
    const {run} = setup();
    run('showDialog = async () => true; persistNamedSavesList = () => false;');
    const before = run('JSON.stringify(state.saveState)');
    await run('rewindStoryToTurn(4)');
    assert.equal(run('JSON.stringify(state.saveState)'), before, 'failed backup must prevent rewind');
    assert.equal(run('state.chapterHistoryList.length'), 2);
  }
  {
    const {run} = setup();
    run(`
      setGenerationBusy = value => { state.isGenerating = value; };
      showLoading = hideLoading = minimizeGenerationOverlay = renderStoryStream = renderSaveState = () => {};
      getActivePlayerProfile = () => state.playerProfile;
      buildNextTurnPrompt = () => ({systemPrompt: '', userPrompt: ''});
      generateStoryFromLLM = async () => {throw new Error('network failure');};
      showErrorRecovery = message => {globalThis.failureMessage = message;};
    `);
    const before = run('JSON.stringify(state.saveState)');
    await run("makeChoice('A', '繼續調查')");
    assert.equal(run('JSON.stringify(state.saveState)'), before);
    assert.equal(run('state.chapterData.prose'), '原始正文');
    assert.equal(run('state.chapterHistoryList.length'), 2);
    assert.equal(run('state.isGenerating'), false);
    assert.match(run('failureMessage'), /進度未變更/);
    run('updateGameplayBreadcrumb = () => {}; handleUndoTurn()');
    assert.equal(run('state.chapterHistoryList.length'), 2, 'undo after failed generation must not remove a committed chapter');
  }
  {
    const {run} = setup();
    run(`
      setGenerationBusy = value => { state.isGenerating = value; };
      showLoading = hideLoading = minimizeGenerationOverlay = renderStoryStream = renderSaveState = updateGameplayBreadcrumb = switchView = warmLoreCache = () => {};
      buildFirstTurnPrompt = () => ({systemPrompt: '', userPrompt: ''});
      generateStoryFromLLM = async () => {throw new Error('opening failed');};
      showErrorRecovery = message => {globalThis.failureMessage = message;};
    `);
    const before = run('JSON.stringify(state.saveState)');
    await run("startNewGameWithProfile({name: '新玩家', targetLeadName: '徐令謙'})");
    assert.equal(run('JSON.stringify(state.saveState)'), before);
    assert.equal(run('state.chapterData.prose'), '原始正文');
    assert.equal(run('state.isGenerating'), false);
    assert.match(run('failureMessage'), /原進度已保留/);
  }
  {
    const {run} = setup();
    assert.match(run(`buildPinnedMemoryBlock([{turn: 1, memoryPinned: true, prose: 'short'}],
      {pinnedMemories: [{turn: 1, prose: '完整的釘選記憶包含關鍵承諾'}]})`), /關鍵承諾/);
  }
  {
    const {context, run} = setup(); let calls = 0;
    context.fetch = async () => { if (++calls === 1) throw new Error('offline'); return Response.json({success:true}); };
    await run('syncStateToGoogleDriveCloud()');
    await run('syncStateToGoogleDriveCloud()');
    assert.equal(calls, 2, 'failed cloud write must not poison the queue');
  }
  {
    const {context, run} = setup(); const pending = deferred(); let calls = 0;
    context.fetch = async () => { calls++; return pending.promise; };
    const first = run('syncStateToGoogleDriveCloud()'); await tick();
    const second = run('syncStateToGoogleDriveCloud()');
    run("state.token = 'changed-account'");
    pending.resolve(Response.json({success:true})); await Promise.all([first,second]);
    assert.equal(calls, 1, 'queued writes from a signed-out account must be dropped');
  }
  {
    const {context, run, storage} = setup(); const pending = deferred();
    context.pendingGeneration = pending.promise;
    run(`
      safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
      setGenerationBusy = value => {state.isGenerating = value;};
      showLoading = hideLoading = minimizeGenerationOverlay = renderStoryStream = renderSaveState = setLoadingPhase = updateGameplayBreadcrumb = dismissError = syncStateToGoogleDriveCloud = startServerCooldown = () => {};
      getActivePlayerProfile = () => state.playerProfile;
      buildNextTurnPrompt = () => ({systemPrompt: '', userPrompt: ''});
      generateStoryFromLLM = () => pendingGeneration;
      auditGeneratedChapter = chapter => chapter;
      applyChapterStateChanges = () => {state.saveState.protagonist = {hp: 75};};
    `);
    const work = run("makeChoice('A', '調查')");
    assert.equal(JSON.parse(storage.get('undercurrent_current_save_state')).turnCount, 5, 'pending draft must not advance persisted turn');
    pending.resolve({turn: 6, prose: '生成成功', choices: []}); await work;
    const committed = JSON.parse(storage.get('undercurrent_current_save_state'));
    assert.equal(committed.turnCount, 6);
    assert.equal(committed.protagonist.hp, 75, 'post-generation state delta must be persisted');
  }
  {
    const {context, run} = setup(); const pending = deferred();
    context.fetch = () => pending.promise;
    const work = run('loadStateFromCloud()');
    run("state.token = 'another-account'");
    pending.resolve(Response.json({success:true, data:{saveState:{turnCount:99}}}));
    await work; assert.equal(run('state.saveState.turnCount'), 5, 'stale cloud load must not cross accounts');
  }
  {
    const {context, run} = setup(); const timers = [];
    context.setTimeout = (_fn, ms) => {timers.push(ms); return timers.length;};
    context.clearTimeout = () => {};
    const chapter = {prose: '這是測試正文。', choices: []};
    context.fetch = async () => new Response('data: ' + JSON.stringify({choices:[{delta:{content:JSON.stringify(chapter)}}]}) + '\n\n');
    run('setLoadingPhase = () => {}; detectRefusal = () => ({refused:false}); getNarrativeValidationError = getLiteraryValidationError = () => "";');
    const result = await run('generateStoryWithWorkerStream("https://test", "", "")');
    assert.equal(result.prose, chapter.prose);
    assert.equal(timers[0], 120000, 'first byte needs its own timeout');
    assert.ok(timers.includes(25000), 'received data must switch to shorter stall timeout');
  }
  console.log('狀態完整性測試通過：過期摘要、正常摘要、依序同步、備份失敗、生成失敗。');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
