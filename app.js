/**
 * 《暗流》（UNDER CURRENT）- Frontend Web Client Application
 * 檔案：app.js
 * 
 * 實裝：
 * 1. 重新產出 / 重擲 (Regenerate Current Turn)
 * 2. 截停產出 (Abort Generation via AbortController)
 * 3. 悔棋 / 修改上一回合選項 (Rewind 1 Turn)
 * 4. 錯誤救援與自動/手動重試機制 (Error Recovery Banner & Retry)
 * 5. 多人排隊與 RPM=5 冷卻倒數提示 (Queue & Cooldown Indicator)
 * 6. 5大體驗優化（雨聲音效、歷史Log、全文匯出、字級主題、打字機跳過）
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
  
  // 抉擇快照（供悔棋與重新生成）
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
  
  // 歷史章節累加池
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
    targetLead: '01_徐令謙',
    targetLeadName: '徐令謙',
    allowR18: true,
    customScenario: '深夜德行法律事務所頂層，我代表弘楊集團前來與徐令謙商討併購案暗帳，兩人在微醺酒香中展開言語與肢體的試探……'
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
  chapterBadge: document.getElementById('chapter-badge'),
  chapterTitle: document.getElementById('chapter-title'),
  proseContent: document.getElementById('prose-content'),
  choicesContainer: document.getElementById('choices-container'),
  customActionInput: document.getElementById('custom-action-input'),
  submitCustomBtn: document.getElementById('submit-custom-btn'),
  skipTypewriterBtn: document.getElementById('skip-typewriter-btn'),
  
  // 重新生成、悔棋與中止控制
  regenerateTurnBtn: document.getElementById('regenerate-turn-btn'),
  rewindTurnBtn: document.getElementById('rewind-turn-btn'),
  abortGenerationBtn: document.getElementById('abort-generation-btn'),
  
  // 排隊與錯誤提示
  serverStatusBadge: document.getElementById('server-status-badge'),
  serverStatusText: document.getElementById('server-status-text'),
  errorRecoveryBanner: document.getElementById('error-recovery-banner'),
  errorMessageText: document.getElementById('error-message-text'),
  retryTurnBtn: document.getElementById('retry-turn-btn'),
  dismissErrorBtn: document.getElementById('dismiss-error-btn'),
  
  // 即時狀態面板
  inlineStatusPanel: document.getElementById('inline-status-panel'),
  panelTimeLocation: document.getElementById('panel-time-location'),
  panelTension: document.getElementById('panel-tension'),
  panelIntoxication: document.getElementById('panel-intoxication'),
  panelOutfit: document.getElementById('panel-outfit'),
  panelInteraction: document.getElementById('panel-interaction'),
  panelInventory: document.getElementById('panel-inventory'),
  panelRumors: document.getElementById('panel-rumors'),

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
  // 1. 重新生成此回 (Regenerate)
  if (dom.regenerateTurnBtn) {
    dom.regenerateTurnBtn.addEventListener('click', handleRegenerateTurn);
  }

  // 2. 悔棋 / 修改上一回抉擇 (Rewind)
  if (dom.rewindTurnBtn) {
    dom.rewindTurnBtn.addEventListener('click', handleRewindTurn);
  }

  // 3. 截停產出 (Abort)
  if (dom.abortGenerationBtn) {
    dom.abortGenerationBtn.addEventListener('click', handleAbortGeneration);
  }

  // 4. 錯誤重試按鈕
  if (dom.retryTurnBtn) {
    dom.retryTurnBtn.addEventListener('click', handleRetryLastTurn);
  }
  if (dom.dismissErrorBtn) {
    dom.dismissErrorBtn.addEventListener('click', () => {
      dom.errorRecoveryBanner.style.display = 'none';
    });
  }

  // 5. 閱讀字級與主題切換
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

  // 6. 雨夜氛圍音效開關
  if (dom.ambienceToggleBtn) dom.ambienceToggleBtn.addEventListener('click', toggleRainAmbience);

  // 7. 歷史章節紀錄 Log & 小說匯出
  if (dom.openHistoryBtn) dom.openHistoryBtn.addEventListener('click', openHistoryModal);
  if (dom.closeHistoryBtn) dom.closeHistoryBtn.addEventListener('click', closeHistoryModal);
  if (dom.exportNovelBtn) dom.exportNovelBtn.addEventListener('click', exportFullNovelText);

  // 8. 打字機跳過
  if (dom.proseContent) dom.proseContent.addEventListener('click', skipTypewriter);
  if (dom.skipTypewriterBtn) dom.skipTypewriterBtn.addEventListener('click', skipTypewriter);

  // 9. 登入 / 註冊 Tab 切換
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

  // 10. 創角彈窗控制與設定檔
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

  // 11. 側邊狀態抽屜
  if (dom.openDrawerBtn) dom.openDrawerBtn.addEventListener('click', openDrawer);
  if (dom.closeDrawerBtn) dom.closeDrawerBtn.addEventListener('click', closeDrawer);
  if (dom.drawerBackdrop) dom.drawerBackdrop.addEventListener('click', closeDrawer);

  // 12. 遊戲存檔槽按鈕 (Slot 1, 2, 3)
  document.querySelectorAll('.save-slot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => saveGameStateToSlot(e.target.getAttribute('data-slot')));
  });
  document.querySelectorAll('.load-slot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => loadGameStateFromSlot(e.target.getAttribute('data-slot')));
  });
  if (dom.quickSaveBtn) dom.quickSaveBtn.addEventListener('click', () => saveGameStateToSlot('1'));

  // 13. 自訂行動
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

  // 14. 卷末換窗
  if (dom.rebaseActBtn) dom.rebaseActBtn.addEventListener('click', handleActRebase);

  // 15. 儲存後端 API 設定
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

  // 恢復上一狀態快照並重新發送請求
  if (state.previousStateSnapshot) {
    state.saveState = JSON.parse(JSON.stringify(state.previousStateSnapshot.saveState));
  }
  
  const payload = state.lastChoicePayload;
  makeChoice(payload.choiceId, payload.customInput, true);
}

function handleRewindTurn() {
  if (!state.previousStateSnapshot) {
    alert('已是開局第一回，無法再向前悔棋！');
    return;
  }
  if (!confirm('確定要【悔棋】回退到上一回合嗎？您可以重新輸入或調整選擇。')) return;

  // 還原上一回合資料
  state.saveState = JSON.parse(JSON.stringify(state.previousStateSnapshot.saveState));
  state.chapterData = JSON.parse(JSON.stringify(state.previousStateSnapshot.chapterData));
  
  // 移除歷史記錄中的最後一筆
  if (state.chapterHistoryList.length > 0) {
    state.chapterHistoryList.pop();
    localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
  }

  // 填回玩家上一次的文字
  if (state.lastChoicePayload && state.lastChoicePayload.customInput) {
    dom.customActionInput.value = state.lastChoicePayload.customInput;
  }

  renderChapter(state.chapterData);
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

  let novelMd = `# 《暗流》（UNDER CURRENT）— 完整篇章紀錄\n\n`;
  novelMd += `* 主角玩家：${pName}（${state.saveState?.meta?.playerProfile?.profession || ''}）\n`;
  novelMd += `* 攻略對象：${targetLead}\n`;
  novelMd += `* 篇章進度：第 ${act} 幕 · 總計 ${state.chapterHistoryList.length} 回合\n`;
  novelMd += `* 匯出時間：${new Date().toLocaleString('zh-TW')}\n\n`;
  novelMd += `---\n\n`;

  state.chapterHistoryList.forEach((c, idx) => {
    novelMd += `## ${c.chapterTitle || `第 ${idx + 1} 回`}\n\n`;
    novelMd += `${c.prose}\n\n`;
    if (c.statusPanel && c.statusPanel.timeLocation) {
      novelMd += `> 🕰 ${c.statusPanel.timeLocation} ｜ 🌡 ${c.statusPanel.tension || ''} ${c.statusPanel.intoxication || ''}\n\n`;
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
// 6. 打字機動效與快速跳過
// ==========================================

function skipTypewriter() {
  if (!state.isTyping) return;
  state.skipTypewriterTriggered = true;
  if (state.typewriterTimer) clearTimeout(state.typewriterTimer);
  
  if (state.chapterData) {
    dom.proseContent.innerHTML = '';
    const paragraphs = state.chapterData.prose.split('\n\n');
    paragraphs.forEach(pText => {
      const p = document.createElement('p');
      p.className = 'mb-6 indent-8';
      p.textContent = pText;
      dom.proseContent.appendChild(p);
    });
    state.isTyping = false;
    if (dom.skipTypewriterBtn) dom.skipTypewriterBtn.classList.add('hidden');
    renderChoices(state.chapterData.choices || []);
  }
}

function typewriterEffect(text, targetEl, onComplete) {
  targetEl.innerHTML = '';
  state.isTyping = true;
  state.skipTypewriterTriggered = false;
  dom.choicesContainer.innerHTML = '';

  if (dom.skipTypewriterBtn) dom.skipTypewriterBtn.classList.remove('hidden');

  if (state.typeSpeed === 'instant') {
    const paragraphs = text.split('\n\n');
    paragraphs.forEach(pText => {
      const p = document.createElement('p');
      p.className = 'mb-6 indent-8';
      p.textContent = pText;
      targetEl.appendChild(p);
    });
    state.isTyping = false;
    if (dom.skipTypewriterBtn) dom.skipTypewriterBtn.classList.add('hidden');
    if (onComplete) onComplete();
    return;
  }

  const speed = state.typeSpeed === 'fast' ? 3 : 10;
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
          if (dom.skipTypewriterBtn) dom.skipTypewriterBtn.classList.add('hidden');
          if (onComplete) onComplete();
        }
      }
    }
  }

  typeNextChar();
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
    saveState: state.saveState
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
    renderChapter(slotData.chapter);
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

  if (state.gasApiUrl) {
    try {
      const res = await callBackendApi('novel/init', {
        playerProfile: playerProfile
      });

      if (res.success && res.data) {
        state.chapterData = res.data.chapter;
        state.saveState = res.data.saveState;
        renderChapter(res.data.chapter);
        renderSaveState();
        appendChapterToHistory(res.data.chapter, '【開局入局】');
        saveGameStateToSlot('1');
      } else {
        showErrorRecovery('開局生成失敗：' + (res.error?.message || '伺服器未回傳資料'));
      }
    } catch (err) {
      console.warn('連線後端失敗，使用正宗本地模式:', err);
      loadMockDataWithProfile(playerProfile);
    }
  } else {
    loadMockDataWithProfile(playerProfile);
  }

  hideLoading();
}

async function initializeStory() {
  showLoading('正在連接世界線，讀取故事進度...');

  await loadMockData();

  if (state.gasApiUrl) {
    try {
      const res = await callBackendApi('novel/load-state', {});
      if (res.success && res.data && res.data.saveState) {
        state.saveState = res.data.saveState;
        renderSaveState();
      } else {
        dom.charCreationModal.style.display = 'flex';
      }
    } catch (e) {
      console.warn('後端連線提示:', e);
      dom.charCreationModal.style.display = 'flex';
    }
  } else {
    dom.charCreationModal.style.display = 'flex';
  }

  hideLoading();
}

async function loadMockData() {
  try {
    const res = await fetch('./mock_data.json');
    const mock = await res.json();
    state.chapterData = mock.mockChapter;
    state.saveState = mock.mockSaveState;
    renderChapter(mock.mockChapter);
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
      prose: `五月深夜的台北士林，暴雨如注，重重雨幕將整座城市的霓虹燈火模糊成一片斑駁血色。\n\n德行法律事務所頂層制策室內，防彈落地窗外雷聲滾滾，室內卻寂靜得近乎壓抑。空氣中交織著淺焙手沖咖啡的微酸果香——那是專程自三峽思慕咖啡送達、由主人親手烘焙研磨的特調豆——以及雪茄木質與冷冽沉香的氣息。\n\n${profile.name}立於深色胡桃木長桌一端，身上那一襲淡雅修身的長裙勾勒出優雅身段，微濕的自然捲髮梢垂在白皙的鎖骨間，散發著清淡若有似無的甜香。她指尖緊貼著手提包內層，那枚載有弘楊集團與政界洗錢暗帳的加密隨身碟正隱隱發燙。\n\n長桌上首，徐令謙微倚著皮質高背椅。他戴著一副細邊金絲眼鏡，深灰手工訂製三件套西裝筆挺而從容，左腕上的 Omega 金錶在昏黃吊燈下泛著冷冽光芒。他修長的手指輕輕搖晃著加冰威士忌水晶杯，太陰坐命的眼眸深邃得宛如不見底的古潭，目光精準如手術刀般落在她身上。\n\n「${profile.name}，在士林這片地界，敢捏著這份帳冊直接找進德行事務所的人，妳是第一個。」徐令謙低沉的嗓音徐徐響起，帶著令人心悸的壓迫感。\n\n話音未落，厚重的胡桃木門扉卻傳來一聲沉悶的解鎖聲。室外走廊的穿堂冷風裹挾著雨水潮氣灌入，一道挺拔冷峻的黑色長風衣身影邁步而入——士林地檢署主任檢察官韓正寰攜帶著濃烈的 Diptyque Tam Dao 檀香氣息，反手扣上了房門。\n\n韓正寰胸前的檢察官徽章閃著寒芒，處女座極度自律的眉眼冷若冰霜，視線先是凌厲地掃過徐令謙，隨後牢牢釘在${profile.name}身上。\n\n「看來今晚的德行事務所比法庭還要熱鬧。」韓正寰嗓音如刀刃切過冰面，緩步走近長桌，高大的身形將出口完全封死，「${profile.name}，妳手裡的東西，按照刑事訴訟法，現在就該交給地檢署。」\n\n黑幫幕後二把手與司法界白日判官的視線在半空中激烈交撞，而兩名危險男人的全部焦點，在這一刻齊齊落在正中央的${profile.name}身上。`,
      statusPanel: {
        timeLocation: '2026年5月12日 21:30 星期二 於 台北市士林區德行法律事務所頂樓制策室',
        tension: '張力值 [75%]',
        intoxication: '微醺度 [25%]',
        outfit: `${profile.name}（素雅長裙、微濕自然捲髮、清甜體香） ｜ 徐令謙（深灰訂製西裝、金絲眼鏡、Omega金錶） ｜ 韓正寰（黑風衣、地檢徽章、冷峻眼神）`,
        interaction: '三方修羅場 ｜ 徐令謙坐於上首玩味打量，韓正寰反手封門阻斷退路，物理距離均不足兩米',
        inventory: '弘楊集團洗錢暗帳隨身碟、瑾和基金會特許證',
        rumors: '政界盛傳士林地檢署正秘密查扣天裕會金流，黑白兩道暗潮洶湧一觸即發',
        pageCode: 'P.001'
      },
      choices: [
        { id: 'opt_a', label: '[A] 借力打力：神情自若地拉開中央座椅坐下，將隨身碟壓在掌心「兩位既然都到了，不如聽聽我的開價」', risk: 'low', hint: '展現從容定力，在黑白夾縫中主導談判節奏' },
        { id: 'opt_b', label: `[B] 轉移焦點：抬眼直視韓正寰「韓檢若想查辦，三年前的案子為何至今不敢結案？」`, risk: 'medium', hint: '直刺司法痛點，拉扯韓正寰心理防線' },
        { id: 'opt_c', label: `[C] 危險推拉：側身朝徐令謙走近，傾身將隨身碟輕放在他的威士忌杯旁「二爺，您說這東西……我該給誰？」`, risk: 'high', hint: '主動跨越安全距離，當著檢察官面與黑幫首領親暱試探' }
      ]
    };
  } else {
    initialMockChapter = {
      chapterTitle: `第 1 回．暴雨德行事務所 · 初會 ${profile.targetLeadName}`,
      prose: `五月的台北士林，窗外暴雨如注，重重敲打著德行法律事務所頂層制策室的防彈落地窗。\n\n室內空氣中瀰漫著淺焙手沖咖啡的微酸香氣——那是專程從三峽思慕咖啡送達、由主人親自烘焙磨製的特調豆子——以及對面男人身上那股若有似無的柑橘木質菸草香。\n\n${profile.name}將身上的大衣下擺稍稍攏起，指尖觸碰到手提包內層那枚冰冷而沉重的密錄隨身碟。她抬起頭，迎向長桌另一端的目光。\n\n${profile.targetLeadName}坐在深色胡桃木長桌的上首，戴著金邊眼鏡，修長而骨節分明的手指輕輕搖晃著水晶杯，目光精準如手術刀般落在她身上。昏黃的光影勾勒出他深邃的輪廓與手工西裝的精緻紋理，整個人散發著久居上位的內斂壓迫感。\n\n「${profile.name}，在台北敢帶著這份帳冊底牌直接找進來的人，妳是第一個。」他緩緩開口，語調低沉優雅，卻帶著不容忽視的試探。\n\n室內的空氣彷彿在這一刻凝固，窗外的雷聲與室內兩人間急促的呼吸與心跳，交織成一場危險博弈的序曲。`,
      statusPanel: {
        timeLocation: '2026年5月12日 21:30 星期二 於 台北市士林區德行法律事務所頂樓制策室',
        tension: '張力值 [50%]',
        intoxication: '微醺度 [20%]',
        outfit: `${profile.name}（${profile.appearance || '深黑大衣、冷靜眼神'}） ｜ ${profile.targetLeadName}（手工深灰西裝、金錶）`,
        interaction: `初次交鋒 ｜ 與 ${profile.targetLeadName} 隔著長桌對坐，目光交鋒`,
        inventory: '調查底牌、密錄隨身碟',
        rumors: '政壇傳言士林地檢署正秘密盯梢天裕會金流，黑白兩道暗潮洶湧',
        pageCode: 'P.001'
      },
      choices: [
        { id: 'opt_a', label: '[A] 順應節奏：神情自若地拉開椅子坐下，將隨身碟推向桌心', risk: 'low', hint: '展現職業從容，以籌碼換取信任' },
        { id: 'opt_b', label: `[B] 反向推拉：冷靜反詰「看來你很清楚這份帳冊能掀起多大風浪」`, risk: 'medium', hint: '言語機鋒試探底線' },
        { id: 'opt_c', label: `[C] 情慾暗示：迎著他的視線傾身靠近，壓低聲音「那您打算怎麼處置我？」`, risk: 'high', hint: '主動拉近物理距離，挑動危險氛圍' }
      ]
    };
  }

  state.chapterData = initialMockChapter;
  renderChapter(initialMockChapter);
  renderSaveState();
  appendChapterToHistory(initialMockChapter, '【開局入局】');
}

function renderChapter(chapter) {
  if (!chapter) return;
  dom.chapterBadge.textContent = `第 ${state.saveState?.meta?.currentAct || 1} 幕 · 第 ${state.saveState?.turnCount || 1} 回合`;
  dom.chapterTitle.textContent = chapter.chapterTitle || '未命名章節';

  if (chapter.statusPanel && dom.inlineStatusPanel) {
    dom.inlineStatusPanel.style.display = 'block';
    if (dom.panelTimeLocation) dom.panelTimeLocation.textContent = chapter.statusPanel.timeLocation || '-';
    if (dom.panelTension) dom.panelTension.textContent = chapter.statusPanel.tension || '張力 0%';
    if (dom.panelIntoxication) dom.panelIntoxication.textContent = chapter.statusPanel.intoxication || '微醺 0%';
    if (dom.panelOutfit) dom.panelOutfit.textContent = chapter.statusPanel.outfit || '-';
    if (dom.panelInteraction) dom.panelInteraction.textContent = chapter.statusPanel.interaction || '-';
    if (dom.panelInventory) dom.panelInventory.textContent = chapter.statusPanel.inventory || '-';
    if (dom.panelRumors) dom.panelRumors.textContent = chapter.statusPanel.rumors || '-';
  }

  typewriterEffect(chapter.prose, dom.proseContent, () => {
    renderChoices(chapter.choices || []);
  });
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
        skipTypewriter();
        return;
      }
      if (choice.risk === 'high') triggerHaptic([50, 30, 80]);
      makeChoice(choice.id, choice.label);
    });

    dom.choicesContainer.appendChild(card);
  });
}

async function makeChoice(choiceId, customInput, isRegenerating = false) {
  // 記錄快照（供悔棋與重擲）
  if (!isRegenerating) {
    state.previousStateSnapshot = {
      saveState: JSON.parse(JSON.stringify(state.saveState)),
      chapterData: JSON.parse(JSON.stringify(state.chapterData))
    };
    state.lastChoicePayload = { choiceId, customInput };
  }

  showLoading(
    isRegenerating ? '主筆作家正在重新構思本回演繹……' : '以太筆觸流轉中，主筆作家正在撰寫後續長篇情節……',
    '若伺服器多人排隊中，系統將自動依序處理，請稍候……'
  );

  dom.errorRecoveryBanner.style.display = 'none';

  if (state.gasApiUrl) {
    try {
      const res = await callBackendApi('novel/next-turn', {
        choiceId: choiceId,
        customInput: customInput,
        saveState: state.saveState
      });

      if (res.success && res.data) {
        state.chapterData = res.data.chapter;
        state.saveState = res.data.saveState;
        renderChapter(res.data.chapter);
        renderSaveState();
        appendChapterToHistory(res.data.chapter, customInput || choiceId);
        startServerCooldown(12); // 啟動 RPM=5 冷卻倒數
      } else {
        showErrorRecovery('生成章節失敗：' + (res.error?.message || '伺服器未回傳數據'));
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        showErrorRecovery('連線異常或逾時: ' + e.message);
      }
    }
  } else {
    // 離線展示
    setTimeout(() => {
      state.saveState.turnCount += 1;
      const targetName = state.saveState?.meta?.playerProfile?.targetLeadName || '徐令謙';
      const nextMock = {
        chapterTitle: `第 1 幕 第 ${state.saveState.turnCount} 回：暗湧與博弈`,
        prose: `妳選擇了「${customInput || choiceId}」。\n\n${targetName}的嘴角勾起一抹極淡的弧度，指尖輕扣桌面。室內的空氣彷彿瞬間凝固了幾分，那股若有似無的木質雪松香氣在兩人近距離的呼吸間蔓延開來。\n\n「在士林，很少有人敢用這種語氣跟我說話。」他站起身，修長挺拔的身影投下一片優雅的陰影，目光深沉地注視著妳……`,
        statusPanel: {
          timeLocation: '2026年5月12日 21:45 星期二 於 台北市士林區德行法律事務所頂樓制策室',
          tension: '張力值 [60%]',
          intoxication: '微醺度 [25%]',
          interaction: '氣氛升溫 ｜ 男主起身靠近，距離不足三十公分',
          outfit: '著裝未變',
          inventory: '特許採訪證、密錄隨身碟',
          rumors: '天裕會門口出現可疑跟監車輛',
          pageCode: 'P.002'
        },
        choices: [
          { id: 'choice_1', label: '[A] 保持冷靜，直視他的雙眼不退半步', risk: 'low', hint: '展現心理防線' },
          { id: 'choice_2', label: '[B] 輕笑一聲，優雅地端起咖啡抿了一口「那是因為他們不夠了解二爺」', risk: 'medium', hint: '反將一軍' },
          { id: 'choice_3', label: '[C] 伸手覆上他搭在桌緣的手背，感受掌心微涼的溫度', risk: 'high', hint: '打破社交界限，引發強烈觸覺張力' }
        ]
      };
      state.chapterData = nextMock;
      renderChapter(nextMock);
      renderSaveState();
      appendChapterToHistory(nextMock, customInput || choiceId);
      startServerCooldown(12);
    }, 1200);
  }

  hideLoading();
}

function showErrorRecovery(msg) {
  hideLoading();
  dom.errorRecoveryBanner.style.display = 'flex';
  dom.errorMessageText.textContent = msg || '生成異常，已保留您的選項。';
  triggerHaptic([100, 50, 100]);
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
