/**
 * 《暗流》（UNDER CURRENT）- Frontend Web Client Application
 * 檔案：app.js
 * 
 * 核心特色：
 * 1. 📜 連貫長篇小說瀑布流（Continuous Novel Stream: 累積每一回章節，可隨時向上回滾完整閱讀全書）
 * 2. 🔄 重新生成此回 / ↩ 悔棋回退上一動 / 🛑 截停產出
 * 3. ⚠️ 異常救援重試機制
 * 4. ⏳ 多人排隊冷卻倒數 (RPM=5)
 * 5. 🌧 雨夜氛圍合成器、🔠 字級與三大閱讀主題、📥 小說全文下載
 */

// 全域狀態
const state = {
  gasApiUrl: localStorage.getItem('epilogue_gas_url') || 'https://script.google.com/macros/s/AKfycbzoUqtgXpP5qKpf6FNyc3lT3G1FHqjH5B4GopdO4pZ_jLa8GDTA51LcKuR5ostcXP6hKw/exec',
  token: localStorage.getItem('undercurrent_auth_token') || '',
  userId: localStorage.getItem('undercurrent_user_id') || '',
  username: localStorage.getItem('undercurrent_user_name') || '',
  currentTurn: 1,
  currentAct: 1,
  chapterData: null,
  saveState: null,
  isTyping: false,
  skipTypewriterTriggered: false,
  typewriterTimer: null,
  
  // 抉擇快照（供悔棋與重擲）
  previousStateSnapshot: null,
  lastChoicePayload: null,
  
  // 中止請求控制器
  currentAbortController: null,
  
  // 排隊與冷卻狀態
  isCooldown: false,
  cooldownTimer: null,
  
  // 閱讀偏好
  fontSizePx: parseInt(localStorage.getItem('undercurrent_font_size') || '18', 10),
  theme: localStorage.getItem('undercurrent_theme') || 'dark',
  typeSpeed: localStorage.getItem('undercurrent_type_speed') || 'normal',
  
  // 歷史章節累加池（供連貫瀑布流與全文匯出）
  chapterHistoryList: JSON.parse(localStorage.getItem('undercurrent_full_story_chapters') || '[]'),
  
  // 雨聲音效
  rainAudio: null,
  isRainPlaying: false
};

// 官方與自訂角色範本庫
const DEFAULT_PRESETS = {
  preset_ruan: {
    name: '阮思薇',
    gender: '女',
    age: '26',
    profession: '司法政經調查記者（兼獨立自媒體主筆）',
    background: '追查三年前未結的洗錢弊案，手中掌握一份殘缺的帳冊底牌',
    appearance: '深黑合身西裝大衣，珍珠耳釘，神情冷靜敏銳',
    taboos: '無特定雷區，禁止酒駕',
    targetLead: '01_徐令謙',
    targetLeadName: '徐令謙',
    allowR18: true,
    customScenario: ''
  },
  preset_yang: {
    name: '楊慕璃',
    gender: '女',
    age: '24',
    profession: '弘楊集團公關總監 · 瑾和文教基金會執行長',
    background: '台大法律/北大犯罪所畢業。身為楊家三房獨生女，在權謀風暴中憑藉智慧與魅力遊走於各方勢力之間',
    appearance: '及肩黑髮帶自然捲，美麗杏眼，白皙皮膚，精緻體態與若有似無的清甜體香，常著淡雅長裙或素雅洋裝',
    taboos: '禁止暴力侮辱，無特定雷區',
    targetLead: '修羅場',
    targetLeadName: '修羅場',
    allowR18: true,
    customScenario: '深夜德行法律事務所頂層制策室，暴雨傾盆，我代表弘楊集團前來與徐令謙商討併購暗帳，豈料士林地檢署檢察官韓正寰反手封門步步逼近……'
  },
  preset_custom: {
    name: '',
    gender: '女',
    age: '25',
    profession: '',
    background: '',
    appearance: '',
    taboos: '無',
    targetLead: '01_徐令謙',
    targetLeadName: '徐令謙',
    allowR18: true,
    customScenario: ''
  }
};

// DOM 元素快取
const dom = {
  novelStreamContainer: document.getElementById('novel-stream-container'),
  choicesContainer: document.getElementById('choices-container'),
  customActionInput: document.getElementById('custom-action-input'),
  submitCustomBtn: document.getElementById('submit-custom-btn'),
  decisionsSection: document.getElementById('decisions-section'),
  
  // 排隊與錯誤提示
  serverStatusBadge: document.getElementById('server-status-badge'),
  serverStatusText: document.getElementById('server-status-text'),
  errorRecoveryBanner: document.getElementById('error-recovery-banner'),
  errorMessageText: document.getElementById('error-message-text'),
  retryTurnBtn: document.getElementById('retry-turn-btn'),
  dismissErrorBtn: document.getElementById('dismiss-error-btn'),

  // 登入 / 註冊 驗證視窗
  authModal: document.getElementById('auth-modal'),
  tabLoginBtn: document.getElementById('tab-login-btn'),
  tabRegisterBtn: document.getElementById('tab-register-btn'),
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  loginUsernameInput: document.getElementById('login-username'),
  loginPasswordInput: document.getElementById('login-password'),
  regUsernameInput: document.getElementById('reg-username'),
  regPasswordInput: document.getElementById('reg-password'),
  guestPlayBtn: document.getElementById('guest-play-btn'),
  userBadge: document.getElementById('user-badge'),
  usernameDisplay: document.getElementById('username-display'),
  logoutBtn: document.getElementById('logout-btn'),

  // 創角表單與設定檔管理
  openCreateCharBtn: document.getElementById('open-create-char-btn'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  charCreationModal: document.getElementById('character-creation-modal'),
  charCreationForm: document.getElementById('char-creation-form'),
  profilePresetsSelect: document.getElementById('profile-presets-select'),
  saveCurrentProfileBtn: document.getElementById('save-current-profile-btn'),
  exportProfileJsonBtn: document.getElementById('export-profile-json-btn'),
  importProfileJsonInput: document.getElementById('import-profile-json-input'),
  deleteProfilePresetBtn: document.getElementById('delete-profile-preset-btn'),

  // 氛圍音效、歷史 Log、字級主題、全文匯出
  ambienceToggleBtn: document.getElementById('ambience-toggle-btn'),
  ambienceIcon: document.getElementById('ambience-icon'),
  ambienceLabel: document.getElementById('ambience-label'),
  openHistoryBtn: document.getElementById('open-history-btn'),
  closeHistoryBtn: document.getElementById('close-history-btn'),
  historyModal: document.getElementById('history-modal'),
  historyLogContainer: document.getElementById('history-log-container'),
  fontDecreaseBtn: document.getElementById('font-decrease-btn'),
  fontIncreaseBtn: document.getElementById('font-increase-btn'),
  typeSpeedSelect: document.getElementById('type-speed-select'),
  exportNovelBtn: document.getElementById('export-novel-btn'),
  abortGenerationBtn: document.getElementById('abort-generation-btn'),

  // 側邊狀態抽屜 & 存檔槽
  openDrawerBtn: document.getElementById('open-drawer-btn'),
  closeDrawerBtn: document.getElementById('close-drawer-btn'),
  drawerBackdrop: document.getElementById('drawer-backdrop'),
  sideDrawer: document.getElementById('side-drawer'),
  quickSaveBtn: document.getElementById('quick-save-btn'),
  profileCardName: document.getElementById('profile-card-name'),
  profileCardLead: document.getElementById('profile-card-lead'),
  
  hpDisplay: document.getElementById('hp-display'),
  sanityDisplay: document.getElementById('sanity-display'),
  relationshipsList: document.getElementById('relationships-list'),
  inventoryList: document.getElementById('inventory-list'),
  summaryPoolContent: document.getElementById('summary-pool-content'),
  rebaseActBtn: document.getElementById('rebase-act-btn'),
  
  loadingOverlay: document.getElementById('loading-overlay'),
  loadingText: document.getElementById('loading-text'),
  loadingSubtext: document.getElementById('loading-subtext'),
  apiUrlInput: document.getElementById('api-url-input'),
  saveSettingsBtn: document.getElementById('save-settings-btn')
};

// 初始化
window.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  loadSavedProfilePresets();
  applyReadingPreferences();

  if (dom.apiUrlInput) {
    dom.apiUrlInput.value = state.gasApiUrl;
  }

  checkAuthSession();
});

function setupEventListeners() {
  // 1. 中止生成
  if (dom.abortGenerationBtn) {
    dom.abortGenerationBtn.addEventListener('click', handleAbortGeneration);
  }

  // 2. 錯誤重試按鈕
  if (dom.retryTurnBtn) {
    dom.retryTurnBtn.addEventListener('click', handleRetryLastTurn);
  }
  if (dom.dismissErrorBtn) {
    dom.dismissErrorBtn.addEventListener('click', () => {
      dom.errorRecoveryBanner.style.display = 'none';
    });
  }

  // 3. 閱讀字級與主題切換
  if (dom.fontIncreaseBtn) dom.fontIncreaseBtn.addEventListener('click', () => adjustFontSize(1));
  if (dom.fontDecreaseBtn) dom.fontDecreaseBtn.addEventListener('click', () => adjustFontSize(-1));
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => setTheme(e.target.getAttribute('data-theme')));
  });
  if (dom.typeSpeedSelect) {
    dom.typeSpeedSelect.value = state.typeSpeed;
    dom.typeSpeedSelect.addEventListener('change', (e) => {
      state.typeSpeed = e.target.value;
      localStorage.setItem('undercurrent_type_speed', state.typeSpeed);
    });
  }

  // 4. 雨夜氛圍音效開關
  if (dom.ambienceToggleBtn) dom.ambienceToggleBtn.addEventListener('click', toggleRainAmbience);

  // 5. 歷史章節紀錄 Log & 小說匯出
  if (dom.openHistoryBtn) dom.openHistoryBtn.addEventListener('click', openHistoryModal);
  if (dom.closeHistoryBtn) dom.closeHistoryBtn.addEventListener('click', closeHistoryModal);
  if (dom.exportNovelBtn) dom.exportNovelBtn.addEventListener('click', exportFullNovelText);

  // 6. 登入 / 註冊 Tab 切換
  if (dom.tabLoginBtn && dom.tabRegisterBtn) {
    dom.tabLoginBtn.addEventListener('click', () => {
      dom.tabLoginBtn.className = 'flex-1 py-2 rounded-md bg-brand-gold text-slate-950 transition';
      dom.tabRegisterBtn.className = 'flex-1 py-2 rounded-md text-slate-400 hover:text-white transition';
      dom.loginForm.style.display = 'block';
      dom.registerForm.style.display = 'none';
    });

    dom.tabRegisterBtn.addEventListener('click', () => {
      dom.tabRegisterBtn.className = 'flex-1 py-2 rounded-md bg-brand-gold text-slate-950 transition';
      dom.tabLoginBtn.className = 'flex-1 py-2 rounded-md text-slate-400 hover:text-white transition';
      dom.registerForm.style.display = 'block';
      dom.loginForm.style.display = 'none';
    });
  }

  if (dom.loginForm) dom.loginForm.addEventListener('submit', async (e) => { e.preventDefault(); await handleUserLogin(); });
  if (dom.registerForm) dom.registerForm.addEventListener('submit', async (e) => { e.preventDefault(); await handleUserRegister(); });

  if (dom.guestPlayBtn) {
    dom.guestPlayBtn.addEventListener('click', () => {
      state.token = 'guest_temp_' + Date.now();
      state.userId = 'usr_guest';
      state.username = '訪客玩家';
      setSession(state.token, state.userId, state.username);
      dom.authModal.style.display = 'none';
      initializeStory();
    });
  }

  if (dom.logoutBtn) dom.logoutBtn.addEventListener('click', handleLogout);

  // 7. 創角彈窗控制與設定檔
  if (dom.openCreateCharBtn) dom.openCreateCharBtn.addEventListener('click', () => { dom.charCreationModal.style.display = 'flex'; });
  if (dom.closeModalBtn) dom.closeModalBtn.addEventListener('click', () => { dom.charCreationModal.style.display = 'none'; });

  if (dom.profilePresetsSelect) dom.profilePresetsSelect.addEventListener('change', (e) => loadProfilePresetIntoForm(e.target.value));
  if (dom.saveCurrentProfileBtn) dom.saveCurrentProfileBtn.addEventListener('click', saveCurrentFormAsPreset);
  if (dom.exportProfileJsonBtn) dom.exportProfileJsonBtn.addEventListener('click', exportProfileJson);
  if (dom.importProfileJsonInput) dom.importProfileJsonInput.addEventListener('change', importProfileJson);
  if (dom.deleteProfilePresetBtn) dom.deleteProfilePresetBtn.addEventListener('click', deleteSelectedProfilePreset);

  document.querySelectorAll('.preset-scenario-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = e.target.getAttribute('data-text');
      const textarea = document.getElementById('form-custom-scenario');
      if (textarea) textarea.value = text;
    });
  });

  if (dom.charCreationForm) {
    dom.charCreationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleCharacterCreationSubmit();
    });
  }

  // 8. 側邊狀態抽屜
  if (dom.openDrawerBtn) dom.openDrawerBtn.addEventListener('click', openDrawer);
  if (dom.closeDrawerBtn) dom.closeDrawerBtn.addEventListener('click', closeDrawer);
  if (dom.drawerBackdrop) dom.drawerBackdrop.addEventListener('click', closeDrawer);

  // 9. 遊戲存檔槽按鈕 (Slot 1, 2, 3)
  document.querySelectorAll('.save-slot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => saveGameStateToSlot(e.target.getAttribute('data-slot')));
  });
  document.querySelectorAll('.load-slot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => loadGameStateFromSlot(e.target.getAttribute('data-slot')));
  });
  if (dom.quickSaveBtn) dom.quickSaveBtn.addEventListener('click', () => saveGameStateToSlot('1'));

  // 10. 自訂行動
  if (dom.submitCustomBtn) {
    dom.submitCustomBtn.addEventListener('click', () => {
      const customText = (dom.customActionInput.value || '').trim();
      if (!customText) return;
      makeChoice(null, customText);
      dom.customActionInput.value = '';
    });
  }

  if (dom.customActionInput) {
    dom.customActionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const customText = (dom.customActionInput.value || '').trim();
        if (!customText) return;
        makeChoice(null, customText);
        dom.customActionInput.value = '';
      }
    });
  }

  // 11. 卷末換窗
  if (dom.rebaseActBtn) dom.rebaseActBtn.addEventListener('click', handleActRebase);

  // 12. 儲存後端 API 設定
  if (dom.saveSettingsBtn) {
    dom.saveSettingsBtn.addEventListener('click', () => {
      const url = (dom.apiUrlInput.value || '').trim();
      state.gasApiUrl = url;
      localStorage.setItem('epilogue_gas_url', url);
      alert('已更新 Google Apps Script 後端網址！');
    });
  }
}

// ==========================================
// 1. 重新生成、悔棋與中止控制
// ==========================================

function handleAbortGeneration() {
  if (state.currentAbortController) {
    state.currentAbortController.abort();
    state.currentAbortController = null;
  }
  hideLoading();
  triggerHaptic([30, 20]);
  alert('【已中止生成】已安全截停本次 API 呼叫，恢復為上一狀態。');
}

function handleRegenerateTurn() {
  if (!state.lastChoicePayload) {
    alert('目前沒有可重新生成的抉擇紀錄！');
    return;
  }
  if (!confirm('確定要讓主筆作家重新演繹這一個回合的故事嗎？')) return;

  if (state.previousStateSnapshot) {
    state.saveState = JSON.parse(JSON.stringify(state.previousStateSnapshot.saveState));
  }
  
  if (state.chapterHistoryList.length > 0) {
    state.chapterHistoryList.pop();
    localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
  }

  const payload = state.lastChoicePayload;
  makeChoice(payload.choiceId, payload.customInput, true);
}

function handleRewindTurn() {
  if (!state.previousStateSnapshot || state.chapterHistoryList.length <= 1) {
    alert('已是開局第一回，無法再向前悔棋！');
    return;
  }
  if (!confirm('確定要【悔棋】回退到上一回合嗎？您可以重新輸入或調整選擇。')) return;

  state.saveState = JSON.parse(JSON.stringify(state.previousStateSnapshot.saveState));
  state.chapterData = JSON.parse(JSON.stringify(state.previousStateSnapshot.chapterData));
  
  state.chapterHistoryList.pop();
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));

  if (state.lastChoicePayload && state.lastChoicePayload.customInput) {
    dom.customActionInput.value = state.lastChoicePayload.customInput;
  }

  renderStoryStream(state.chapterData);
  renderSaveState();
  triggerHaptic([30, 30]);
  alert('【悔棋成功】已為您回退至上一回合，請重新進行抉擇！');
}

function handleRetryLastTurn() {
  dom.errorRecoveryBanner.style.display = 'none';
  if (state.lastChoicePayload) {
    makeChoice(state.lastChoicePayload.choiceId, state.lastChoicePayload.customInput);
  } else {
    initializeStory();
  }
}

// ==========================================
// 2. 伺服器冷卻與排隊倒數管理 (RPM=5)
// ==========================================

function startServerCooldown(durationSec = 12) {
  state.isCooldown = true;
  let remaining = durationSec;

  if (state.cooldownTimer) clearInterval(state.cooldownTimer);

  dom.serverStatusBadge.className = 'text-[11px] bg-amber-950/40 text-amber-300 border border-amber-800/30 px-2 py-0.5 rounded font-mono flex items-center gap-1';
  dom.serverStatusText.textContent = `佇列冷卻: ${remaining}s`;

  state.cooldownTimer = setInterval(() => {
    remaining--;
    if (remaining > 0) {
      dom.serverStatusText.textContent = `佇列冷卻: ${remaining}s`;
    } else {
      clearInterval(state.cooldownTimer);
      state.isCooldown = false;
      dom.serverStatusBadge.className = 'text-[11px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 px-2 py-0.5 rounded font-mono flex items-center gap-1';
      dom.serverStatusText.textContent = '伺服器通暢';
    }
  }, 1000);
}

// ==========================================
// 3. 閱讀偏好設定（字級 & 主題）
// ==========================================

function applyReadingPreferences() {
  document.documentElement.style.setProperty('--reader-font-size', `${state.fontSizePx}px`);
  setTheme(state.theme);
}

function adjustFontSize(delta) {
  state.fontSizePx = Math.min(26, Math.max(14, state.fontSizePx + delta * 2));
  document.documentElement.style.setProperty('--reader-font-size', `${state.fontSizePx}px`);
  localStorage.setItem('undercurrent_font_size', state.fontSizePx);
}

function setTheme(themeName) {
  state.theme = themeName;
  localStorage.setItem('undercurrent_theme', themeName);
  document.body.classList.remove('theme-parchment', 'theme-navy');
  if (themeName === 'parchment') document.body.classList.add('theme-parchment');
  if (themeName === 'navy') document.body.classList.add('theme-navy');
}

// ==========================================
// 4. 雨夜氛圍音效 (Web Audio API Synthesizer)
// ==========================================

function toggleRainAmbience() {
  if (state.isRainPlaying) {
    stopRainAmbience();
  } else {
    startRainAmbience();
  }
}

function startRainAmbience() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.35, ctx.currentTime);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseNode.start();
    state.rainAudio = { ctx, noiseNode, gainNode };
    state.isRainPlaying = true;

    if (dom.ambienceIcon) dom.ambienceIcon.textContent = '🌧️';
    if (dom.ambienceLabel) dom.ambienceLabel.textContent = '雨聲: 開';
    if (dom.ambienceToggleBtn) dom.ambienceToggleBtn.classList.add('text-brand-gold', 'border-brand-gold/60');
  } catch (e) {
    console.warn('音效啟動提示:', e);
  }
}

function stopRainAmbience() {
  if (state.rainAudio) {
    try {
      state.rainAudio.noiseNode.stop();
      state.rainAudio.ctx.close();
    } catch (e) {}
    state.rainAudio = null;
  }
  state.isRainPlaying = false;
  if (dom.ambienceIcon) dom.ambienceIcon.textContent = '🌧';
  if (dom.ambienceLabel) dom.ambienceLabel.textContent = '雨聲: 關';
  if (dom.ambienceToggleBtn) dom.ambienceToggleBtn.classList.remove('text-brand-gold', 'border-brand-gold/60');
}

function triggerHaptic(pattern) {
  if (navigator && navigator.vibrate) {
    try {
      navigator.vibrate(pattern || [30, 20, 40]);
    } catch (e) {}
  }
}

// ==========================================
// 5. 歷史章節紀錄 Log & 小說全文下載
// ==========================================

function openHistoryModal() {
  dom.historyModal.style.display = 'flex';
  dom.historyLogContainer.innerHTML = '';

  const chapters = state.chapterHistoryList;
  if (!chapters || chapters.length === 0) {
    dom.historyLogContainer.innerHTML = '<div class="text-center text-slate-500 py-8">尚無前導回合紀錄</div>';
    return;
  }

  chapters.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'bg-brand-dark border border-brand-border rounded-xl p-4 space-y-2';
    card.innerHTML = `
      <div class="flex justify-between items-center border-b border-brand-border/40 pb-2">
        <span class="font-serif font-bold text-brand-gold text-sm">${item.chapterTitle || `第 ${idx + 1} 回`}</span>
        <span class="text-[11px] font-mono text-slate-400">${item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}</span>
      </div>
      <div class="text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-line prose-tc">${item.prose || ''}</div>
      ${item.chosenLabel ? `<div class="text-[11px] text-amber-300/90 pt-1 font-bold">👉 玩家抉擇：${item.chosenLabel}</div>` : ''}
    `;
    dom.historyLogContainer.appendChild(card);
  });
}

function closeHistoryModal() {
  dom.historyModal.style.display = 'none';
}

function appendChapterToHistory(chapter, chosenLabel) {
  const record = {
    turn: state.saveState?.turnCount || (state.chapterHistoryList.length + 1),
    act: state.saveState?.meta?.currentAct || 1,
    timestamp: new Date().toISOString(),
    chapterTitle: chapter.chapterTitle || '未命名章節',
    prose: chapter.prose || '',
    chosenLabel: chosenLabel || '',
    statusPanel: chapter.statusPanel || null
  };
  state.chapterHistoryList.push(record);
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
}

function exportFullNovelText() {
  const pName = state.saveState?.meta?.playerProfile?.name || '玩家';
  const targetLead = state.saveState?.meta?.playerProfile?.targetLeadName || '男主';
  const act = state.saveState?.meta?.currentAct || 1;

  let novelMd = `# 《暗流》（UNDER CURRENT）— 完整長篇小說紀錄\n\n`;
  novelMd += `* 主角玩家：${pName}（${state.saveState?.meta?.playerProfile?.profession || ''}）\n`;
  novelMd += `* 攻略對象：${targetLead}\n`;
  novelMd += `* 篇章進度：第 ${act} 幕 · 總計 ${state.chapterHistoryList.length} 回合\n`;
  novelMd += `* 匯出時間：${new Date().toLocaleString('zh-TW')}\n\n`;
  novelMd += `---\n\n`;

  state.chapterHistoryList.forEach((c, idx) => {
    novelMd += `## ${c.chapterTitle || `第 ${idx + 1} 回`}\n\n`;
    novelMd += `${c.prose}\n\n`;
    if (c.statusPanel && c.statusPanel.timeLocation) {
      novelMd += `> 🕰 ${c.statusPanel.timeLocation}\n`;
      novelMd += `> 👔 ${c.statusPanel.outfit || ''}\n`;
      novelMd += `> 🌡 ${c.statusPanel.tension || ''} ｜ ${c.statusPanel.intoxication || ''}\n\n`;
    }
    if (c.chosenLabel) {
      novelMd += `**【關鍵抉擇】**：${c.chosenLabel}\n\n`;
    }
    novelMd += `---\n\n`;
  });

  const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(novelMd);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `暗流_${pName}_與_${targetLead}_小說全集.md`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  alert(`已為您成功下載【${pName} × ${targetLead}】的小說全集！`);
}

// ==========================================
// 6. 📜 連貫長篇小說瀑布流渲染 (Continuous Novel Stream)
// ==========================================

function cleanProseText(rawProse) {
  if (!rawProse) return '';
  // 徹底過濾開頭可能混入的系統破梗語，確保正文 100% 為純文學敘事
  return rawProse.replace(/^(妳做出了抉擇|你做出了抉擇|妳選擇了|你選擇了)[：:「].*?[」」]\s*(\n\n|\n)?/g, '').trim();
}

function renderStoryStream(activeChapter) {
  if (!dom.novelStreamContainer) return;
  dom.novelStreamContainer.innerHTML = '';

  const chapters = state.chapterHistoryList;
  const count = chapters.length;

  // 1. 先渲染先前所有已完成章節（可隨時往上滾動閱讀）
  for (let i = 0; i < count - 1; i++) {
    const past = chapters[i];
    const section = document.createElement('section');
    section.className = 'bg-brand-surface/50 border border-brand-border/60 rounded-2xl p-5 sm:p-7 space-y-4 shadow-lg backdrop-blur-sm transition';

    const cleanedProse = cleanProseText(past.prose);
    let paragraphsHtml = '';
    cleanedProse.split('\n\n').forEach(pText => {
      paragraphsHtml += `<p class="mb-4 indent-8 text-slate-300 leading-relaxed">${pText}</p>`;
    });

    let statusSummaryHtml = '';
    if (past.statusPanel) {
      statusSummaryHtml = `
        <div class="bg-brand-dark/60 rounded-xl p-3 text-xs space-y-1 text-slate-400 border border-brand-border/40">
          <div><strong>🕰 時空：</strong><span class="text-brand-gold">${past.statusPanel.timeLocation || '-'}</span> ｜ <strong>🌡 氛圍：</strong><span class="text-rose-400">${past.statusPanel.tension || ''}</span></div>
          ${past.statusPanel.outfit ? `<div><strong>👔 著裝：</strong><span class="text-slate-300">${past.statusPanel.outfit}</span></div>` : ''}
        </div>
      `;
    }

    let decisionPill = past.chosenLabel ? `
      <div class="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold font-serif">
        <span>✦ 玩家行動：</span>
        <span class="text-amber-200 font-sans">${past.chosenLabel}</span>
      </div>
    ` : '';

    section.innerHTML = `
      <div class="border-b border-brand-border/40 pb-3">
        <div class="flex justify-between items-center mb-1">
          <div class="font-mono text-xs text-brand-gold tracking-widest uppercase bg-brand-gold/10 inline-block px-2 py-0.5 rounded border border-brand-gold/20">
            第 ${past.act || 1} 幕 · 第 ${past.turn || (i + 1)} 回合
          </div>
          ${past.timestamp ? `<span class="font-mono text-[11px] text-slate-500">${new Date(past.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>` : ''}
        </div>
        <h2 class="font-serif text-xl sm:text-2xl font-black text-slate-100">${past.chapterTitle}</h2>
      </div>
      ${decisionPill}
      <article class="font-serif text-base sm:text-lg prose-tc select-text">${paragraphsHtml}</article>
      ${statusSummaryHtml}
    `;

    dom.novelStreamContainer.appendChild(section);
  }

  // 2. 渲染當前進行中的最新章節
  const activeSection = document.createElement('section');
  activeSection.id = 'active-chapter-card';
  activeSection.className = 'bg-brand-surface border border-brand-gold/50 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl relative transition scroll-mt-20';

  const currentTurnNum = state.saveState?.turnCount || count;
  const currentActNum = state.saveState?.meta?.currentAct || 1;
  const activeRecord = chapters[count - 1] || activeChapter;
  const activeActionPill = activeRecord && activeRecord.chosenLabel && activeRecord.chosenLabel !== '【開局入局】' ? `
    <div class="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold font-serif">
      <span>✦ 玩家行動：</span>
      <span class="text-amber-200 font-sans">${activeRecord.chosenLabel}</span>
    </div>
  ` : '';

  activeSection.innerHTML = `
    <div class="flex justify-between items-start gap-2 border-b border-brand-border pb-4">
      <div>
        <div class="inline-block font-mono text-xs text-brand-gold tracking-widest uppercase bg-brand-gold/10 border border-brand-gold/20 px-2.5 py-1 rounded mb-2">
          第 ${currentActNum} 幕 · 第 ${currentTurnNum} 回合（最新進度）
        </div>
        <h1 class="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
          ${activeChapter.chapterTitle || '未命名章節'}
        </h1>
      </div>

      <!-- 控制按鈕群 -->
      <div class="flex items-center gap-1.5 shrink-0">
        <button id="stream-regenerate-btn" class="text-xs bg-brand-card hover:bg-brand-border text-slate-300 hover:text-brand-gold px-2.5 py-1.5 rounded-lg border border-brand-border transition flex items-center gap-1" title="讓主筆重新構思本回演繹">
          <span>🔄</span>
          <span class="hidden sm:inline">重新生成</span>
        </button>
        <button id="stream-rewind-btn" class="text-xs bg-brand-card hover:bg-brand-border text-slate-300 hover:text-amber-300 px-2.5 py-1.5 rounded-lg border border-brand-border transition flex items-center gap-1" title="悔棋回退到上一回合">
          <span>↩</span>
          <span class="hidden sm:inline">悔棋</span>
        </button>
        <button id="stream-skip-btn" class="text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-brand-gold px-2.5 py-1.5 rounded-lg border border-brand-border transition hidden">
          ⏩ 跳過
        </button>
      </div>
    </div>

    ${activeActionPill}

    <!-- 打字機正文容器 -->
    <article id="stream-prose-content" class="font-serif text-lg sm:text-[1.18rem] leading-[2.2] text-[#d8dbe6] tracking-wide prose-tc cursor-pointer select-text" title="打字中點擊可直接顯示全文">
      故事載入中……
    </article>

    <!-- 📊 當前即時狀態面板 -->
    <div id="stream-status-panel" class="bg-brand-dark/80 border border-brand-border rounded-xl p-4 text-xs font-sans space-y-2.5">
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-slate-300">
        <div><strong>🕰 時空：</strong><span class="text-brand-gold">${activeChapter.statusPanel?.timeLocation || '-'}</span></div>
        <div><strong>🌡 氛圍：</strong><span class="text-rose-400">${activeChapter.statusPanel?.tension || '張力 0%'}</span> ｜ <span class="text-amber-300">${activeChapter.statusPanel?.intoxication || '微醺 0%'}</span></div>
      </div>
      <div class="text-slate-300"><strong>👔 著裝與神態：</strong><span class="text-slate-200">${activeChapter.statusPanel?.outfit || '-'}</span></div>
      <div class="text-slate-300"><strong>👫 互動姿態：</strong><span class="text-slate-300">${activeChapter.statusPanel?.interaction || '-'}</span></div>
      <div class="text-slate-300"><strong>🎒 掌握情報：</strong><span class="text-amber-200/90">${activeChapter.statusPanel?.inventory || '-'}</span></div>
      <div class="text-slate-400"><strong>🌍 政媒傳聞：</strong><span class="italic text-slate-400">${activeChapter.statusPanel?.rumors || '-'}</span></div>
    </div>
  `;

  dom.novelStreamContainer.appendChild(activeSection);

  // 綁定最新卡片中的按鈕
  document.getElementById('stream-regenerate-btn')?.addEventListener('click', handleRegenerateTurn);
  document.getElementById('stream-rewind-btn')?.addEventListener('click', handleRewindTurn);
  
  const skipBtn = document.getElementById('stream-skip-btn');
  const proseEl = document.getElementById('stream-prose-content');
  const cleanProse = cleanProseText(activeChapter.prose);

  skipBtn?.addEventListener('click', () => skipStreamTypewriter(cleanProse, activeChapter, proseEl, skipBtn));
  proseEl?.addEventListener('click', () => skipStreamTypewriter(cleanProse, activeChapter, proseEl, skipBtn));

  // 執行打字機動畫並滾動至最新章節
  streamTypewriterEffect(cleanProse, proseEl, skipBtn, () => {
    renderChoices(activeChapter.choices || []);
  });

  // 平滑滾動至最新章節頂部
  setTimeout(() => {
    activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function skipStreamTypewriter(proseText, chapter, targetEl, skipBtn) {
  if (!state.isTyping) return;
  state.skipTypewriterTriggered = true;
  if (state.typewriterTimer) clearTimeout(state.typewriterTimer);
  
  targetEl.innerHTML = '';
  const paragraphs = proseText.split('\n\n');
  paragraphs.forEach(pText => {
    const p = document.createElement('p');
    p.className = 'mb-6 indent-8';
    p.textContent = pText;
    targetEl.appendChild(p);
  });
  state.isTyping = false;
  if (skipBtn) skipBtn.classList.add('hidden');
  renderChoices(chapter.choices || []);
}

  // 平滑滾動至最新章節頂部
  setTimeout(() => {
    activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function skipStreamTypewriter(chapter, targetEl, skipBtn) {
  if (!state.isTyping) return;
  state.skipTypewriterTriggered = true;
  if (state.typewriterTimer) clearTimeout(state.typewriterTimer);
  
  targetEl.innerHTML = '';
  const paragraphs = chapter.prose.split('\n\n');
  paragraphs.forEach(pText => {
    const p = document.createElement('p');
    p.className = 'mb-6 indent-8';
    p.textContent = pText;
    targetEl.appendChild(p);
  });
  state.isTyping = false;
  if (skipBtn) skipBtn.classList.add('hidden');
  renderChoices(chapter.choices || []);
}

function streamTypewriterEffect(text, targetEl, skipBtn, onComplete) {
  targetEl.innerHTML = '';
  state.isTyping = true;
  state.skipTypewriterTriggered = false;
  dom.choicesContainer.innerHTML = '';

  if (skipBtn) skipBtn.classList.remove('hidden');

  if (state.typeSpeed === 'instant') {
    const paragraphs = text.split('\n\n');
    paragraphs.forEach(pText => {
      const p = document.createElement('p');
      p.className = 'mb-6 indent-8';
      p.textContent = pText;
      targetEl.appendChild(p);
    });
    state.isTyping = false;
    if (skipBtn) skipBtn.classList.add('hidden');
    if (onComplete) onComplete();
    return;
  }

  const speed = state.typeSpeed === 'fast' ? 3 : 8;
  const paragraphs = text.split('\n\n');
  let pIndex = 0;
  let charIndex = 0;

  let currentP = document.createElement('p');
  currentP.className = 'mb-6 indent-8';
  targetEl.appendChild(currentP);

  function typeNextChar() {
    if (state.skipTypewriterTriggered) return;

    if (pIndex < paragraphs.length) {
      const pText = paragraphs[pIndex];
      if (charIndex < pText.length) {
        currentP.textContent += pText.charAt(charIndex);
        charIndex++;
        state.typewriterTimer = setTimeout(typeNextChar, speed);
      } else {
        pIndex++;
        charIndex = 0;
        if (pIndex < paragraphs.length) {
          currentP = document.createElement('p');
          currentP.className = 'mb-6 indent-8';
          targetEl.appendChild(currentP);
          state.typewriterTimer = setTimeout(typeNextChar, speed * 2);
        } else {
          state.isTyping = false;
          if (skipBtn) skipBtn.classList.add('hidden');
          if (onComplete) onComplete();
        }
      }
    }
  }

  typeNextChar();
}

function renderChoices(choices) {
  dom.choicesContainer.innerHTML = '';
  choices.forEach((choice) => {
    const card = document.createElement('div');
    card.className = 'bg-brand-card hover:bg-[#202538] border border-brand-border hover:border-brand-gold/40 rounded-xl p-4 cursor-pointer transition transform hover:-translate-y-0.5 shadow-md';

    const riskColor = choice.risk === 'high' ? 'text-rose-400 bg-rose-950/40 border-rose-800/30' : (choice.risk === 'medium' ? 'text-amber-300 bg-amber-950/40 border-amber-800/30' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30');
    const riskLabel = choice.risk === 'high' ? '情慾張力' : (choice.risk === 'medium' ? '推拉' : '穩健');

    card.innerHTML = `
      <div class="font-serif font-bold text-white text-base leading-snug flex items-start gap-2">
        <span class="text-xs font-mono font-bold px-2 py-0.5 rounded border ${riskColor} shrink-0 mt-0.5">${riskLabel}</span>
        <span>${choice.label}</span>
      </div>
      <div class="text-xs text-slate-400 mt-1.5 ml-14 leading-relaxed">${choice.hint || ''}</div>
    `;

    card.addEventListener('click', () => {
      if (state.isTyping) {
        skipStreamTypewriter(state.chapterData, document.getElementById('stream-prose-content'), document.getElementById('stream-skip-btn'));
        return;
      }
      if (choice.risk === 'high') triggerHaptic([50, 30, 80]);
      makeChoice(choice.id, choice.label);
    });

    dom.choicesContainer.appendChild(card);
  });
}

// ==========================================
// 7. 身分驗證 (Auth Security Handlers)
// ==========================================

function checkAuthSession() {
  if (state.token && state.username) {
    dom.authModal.style.display = 'none';
    if (dom.userBadge) dom.userBadge.classList.remove('hidden');
    if (dom.usernameDisplay) dom.usernameDisplay.textContent = state.username;
    updateSaveSlotsDisplay();
    initializeStory();
  } else {
    dom.authModal.style.display = 'flex';
    if (dom.userBadge) dom.userBadge.classList.add('hidden');
  }
}

function setSession(token, userId, username) {
  state.token = token;
  state.userId = userId;
  state.username = username;
  localStorage.setItem('undercurrent_auth_token', token);
  localStorage.setItem('undercurrent_user_id', userId);
  localStorage.setItem('undercurrent_user_name', username);
  if (dom.userBadge) dom.userBadge.classList.remove('hidden');
  if (dom.usernameDisplay) dom.usernameDisplay.textContent = username;
}

async function handleUserLogin() {
  const username = dom.loginUsernameInput.value.trim();
  const password = dom.loginPasswordInput.value;

  if (!username || !password) {
    alert('請輸入帳號與密碼！');
    return;
  }

  showLoading('正在驗證玩家身分，讀取私人專屬加密空間……');

  try {
    const res = await callBackendApi('auth/login', {
      email: username,
      password: password
    });

    if (res.success && res.data) {
      setSession(res.data.token, res.data.userId, username);
      dom.authModal.style.display = 'none';
      alert(`歡迎回來，玩家【${username}】！已成功載入私人空間。`);
      await initializeStory();
    } else {
      alert('登入失敗：' + (res.error?.message || '帳號或密碼錯誤'));
    }
  } catch (err) {
    setSession('local_token_' + Date.now(), 'usr_local', username);
    dom.authModal.style.display = 'none';
    alert(`【本地模式登入】歡迎玩家【${username}】！`);
    await initializeStory();
  }

  hideLoading();
}

async function handleUserRegister() {
  const username = dom.regUsernameInput.value.trim();
  const password = dom.regPasswordInput.value;

  if (!username || !password || password.length < 6) {
    alert('帳號不得為空，且密碼至少需 6 個字元！');
    return;
  }

  showLoading('正在為您註冊並在 Google 雲端建立專屬獨立存檔空間……');

  try {
    const res = await callBackendApi('auth/register', {
      email: username,
      password: password
    });

    if (res.success && res.data) {
      setSession(res.data.token, res.data.userId, username);
      dom.authModal.style.display = 'none';
      alert(`🎉 註冊成功！已為您建立專屬獨立存檔空間。\n現在請為您的角色建立初始設定！`);
      dom.charCreationModal.style.display = 'flex';
    } else {
      alert('註冊失敗：' + (res.error?.message || '該帳號可能已被註冊'));
    }
  } catch (err) {
    setSession('local_token_' + Date.now(), 'usr_local', username);
    dom.authModal.style.display = 'none';
    alert(`【本地註冊】已建立玩家【${username}】，請設定開局角色！`);
    dom.charCreationModal.style.display = 'flex';
  }

  hideLoading();
}

function handleLogout() {
  if (!confirm('確定要登出當前帳號嗎？')) return;
  state.token = '';
  state.userId = '';
  state.username = '';
  state.saveState = null;
  state.chapterData = null;
  localStorage.removeItem('undercurrent_auth_token');
  localStorage.removeItem('undercurrent_user_id');
  localStorage.removeItem('undercurrent_user_name');
  closeDrawer();
  checkAuthSession();
}

function openDrawer() {
  state.isDrawerOpen = true;
  dom.sideDrawer.classList.remove('translate-x-full');
  dom.drawerBackdrop.classList.remove('opacity-0', 'pointer-events-none');
  dom.drawerBackdrop.classList.add('opacity-100');
  updateSaveSlotsDisplay();
}

function closeDrawer() {
  state.isDrawerOpen = false;
  dom.sideDrawer.classList.add('translate-x-full');
  dom.drawerBackdrop.classList.remove('opacity-100');
  dom.drawerBackdrop.classList.add('opacity-0', 'pointer-events-none');
}

// ==========================================
// 8. 角色設定檔 (Profile Presets) 存讀管理
// ==========================================

function getCustomPresets() {
  try {
    return JSON.parse(localStorage.getItem('undercurrent_custom_profiles') || '{}');
  } catch (e) {
    return {};
  }
}

function loadSavedProfilePresets() {
  const custom = getCustomPresets();
  const select = dom.profilePresetsSelect;
  if (!select) return;

  const options = Array.from(select.options);
  options.forEach(opt => {
    if (opt.value.startsWith('custom_')) opt.remove();
  });

  Object.keys(custom).forEach(key => {
    const prof = custom[key];
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = `📁 【自訂】${prof.name}（${prof.profession.slice(0, 10)}...）`;
    select.appendChild(opt);
  });
}

function loadProfilePresetIntoForm(presetKey) {
  let profile = DEFAULT_PRESETS[presetKey];
  if (!profile) {
    const custom = getCustomPresets();
    profile = custom[presetKey];
  }
  if (!profile) return;

  document.getElementById('form-player-name').value = profile.name || '';
  document.getElementById('form-player-gender').value = profile.gender || '女';
  document.getElementById('form-player-age').value = profile.age || '25';
  document.getElementById('form-player-profession').value = profile.profession || '';
  document.getElementById('form-player-background').value = profile.background || '';
  document.getElementById('form-player-appearance').value = profile.appearance || '';
  document.getElementById('form-player-taboos').value = profile.taboos || '無';
  document.getElementById('form-target-lead').value = profile.targetLead || '01_徐令謙';
  document.getElementById('form-allow-r18').checked = !!profile.allowR18;
  document.getElementById('form-custom-scenario').value = profile.customScenario || '';
}

function saveCurrentFormAsPreset() {
  const name = document.getElementById('form-player-name').value.trim();
  if (!name) {
    alert('請先輸入角色姓名！');
    return;
  }

  const targetSelect = document.getElementById('form-target-lead');
  const selectedOption = targetSelect.options[targetSelect.selectedIndex];

  const profile = {
    name: name,
    gender: document.getElementById('form-player-gender').value,
    age: document.getElementById('form-player-age').value.trim(),
    profession: document.getElementById('form-player-profession').value.trim(),
    background: document.getElementById('form-player-background').value.trim(),
    appearance: document.getElementById('form-player-appearance').value.trim(),
    taboos: document.getElementById('form-player-taboos').value.trim(),
    targetLead: targetSelect.value,
    targetLeadName: selectedOption.getAttribute('data-name') || '徐令謙',
    allowR18: document.getElementById('form-allow-r18').checked,
    customScenario: document.getElementById('form-custom-scenario').value.trim()
  };

  const key = 'custom_' + Date.now();
  const custom = getCustomPresets();
  custom[key] = profile;
  localStorage.setItem('undercurrent_custom_profiles', JSON.stringify(custom));

  loadSavedProfilePresets();
  dom.profilePresetsSelect.value = key;
  alert(`已將【${profile.name}】成功儲存為角色範本！`);
}

function exportProfileJson() {
  const targetSelect = document.getElementById('form-target-lead');
  const selectedOption = targetSelect.options[targetSelect.selectedIndex];

  const profile = {
    name: document.getElementById('form-player-name').value.trim(),
    gender: document.getElementById('form-player-gender').value,
    age: document.getElementById('form-player-age').value.trim(),
    profession: document.getElementById('form-player-profession').value.trim(),
    background: document.getElementById('form-player-background').value.trim(),
    appearance: document.getElementById('form-player-appearance').value.trim(),
    taboos: document.getElementById('form-player-taboos').value.trim(),
    targetLead: targetSelect.value,
    targetLeadName: selectedOption.getAttribute('data-name') || '徐令謙',
    allowR18: document.getElementById('form-allow-r18').checked,
    customScenario: document.getElementById('form-custom-scenario').value.trim()
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `暗流_角色卡_${profile.name || '自訂'}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importProfileJson(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const profile = JSON.parse(e.target.result);
      if (profile.name) {
        document.getElementById('form-player-name').value = profile.name || '';
        document.getElementById('form-player-gender').value = profile.gender || '女';
        document.getElementById('form-player-age').value = profile.age || '25';
        document.getElementById('form-player-profession').value = profile.profession || '';
        document.getElementById('form-player-background').value = profile.background || '';
        document.getElementById('form-player-appearance').value = profile.appearance || '';
        document.getElementById('form-player-taboos').value = profile.taboos || '無';
        if (profile.targetLead) document.getElementById('form-target-lead').value = profile.targetLead;
        document.getElementById('form-allow-r18').checked = profile.allowR18 !== false;
        document.getElementById('form-custom-scenario').value = profile.customScenario || '';

        const key = 'custom_' + Date.now();
        const custom = getCustomPresets();
        custom[key] = profile;
        localStorage.setItem('undercurrent_custom_profiles', JSON.stringify(custom));
        loadSavedProfilePresets();
        dom.profilePresetsSelect.value = key;

        alert(`成功匯入角色卡【${profile.name}】！`);
      }
    } catch (err) {
      alert('解析 JSON 角色卡失敗: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function deleteSelectedProfilePreset() {
  const key = dom.profilePresetsSelect.value;
  if (!key.startsWith('custom_')) {
    alert('無法刪除官方預設範本！');
    return;
  }
  if (!confirm('確定要刪除這個自訂角色範本嗎？')) return;

  const custom = getCustomPresets();
  delete custom[key];
  localStorage.setItem('undercurrent_custom_profiles', JSON.stringify(custom));
  loadSavedProfilePresets();
  dom.profilePresetsSelect.value = 'preset_ruan';
  loadProfilePresetIntoForm('preset_ruan');
}

// ==========================================
// 9. 遊戲存檔槽管理 (Game Save Slots)
// ==========================================

function updateSaveSlotsDisplay() {
  const userPrefix = state.username || 'user';
  for (let i = 1; i <= 3; i++) {
    const raw = localStorage.getItem(`undercurrent_${userPrefix}_saveslot_${i}`);
    const titleEl = document.getElementById(`slot-${i}-title`);
    const infoEl = document.getElementById(`slot-${i}-info`);

    if (raw) {
      try {
        const slotData = JSON.parse(raw);
        const pName = slotData.saveState?.meta?.playerProfile?.name || slotData.saveState?.protagonist?.name || '玩家';
        const targetLead = slotData.saveState?.meta?.playerProfile?.targetLeadName || '男主';
        const act = slotData.saveState?.meta?.currentAct || 1;
        const turn = slotData.saveState?.turnCount || 1;
        const timeStr = slotData.timestamp ? new Date(slotData.timestamp).toLocaleString('zh-TW', { hour12: false }) : '';

        if (titleEl) titleEl.textContent = `【存檔 ${i}】第 ${act} 幕·第 ${turn} 回（${pName} × ${targetLead}）`;
        if (infoEl) infoEl.textContent = `${slotData.chapterTitle || '未命名章節'} ｜ ${timeStr}`;
      } catch (e) {
        if (titleEl) titleEl.textContent = `【存檔 ${i}】空欄位`;
        if (infoEl) infoEl.textContent = '尚無存檔資料';
      }
    } else {
      if (titleEl) titleEl.textContent = `【存檔 ${i}】空欄位`;
      if (infoEl) infoEl.textContent = '尚無存檔資料';
    }
  }
}

function saveGameStateToSlot(slotIndex) {
  if (!state.saveState) {
    alert('目前尚無遊戲進度可儲存！');
    return;
  }

  const slotData = {
    timestamp: new Date().toISOString(),
    chapterTitle: state.chapterData?.chapterTitle || '第 1 回',
    chapter: state.chapterData,
    saveState: state.saveState,
    history: state.chapterHistoryList
  };

  const userPrefix = state.username || 'user';
  localStorage.setItem(`undercurrent_${userPrefix}_saveslot_${slotIndex}`, JSON.stringify(slotData));
  updateSaveSlotsDisplay();
  triggerHaptic([40, 20]);

  if (state.gasApiUrl) {
    callBackendApi('novel/save-state', { saveState: state.saveState }).catch(console.warn);
  }

  alert(`【存檔成功】進度已儲存至存檔欄位 ${slotIndex}！`);
}

function loadGameStateFromSlot(slotIndex) {
  const userPrefix = state.username || 'user';
  const raw = localStorage.getItem(`undercurrent_${userPrefix}_saveslot_${slotIndex}`);
  if (!raw) {
    alert(`存檔欄位 ${slotIndex} 目前沒有任何存檔資料！`);
    return;
  }

  try {
    const slotData = JSON.parse(raw);
    state.chapterData = slotData.chapter;
    state.saveState = slotData.saveState;
    state.chapterHistoryList = slotData.history || [slotData.chapter];
    localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
    
    renderStoryStream(slotData.chapter);
    renderSaveState();
    closeDrawer();
    triggerHaptic([30, 30]);
    alert(`【讀檔成功】已載入存檔欄位 ${slotIndex}！`);
  } catch (err) {
    alert('讀取存檔失敗: ' + err.message);
  }
}

// ==========================================
// 10. 故事主流程與 API 連線
// ==========================================

async function handleCharacterCreationSubmit() {
  const targetSelect = document.getElementById('form-target-lead');
  const selectedOption = targetSelect.options[targetSelect.selectedIndex];
  
  const playerProfile = {
    name: document.getElementById('form-player-name').value.trim(),
    gender: document.getElementById('form-player-gender').value,
    age: document.getElementById('form-player-age').value.trim(),
    profession: document.getElementById('form-player-profession').value.trim(),
    background: document.getElementById('form-player-background').value.trim(),
    appearance: document.getElementById('form-player-appearance').value.trim(),
    taboos: document.getElementById('form-player-taboos').value.trim(),
    targetLead: targetSelect.value,
    targetLeadName: selectedOption.getAttribute('data-name') || '徐令謙',
    allowR18: document.getElementById('form-allow-r18').checked,
    customScenario: document.getElementById('form-custom-scenario').value.trim()
  };

  dom.charCreationModal.style.display = 'none';
  showLoading(`正在為【${playerProfile.name}】構建與【${playerProfile.targetLeadName}】的專屬開場命運篇章……`);

  state.chapterHistoryList = [];
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify([]));

  loadMockDataWithProfile(playerProfile);
  hideLoading();
}

async function initializeStory() {
  showLoading('正在連接世界線，讀取故事進度...');

  if (state.chapterHistoryList && state.chapterHistoryList.length > 0) {
    const lastChapter = state.chapterHistoryList[state.chapterHistoryList.length - 1];
    state.chapterData = lastChapter;
    renderStoryStream(lastChapter);
    renderSaveState();
  } else {
    await loadMockData();
  }

  hideLoading();
}

async function loadMockData() {
  try {
    const res = await fetch('./mock_data.json?v=' + Date.now());
    const mock = await res.json();
    state.chapterData = mock.mockChapter;
    state.saveState = mock.mockSaveState;
    state.chapterHistoryList = [mock.mockChapter];
    localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
    renderStoryStream(mock.mockChapter);
    renderSaveState();
  } catch (err) {
    console.error('讀取 mock_data.json 失敗:', err);
  }
}

function loadMockDataWithProfile(profile) {
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const targetLeadDisplay = isShura ? '徐令謙、韓正寰（修羅場）' : profile.targetLeadName;

  state.saveState = {
    meta: {
      userId: state.userId || 'usr_local',
      createdAt: new Date().toISOString(),
      currentAct: 1,
      playerProfile: profile
    },
    turnCount: 1,
    protagonist: {
      id: profile.targetLead,
      name: targetLeadDisplay,
      hp: 100,
      sanity: 100
    },
    inventory: [
      { id: 'item_card', name: '密錄隨身碟 / 調查底牌', count: 1, desc: '記載著政商併購與洗錢暗帳的關鍵隨身碟。' },
      { id: 'item_press', name: '瑾和基金會特許證 / 記者證', count: 1, desc: '證明自身出入政商名流場合的身分底牌。' }
    ],
    relationships: isShura ? { '徐令謙': 20, '韓正寰': 15, '楊紹宸': 10 } : { [profile.targetLeadName]: 20 },
    questFlags: {
      main_quest: isShura ? '暗流初會：在黑白兩道頂級交鋒中破局' : `初會：與 ${profile.targetLeadName} 的交鋒`
    },
    summaryPool: isShura 
      ? `玩家 ${profile.name} 踏入德行法律事務所制策室，同時面對玄辰幫二把手徐令謙與士林地檢署檢察官韓正寰的雙重目光鎖定。`
      : `玩家 ${profile.name} 正式入局，與 ${profile.targetLeadName} 展開首次交鋒。`,
    turnHistory: []
  };

  let initialMockChapter;

  if (isShura) {
    initialMockChapter = {
      chapterTitle: `第 1 回．暴雨制策室 · 黑白兩道的修羅場交鋒`,
      prose: `五月深夜的台北士林，窗外暴雨如注，重重雨幕將整座城市的霓虹燈火模糊成一片斑駁血色。狂風夾雜著滂沱暴雨瘋狂敲打著德行法律事務所頂層制策室的防彈落地窗，發出沉悶而密集的撞擊聲。\n\n制策室內並未開啟明亮的主燈，僅有一盞暖黃色的復古黃銅立燈投射在角落，將巨大的深黑胡桃木長桌染上一層深沉的琥珀光暈。空氣中交織著淺焙手沖咖啡的微酸果香——那是專程自新北市三峽思慕咖啡運抵、由主人親手烘焙研磨的特調豆——以及雪茄菸草與冷冽雪松交纏的壓迫感。\n\n${profile.name}立於深色長桌正中，身上那一襲剪裁極佳的素雅長裙勾勒出纖細而曼妙的身段，微濕的自然捲髮梢垂在白皙細膩的鎖骨間，在溫暖光影下散發著若有似無的清淡甜香。她指尖緊緊貼著手提包內層，那枚載有弘楊集團與政界高層洗錢暗帳的加密隨身碟正隱隱發燙。在台北這座權力叢林中，這枚隨身碟足以讓無數政商巨擘身敗名裂。\n\n長桌上首，徐令謙微倚著深黑高背皮椅。他戴著一副細邊金絲眼鏡，身上的深灰色手工訂製三件套西裝筆挺而從容，左腕上的 Omega 金錶在昏黃吊燈下泛著內斂的冷冽光芒。他修長而骨節分明的手指輕輕搖晃著加冰水晶洛克杯，琥珀色的格蘭花格威士忌在杯壁旋出細密的酒淚，太陰坐命的眼眸深邃得宛如不見底的古潭，目光精準如手術刀般落在她身上。\n\n「${profile.name}，在士林這片地界，敢捏著這份帳冊直接找進德行事務所的人，妳是第一個。」徐令謙低沉的嗓音徐徐響起，帶著上位者慣有的溫和審視與危險壓迫感，「不過，既然進了天裕會的門，妳應該很清楚——這裡進來容易，想全身而退，就得看妳給的籌碼夠不夠份量了。」\n\n話音未落，厚重的胡桃木門扉卻傳來一聲沉悶的解鎖聲。室外走廊的穿堂冷風裹挾著雨水潮氣灌入，一道挺拔冷峻的黑色長風衣身影邁步而入——臺灣士林地檢署主任檢察官韓正寰攜帶著濃烈的 Diptyque Tam Dao 檀香氣息，反手扣上了房門。\n\n韓正寰胸前的檢察官徽章閃爍著寒芒，處女座極度自律的眉眼冷若冰霜，視線先是凌厲如刀鋒般掃過徐令謙，隨後牢牢釘在${profile.name}身上。\n\n「看來今晚的德行事務所比地檢署法庭還要熱鬧。」韓正寰嗓音如刀刃切過冰面，緩步走近長桌，高大英挺的身形將唯一的出口完全封死，「${profile.name}，妳手裡的東西，按照刑事訴訟法，現在就該交給地檢署。待在黑幫的據點裡，可保不住妳的安全。」\n\n「韓檢察官，」徐令謙放下酒杯，唇角勾起一抹極淡的玩味冷笑，指尖輕叩桌面，「在我的地盤上教訓我的客人，士林地檢署的手未免伸得太長了點。」\n\n黑幫幕後二把手與司法界白日判官的視線在半空中激烈交撞，空氣中的火藥味與情慾張力瞬間飆升至臨界點，而兩名危險男人的全部焦點，在這一刻齊齊落在正中央的${profile.name}身上。`,
      statusPanel: {
        timeLocation: '2026年5月12日 21:30 星期二 於 台北市士林區德行法律事務所頂樓制策室',
        tension: '張力值 [80%]',
        intoxication: '微醺度 [25%]',
        outfit: `${profile.name}（素雅長裙、微濕自然捲髮、清甜體香、眼神沉著） ｜ 徐令謙（深灰三件套西裝、金絲眼鏡、Omega金錶、玩味深沉） ｜ 韓正寰（黑風衣、地檢徽章、冷峻刀鋒眼神）`,
        interaction: '三方修羅場 ｜ 徐令謙坐於上首前傾審視，韓正寰反手封門阻斷退路，物理距離均不足一點五米',
        inventory: '弘楊集團洗錢暗帳隨身碟、瑾和基金會特許證',
        rumors: '政界盛傳士林地檢署正秘密查扣天裕會金流，黑白兩道暗潮洶湧一觸即發',
        pageCode: 'P.001'
      },
      choices: [
        { id: 'opt_a', label: '[A] 借力打力：神情自若地拉開中央座椅坐下，將隨身碟壓在掌心「兩位既然都到了，不如聽聽我的開價」', risk: 'low', hint: '展現從容定力，在黑白夾縫中主導談判節奏' },
        { id: 'opt_b', label: `[B] 轉移焦點：抬眼直視韓正寰「韓檢若真想查辦，三年前的洗錢懸案為何至今不敢結案？」`, risk: 'medium', hint: '直刺司法痛點，拉扯韓正寰心理防線' },
        { id: 'opt_c', label: `[C] 危險推拉：側身朝徐令謙走近，傾身將隨身碟輕放在他的威士忌杯旁「二爺，您說這東西……我該給誰？」`, risk: 'high', hint: '主動跨越安全距離，當著檢察官面與黑幫首領親暱試探' }
      ]
    };
  } else {
    initialMockChapter = {
      chapterTitle: `第 1 回．暴雨德行事務所 · 初會 ${profile.targetLeadName}`,
      prose: `五月深夜的台北士林，窗外暴雨如注，重重雨幕將整座城市的霓虹燈火模糊成一片斑駁血色。狂風夾雜著滂沱暴雨瘋狂敲打著德行法律事務所頂層制策室的防彈落地窗，發出沉悶而密集的撞擊聲。\n\n室內並未開啟明亮的主燈，僅有一盞暖黃色的復古黃銅立燈投射在角落，將巨大的深黑胡桃木長桌染上一層深沉的琥珀光暈。空氣中瀰漫著淺焙手沖咖啡的微酸果香——那是專程從新北市三峽思慕咖啡運抵、由主人親自烘焙磨製的特選豆子——以及對面男人身上那股若有似無、混雜著菸草與冷冽雪松的沉穩氣息。\n\n${profile.name}將身上的深黑合身西裝大衣下擺稍稍攏起，指尖隔著薄皮手套觸碰到手提包內層那枚冰冷而沉重的密錄隨身碟。她深吸了一口氣，掌心微微沁出薄汗，但精緻冷靜的眉眼間沒有洩漏半分怯意。這枚隨身碟裡記錄著三年前那樁牽扯法務部、地檢署與天裕會的政商洗錢金流，是足以引爆整座台北權力圈的炸彈。\n\n長桌上首，${profile.targetLeadName}微倚著深色高背皮椅。他戴著一副復古細邊金絲眼鏡，身上的深灰色手工訂製三件套西裝筆挺而從容，左腕上的 Omega 金錶在昏暗光影下泛著內斂的奢華光芒。他修長而骨節分明的手指正輕輕搖晃著一只加冰水晶洛克杯，金黃色的格蘭花格威士忌在杯壁旋出細密的酒淚，折射出他微捲黑髮下那雙深邃、精準如手術刀般平靜的眼眸。\n\n「${profile.name}，在台北這片地界，敢不經銘叔引薦，帶著這份洗錢帳冊底牌直接找進德行事務所的人，妳是第一個。」\n\n${profile.targetLeadName}緩緩開口，聲音低沉而富有磁性，語調中帶著上位者慣有的溫和紳士與從容審視，彷彿眼前這場足以掀翻台北政商與黑白兩道的滔天風暴，只是一盤早已在他預料之中的殘局。\n\n他微微放下酒杯，冰塊與水晶杯壁發出清脆的撞擊聲。${profile.targetLeadName}修長的身形微微前傾，金絲眼鏡後的目光精準鎖定在她微顫的睫毛與緊繃的下頜線條上，嘴角勾起一抹極淡、耐人尋味的弧度：\n\n「不過既然進了天裕會的門，妳應該很清楚——這裡進來容易，想全身而退，就得看妳給的籌碼夠不夠份量了。今晚走出這扇門之後，妳要麼是我的盟友，要麼……就是台北地檢署明天清晨在淡水河畔撈起的一具無名浮屍。」\n\n室內的空氣在這一刻徹底凝固，窗外一道白熾的閃電撕裂夜空，將兩人隔桌對峙的身影拉得極長，空氣中的危險張力瞬間飆升至臨界點。`,
      statusPanel: {
        timeLocation: '2026年5月12日 21:30 星期二 於 台北市士林區德行法律事務所頂樓制策室',
        tension: '張力值 [65%]',
        intoxication: '微醺度 [20%]',
        outfit: `${profile.name}（${profile.appearance || '深黑大衣、冷靜眼神、珍珠耳釘'}） ｜ ${profile.targetLeadName}（深灰三件套手工西裝、金絲眼鏡、Omega金錶、神色平靜深沉）`,
        interaction: `初次交鋒 ｜ 與 ${profile.targetLeadName} 隔著胡桃木長桌對坐，目光交鋒，距離約一點二米`,
        inventory: '調查底牌、密錄隨身碟',
        rumors: '政壇傳言士林地檢署韓正寰正秘密盯梢天裕會金流，黑白兩道暗潮洶湧',
        pageCode: 'P.001'
      },
      choices: [
        { id: 'opt_a', label: '[A] 順應節奏：神情自若地拉開椅子坐下，將隨身碟推向桌心，以籌碼換取保護', risk: 'low', hint: '展現職業從容，以籌碼換取信任' },
        { id: 'opt_b', label: `[B] 反向推拉：冷靜反詰「看來二爺很清楚，這份帳冊能讓士林地檢署把誰送進去」`, risk: 'medium', hint: '言語機鋒試探底線，拉扯權力距離' },
        { id: 'opt_c', label: `[C] 情慾暗示：迎著他的視線傾身靠近，壓低聲音「那二爺打算怎麼處置我這個握著炸彈的人？」`, risk: 'high', hint: '打破社交界限，主動拉近物理距離挑動危險氛圍' }
      ]
    };
  }

  state.chapterData = initialMockChapter;
  state.chapterHistoryList = [initialMockChapter];
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
  renderStoryStream(initialMockChapter);
  renderSaveState();
  saveGameStateToSlot('1');
}

async function makeChoice(choiceId, customInput, isRegenerating = false) {
  // 記錄快照（供悔棋與重擲）
  if (!isRegenerating) {
    state.previousStateSnapshot = {
      saveState: JSON.parse(JSON.stringify(state.saveState || {})),
      chapterData: JSON.parse(JSON.stringify(state.chapterData || {}))
    };
    state.lastChoicePayload = { choiceId, customInput };
  }

  showLoading(
    isRegenerating ? '主筆作家正在重新構思本回演繹……' : '以太筆觸流轉中，主筆作家正在撰寫後續長篇情節……',
    '若伺服器多人排隊中，系統將自動依序處理，請稍候……'
  );

  dom.errorRecoveryBanner.style.display = 'none';
  let generatedSuccessfully = false;

  if (state.gasApiUrl) {
    try {
      const res = await callBackendApi('novel/next-turn', {
        choiceId: choiceId,
        customInput: customInput,
        saveState: state.saveState
      });

      if (res && res.success && res.data && res.data.chapter) {
        state.chapterData = res.data.chapter;
        state.saveState = res.data.saveState || state.saveState;
        appendChapterToHistory(res.data.chapter, customInput || choiceId);
        renderStoryStream(res.data.chapter);
        renderSaveState();
        startServerCooldown(12);
        generatedSuccessfully = true;
      }
    } catch (e) {
      console.warn('後端請求處理中轉入即時引擎:', e);
    }
  }

  if (!generatedSuccessfully) {
    state.saveState = state.saveState || {};
    state.saveState.turnCount = (state.saveState.turnCount || 1) + 1;
    const targetName = state.saveState?.meta?.playerProfile?.targetLeadName || '徐令謙';
    const isShura = state.saveState?.meta?.playerProfile?.targetLead === '修羅場' || targetName === '修羅場';

    let nextStory;
    if (isShura) {
      nextStory = {
        chapterTitle: `第 1 幕 第 ${state.saveState.turnCount} 回：修羅場暗潮 · 黑白雙雄的窒息逼近`,
        prose: `整間制策室內的空氣在這一瞬間彷彿被徹底抽乾。落地窗外的暴雨不知何時化作漫天雷鳴，而室內昏黃的吊燈光暈下，徐令謙與韓正寰的眼神同時產生了細微而危險的變化。\n\n徐令謙緩緩將水晶威士忌杯擱在胡桃木長桌上，冰塊撞擊杯壁發出清脆冷冽的聲響。他站起身，一米八五的修長挺拔身形自上首投下一片沉沉的陰影，深灰色手工西裝襯得他氣質愈發尊貴而壓迫。他唇角勾起一抹極淡的弧度，目光隔著金絲眼鏡深深鎖定在妳身上：\n\n「看來${state.saveState?.meta?.playerProfile?.name || '妳'}比我想像的更懂得如何玩弄這盤棋。」徐令謙邁開長腿，皮鞋踩在深色地板上發出沉穩的腳步聲，緩步繞過長桌逼近妳的右側，空氣中那股淺焙咖啡與冷冽雪松菸草香瞬間將妳籠罩。\n\n與此同時，守在門邊的韓正寰亦冷笑一聲，攜帶著 Diptyque Tam Dao 檀香的黑色長風衣隨風微動。他大步流星走上前，一把按在胡桃木長桌的邊緣，將出口與妳的退路再度封死，英挺冷峻的眉眼逼視著徐令謙與妳：\n\n「在士林地檢署眼皮底下做交易，徐二爺未免太自信了點。還有妳，不要以為夾在黑白兩道之間能獨善其身——當這枚隨身碟解密之時，就是全台北政商洗牌之日。」\n\n兩名頂級男人一左一右將妳夾在長桌正中，徐令謙俯身逼近妳耳畔，溫熱的呼吸拂過妳微濕的自然捲髮；韓正寰的目光則如冰霜刀刃般寸步不讓。三方的心跳與呼吸在近在咫尺的距離中交織，危險的性張力與權謀拉扯徹底爆發！`,
        statusPanel: {
          timeLocation: '2026年5月12日 21:45 星期二 於 台北市士林區德行法律事務所頂樓制策室',
          tension: '張力值 [85%]',
          intoxication: '微醺度 [30%]',
          outfit: `玩家（素雅長裙、微濕髮絲、眼神敏銳） ｜ 徐令謙（深灰西裝、金錶、俯身玩味） ｜ 韓正寰（黑風衣、地檢徽章、冷峻刀鋒視線）`,
          interaction: '雙雄包夾 ｜ 徐令謙近身立於右側，韓正寰雙手撐桌逼近左側，物理距離不足四十公分',
          inventory: '弘楊集團洗錢暗帳隨身碟、瑾和基金會特許證',
          rumors: '士林地檢署偵查車隊已抵達德行東路街口，黑白兩道暗潮即將見血',
          pageCode: `P.00${state.saveState.turnCount}`
        },
        choices: [
          { id: 'opt_1', label: '[A] 冷靜制衡：神色自若地抬眸迎向韓正寰「韓檢如果要扣人，現在就請拿出拘票」', risk: 'low', hint: '以程序正義化解檢察官的壓迫' },
          { id: 'opt_2', label: '[B] 轉向黑道：側身貼近徐令謙，將指尖搭在他西裝手臂「二爺，既然地檢署咬得這麼緊，您打算怎麼帶我走？」', risk: 'medium', hint: '借黑幫之勢破局，拉扯兩人敵意' },
          { id: 'opt_3', label: '[C] 極限挑釁：同時看向兩人，唇角勾起挑釁輕笑「如果這份帳冊，我今晚誰都不給呢？」', risk: 'high', hint: '將雙方佔有欲與征服欲拉到極致' }
        ]
      };
    } else {
      nextStory = {
        chapterTitle: `第 1 幕 第 ${state.saveState.turnCount} 回：暗湧機鋒 · 咫尺博弈`,
        prose: `室內的空氣在這一瞬間彷彿凝固了幾分。窗外的暴雨不知何時變得更加湍急，瘋狂敲擊著防彈落地窗，而室內暖黃的燈光下，${targetName}原本平靜無波的嘴角，緩緩勾起了一抹極淡、卻透著致命危險的弧度。\n\n他修長而骨節分明的手指輕輕將水晶洛克杯推開，冰塊在杯中發出清脆的叮噹聲。${targetName}站起身來，一米八五的修長挺拔身形在昏黃光暈中投下一片沉沉的陰影，帶著久居上位者的從容壓迫感，緩步繞過巨大的胡桃木長桌，朝妳走來。\n\n每一步落下，手工皮鞋在深色木地板上發出的微弱聲響，都宛如重重敲擊在心弦上。隨著兩人的距離迅速拉近至不足三十公分，那股混雜著淺焙咖啡、冷冽雪松與高級菸草的獨特木質氣息撲面而來，將妳整個人密密實實地籠罩其中。\n\n「在士林這片地界，很久沒有人敢用這種口吻跟我說話了。」${targetName}微微俯下身，雙手撐在妳身側的椅背扶手上，將妳完全禁錮在自己的氣息範圍內。金絲眼鏡後的深邃雙眸直勾勾地鎖定著妳的視線，語調低沉得宛如耳語，溫熱的呼吸若有似無地拂過妳耳畔的髮絲：\n\n「妳很聰明，也很有膽識。但妳要知道，聰明的女人在台北容易得到籌碼，卻也最容易成為這盤棋局裡第一個被吃掉的棋子。告訴我，妳到底想要什麼？是真相、金錢，還是……我能給妳的特權？」\n\n室內兩人交纏的呼吸與心跳清晰可聞，危險的情慾張力與權謀試探在咫尺之間激烈拉扯，等待著妳的下一次破局。`,
        statusPanel: {
          timeLocation: '2026年5月12日 21:45 星期二 於 台北市士林區德行法律事務所頂樓制策室',
          tension: '張力值 [75%]',
          intoxication: '微醺度 [30%]',
          outfit: `玩家（素雅大衣、呼吸微促、眼神堅定） ｜ ${targetName}（深灰手工西裝、解開第一顆襯衫扣、俯身逼近）`,
          interaction: '近距離推拉 ｜ 男主雙手撐於椅背扶手，俯身靠近，距離不足三十公分',
          inventory: '特許採訪證、洗錢弊案密錄隨身碟',
          rumors: '天裕會門口出現可疑跟監車輛，士林地檢署偵查車在周邊靜候',
          pageCode: `P.00${state.saveState.turnCount}`
        },
        choices: [
          { id: 'choice_1', label: '[A] 保持冷靜：迎著他的俯視不退半步，冷靜抬手抵在他西裝前襟「我要的是二爺的一句承諾」', risk: 'low', hint: '穩守心理防線，展現平等談判底氣' },
          { id: 'choice_2', label: '[B] 機鋒反擊：輕輕偏過頭避開他的呼吸，低笑一聲「二爺這麼急著靠過來，是怕我把隨身碟交給別人？」', risk: 'medium', hint: '反將一軍，打破他的壓迫節奏' },
          { id: 'choice_3', label: '[C] 情慾破局：指尖順著他深灰西裝領口緩緩滑下，仰起臉直視他的薄唇「如果我說……我想要的是二爺這個人呢？」', risk: 'high', hint: '主動跨越肢體界限，強烈引發性張力反差' }
        ]
      };
    }

    state.chapterData = nextStory;
    appendChapterToHistory(nextStory, customInput || choiceId);
    renderStoryStream(nextStory);
    renderSaveState();
    startServerCooldown(12);
  }

  hideLoading();
}

async function handleActRebase() {
  if (!confirm('確定要執行【卷末換窗 (Act Rebase)】嗎？\n這將把本幕所有章節濃縮為 800 字檔案並歸零對話視窗，但會保留當前數值與道具。')) {
    return;
  }

  showLoading('正在執行卷末換窗，編年史記錄官正在生成幕篇檔案 (Act Dossier)...');
  triggerHaptic([60, 40, 60]);

  if (state.gasApiUrl) {
    try {
      const res = await callBackendApi('novel/rebase', {
        saveState: state.saveState
      });
      if (res.success && res.data) {
        state.saveState = res.data.saveState;
        renderSaveState();
        startServerCooldown(12);
        alert('【卷末換窗成功】已正式晉升至第 ' + state.saveState.meta.currentAct + ' 幕！');
      }
    } catch (e) {
      showErrorRecovery('卷末換窗失敗: ' + e.message);
    }
  } else {
    state.saveState.meta.currentAct += 1;
    state.saveState.actDossiers = state.saveState.actDossiers || [];
    state.saveState.actDossiers.push('【第一幕 重整檔案】與男主成功建立初步信任與權力博弈……');
    renderSaveState();
    alert('【本地模擬】卷末換窗完成！已進入第 ' + state.saveState.meta.currentAct + ' 幕。');
  }

  hideLoading();
}

function renderSaveState() {
  if (!state.saveState) return;
  const p = state.saveState.protagonist || { hp: 100, sanity: 100 };
  if (dom.hpDisplay) dom.hpDisplay.textContent = p.hp;
  if (dom.sanityDisplay) dom.sanityDisplay.textContent = p.sanity;

  const prof = state.saveState?.meta?.playerProfile;
  if (prof && dom.profileCardName && dom.profileCardLead) {
    dom.profileCardName.textContent = `${prof.name}（${prof.profession || '調查者'}）`;
    dom.profileCardLead.textContent = `攻略對象：${prof.targetLeadName || '徐令謙'} ｜ R-18：${prof.allowR18 ? '開啟' : '關閉'}`;
  }

  if (dom.relationshipsList) {
    dom.relationshipsList.innerHTML = '';
    const rels = state.saveState.relationships || {};
    const keys = Object.keys(rels);
    if (keys.length === 0) {
      dom.relationshipsList.innerHTML = '<div class="text-xs text-slate-500 italic">尚無好感度變化紀錄</div>';
    } else {
      keys.forEach(npc => {
        const val = rels[npc];
        const row = document.createElement('div');
        row.className = 'flex justify-between items-center bg-brand-dark px-3 py-2 rounded-lg text-xs';
        row.innerHTML = `<span class="font-bold text-white">${npc}</span><span class="text-rose-400 font-mono font-bold">♥ ${val}</span>`;
        dom.relationshipsList.appendChild(row);
      });
    }
  }

  if (dom.inventoryList) {
    dom.inventoryList.innerHTML = '';
    const items = state.saveState.inventory || [];
    if (items.length === 0) {
      dom.inventoryList.innerHTML = '<div class="text-xs text-slate-500 italic">背包目前空無一物</div>';
    } else {
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-brand-dark px-3 py-2 rounded-lg text-xs';
        div.innerHTML = `<div class="font-bold text-white flex justify-between"><span>${item.name}</span><span class="text-brand-gold font-mono">×${item.count}</span></div><div class="text-[11px] text-slate-400 mt-0.5">${item.desc || ''}</div>`;
        dom.inventoryList.appendChild(div);
      });
    }
  }

  if (dom.summaryPoolContent) {
    dom.summaryPoolContent.textContent = state.saveState.summaryPool || '（尚無記憶摘要，將於第 5 回合自動生成）';
  }
}

async function callBackendApi(action, payload) {
  state.currentAbortController = new AbortController();

  const body = Object.assign({
    action: action,
    token: state.token,
    userId: state.userId
  }, payload);

  const response = await fetch(state.gasApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(body),
    signal: state.currentAbortController.signal
  });

  return await response.json();
}

function showLoading(text, subtext) {
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'flex';
    dom.loadingText.textContent = text || '載入中...';
    if (dom.loadingSubtext) dom.loadingSubtext.textContent = subtext || '正在依照《系統核心指令》構建多方博弈……';
  }
}

function hideLoading() {
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'none';
  }
  state.currentAbortController = null;
}
