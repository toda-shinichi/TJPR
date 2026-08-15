/**
 * 《暗流》（UNDER CURRENT）- Frontend Web Client Application
 * 檔案：app.js
 * 
 * 核心特色：
 * 1. 📜 連貫長篇小說瀑布流（Continuous Novel Stream: 累積每一回章節，可隨時向上回滾完整閱讀全書）
 * 2. 🎭 全動態多回合劇情演進引擎：第 1~5+ 回合正文篇篇不同（1,000+字），ABC 選項與狀態即時演化！
 * 3. ✦ 獨立玩家行動 UI 標籤，小說正文 100% 出版級純文學敘事
 * 4. 🔄 重新生成此回 / ↩ 悔棋回退上一動 / 🛑 截停產出 / ⚠️ 異常救援重試
 * 5. ⏳ 多人排隊冷卻倒數 (RPM=5)
 * 6. 🌧 雨夜氛圍合成器、🔠 字級與三大閱讀主題、📥 小說全文下載
 */

// 全域狀態
const state = {
  gasApiUrl: 'https://script.google.com/macros/s/AKfycbzg3xfoXqVMM90YoIlx4FLwHRg5qy2wu0kV2Bae8xI-kWuNWd_ZNVKuOANygFZKv7rBhQ/exec',
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
  // 視圖切換
  homeView: document.getElementById('home-view'),
  gameplayView: document.getElementById('gameplay-view'),
  navHomeBtn: document.getElementById('nav-home-btn'),
  headerHomeBtn: document.getElementById('header-home-btn'),
  backToHomeBtn: document.getElementById('back-to-home-btn'),
  navSavesBtn: document.getElementById('nav-saves-btn'),
  drawerHomeBtn: document.getElementById('drawer-home-btn'),
  drawerSavesBtn: document.getElementById('drawer-saves-btn'),
  gameplayQuickSaveBtn: document.getElementById('gameplay-quick-save-btn'),
  gameplayDrawerBtn: document.getElementById('gameplay-drawer-btn'),
  gameplayBreadcrumb: document.getElementById('gameplay-breadcrumb'),

  // 首頁元件
  homeUsernameDisplay: document.getElementById('home-username-display'),
  homeLogoutBtn: document.getElementById('home-logout-btn'),
  homeDeleteAccountBtn: document.getElementById('home-delete-account-btn'),
  homeClearAllDataBtn: document.getElementById('home-clear-all-data-btn'),
  homeNewGameBtn: document.getElementById('home-new-game-btn'),
  homeContinueGameBtn: document.getElementById('home-continue-game-btn'),
  homeContinueDesc: document.getElementById('home-continue-desc'),
  homeOpenSavesBtn: document.getElementById('home-open-saves-btn'),
  homeOpenPresetsBtn: document.getElementById('home-open-presets-btn'),
  homeRecentSavesList: document.getElementById('home-recent-saves-list'),
  homeViewAllSavesBtn: document.getElementById('home-view-all-saves-btn'),

  // 登入 / 註冊 門禁視窗
  authModal: document.getElementById('auth-modal'),
  tabLoginBtn: document.getElementById('tab-login-btn'),
  tabRegisterBtn: document.getElementById('tab-register-btn'),
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  loginUsernameInput: document.getElementById('login-username'),
  loginPasswordInput: document.getElementById('login-password'),
  regUsernameInput: document.getElementById('reg-username'),
  regPasswordInput: document.getElementById('reg-password'),
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

  // 自訂命名存檔庫彈窗
  saveArchiveModal: document.getElementById('save-archive-modal'),
  closeSaveArchiveBtn: document.getElementById('close-save-archive-btn'),
  newSaveNameInput: document.getElementById('new-save-name-input'),
  createNamedSaveBtn: document.getElementById('create-named-save-btn'),
  searchSaveInput: document.getElementById('search-save-input'),
  saveArchivesList: document.getElementById('save-archives-list'),
  exportAllSavesBtn: document.getElementById('export-all-saves-btn'),
  importAllSavesInput: document.getElementById('import-all-saves-input'),

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

  // 側邊狀態抽屜 & 存檔槽
  openDrawerBtn: document.getElementById('open-drawer-btn'),
  closeDrawerBtn: document.getElementById('close-drawer-btn'),
  drawerBackdrop: document.getElementById('drawer-backdrop'),
  sideDrawer: document.getElementById('side-drawer'),
  profileCardName: document.getElementById('profile-card-name'),
  profileCardLead: document.getElementById('profile-card-lead'),
  
  hpDisplay: document.getElementById('hp-display'),
  sanityDisplay: document.getElementById('sanity-display'),
  relationshipsList: document.getElementById('relationships-list'),
  inventoryList: document.getElementById('inventory-list'),
  rebaseActBtn: document.getElementById('rebase-act-btn'),
  
  loadingOverlay: document.getElementById('loading-overlay'),
  loadingText: document.getElementById('loading-text'),
  loadingSubtext: document.getElementById('loading-subtext'),
  abortGenerationBtn: document.getElementById('abort-generation-btn')
};

function applyReadingPreferences() {
  if (document.documentElement && document.documentElement.style) {
    document.documentElement.style.setProperty('--reader-font-size', `${state.fontSizePx || 18}px`);
  }
  setTheme(state.theme || 'dark');
}

function adjustFontSize(delta) {
  state.fontSizePx = Math.min(26, Math.max(14, (state.fontSizePx || 18) + delta * 2));
  if (document.documentElement && document.documentElement.style) {
    document.documentElement.style.setProperty('--reader-font-size', `${state.fontSizePx}px`);
  }
  localStorage.setItem('undercurrent_font_size', state.fontSizePx);
}

function setTheme(themeName) {
  state.theme = themeName;
  localStorage.setItem('undercurrent_theme', themeName);
  if (document.body && document.body.classList) {
    document.body.classList.remove('theme-parchment', 'theme-navy');
    if (themeName === 'parchment') document.body.classList.add('theme-parchment');
    if (themeName === 'navy') document.body.classList.add('theme-navy');
  }
}

function triggerHaptic(pattern) {
  if (navigator && navigator.vibrate) {
    try { navigator.vibrate(pattern || 30); } catch (e) {}
  }
}

// 初始化
window.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  loadSavedProfilePresets();
  applyReadingPreferences();

  if (dom.apiUrlInput) {
    dom.apiUrlInput.value = state.gasApiUrl;
  }

  // 檢查是否已有暫存進度
  const savedHistory = localStorage.getItem('undercurrent_full_story_chapters');
  if (savedHistory) {
    try {
      const parsed = JSON.parse(savedHistory);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.chapterHistoryList = parsed;
        state.chapterData = parsed[parsed.length - 1];
        renderStoryStream(state.chapterData);
      }
    } catch (e) {
      console.warn('Failed to parse saved story history:', e);
    }
  }

  checkAuthSession();
  switchView('home');
});

function handleAbortGeneration() {
  if (state.currentAbortController) {
    state.currentAbortController.abort();
    state.currentAbortController = null;
  }
  hideLoading();
  alert('已中止本次生成。');
}

function handleRetryLastTurn() {
  if (state.lastChoicePayload) {
    makeChoice(state.lastChoicePayload.choiceId, state.lastChoicePayload.customInput, true);
  }
}

function handleRegenerateTurn() {
  if (state.lastChoicePayload) {
    makeChoice(state.lastChoicePayload.choiceId, state.lastChoicePayload.customInput, true);
  } else {
    alert('目前尚無上一步抉擇紀錄可重新演繹。');
  }
}

function handleUndoTurn() {
  if (state.previousStateSnapshot) {
    state.saveState = JSON.parse(JSON.stringify(state.previousStateSnapshot.saveState));
    state.chapterData = JSON.parse(JSON.stringify(state.previousStateSnapshot.chapterData));
    if (state.chapterHistoryList.length > 1) {
      state.chapterHistoryList.pop();
      localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
    }
    renderStoryStream(state.chapterData);
    renderSaveState();
    alert('已成功悔棋回退至上一回合！');
  } else {
    alert('已無更早的上一動快照可回退。');
  }
}

const handleRewindTurn = handleUndoTurn;

function setupEventListeners() {
  // 0. 🏠 首頁與存檔庫切換監聽
  if (dom.navHomeBtn) dom.navHomeBtn.addEventListener('click', () => switchView('home'));
  if (dom.headerHomeBtn) dom.headerHomeBtn.addEventListener('click', () => switchView('home'));
  if (dom.backToHomeBtn) dom.backToHomeBtn.addEventListener('click', () => switchView('home'));
  if (dom.drawerHomeBtn) dom.drawerHomeBtn.addEventListener('click', () => { closeDrawer(); switchView('home'); });
  
  if (dom.navSavesBtn) dom.navSavesBtn.addEventListener('click', openSaveArchiveModal);
  if (dom.drawerSavesBtn) dom.drawerSavesBtn.addEventListener('click', () => { closeDrawer(); openSaveArchiveModal(); });
  if (dom.closeSaveArchiveBtn) dom.closeSaveArchiveBtn.addEventListener('click', closeSaveArchiveModal);
  if (dom.homeOpenSavesBtn) dom.homeOpenSavesBtn.addEventListener('click', openSaveArchiveModal);
  if (dom.homeViewAllSavesBtn) dom.homeViewAllSavesBtn.addEventListener('click', openSaveArchiveModal);

  // 首頁卡片按鈕
  if (dom.homeNewGameBtn) {
    dom.homeNewGameBtn.addEventListener('click', () => {
      openCharacterCreationModal();
    });
  }
  if (dom.homeContinueGameBtn) {
    dom.homeContinueGameBtn.addEventListener('click', () => {
      const hasHistory = Array.isArray(state.chapterHistoryList) && state.chapterHistoryList.length > 0;
      if (hasHistory && state.chapterData) {
        switchView('gameplay');
      } else {
        alert('目前尚未有進行中的冒險存檔，為您開啟【全新創角開局】！');
        openCharacterCreationModal();
      }
    });
  }
  if (dom.homeOpenPresetsBtn) {
    dom.homeOpenPresetsBtn.addEventListener('click', () => {
      openCharacterCreationModal();
    });
  }

  // 帳號與清空本機存檔
  if (dom.logoutBtn) dom.logoutBtn.addEventListener('click', handleLogout);
  if (dom.homeLogoutBtn) dom.homeLogoutBtn.addEventListener('click', handleLogout);
  if (dom.homeDeleteAccountBtn) dom.homeDeleteAccountBtn.addEventListener('click', handleDeleteAccount);
  if (dom.homeClearAllDataBtn) dom.homeClearAllDataBtn.addEventListener('click', clearAllLocalGameData);

  // 存檔管理
  if (dom.createNamedSaveBtn) {
    dom.createNamedSaveBtn.addEventListener('click', () => {
      createNamedSave(dom.newSaveNameInput.value);
    });
  }
  if (dom.searchSaveInput) {
    dom.searchSaveInput.addEventListener('input', (e) => {
      renderSaveArchivesList(e.target.value);
    });
  }
  if (dom.exportAllSavesBtn) dom.exportAllSavesBtn.addEventListener('click', exportAllSavesJson);
  if (dom.importAllSavesInput) dom.importAllSavesInput.addEventListener('change', importAllSavesJson);

  // 登入 / 註冊 Tab 切換
  if (dom.tabLoginBtn && dom.tabRegisterBtn) {
    dom.tabLoginBtn.addEventListener('click', () => {
      dom.tabLoginBtn.className = 'flex-1 py-2.5 rounded-md bg-brand-gold text-slate-950 transition font-bold cursor-pointer';
      dom.tabRegisterBtn.className = 'flex-1 py-2.5 rounded-md text-slate-400 hover:text-white transition font-bold cursor-pointer';
      if (dom.loginForm) dom.loginForm.style.display = 'block';
      if (dom.registerForm) dom.registerForm.style.display = 'none';
    });

    dom.tabRegisterBtn.addEventListener('click', () => {
      dom.tabRegisterBtn.className = 'flex-1 py-2.5 rounded-md bg-brand-gold text-slate-950 transition font-bold cursor-pointer';
      dom.tabLoginBtn.className = 'flex-1 py-2.5 rounded-md text-slate-400 hover:text-white transition font-bold cursor-pointer';
      if (dom.registerForm) dom.registerForm.style.display = 'block';
      if (dom.loginForm) dom.loginForm.style.display = 'none';
    });
  }

  if (dom.loginForm) {
    dom.loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleUserLogin();
    });
  }

  if (dom.registerForm) {
    dom.registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleUserRegister();
    });
  }

  // 創角彈窗控制與設定檔
  if (dom.openCreateCharBtn) dom.openCreateCharBtn.addEventListener('click', openCharacterCreationModal);
  if (dom.closeModalBtn) dom.closeModalBtn.addEventListener('click', () => { dom.charCreationModal.style.display = 'none'; });

  if (dom.profilePresetsSelect) dom.profilePresetsSelect.addEventListener('change', (e) => loadProfilePresetIntoForm(e.target.value));
  if (dom.saveCurrentProfileBtn) dom.saveCurrentProfileBtn.addEventListener('click', saveCurrentFormAsPreset);
  if (dom.exportProfileJsonBtn) dom.exportProfileJsonBtn.addEventListener('click', exportProfileJson);
  if (dom.importProfileJsonInput) dom.importProfileJsonInput.addEventListener('change', importProfileJson);
  if (dom.deleteProfilePresetBtn) dom.deleteProfilePresetBtn.addEventListener('click', deleteSelectedProfilePreset);

  if (dom.charCreationForm) {
    dom.charCreationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleCharacterCreationSubmit();
    });
  }

  // 側邊狀態抽屜
  if (dom.openDrawerBtn) dom.openDrawerBtn.addEventListener('click', openDrawer);
  if (dom.closeDrawerBtn) dom.closeDrawerBtn.addEventListener('click', closeDrawer);
  if (dom.drawerBackdrop) dom.drawerBackdrop.addEventListener('click', closeDrawer);
  if (dom.gameplayDrawerBtn) dom.gameplayDrawerBtn.addEventListener('click', openDrawer);
  if (dom.gameplayQuickSaveBtn) dom.gameplayQuickSaveBtn.addEventListener('click', () => saveGameStateToSlot('1'));

  // 中止與重試
  if (dom.abortGenerationBtn) dom.abortGenerationBtn.addEventListener('click', handleAbortGeneration);
  if (dom.retryTurnBtn) dom.retryTurnBtn.addEventListener('click', handleRetryLastTurn);
  if (dom.dismissErrorBtn) dom.dismissErrorBtn.addEventListener('click', () => { dom.errorRecoveryBanner.style.display = 'none'; });

  // 卷末換窗
  if (dom.rebaseActBtn) dom.rebaseActBtn.addEventListener('click', handleActRebase);

  // 自訂行動
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
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) {
        e.preventDefault();
        const customText = (dom.customActionInput.value || '').trim();
        if (!customText) return;
        makeChoice(null, customText);
        dom.customActionInput.value = '';
      }
    });
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
      <div class="text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-line prose-tc">${cleanProseText(item.prose) || ''}</div>
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
    novelMd += `${cleanProseText(c.prose)}\n\n`;
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
    if (activeSection && typeof activeSection.scrollIntoView === 'function') {
      activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        skipStreamTypewriter(cleanProseText(state.chapterData.prose), state.chapterData, document.getElementById('stream-prose-content'), document.getElementById('stream-skip-btn'));
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



// ==========================================
// 🔐 身分驗證與門禁系統 (Strict Auth & Account Management)
// ==========================================

function getLocalUsersDb() {
  try {
    return JSON.parse(localStorage.getItem('undercurrent_registered_users') || '{}');
  } catch (e) {
    return {};
  }
}

function saveLocalUsersDb(db) {
  localStorage.setItem('undercurrent_registered_users', JSON.stringify(db));
}

function setSession(token, userId, username) {
  state.token = token;
  state.userId = userId;
  state.username = username;
  localStorage.setItem('undercurrent_auth_token', token);
  localStorage.setItem('undercurrent_user_id', userId);
  localStorage.setItem('undercurrent_user_name', username);
  checkAuthSession();
}

function checkAuthSession() {
  const isLoggedIn = !!(state.token && state.username);
  
  if (isLoggedIn) {
    if (dom.authModal) dom.authModal.style.display = 'none';
    if (dom.userBadge) dom.userBadge.classList.remove('hidden');
    if (dom.usernameDisplay) dom.usernameDisplay.textContent = state.username;
    updateSaveSlotsDisplay();
    updateHomeViewDisplay();
    switchView('home');
  } else {
    // 嚴格門禁：未登入一律強顯 Auth Modal，阻擋進入首頁
    if (dom.authModal) dom.authModal.style.display = 'flex';
    if (dom.userBadge) dom.userBadge.classList.add('hidden');
    if (dom.homeView) dom.homeView.style.display = 'none';
    if (dom.gameplayView) dom.gameplayView.style.display = 'none';
  }
}

function updateHomeViewDisplay() {
  if (dom.homeUsernameDisplay) {
    dom.homeUsernameDisplay.textContent = state.username ? `${state.username}` : '未登入';
  }
  
  // 更新最近存檔摘要
  if (dom.homeRecentSavesList) {
    const archives = getNamedSaves();
    const keys = Object.keys(archives);
    if (keys.length === 0) {
      dom.homeRecentSavesList.innerHTML = '<div class="text-xs text-slate-500 py-3 text-center">尚無存檔紀錄，點擊上方【開啟全新局】即刻啟程！</div>';
      if (dom.homeContinueDesc) dom.homeContinueDesc.textContent = '尚未開始遊戲';
    } else {
      const latestKey = keys[keys.length - 1];
      const latest = archives[latestKey];
      if (dom.homeContinueDesc) dom.homeContinueDesc.textContent = `進度：${latest.chapterTitle || '第 1 回'} (${latest.name})`;
      
      let html = '';
      keys.slice(-3).reverse().forEach(key => {
        const item = archives[key];
        const timeStr = item.timestamp ? new Date(item.timestamp).toLocaleString('zh-TW', { hour12: false }) : '';
        html += `
          <div class="flex items-center justify-between p-2.5 rounded-lg bg-brand-dark/80 border border-brand-border hover:border-brand-gold/40 transition">
            <div class="min-w-0 pr-2">
              <div class="text-xs font-bold text-white truncate">${item.name}</div>
              <div class="text-[11px] text-slate-400 truncate">${item.chapterTitle || '章節進度'} ｜ ${timeStr}</div>
            </div>
            <button onclick="loadNamedSave('${key}')" class="px-2.5 py-1 rounded bg-brand-gold/15 hover:bg-brand-gold/30 text-brand-gold text-xs font-bold border border-brand-gold/30 transition shrink-0">
              讀取
            </button>
          </div>
        `;
      });
      dom.homeRecentSavesList.innerHTML = html;
    }
  }
}

async function handleUserLogin() {
  const username = dom.loginUsernameInput.value.trim();
  const password = dom.loginPasswordInput.value;

  if (!username || !password) {
    alert('請輸入帳號與密碼！');
    return;
  }

  showLoading('正在驗證玩家身分，讀取專屬加密空間……');

  let loginSuccess = false;

  // 嘗試向 Google 雲端登入
  if (state.gasApiUrl) {
    try {
      const res = await callBackendApi('auth/login', {
        email: username,
        password: password
      });

      if (res && res.success && res.data) {
        setSession(res.data.token, res.data.userId, username);
        loginSuccess = true;
      }
    } catch (e) {
      console.warn('雲端後端未連線，轉入本地身分庫:', e);
    }
  }

  // 本地身分庫比對備援
  if (!loginSuccess) {
    const db = getLocalUsersDb();
    if (db[username]) {
      if (db[username].password === password) {
        setSession(db[username].token, db[username].userId, username);
        loginSuccess = true;
      } else {
        hideLoading();
        alert('❌ 密碼錯誤，請重新輸入！');
        return;
      }
    } else {
      // 若為全新本地帳號直接開通
      const userId = 'usr_' + Date.now().toString(36);
      const token = 'tok_' + Math.random().toString(36).substring(2);
      db[username] = { userId, token, password, createdAt: new Date().toISOString() };
      saveLocalUsersDb(db);
      setSession(token, userId, username);
      loginSuccess = true;
    }
  }

  hideLoading();
  alert(`🎉 歡迎回來，玩家【${username}】！已進入遊戲首頁。`);
}

async function handleUserRegister() {
  const username = dom.regUsernameInput.value.trim();
  const password = dom.regPasswordInput.value;

  if (!username || !password || password.length < 6) {
    alert('帳號不得為空，且密碼至少需 6 個字元！');
    return;
  }

  showLoading('正在為您註冊並在 Google 雲端建立專屬獨立存檔空間……');

  let registerSuccess = false;

  if (state.gasApiUrl) {
    try {
      const res = await callBackendApi('auth/register', {
        email: username,
        password: password
      });

      if (res && res.success && res.data) {
        setSession(res.data.token, res.data.userId, username);
        registerSuccess = true;
      }
    } catch (e) {
      console.warn('雲端註冊轉入本地建庫:', e);
    }
  }

  if (!registerSuccess) {
    const db = getLocalUsersDb();
    if (db[username]) {
      hideLoading();
      alert('該帳號已存在，請直接登入或使用其他帳號名稱！');
      return;
    }
    const userId = 'usr_' + Date.now().toString(36);
    const token = 'tok_' + Math.random().toString(36).substring(2);
    db[username] = { userId, token, password, createdAt: new Date().toISOString() };
    saveLocalUsersDb(db);
    setSession(token, userId, username);
    registerSuccess = true;
  }

  hideLoading();
  alert(`🎉 註冊成功！歡迎玩家【${username}】！已為您建立專屬空間。`);
}

function handleLogout() {
  if (!confirm('確定要登出當前帳號嗎？')) return;

  state.token = '';
  state.userId = '';
  state.username = '';
  localStorage.removeItem('undercurrent_auth_token');
  localStorage.removeItem('undercurrent_user_id');
  localStorage.removeItem('undercurrent_user_name');

  closeDrawer();
  checkAuthSession();
}

async function handleDeleteAccount() {
  const currentUsername = state.username;
  if (!currentUsername) return;

  if (!confirm(`⚠️ 【危險操作】確定要永久註銷帳號【${currentUsername}】嗎？\n此動作將永久刪除您的帳號、雲端與本機所有存檔紀錄，且無法復原！`)) {
    return;
  }

  const confirmInput = prompt(`請輸入您的帳號名稱「${currentUsername}」以確認註銷：`);
  if (confirmInput !== currentUsername) {
    alert('輸入帳號不一致，已取消註銷操作。');
    return;
  }

  showLoading('正在註銷帳號並抹除所有相關存檔……');

  // 嘗試通知雲端後端刪除
  if (state.gasApiUrl) {
    try {
      await callBackendApi('auth/delete-account', { token: state.token });
    } catch (e) {
      console.warn('雲端刪除請求結束:', e);
    }
  }

  // 抹除本地庫該使用者
  const db = getLocalUsersDb();
  delete db[currentUsername];
  saveLocalUsersDb(db);

  // 清空此使用者的所有存檔
  clearAllLocalGameDataSilent();

  // 清空 Session
  state.token = '';
  state.userId = '';
  state.username = '';
  localStorage.removeItem('undercurrent_auth_token');
  localStorage.removeItem('undercurrent_user_id');
  localStorage.removeItem('undercurrent_user_name');

  hideLoading();
  alert(`✅ 帳號【${currentUsername}】已成功永久註銷與刪除！`);
  checkAuthSession();
}

function clearAllLocalGameDataSilent() {
  localStorage.removeItem('undercurrent_full_story_chapters');
  localStorage.removeItem('undercurrent_current_save_state');
  localStorage.removeItem('undercurrent_current_player_profile');
  localStorage.removeItem('undercurrent_named_saves');
  
  for (let i = 1; i <= 3; i++) {
    localStorage.removeItem(`undercurrent_saveslot_${i}`);
    localStorage.removeItem(`undercurrent_user_saveslot_${i}`);
    localStorage.removeItem(`undercurrent_usr_local_saveslot_${i}`);
  }

  state.chapterHistoryList = [];
  state.chapterData = null;
  state.saveState = null;
  state.previousStateSnapshot = null;
  state.lastChoicePayload = null;

  if (dom.novelStreamContainer) dom.novelStreamContainer.innerHTML = '';
  if (dom.choicesContainer) dom.choicesContainer.innerHTML = '';
}

function clearAllLocalGameData() {
  if (!confirm('⚠️ 警告：確定要清空所有本機暫存、自訂存檔與遊玩歷史紀錄嗎？\n這將把當前帳號的遊戲進度完全重置！')) {
    return;
  }
  clearAllLocalGameDataSilent();
  updateSaveSlotsDisplay();
  updateHomeViewDisplay();
  switchView('home');
  alert('✨ 已成功清空所有本機存檔與紀錄！');
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
  if (!select || !select.options) return;

  const options = Array.from(select.options);
  options.forEach(opt => {
    if (opt && typeof opt.value === 'string' && opt.value.startsWith('custom_')) {
      opt.remove();
    }
  });

  Object.keys(custom).forEach(key => {
    const prof = custom[key];
    if (prof) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = `📁 【自訂】${prof.name || '自訂角色'}（${(prof.profession || '').slice(0, 10)}...）`;
      select.appendChild(opt);
    }
  });
}



function getActivePlayerProfile() {
  if (state.saveState?.meta?.playerProfile?.name) {
    return state.saveState.meta.playerProfile;
  }
  try {
    const raw = localStorage.getItem('undercurrent_current_player_profile');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    name: '楊慕璃',
    gender: '女',
    age: '24',
    profession: '弘楊集團公關總監 · 瑾和文教基金會執行長',
    background: '台大法律/北大犯罪所畢業。身為楊家三房獨生女，在權謀風暴中憑藉智慧與魅力遊走於各方勢力之間。',
    appearance: '及肩黑髮帶自然捲，美麗杏眼，白皙皮膚，精緻體態與若有似無的清甜體香，常著淡雅長裙或素雅洋裝',
    taboos: '禁止暴力侮辱，無特定雷區',
    targetLead: '修羅場',
    targetLeadName: '修羅場',
    allowR18: true,
    customScenario: '深夜德行法律事務所頂層制策室，暴雨傾盆，我代表弘楊集團前來與徐令謙商討併購暗帳，豈料士林地檢署檢察官韓正寰反手封門步步逼近……'
  };
}

function setFormValue(id, val) {
  const el = document.getElementById(id);
  if (el) {
    if (el.type === 'checkbox') {
      el.checked = !!val;
    } else {
      el.value = val !== undefined && val !== null ? val : '';
    }
  }
}

function openCharacterCreationModal() {
  if (dom.charCreationModal) {
    dom.charCreationModal.style.display = 'flex';
    loadSavedProfilePresets();
    
    // 載入當前角色設定
    const profile = getActivePlayerProfile();
    if (profile) {
      setFormValue('form-player-name', profile.name || '楊慕璃');
      setFormValue('form-player-gender', profile.gender || '女');
      setFormValue('form-player-age', profile.age || '24');
      setFormValue('form-player-profession', profile.profession || '弘楊集團公關總監 · 瑾和文教基金會執行長');
      setFormValue('form-player-background', profile.background || '台大法律/北大犯罪所畢業。身為楊家三房獨生女，在權謀風暴中憑藉智慧與魅力遊走於各方勢力之間。');
      setFormValue('form-player-appearance', profile.appearance || '及肩黑髮帶自然捲，美麗杏眼，白皙皮膚，精緻體態與若有似無的清甜體香，常著淡雅長裙或素雅洋裝');
      setFormValue('form-player-taboos', profile.taboos || '禁止暴力侮辱，無特定雷區');
      setFormValue('form-target-lead', profile.targetLead || '修羅場');
      setFormValue('form-allow-r18', profile.allowR18 !== false);
      setFormValue('form-custom-scenario', profile.customScenario || '深夜德行法律事務所頂層制策室，暴雨傾盆，我代表弘楊集團前來與徐令謙商討併購暗帳，豈料士林地檢署檢察官韓正寰反手封門步步逼近……');
    }
  }
}

function loadProfilePresetIntoForm(presetKey) {
  let profile = DEFAULT_PRESETS[presetKey];
  if (!profile) {
    const custom = getCustomPresets();
    profile = custom[presetKey];
  }
  if (!profile) return;

  setFormValue('form-player-name', profile.name);
  setFormValue('form-player-gender', profile.gender || '女');
  setFormValue('form-player-age', profile.age || '24');
  setFormValue('form-player-profession', profile.profession);
  setFormValue('form-player-background', profile.background);
  setFormValue('form-player-appearance', profile.appearance);
  setFormValue('form-player-taboos', profile.taboos || '無');
  setFormValue('form-target-lead', profile.targetLead || '01_徐令謙');
  setFormValue('form-allow-r18', profile.allowR18 !== false);
  setFormValue('form-custom-scenario', profile.customScenario || '');
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
// 10. 全動態多回合劇情與選項演進引擎 (Multi-Turn Narrative & Choice Engine)
// ==========================================

function generateDynamicTurnChapter(turnCount, choiceId, customInput, profile) {
  const pName = profile.name || '阮思薇';
  const targetName = profile.targetLeadName || '徐令謙';
  const isShura = profile.targetLead === '修羅場' || targetName === '修羅場';

  // ========================================================
  // ⚡ 1. 玩家自訂行動即時響應合成器 (Custom Action Dynamic Synthesizer)
  // ========================================================
  if (customInput && customInput.trim()) {
    const rawAction = customInput.trim();
    const actionLower = rawAction.toLowerCase();
    
    // 行動意圖深度語義分類
    const isThreatWeapon = /(刀|匕首|槍|殺|抵|喉嚨|脖子|威脅|逼問|命|刺|死)/.test(rawAction);
    const isRomanticErotic = /(吻|親|抱|腿|摸|脫|領帶|解開|耳垂|喘|胸|腰|衣服|扣子|上床|誘惑|咬|唇|撫)/.test(rawAction);
    const isFleeRefuse = /(走|逃|門|離開|拒絕|不給|轉身|算帳|告辭|撤|跑)/.test(rawAction);
    const isPhysicalAttack = /(潑|打|巴掌|扇|砸|摔|踢|推|撞|杯子)/.test(rawAction);
    const isNegotiate = /(帳冊|隨身碟|利益|條件|合作|代價|談判|籌碼|金流|底牌)/.test(rawAction);

    let generatedProse = '';
    let generatedChoices = [];
    let tensionVal = 85;
    let intoxVal = 40;

    if (isShura) {
      if (isThreatWeapon) {
        tensionVal = 98;
        generatedProse = 
          `整間制策室內的空氣在這一剎那徹底凍結至冰點！窗外的暴雨瘋狂撞擊著防彈落地窗，而室內的氣氛已然劍拔弩張到了極限。\n\n` +
          `${pName}的動作快如閃電，纖細白皙的手指驟然發力，冰冷鋒利的刃芒在昏黃的復古燈光下一閃而過，以極其精準狠絕的姿態直接壓上了徐令謙頸側搏動的動脈！\n\n` +
          `刃鋒深陷進男人白皙的肌膚，甚至逼出了一道極細微的血痕。然而徐令謙握著威士忌水晶杯的手指甚至沒有顫抖半分，那雙太陰坐命的眼眸隔著金絲眼鏡微微垂下，落在頸間的寒芒上，嘴角非但沒有怒意，反而勾起一抹極度危險且玩味的嗜血笑意：\n\n` +
          `「敢在士林天裕會的堂口，把刀架在我徐令謙脖子上的人……${pName}，妳確實是全台北第一個。」徐令謙非但不退，反而微微傾身，修長溫熱的手掌直接覆上她握刀的手背，帶著不容抗拒的強大握力，將冰冷的刀鋒逼得更深了幾分，「但妳握刀的手在抖。告訴我，妳是在向我示威，還是……想要我用這條命來替妳做擔保？」\n\n` +
          `「放開她！」站在另一側的韓正寰瞳孔驟縮，腰間的警用佩槍瞬間解開保險，黑風衣下擺帶起一陣 Diptyque Tam Dao 檀香風壓。士林地檢署檢察官冷峻如刀的目光在兩人交疊的雙手上死死釘住，嗓音低沉得宛如壓抑的火山：\n\n` +
          `「${pName}，把刀放下！在檢察官面前動用致命武力是重罪——但如果徐令謙敢動妳一根頭髮，今晚我會親自開槍擊斃他。」\n\n` +
          `兩名頂級男人的呼吸與殺伐氣場在咫尺之內激烈碰撞，刀鋒、血痕與情慾博弈在此刻達到了最高峰！`;
        generatedChoices = [
          { id: 'custom_threat_1', label: '[A] 步步逼近：指尖施力逼問「徐二爺既然不怕死，那就把三年前的洗錢密鑰交出來」', risk: 'high', hint: '將黑道首領逼入死角' },
          { id: 'custom_threat_2', label: '[B] 轉向挑釁：側眸迎向韓正寰的槍口「韓檢如果要開槍，最好連我一起打死」', risk: 'high', hint: '激化檢察官的保護欲與失控邊緣' },
          { id: 'custom_threat_3', label: '[C] 鋒芒收斂：順勢將刀尖滑入徐令謙西裝內袋，反手拉近兩人距離「二爺的命我要，隨身碟我也要」', risk: 'medium', hint: '危險推拉，將殺意轉化為極致性張力' }
        ];
      } else if (isRomanticErotic) {
        tensionVal = 95;
        intoxVal = 65;
        generatedProse = 
          `制策室內最後一層冰冷的防線被徹底撕碎。長桌上的格蘭花格威士忌香氣與空氣中淺焙咖啡的果酸交織，令人神智微醺卻又感官成倍放大。\n\n` +
          `${pName}不再掩飾周身的魅力，直接主動逼近，纖細柔滑的手指順著徐令謙手工訂製西裝的領口探入，指尖直接觸碰到男人襯衫下滾燙而緊繃的肌理。男人的呼吸在這一瞬間陡然粗重了一分。\n\n` +
          `徐令謙單手摘下鼻樑上的金絲眼鏡隨手扔在長桌上，那雙深邃如寒潭的眸子裡，久居上位的內斂紳士面具徹底褪去，取而代之的是毫不掩飾的掠奪欲。他大掌一把扣住她纖細的腰肢，將她整個人霸道地提抱起放在深黑胡桃木長桌上，另一手穿插進她微濕的髮絲中，俯下身帶著濃烈酒氣吻上了她微涼的耳垂與頸側：\n\n` +
          `「妳這是在玩火，${pName}。」男人的嗓音沙啞得宛如砂紙磨過，「但既然妳主動跨過了這條線，今晚這間辦公室，妳就別想完好無損地走出去。」\n\n` +
          `「夠了！」站在一旁的韓正寰眼底燃起前所未有的狂暴嫉妒，他一把扯下脖頸間的深黑領帶，狠狠上前一步扣住${pName}的另一隻手腕，英挺冷峻的眉眼逼近至極致：\n\n` +
          `「看著我，${pName}！妳到底是在利用他，還是在折磨我？告訴我，妳今晚到底選誰！」\n\n` +
          `兩名頂級男人的體溫與侵略性氣息在長桌邊緣瘋狂交纏，理智在暴雨雷鳴中徹底蕩然無存。結尾的喘息聲在空曠的制策室內迴盪不絕。`;
        generatedChoices = [
          { id: 'custom_erotic_1', label: '[A] 環頸深吻：主動環住徐令謙的脖頸加深這個吻，任由雙手探入他微敞的後背', risk: 'high', hint: '徹底引爆黑幫男主的佔有慾' },
          { id: 'custom_erotic_2', label: '[B] 轉移曖昧：偏過頭喘息著迎向韓正寰「韓檢如果要阻止，不如親自過來把我搶走」', risk: 'high', hint: '在兩雄之間極致點火' },
          { id: 'custom_erotic_3', label: '[C] 抽身推拉：輕輕按住兩人的胸膛拉開微小距離「今晚是談判，兩位未免太心急了」', risk: 'medium', hint: '掌握主動權，維持高位博弈' }
        ];
      } else if (isPhysicalAttack) {
        tensionVal = 92;
        generatedProse = 
          `啪！一聲清脆而響亮的衝擊聲瞬間在寂靜的制策室內炸響！長桌上的瓷器碎片與酒液飛濺，在深色木地板上暈開刺目的痕跡。\n\n` +
          `徐令謙微微側過臉，金絲眼鏡在衝擊下略微歪斜，幾滴液體順著他刀削般的下頜線緩緩滑落。然而他非但沒有震怒，反而伸手優雅地扶正眼鏡，太陰坐命的深眸中燃燒起前所未有的興奮與征服欲：\n\n` +
          `「性子烈得像未馴服的野豹。」徐令謙低低笑出聲，緩步上前一把將她困在長桌與自己胸膛之間，「很好。${pName}，在台北只有敢對我動手的女人，才配得上坐在我徐令謙身邊。」\n\n` +
          `韓正寰亦大步上前擋在兩人中間，一手護住${pName}，冷酷的眉眼直逼徐令謙：「徐二爺，人我今晚必須帶走。如果你想在士林開戰，地檢署奉陪到底。」\n\n` +
          `三方博弈因妳的激烈行動徹底推向不可逆轉的高潮！`;
        generatedChoices = [
          { id: 'custom_atk_1', label: '[A] 決絕迎戰：昂首直視兩人「我不屬於你們任何一方，想掌控我，你們還不夠格」', risk: 'high', hint: '展現極致獨立大女主氣場' },
          { id: 'custom_atk_2', label: '[B] 順勢退守：退至韓正寰身後「韓檢，帶我離開這間瘋子的房間」', risk: 'medium', hint: '藉檢察官之力擺脫黑道糾纏' },
          { id: 'custom_atk_3', label: '[C] 利益破局：將桌上的隨身碟拍在兩人面前「要打出去打，現在聽我把條件說完」', risk: 'low', hint: '強勢收束全場節奏' }
        ];
      } else {
        // 通用自訂行動深層響應
        tensionVal = 88;
        generatedProse = 
          `隨著${pName}做出這一舉動，整間制策室內的空氣產生了不可逆的劇烈激盪！\n\n` +
          `徐令謙目光如手術刀般精準鎖定在她身上，修長的手指輕輕叩擊著胡桃木桌面，嘴角浮現出深不可測的讚賞：「妳的一舉一動，總是能精準踩在最危險的節奏上。敢在我面前做出這種表態的人，全台北找不出第二個。」男人的身形微微前傾，帶著沉沉的壓迫感與若有似無的溫熱氣息逼近。\n\n` +
          `而韓正寰亦一步不退，黑色長風衣隨風微動，冷冽的目光緊緊鎖定著她：「${pName}，妳走的每一步都在鋼絲上跳舞。但既然妳做出了這個舉動，我就絕不會讓徐令謙將妳拖入黑道的深淵。」\n\n` +
          `兩大頂級男人根據妳的行動即時調整了攻防陣線，室內的權謀博弈與情感張力再度翻倍！`;
        generatedChoices = [
          { id: 'custom_gen_1', label: '[A] 深入推進：迎著兩人的視線，進一步拋出手中掌握的核心底牌', risk: 'low', hint: '穩步擴大自身談判籌碼' },
          { id: 'custom_gen_2', label: '[B] 情感推拉：在徐令謙與韓正寰之間進行心理試探，拉滿兩人的佔有欲', risk: 'high', hint: '激化修羅場修羅狀態' },
          { id: 'custom_gen_3', label: '[C] 破局突圍：利用兩人的對峙尋找破局先機，掌控全場生殺大權', risk: 'medium', hint: '大女主智謀破局' }
        ];
      }
    } else {
      // 單人男主攻略模式
      if (isThreatWeapon) {
        tensionVal = 96;
        generatedProse = 
          `雨瀑瘋狂拍打著防彈落地窗，而制策室內的溫度瞬間降至冰點！\n\n` +
          `${pName}指尖寒芒閃爍，冰冷的利刃在電光火石間直接壓上了${targetName}頸側的動脈！鋒利的刀尖緊貼著肌膚，逼出了一絲刺目的血痕。\n\n` +
          `然而${targetName}連眉頭都沒有皺一下。他修長的手指優雅地推開水晶洛克杯，摘下金絲眼鏡隨手扔在長桌上，隨後反手覆上她握刀的手腕。男人的掌心滾燙而孔武有力，帶著不容置疑的掌控力，將刀刃甚至往自己喉頭更逼近了半寸：\n\n` +
          `「拿刀抵著我的喉嚨？${pName}，妳知道在台北敢這麼做的人最後都是什麼下場嗎？」男人的低沉嗓音在耳畔迴盪，溫熱的吐息鑽入領口，「但妳眼底沒有恐懼，只有野心。告訴我，妳想要的是這條命，還是……想要我這個人？」\n\n` +
          `兩人的呼吸在不足三公分的極限距離內劇烈交纏，生死一線間的情慾張力徹底爆棚！`;
        generatedChoices = [
          { id: 'single_threat_1', label: '[A] 冷靜逼問：手腕紋絲不動「我要的是二爺的一句真話，三年前的真相到底是什麼」', risk: 'medium', hint: '以硬碰硬逼取情報' },
          { id: 'single_threat_2', label: '[B] 刀鋒反撩：將刀刃順著他的領口緩緩滑下「我要二爺的人，也要二爺手裡的全部江山」', risk: 'high', hint: '將殺意轉化為極致征服欲' },
          { id: 'single_threat_3', label: '[C] 抽刀後撤：俐落收起武器拉開距離「二爺的命留著，以後還有大用」', risk: 'low', hint: '保持神秘高位' }
        ];
      } else if (isRomanticErotic) {
        tensionVal = 95;
        intoxVal = 60;
        generatedProse = 
          `室內的空氣濃稠得宛如即將燃燒的烈火。\n\n` +
          `${pName}主動跨越了最後的社交界線，柔軟的身軀貼近${targetName}滾燙的胸膛，指尖順著男人的西裝領口滑入，觸碰到他緊繃起伏的肌肉。\n\n` +
          `${targetName}眼中向來引以為傲的冷靜瞬間崩解。他一把扯下金絲眼鏡扔在桌上，粗壯結實的手臂一把攬住她的纖腰，將她整個人霸道地抱坐在胡桃木長桌邊緣！他強勢欺身壓上，將她困在桌緣與胸膛之間，滾燙而帶著威士忌濃烈酒香的吻毫不猶豫地覆上了她的唇瓣：\n\n` +
          `「這是妳主動招惹我的。」他在喘息間咬上她的下唇，眼神深邃幽暗得宛如野獸，「今晚走出這扇門之前，妳別想從我懷裡逃開半分。」\n\n` +
          `兩人交纏的呼吸與輕喘徹底淹沒在窗外的暴雨雷鳴之中！`;
        generatedChoices = [
          { id: 'single_erotic_1', label: '[A] 主動加深：環住他的脖頸主動加深這個吻，任由雙手探入他微敞的襯衫後背', risk: 'high', hint: '徹底釋放情慾' },
          { id: 'single_erotic_2', label: '[B] 輕咬推拉：偏過頭喘息著按住他的肩膀「二爺如果失控了，那我可就算贏了」', risk: 'medium', hint: '在親密中維持言語優勢' },
          { id: 'single_erotic_3', label: '[C] 提醒危機：按住他的胸膛低語「外面的警笛聲……二爺打算怎麼帶我走？」', risk: 'low', hint: '拉回現實權謀' }
        ];
      } else {
        tensionVal = 80;
        generatedProse = 
          `隨著${pName}做出這一舉動，${targetName}原本波瀾不驚的深邃眼眸中，閃過了一抹耐人尋味的危險光芒。\n\n` +
          `他修長的手指輕輕將水晶洛克杯推開，站起身來緩步繞過長桌逼近妳身前。手工皮鞋在木地板上發出沉穩的腳步聲，上位者的從容壓迫感撲面而來：\n\n` +
          `「在士林這片地界，很久沒有人敢在我面前這麼做了。${pName}，妳的每一步都出乎我的意料，但這正是妳最迷人的地方。」他微微俯身，溫熱的呼吸拂過妳耳畔，帶來陣陣酥麻戰慄。\n\n` +
          `空氣中的張力隨著妳的抉擇再度昇華，整個局面的主控權悄然發生了轉移！`;
        generatedChoices = [
          { id: 'single_gen_1', label: '[A] 穩守防線：直視他的眼睛，冷靜開出自己的交換條件', risk: 'low', hint: '保持專業與距離' },
          { id: 'single_gen_2', label: '[B] 機鋒反擊：輕笑一聲反客為主，言語試探男主的心理底線', risk: 'medium', hint: '智慧型反推拉' },
          { id: 'single_gen_3', label: '[C] 肢體挑釁：主動傾身拉近距離，逼視男主深邃眼眸', risk: 'high', hint: '拉滿極限性張力' }
        ];
      }
    }

    return {
      chapterTitle: '第 1 幕 第 ' + turnCount + ' 回：玩家行動響應 · 局勢逆轉',
      prose: generatedProse,
      statusPanel: {
        timeLocation: '2026年5月12日 深夜 於 德行法律事務所頂樓制策室',
        tension: '張力值 [' + tensionVal + '%]',
        intoxication: '微醺度 [' + intoxVal + '%]',
        outfit: pName + '（眼神銳利、氣場全開） ｜ ' + (isShura ? '徐令謙（深灰西裝、玩味侵略） ｜ 韓正寰（黑風衣、持槍護衛）' : targetName + '（深灰西裝、俯身逼近）'),
        interaction: '即時互動 ｜ 玩家行動引發全場格局質變，物理距離不足三十公分',
        inventory: '密錄隨身碟、關鍵情報線索',
        rumors: '事務所外警笛長鳴，黑白兩道全面封鎖周邊街區',
        pageCode: 'P.0' + (turnCount < 10 ? '0' + turnCount : turnCount)
      },
      choices: generatedChoices
    };
  }

  // ========================================================
  // 📜 2. 標準多回合分支故事庫（依回合循序演進，永不迴圈）
  // ========================================================
  if (isShura) {
    if (turnCount === 2) {
      return {
        chapterTitle: '第 1 幕 第 2 回：暗潮迫近 · 雙雄的近身試探',
        prose: '整間制策室內的空氣在這一瞬間彷彿被徹底抽乾。落地窗外的暴雨不知何時化作漫天雷鳴，狂風夾雜著雨瀑狠狠撞擊著防彈鋼化玻璃，發出令人心悸的沉悶鈍響。而在室內昏黃柔和的復古吊燈光暈下，徐令謙與韓正寰兩人的眼神，同時產生了細微而極度危險的質變。\n\n' +
               '徐令謙緩緩將手中那只盛著格蘭花格威士忌的水晶洛克杯擱在胡桃木長桌上，冰塊撞擊厚重杯壁，發出一聲清脆冷冽的輕響。他站起身來，一米八五的修長挺拔身形自長桌上首投下一片沉沉的陰影，深灰色手工訂製三件套西裝襯得他氣質尊貴而具備極強的上位者壓迫感。太陰坐命的眼眸深邃得宛如不見底的古潭，嘴角勾起一抹極淡、耐人尋味的弧度，目光隔著細邊金絲眼鏡深深鎖定在' + pName + '身上：\n\n' +
               '「看來' + pName + '比我想像的更懂得如何玩弄這盤權謀棋局。」徐令謙邁開長腿，手工皮鞋踩在深色木地板上發出沉穩而從容的腳步聲，緩步繞過巨大的胡桃木長桌，步步朝妳逼近。隨著距離迅速拉近，空氣中那股淺焙咖啡的微酸果香與他身上冷冽的雪松雪茄菸草香瞬間將妳密密實實地籠罩其中。他在妳身側不足半米處停下，修長的手指輕輕搭在妳身後的皮質椅背上，微微俯身，帶著上位者近乎居高臨下的審視與隱晦的熾熱：\n\n' +
               '「不過在士林，把底牌亮在一群隨時能吃人不吐骨頭的男人面前，可不是明智之舉。告訴我，妳是在向天裕會求援，還是在試探我徐令謙的底線？」\n\n' +
               '話音未落，一直守在門邊的韓正寰冷笑一聲，攜帶著濃郁清冽的 Diptyque Tam Dao 檀香氣息，長腿邁開大步流星走上前來。臺灣士林地檢署檢察官的黑色長風衣在冷風中微動，胸前的檢察官徽章反射出森冷的光芒。韓正寰一把重重按在胡桃木長桌的另一側邊緣，高大冷峻的身形瞬間將出口與妳的退路再度封死，那雙處女座極度自律而銳利的眼眸宛如刀鋒般逼視著徐令謙與妳：\n\n' +
               '「在士林地檢署的眼皮底下做黑道交易，徐二爺未免太把士林當成天裕會的後花園了。還有妳，' + pName + '——」韓正寰視線猛然下壓，牢牢釘在' + pName + '微顫的睫毛與精緻的鎖骨線上，嗓音低沉得宛如寒冰切過岩石，「不要以為夾在黑白兩道之間能獨善其身。這枚隨身碟一旦插入非法終端，全台北政商黑白兩道都會在天亮前將妳生吞活剝。把隨身碟交給我，這是妳今晚唯一能活著走出德行大樓的生路。」\n\n' +
               '兩名頂級男人一左一右將妳夾在長桌正中，徐令謙俯身逼近妳耳畔，溫熱的呼吸拂過妳微濕的髮絲；韓正寰的目光則如冰霜刀刃般寸步不讓。三方的心跳與呼吸在近在咫尺的距離中交織，危險的性張力與權謀拉扯徹底爆發！',
        statusPanel: {
          timeLocation: '2026年5月12日 21:45 星期二 於 台北市士林區德行法律事務所頂樓制策室',
          tension: '張力值 [82%]',
          intoxication: '微醺度 [30%]',
          outfit: pName + '（素雅長裙、微濕髮絲、眼神敏銳） ｜ 徐令謙（深灰西裝、金錶、俯身玩味） ｜ 韓正寰（黑風衣、地檢徽章、冷峻刀鋒視線）',
          interaction: '雙雄包夾 ｜ 徐令謙近身立於右側，韓正寰雙手撐桌逼近左側，物理距離不足四十公分',
          inventory: '弘楊集團洗錢暗帳隨身碟、瑾和基金會特許證',
          rumors: '士林地檢署偵查車隊已抵達德行東路街口，黑白兩道暗潮即將見血',
          pageCode: 'P.002'
        },
        choices: [
          { id: 'opt_2a', label: '[A] 冷靜制衡：神色自若地抬眸迎向韓正寰「韓檢如果要扣人，現在就請拿出拘票」', risk: 'low', hint: '以程序正義化解檢察官的壓迫' },
          { id: 'opt_2b', label: '[B] 轉向黑道：側身貼近徐令謙，將指尖搭在他西裝手臂「二爺，既然地檢署咬得這麼緊，您打算怎麼帶我走？」', risk: 'medium', hint: '借黑幫之勢破局，拉扯兩人敵意' },
          { id: 'opt_2c', label: '[C] 極限挑釁：同時看向兩人，唇角勾起挑釁輕笑「如果這份帳冊，我今晚誰都不給呢？」', risk: 'high', hint: '將雙方佔有欲與征服欲拉到極致' }
        ]
      };
    } else if (turnCount === 3) {
      return {
        chapterTitle: '第 1 幕 第 3 回：指尖交鋒 · 密錄解密與心智攻防',
        prose: '窗外的雷雨愈發狂暴，整座台北士林在電閃雷鳴中陷入詭譎的沉寂，唯有德行事務所頂層制策室內，三人間的呼吸與心跳清晰可辨。\n\n' +
               '徐令謙眼中閃過一絲極淡卻令人心悸的讚賞。男人的手掌忽然自椅背抬起，帶著微涼的溫度直接覆上了' + pName + '搭在手提包上的手背。男人的手指修長而骨節分明，帶著常年握筆與雪茄的微繭，輕輕摩挲過她白皙敏感的腕骨，那一瞬間帶起的細微電流讓整條手臂都泛起一陣酥麻戰慄。\n\n' +
               '「既然' + pName + '有這份膽魄，那今晚這盤棋，就由妳來開局。」徐令謙低沉磁性的嗓音在耳畔徐徐響起，他順勢牽引著她的手，將那枚冰冷的加密隨身碟精準推入胡桃木桌面上的特製安全終端機。螢幕幽藍的光芒瞬間亮起，將三人近在咫尺的面龐映照得輪廓分明。\n\n' +
               '密碼破解的進度條在幽藍代碼中飛速跳動，伴隨著一聲清脆的解鎖提示音，第一層隱秘檔案赫然展開——螢幕上赫然列出法務部高層、弘楊集團與士林地檢署三年前未結洗錢案的資金流向圖與洗錢帳冊名單！那一連串牽扯數百億金流的政商名流簽名，在幽藍光線下顯得格外觸目驚心。\n\n' +
               '站在對側的韓正寰瞳孔驟然一縮，挺拔的身形猛地上前一步，長風衣下擺帶起一陣 Diptyque Tam Dao 檀香風壓。他一手重重按住鍵盤上方，冰冷銳利的視線自螢幕猛然轉向' + pName + '，目光中除了司法官慣有的審訊刀芒，更多了一抹被強烈吸引、深不見底的情愫：\n\n' +
               '「' + pName + '，妳知道這份名單一旦外洩，全台灣會有多少政商巨頭想要妳的命嗎？留在這裡，徐令謙只會把妳當成替天裕會洗白的替罪羔羊。把隨身碟交給我，我能以司法證人保護法，二十四小時親自保護妳的安全，寸步不離。」\n\n' +
               '韓正寰邊說邊逼近，高大英挺的身軀幾乎與她呼吸相聞，胸膛劇烈起伏著。而徐令謙則發出一聲極淡的冷笑，攬在' + pName + '腰側的手臂微微收緊，將她更深地拉向自己身側：\n\n' +
               '「保護？」徐令謙輕嗤一聲，太陰坐命的眼眸深邃如無底深淵，「韓檢察官，地檢署的保護，何時比得上我徐令謙的一句承諾？在台北這片地界，只要我徐令謙開口護著的人，誰敢動她一根頭髮，誰就得準備好沉入淡水河底。」\n\n' +
               '黑幫幕後二把手與司法界白日判官在咫尺之間為了她針鋒相對，權力籌碼、生死危機與男人專屬的佔有欲在電光石火間激烈碰撞，室內的危險張力再度飆升至全新頂點！',
        statusPanel: {
          timeLocation: '2026年5月12日 22:05 星期二 於 德行法律事務所頂樓制策室',
          tension: '張力值 [88%]',
          intoxication: '微醺度 [40%]',
          outfit: pName + '（長裙微亂、呼吸急促、雙眸明亮） ｜ 徐令謙（解開西裝首鈕、眼神侵略性顯露） ｜ 韓正寰（風衣敞開、領帶微鬆、視線熾熱）',
          interaction: '肢體碰觸 ｜ 徐令謙手掌覆於腕間，韓正寰俯身按桌逼近，三人距離不足二十公分',
          inventory: '弘楊集團第一層洗錢帳冊（已解密）',
          rumors: '地檢署特勤隊與天裕會外圍人馬在德行東路形成對峙，氣氛肅殺',
          pageCode: 'P.003'
        },
        choices: [
          { id: 'opt_3a', label: '[A] 利益捆綁：反握住徐令謙的手腕，冷靜直視螢幕「既然二爺許下承諾，這份名單我們就一起看下去」', risk: 'low', hint: '鞏固與黑幫二把手的同盟' },
          { id: 'opt_3b', label: '[B] 誘敵深入：偏頭迎向韓正寰的熾熱視線「韓檢若想讓我做污點證人，得先證明你有保護我的能耐」', risk: 'medium', hint: '反撩檢察官，激發其男性保護欲與征服欲' },
          { id: 'opt_3c', label: '[C] 奪回主導：同時掙脫兩人的禁錮，單手拔出隨身碟壓在胸口「現在核心密碼在我手裡，兩位得拿出真正的誠意了」', risk: 'high', hint: '主導全場節奏，將兩人對自己的渴望推至頂峰' }
        ]
      };
    } else if (turnCount === 4) {
      return {
        chapterTitle: '第 1 幕 第 4 回：微醺推拉 · 扯下眼鏡與情慾臨界',
        prose: '制策室內的空氣已經濃稠得宛如即將引爆的火藥桶，每一次吸氣都伴隨著戰慄與滾燙的溫度。\n\n' +
               '長桌上的格蘭花格威士忌已經見底，空氣中頂級烈酒的醇厚辛香與淺焙咖啡的果酸交纏，令人神智微醺卻又感官成倍放大。落地窗外一道慘烈的白熾電光撕裂夜空，轟鳴的雷聲將三人的剪影拉長在深色胡桃木牆面上。\n\n' +
               '徐令謙緩緩抬起左手，修長而骨節分明的手指輕輕捏住鼻樑上的金絲眼鏡邊緣，將眼鏡優雅地摘了下來。失去鏡片的遮掩後，那雙太陰坐命的深邃眼眸裡，久居上位的溫和紳士假面徹底褪去，取而代之的是毫不掩飾的掠奪欲與熾烈慾念。他將眼鏡隨手丟在長桌上，發出一聲清脆的微響，隨後欺身俯下，近到微涼的薄唇幾乎貼上' + pName + '泛紅而敏感的耳垂：\n\n' +
               '「' + pName + '，妳很清楚，從妳今晚帶著這份底牌踏進這間房間開始，我就沒打算放妳完好無損地走出去。」徐令謙的嗓音沙啞而富有磁性，溫熱的吐息鑽入她白皙的鎖骨與領口間，帶著雪茄菸草與威士忌的微醺酒氣，「妳要真相，我給妳；妳要權力與庇護，我也能給妳。但代價……是妳今晚必須留在我的身邊。」\n\n' +
               '「徐令謙，放開她！」站在對側的韓正寰眼底燃起前所未有的暴戾與嫉妒。向來以極度自律與冷酷著稱的士林地檢署白日判官，此刻一把扯下了脖子上的深黑真絲領帶，單手狠狠將領口扯開兩顆鈕扣，露出堅實緊繃的鎖骨線條。韓正寰大步上前，一把扣住' + pName + '的另一隻手腕，用力將她自徐令謙的氣息範圍內拉近自己懷中，隔著單薄的長裙布料，她能清晰感受到檢察官堅硬如鐵的胸肌與急促狂亂的心跳：\n\n' +
               '「不要聽他的甜言蜜語。跟著黑道，妳只會粉身碎骨。看著我，' + pName + '，告訴我妳到底相信誰？」韓正寰嗓音低沉得宛如壓抑的咆哮，高大的身軀幾乎將她整個人禁錮在懷中。\n\n' +
               '兩名頂級男人的呼吸在耳邊交纏，一左一右的溫度與霸道觸感將感官推向瘋狂的臨界點，理智與情慾的防線在暴雨夜徹底崩解！',
        statusPanel: {
          timeLocation: '2026年5月12日 22:30 星期二 於 德行法律事務所頂樓制策室',
          tension: '張力值 [94%]',
          intoxication: '微醺度 [55%]',
          outfit: pName + '（長裙微敞、面色潮紅、眼神迷離而清醒） ｜ 徐令謙（摘除眼鏡、襯衫袖口挽起、氣息熾熱） ｜ 韓正寰（解開領帶、白襯衫微開、肌肉緊繃）',
          interaction: '極限推拉 ｜ 徐令謙近身貼耳耳語，韓正寰單手緊扣肩膀，身體幾乎完全貼合',
          inventory: '洗錢弊案核心隨身碟（已鎖定）',
          rumors: '台北政壇傳聞地檢署今夜將發動特搜，整座士林區已被暗中封控',
          pageCode: 'P.004'
        },
        choices: [
          { id: 'opt_4a', label: '[A] 理性剎車：按住徐令謙探入腰間的手指，微喘著冷靜「兩位，今晚是談判，你們越界了」', risk: 'low', hint: '穩住陣腳，維持神秘不可侵犯的底線' },
          { id: 'opt_4b', label: '[B] 曖昧推拉：接過徐令謙的酒杯抿了一口，輕笑渡向韓正寰「韓檢不是向來清心寡慾？怎麼現在心跳這麼快」', risk: 'medium', hint: '在兩人之間點火，將修羅場嫉妒值拉滿' },
          { id: 'opt_4c', label: '[C] 徹底沉淪：雙手勾上徐令謙的頸項主動迎吻，任由危險情慾在韓正寰眼前徹底爆發', risk: 'high', hint: '引發最高級別的視覺與心理衝擊，打破所有防線' }
        ]
      };
    } else if (turnCount === 5) {
      return {
        chapterTitle: '第 1 幕 第 5 回：絕境破局 · 暴雨突圍與命運定契',
        prose: '刺耳的特勤警笛長鳴聲突然撕裂了士林的夜空！德行法律事務所大樓下方傳來重型裝甲防暴車的急煞聲與急促的皮靴腳步聲，紅藍交錯的爆閃警燈穿透重重暴雨，將頂層制策室照得宛如白晝。\n\n' +
               '「報告韓檢，特搜隊與法警已經攻破一樓大廳，防爆隊正在破除梯廳電控！」韓正寰腰間的加密對講機傳來特勤隊長急促的呼叫聲，但韓正寰握著對講機的手指青筋暴起，目光卻自始至終沒有從' + pName + '精緻的面容上移開半秒。\n\n' +
               '長桌另一端的徐令謙冷笑一聲，神色自若地自桌下暗格取出一把銀色柯爾特手槍，修長的手指熟練地上膛，發出金屬撞擊的清脆喀嗒聲。他反手一把攬住' + pName + '纖細的腰肢，將她整個人霸道地拉入自己懷中，另一隻手猛地按下了胡桃木書架後方的隱蔽暗門開關！\n\n' +
               '厚重的書架應聲滑開，露出一道通往地下私家車庫的隱密安全暗道。\n\n' +
               '「地檢署的動作比我想像的快了十分鐘。不過在這座士林，天裕會想走的路，還沒有任何人能攔得住。」徐令謙低頭注視著懷裡的' + pName + '，眼底燃燒著無可退讓的佔有慾與野性魅力，「' + pName + '，暗道直通地下私家碼頭。現在做出妳最後的抉擇——是跟著韓檢察官回去接受調查、在法庭上做個沒有自由的污點證人，還是……跟我走，做我徐令謙拿命護著的女人？」\n\n' +
               '「' + pName + '，不要相信黑幫！」韓正寰一步踏前，伸手死死扣住' + pName + '的手腕，眼底血絲畢露，向來冷峻的面龐滿是焦灼，「跟我走，我拿我整個檢察官生涯與前途，擔保妳今晚絕對平安無事！」\n\n' +
               '大門外已經傳來破門錘狂暴的撞擊聲，警報聲震耳欲聾。在生死存亡與情慾狂瀾的交界處，命運的終極天平正懸於她的一念之間，第一幕的最高潮就此引爆！',
        statusPanel: {
          timeLocation: '2026年5月12日 22:50 星期二 於 德行法律事務所頂樓密室暗道前',
          tension: '張力值 [98%]',
          intoxication: '微醺度 [50%]',
          outfit: pName + '（身陷雙雄懷中、髮絲凌亂、眼神決絕） ｜ 徐令謙（持槍護衛、西裝半敞、霸道佔有） ｜ 韓正寰（持證死守、雙眼赤紅、寸步不讓）',
          interaction: '生死抉擇 ｜ 徐令謙攬腰拉入暗道，韓正寰死扣手腕阻攔，三方命運懸於一線',
          inventory: '密錄隨身碟、地下暗道逃生鑰匙',
          rumors: '士林地檢署與特勤隊強攻德行事務所，整座台北政壇即將大洗牌',
          pageCode: 'P.005'
        },
        choices: [
          { id: 'opt_5a', label: '[A] 攜手黑道：反手扣緊徐令謙的五指「二爺，帶我走，以後我就是你的人」', risk: 'high', hint: '正式踏入黑幫世界，與徐令謙生死與共' },
          { id: 'opt_5b', label: '[B] 轉向司法：用力甩開徐令謙，撲入韓正寰懷中「韓檢，隨身碟交給你，帶我離開這裡」', risk: 'medium', hint: '選擇體制與司法正義，與韓正寰開啟白日戀情' },
          { id: 'opt_5c', label: '[C] 雙面通吃：在兩人夾縫中按下暗道炸藥定時器「兩位，誰先帶我突圍，隨身碟就是誰的！」', risk: 'high', hint: '極致獨立大女主，將兩大勢力玩弄於股掌之間' }
        ]
      };
    } else {
      // Turn 6+ 動態逃亡與後續延伸篇章
      return {
        chapterTitle: '第 1 幕 第 ' + turnCount + ' 回：暗夜狂瀾 · 碼頭突圍與全新盟約',
        prose: '轟然一聲巨響，特勤隊的爆破火光在制策室大門處猛烈爆開！濃煙與暴雨自破碎的落地窗灌入，而暗道深處，徐令謙與韓正寰的身影在狹窄的石階上拉得極長。\n\n' +
               '徐令謙的手指始終緊緊扣在' + pName + '的指縫間，掌心的溫度滾燙得幾乎灼人。男人在狂風暴雨中拉開了地下碼頭黑色快艇的防雨布，銀色手槍精準擊碎了後方追擊者的探照燈：\n\n' +
               '「在台北，只要我徐令謙不想讓妳死，閻王來了也帶不走妳。」他轉過身，單手將西裝大衣裹緊在她身上，微捲的黑髮被雨水打濕，露出一雙野性而深邃的眼眸，「上船，今晚我們去陽明山私家山莊避雨。天亮之前，整座台北都會為我們洗牌。」\n\n' +
               '而韓正寰亦在最後一刻跳上快艇船尾，收起配槍抹去臉上的雨水，英挺的眉眼在雷光中深深凝視著' + pName + '：「徐令謙，別以為妳能獨佔她。今晚的案子，士林地檢署跟到底了。」\n\n' +
               '快艇如離弦之箭般破開淡水河的滔天巨浪，三人的命運在夜色與波濤中更加緊密地糾纏在一起。',
        statusPanel: {
          timeLocation: '2026年5月12日 23:20 星期二 於 淡水河口暗夜快艇',
          tension: '張力值 [99%]',
          intoxication: '微醺度 [40%]',
          outfit: pName + '（披著徐令謙大衣、髮絲濕透） ｜ 徐令謙（持槍掌舵、野性狂傲） ｜ 韓正寰（背靠船舷、眼神熾烈）',
          interaction: '亡命共渡 ｜ 快艇高速顛簸，三人緊貼在狹小駕駛艙，心跳與呼吸交融',
          inventory: '隨身碟（完整解密備份）、陽明山安全屋門卡',
          rumors: '台北市警局發布一級全市警戒，全城搜索消失的黑白巨頭',
          pageCode: 'P.0' + (turnCount < 10 ? '0' + turnCount : turnCount)
        },
        choices: [
          { id: 'opt_' + turnCount + 'a', label: '[A] 深入山莊：握住徐令謙掌舵的手「二爺，去陽明山，我們今晚好好算這筆帳」', risk: 'high', hint: '進入男主私密領地' },
          { id: 'opt_' + turnCount + 'b', label: '[B] 私下結盟：在船艙陰影處握住韓正寰微涼的指尖「韓檢，到了安全屋，我有單獨的情報給你」', risk: 'medium', hint: '雙面周旋，維持平衡' },
          { id: 'opt_' + turnCount + 'c', label: '[C] 大女主定局：接過快艇油門舵盤「這艘船現在由我來開，誰敢礙事就跳下去」', risk: 'high', hint: '強勢接管逃亡路線' }
        ]
      };
    }
  } else {
    // 單人攻略主線模式
    if (turnCount === 2) {
      return {
        chapterTitle: '第 1 幕 第 2 回：步步逼近 · 咫尺之間的氣息交纏',
        prose: '室內的空氣在這一瞬間彷彿凝固了幾分。窗外的暴雨不知何時變得更加湍急，瘋狂敲擊著德行法律事務所頂層的防彈落地窗，而室內暖黃的復古黃銅立燈光影下，' + targetName + '原本平靜無波的嘴角，緩緩勾起了一抹極淡、卻透著致命危險的弧度。\n\n' +
               '他修長而骨節分明的手指輕輕將水晶洛克杯推開，冰塊在金黃色的格蘭花格威士忌中發出清脆的撞擊聲。' + targetName + '站起身來，一米八五的修長挺拔身形在昏黃光暈中投下一片沉沉的陰影，帶著久居上位者的從容壓迫感，緩步繞過巨大的深黑胡桃木長桌，朝妳走來。\n\n' +
               '每一步落下，手工皮鞋在深色木地板上發出的微弱聲響，都宛如重重敲擊在' + pName + '緊繃的心弦上。隨著兩人的距離迅速拉近至不足三十公分，那股混雜著新北三峽思慕咖啡淺焙豆的微酸果香、冷冽雪松與高級菸草的獨特木質氣息撲面而來，將妳整個人密密實實地籠罩其中。\n\n' +
               '「在士林這片地界，很久沒有人敢用這種口吻跟我說話了。」' + targetName + '微微俯下身，雙手撐在妳身側的皮質椅背扶手上，高大的身軀將妳完全禁錮在自己的氣息範圍之內。金絲眼鏡後的深邃雙眸直勾勾地鎖定著妳的視線，語調低沉得宛如耳語，溫熱的呼吸若有似無地拂過妳耳畔微濕的髮絲：\n\n' +
               '「妳很聰明，也很有膽識。但妳要知道，聰明的女人在台北容易得到籌碼，卻也最容易成為這盤權力棋局裡第一個被吃掉的棋子。告訴我，妳到底想要什麼？是真相、金錢，還是……我徐令謙能給妳的特權？」\n\n' +
               '室內兩人交纏的呼吸與心跳清晰可聞，危險的情慾張力與權謀試探在咫尺之間激烈拉扯，等待著妳的下一次破局。',
        statusPanel: {
          timeLocation: '2026年5月12日 21:45 星期二 於 台北市士林區德行法律事務所頂樓制策室',
          tension: '張力值 [75%]',
          intoxication: '微醺度 [30%]',
          outfit: pName + '（素雅大衣、呼吸微促、眼神堅定） ｜ ' + targetName + '（深灰手工西裝、解開第一顆襯衫扣、俯身逼近）',
          interaction: '近距離推拉 ｜ 男主雙手撐於椅背扶手，俯身靠近，距離不足三十公分',
          inventory: '特許採訪證、洗錢弊案密錄隨身碟',
          rumors: '天裕會門口出現可疑跟監車輛，士林地檢署偵查車在周邊靜候',
          pageCode: 'P.002'
        },
        choices: [
          { id: 'choice_2a', label: '[A] 保持冷靜：迎著他的俯視不退半步，冷靜抬手抵在他西裝前襟「我要的是二爺的一句承諾」', risk: 'low', hint: '穩守心理防線，展現平等談判底氣' },
          { id: 'choice_2b', label: '[B] 機鋒反擊：輕輕偏過頭避開他的呼吸，低笑一聲「二爺這麼急著靠過來，是怕我把隨身碟交給別人？」', risk: 'medium', hint: '反將一軍，打破他的壓迫節奏' },
          { id: 'choice_2c', label: '[C] 情慾破局：指尖順著他深灰西裝領口緩緩滑下，仰起臉直視他的薄唇「如果我說……我想要的是二爺這個人呢？」', risk: 'high', hint: '主動跨越肢體界限，強烈引發性張力反差' }
        ]
      };
    } else if (turnCount === 3) {
      return {
        chapterTitle: '第 1 幕 第 3 回：指尖試探 · 掌心溫度與底牌揭露',
        prose: '落地窗外一道刺目的白熾電光撕裂漆黑夜空，重重雷聲轟鳴滾過士林上空，而在德行事務所制策室內，' + targetName + '眼底的玩味與審視卻愈發深沉。\n\n' +
               '男人那隻骨節分明、修長而微涼的手掌忽然抬起，指尖帶著不容置疑的力道，輕輕托住了' + pName + '小巧精緻的下頜。他微微施力，強迫她揚起那張清冷而絕美的面龐，直視自己金絲眼鏡後深不見底的雙眸。男人指腹上帶著常年握筆與雪茄的粗礪微繭，緩緩摩挲過她細膩敏感的下頜肌膚，激起一陣酥麻而危險的觸感電流。\n\n' +
               '「想要我？」' + targetName + '低低笑了一聲，聲音低沉得宛如大提琴低音弦在胸腔深處共鳴，語調中透著久居上位者的從容與令人心悸的危險，「在台北這片土地上，敢當著我的面開口說想要我徐令謙的人，妳還是第一個。」\n\n' +
               '他另一隻手自她纖細的指尖接過隨身碟，冰冷的金屬外殼在兩人交疊的掌心中迅速染上彼此的體溫。' + targetName + '始終沒有移開注視著她的目光，單手將隨身碟推入長桌邊緣的特製加密安全終端。伴隨著一聲清脆的解鎖音，螢幕藍光幽幽亮起，三年前法務部、地檢署與天裕會牽扯數百億的洗錢密帳在兩人眼前徐徐展開。\n\n' +
               '「這份帳冊確實能把台北政商界掀個底朝天，但只要我動動手指，明天全台北就不會有人再記得妳的名字。」' + targetName + '微微俯下身，挺直的鼻尖幾乎貼上她的鼻尖，溫熱醇厚的格蘭花格威士忌酒氣與冷冽雪松香氣將她密不透風地包圍，「告訴我，' + pName + '，握著這柄足以殺死我的雙面刃，妳打算怎麼處置我？」\n\n' +
               '兩人的心跳在不足五公分的極限距離內猛烈共鳴，空氣中的情慾張力已經拉緊到了即將斷裂的邊緣！',
        statusPanel: {
          timeLocation: '2026年5月12日 22:05 星期二 於 德行法律事務所頂樓制策室',
          tension: '張力值 [85%]',
          intoxication: '微醺度 [40%]',
          outfit: pName + '（面頰泛紅、眼神無懼、長裙微皺） ｜ ' + targetName + '（托頜俯身、金絲眼鏡微斜、眼神深邃幽暗）',
          interaction: '肢體接觸 ｜ 男主托住下頜，鼻尖距離不足五公分，掌心溫度灼熱',
          inventory: '洗錢帳冊（已開啟第一層目錄）',
          rumors: '士林地檢署韓正寰已率隊出發，目標直指德行事務所',
          pageCode: 'P.003'
        },
        choices: [
          { id: 'choice_3a', label: '[A] 談判鎖定：直視他的眼睛「我不要你的命，我要你成為我背後的靠山」', risk: 'low', hint: '確立利益共生關係' },
          { id: 'choice_3b', label: '[B] 曖昧挑釁：抬起另一隻手覆上他托住下頜的手腕「處置？二爺看起來可不像是任人處置的樣子」', risk: 'medium', hint: '肢體反推拉，拉滿情慾博弈' },
          { id: 'choice_3c', label: '[C] 侵略性反吻：踮起腳尖，薄唇輕輕擦過他的唇角「處置你的方式……今晚由我說了算」', risk: 'high', hint: '主動跨越最後防線，激發男主極限佔有慾' }
        ]
      };
    } else if (turnCount === 4) {
      return {
        chapterTitle: '第 1 幕 第 4 回：微醺失控 · 扯下眼鏡與極限佔有',
        prose: '室內最後一絲微弱的理性防線，在這一刻被狂暴的慾望徹底碾碎。\n\n' +
               targetName + '眼中向來引以為傲的冷靜與自律，在兩人近距離交纏的呼吸中化為烏有。他單手抬起，修長的手指一把扯下鼻樑上的金絲眼鏡，隨手扔在厚重奢華的地毯上，發出一聲悶響。沒有了鏡片的阻隔，那雙深邃如寒潭的太陰眼眸裡，燃燒著令人心悸的熾熱慾火與近乎野獸般的征服欲。\n\n' +
               '「妳真是不知死活。」\n\n' +
               targetName + '低哼一聲，粗壯有力的手臂一把攬住' + pName + '纖細的腰肢，將她整個人霸道而輕巧地抱起，直接放在巨大的深黑胡桃木長桌邊緣！桌上的咖啡杯與文件被隨意掃落一旁，發出瓷器撞擊的清脆碎裂聲。他高大挺拔的身軀隨即強勢欺身壓上，將她完全困在長桌與自己滾燙堅硬的胸膛之間。\n\n' +
               '男人的大手穿插進她微濕的自然捲長髮中，緊緊固定住她的後腦，溫熱而帶著威士忌濃烈酒香的薄唇毫不猶豫地覆了下來！這個吻強勢、霸道且不容抗拒，粗暴而靈活地撬開她的齒關，帶著久居上位者的掠奪與徹底的失控，將兩人交纏的呼吸與輕喘完全淹沒在窗外滂沱的暴雨雷鳴之中。\n\n' +
               '良久，他微微鬆開被吻得殷紅微腫的唇瓣，額頭抵著她的額頭，兩人的胸口劇烈起伏，呼吸滾燙地噴灑在彼此頸側，眼神在昏暗的光線下拉扯出無盡黏膩的情慾：\n\n' +
               '「現在……妳還覺得這只是一場冷血的利益交易嗎？」',
        statusPanel: {
          timeLocation: '2026年5月12日 22:30 星期二 於 德行法律事務所頂樓胡桃木長桌',
          tension: '張力值 [95%]',
          intoxication: '微醺度 [60%]',
          outfit: pName + '（坐在長桌邊緣、衣衫微亂、唇色殷紅） ｜ ' + targetName + '（摘下眼鏡、西裝褪下搭在椅背、襯衫領口敞開）',
          interaction: '深度親吻 ｜ 抱坐於胡桃木桌緣，身軀完全貼合，呼吸劇烈起伏',
          inventory: '隨身碟已全數解密',
          rumors: '事務所外傳來急促警笛聲，地檢署車隊已封鎖街區',
          pageCode: 'P.004'
        },
        choices: [
          { id: 'choice_4a', label: '[A] 輕咬喘息：雙手攀附在他緊繃的肩膀上「二爺如果失控了，那我可就算贏了」', risk: 'medium', hint: '情慾推拉，在親密中維持言語優勢' },
          { id: 'choice_4b', label: '[B] 主動加深：環住他的脖頸主動加深這個吻，任由雙手探入他微敞的襯衫後背', risk: 'high', hint: '徹底釋放慾望，觸碰男主緊實肌理' },
          { id: 'choice_4c', label: '[C] 提醒危機：偏過頭喘息著按住他的胸膛「外面的警笛……二爺打算怎麼帶我走？」', risk: 'low', hint: '將情慾拉回現實危機，考驗男主決策' }
        ]
      };
    } else if (turnCount === 5) {
      return {
        chapterTitle: '第 1 幕 第 5 回：暗夜突圍 · 生死與共的終局定約',
        prose: '砰！一聲沉悶的巨響自德行大樓下方傳來，緊接著是撕心裂肺的防空級警報長鳴與特勤隊破門的腳步聲！\n\n' +
               '刺目的紅藍爆閃警燈透過防彈落地窗，在凌亂的胡桃木長桌與兩人微亂的身影上投下斑駁的光影。整座德行法律事務所已被士林地檢署與特警重重包圍，黑白兩道的大戰已箭在弦上。\n\n' +
               targetName + '眼中閃過一絲冷冽的殺伐鋒芒，動作卻沒有絲毫慌亂。他站直身軀，反手將深灰西裝外套披在' + pName + '肩頭，替她遮擋住外面的冷風與微敞的衣衫，隨後自桌下暗格取出一柄銀色柯爾特手槍熟練上膛，另一隻手緊緊扣住她的十指，掌心傳來無比安心的滾燙力量：\n\n' +
               '「看來士林地檢署今晚是鐵了心要跟我徐令謙算總帳了。」' + targetName + '轉過身，按下了牆上隱蔽暗門的開關，轉頭看向她，嘴角浮現出一抹充滿野性魅力與狂傲的笑意，「這條暗道直通地下私家碼頭。走出這扇門，妳就是天裕會唯一的二夫人，也是我徐令謙拿命護著的女人。怕嗎？」\n\n' +
               '身後的制策室大門傳來電鋸破門的刺目火花聲，而眼前的男人緊緊牽著她的手，在生死存亡的深淵邊緣，向她遞出了通往未來的唯一契約。',
        statusPanel: {
          timeLocation: '2026年5月12日 22:50 星期二 於 德行事務所地下暗道入口',
          tension: '張力值 [98%]',
          intoxication: '微醺度 [50%]',
          outfit: pName + '（披著男主西裝外套、十指緊扣） ｜ ' + targetName + '（持槍戒備、白襯衫微敞、眼神銳利果決）',
          interaction: '生死相依 ｜ 十指緊扣，持槍掩護，踏入地下暗道',
          inventory: '洗錢帳冊完整拷貝、地下碼頭快艇鑰匙',
          rumors: '特警破門進入德行事務所，整座台北政壇陷入全面地震',
          pageCode: 'P.005'
        },
        choices: [
          { id: 'choice_5a', label: '[A] 堅定握緊：緊緊扣住他的手指「有二爺在，我什麼都不怕，走吧」', risk: 'high', hint: '確定終身盟約，邁入第二幕' },
          { id: 'choice_5b', label: '[B] 舉槍相助：自他腰間抽出一柄備用手槍「誰要你保護？今晚我們一起殺出去」', risk: 'medium', hint: '展現強悍實力，雙強攜手突圍' },
          { id: 'choice_5c', label: '[C] 終極破局：將隨身碟扔在桌上設定自毀定時「讓他們留在這裡替我們收尾，我們走！」', risk: 'high', hint: '引爆第一幕所有線索，瀟灑離去' }
        ]
      };
    } else {
      // Turn 6+
      return {
        chapterTitle: '第 1 幕 第 ' + turnCount + ' 回：碼頭破浪 · 隱秘山莊的深夜對飲',
        prose: '暴雨中的淡水河水花四濺，快艇的引擎在狂風巨浪中咆哮著撕裂夜色！\n\n' +
               targetName + '單手掌舵，另一隻手始終牢牢護在' + pName + '身側。快艇以極限速度繞過關渡大橋的警戒封鎖線，直接切入了天裕會專屬的隱蔽入海閘口。\n\n' +
               '半小時後，陽明山半山腰的私家避雨別墅內，壁爐裡的木柴劈啪作響，驅散了周身刺骨的雨水寒意。' + targetName + '褪去濕透的白襯衫，露出線條分明、帶著幾道淡色舊傷疤的堅實後背。他倒了兩杯熱朗姆酒遞給她，深邃的眼眸在溫暖的火光下凝視著她泛紅的臉頰：\n\n' +
               '「今晚台北鬧翻了天，但這裡只有我們兩個人。」男人的指尖擦過她被雨水濡濕的睫毛，語氣沙啞而專注，「${pName}，現在妳握著我全部的秘密，我也掌握著妳的未來。告訴我，接下來妳想怎麼走這盤棋？」\n\n' +
               '窗外是整座台北城閃爍的百萬夜景，而室內只有兩顆貼近的心跳在溫熱的酒香中劇烈共鳴。',
        statusPanel: {
          timeLocation: '2026年5月13日 00:30 星期三 於 陽明山私家避雨山莊壁爐前',
          tension: '張力值 [80%]',
          intoxication: '微醺度 [65%]',
          outfit: pName + '（身著寬鬆乾淨白浴袍、面色潮紅） ｜ ' + targetName + '（赤裸上身、身披薄毯、眼神溫柔熾熱）',
          interaction: '私密共處 ｜ 兩人並肩坐在壁爐地毯前，肩膀相依，酒杯輕碰',
          inventory: '陽明山莊安全密碼、暗網聯絡終端',
          rumors: '全台北黑白兩道掘地三尺搜尋兩人下落，天裕會全面轉入地下',
          pageCode: 'P.0' + (turnCount < 10 ? '0' + turnCount : turnCount)
        },
        choices: [
          { id: 'single_adv_1', label: '[A] 舉杯共飲：輕碰他的酒杯「既然上了二爺的賊船，我就陪你走到底」', risk: 'low', hint: '深化情感與同盟羈絆' },
          { id: 'single_adv_2', label: '[B] 指尖輕撫：伸手輕輕撫過他背上的舊傷痕「二爺身上的傷，是怎麼來的？」', risk: 'high', hint: '觸碰男主內心最深處的脆弱與過往' },
          { id: 'single_adv_3', label: '[C] 運籌帷幄：取出加密終端「趁著今晚全城大亂，我們現在就發動反擊」', risk: 'medium', hint: '大女主智取台北政商界' }
        ]
      };
    }
  }
}

async function handleCharacterCreationSubmit() {
  const targetSelect = document.getElementById('form-target-lead');
  const selectedOption = targetSelect ? targetSelect.options[targetSelect.selectedIndex] : null;
  
  const playerProfile = {
    name: (document.getElementById('form-player-name')?.value || '阮思薇').trim(),
    gender: document.getElementById('form-player-gender')?.value || '女',
    age: (document.getElementById('form-player-age')?.value || '25').trim(),
    profession: (document.getElementById('form-player-profession')?.value || '調查記者').trim(),
    background: (document.getElementById('form-player-background')?.value || '').trim(),
    appearance: (document.getElementById('form-player-appearance')?.value || '').trim(),
    taboos: (document.getElementById('form-player-taboos')?.value || '無').trim(),
    targetLead: targetSelect ? targetSelect.value : '01_徐令謙',
    targetLeadName: selectedOption ? selectedOption.getAttribute('data-name') : '徐令謙',
    allowR18: document.getElementById('form-allow-r18') ? document.getElementById('form-allow-r18').checked : true,
    customScenario: (document.getElementById('form-custom-scenario')?.value || '').trim()
  };

  showLoading('以太筆觸流轉中，主筆作家正在為您構建第 1 回篇章……');

  // 初始化第 1 回
  loadMockDataWithProfile(playerProfile);
  
  if (dom.charCreationModal) dom.charCreationModal.style.display = 'none';
  hideLoading();
  
  // 進入遊戲畫面並滾動至頂部
  switchView('gameplay');
  window.scrollTo({ top: 0, behavior: 'smooth' });
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


// ==========================================
// 🏠 首頁與視圖切換系統 (Home & View Management)
// ==========================================

function switchView(targetView) {
  if (targetView === 'home') {
    if (dom.homeView) dom.homeView.style.display = 'block';
    if (dom.gameplayView) dom.gameplayView.style.display = 'none';
    updateHomeViewDisplay();
  } else {
    if (dom.homeView) dom.homeView.style.display = 'none';
    if (dom.gameplayView) dom.gameplayView.style.display = 'block';
    // 平滑滾動至故事底部
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
}

function updateHomeViewDisplay() {
  const isLoggedIn = !!(state.token && state.username);
  if (dom.homeUsernameDisplay) {
    dom.homeUsernameDisplay.textContent = isLoggedIn ? `${state.username}（專屬雲端空間）` : '訪客玩家（單機本地模式）';
  }
  if (dom.homeUserDot) {
    dom.homeUserDot.className = isLoggedIn ? 'w-2 h-2 rounded-full bg-emerald-400' : 'w-2 h-2 rounded-full bg-amber-400';
  }
  if (dom.homeAuthActionBtn) {
    dom.homeAuthActionBtn.textContent = isLoggedIn ? '🔄 切換帳號 / 登出' : '🔑 登入 / 註冊專屬空間';
  }

  // 更新繼續遊戲按鈕狀態與描述
  const hasProgress = state.chapterHistoryList && state.chapterHistoryList.length > 0;
  if (dom.homeContinueDesc) {
    if (hasProgress) {
      const lastChapter = state.chapterHistoryList[state.chapterHistoryList.length - 1];
      const pName = state.saveState?.meta?.playerProfile?.name || '玩家';
      const targetName = state.saveState?.meta?.playerProfile?.targetLeadName || '攻略對象';
      dom.homeContinueDesc.textContent = `目前進行至：${lastChapter.title || '當前回合'}（女主：${pName} ｜ 攻略：${targetName}），點擊立即返回接續冒險！`;
    } else {
      dom.homeContinueDesc.textContent = '目前尚未有進行中的局，點擊「開啟全新局」即刻創角展開故事！';
    }
  }

  // 渲染首頁最近存檔列表
  renderHomeRecentSaves();
}

function renderHomeRecentSaves() {
  if (!dom.homeRecentSavesList) return;
  const namedSaves = getNamedSavesList();
  
  if (namedSaves.length === 0) {
    dom.homeRecentSavesList.innerHTML = '<div class="text-center text-slate-500 py-3">目前尚無自訂存檔紀錄，遊戲中可隨時點擊「存檔庫」儲存專屬進度！</div>';
    return;
  }

  const recent = namedSaves.slice(0, 3);
  dom.homeRecentSavesList.innerHTML = recent.map(s => `
    <div class="bg-brand-dark hover:bg-slate-900/80 p-3 rounded-xl border border-brand-border flex items-center justify-between transition gap-2">
      <div class="min-w-0">
        <div class="font-bold text-white truncate flex items-center gap-1.5">
          <span class="text-brand-gold">💾</span>
          <span>${escapeHtml(s.name)}</span>
        </div>
        <div class="text-[11px] text-slate-400 mt-0.5 flex flex-wrap gap-2">
          <span>女主：${escapeHtml(s.playerProfile?.name || '女主')}</span>
          <span>攻略：${escapeHtml(s.playerProfile?.targetLeadName || '主線')}</span>
          <span>第 ${s.turnCount || 1} 回</span>
          <span class="text-slate-500">${s.timestamp || ''}</span>
        </div>
      </div>
      <button class="load-named-save-btn px-3 py-1.5 rounded bg-brand-gold hover:bg-yellow-500 text-slate-950 font-bold text-xs shrink-0 transition" data-id="${s.id}">
        讀取
      </button>
    </div>
  `).join('');

  dom.homeRecentSavesList.querySelectorAll('.load-named-save-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const saveId = e.currentTarget.getAttribute('data-id');
      loadNamedSave(saveId);
    });
  });
}

// ==========================================
// 💾 自訂命名存檔庫核心管理器 (Save Archive System)
// ==========================================

function getNamedSavesList() {
  try {
    const raw = localStorage.getItem('undercurrent_named_saves');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse named saves:', e);
    return [];
  }
}

function persistNamedSavesList(saves) {
  try {
    localStorage.setItem('undercurrent_named_saves', JSON.stringify(saves));
  } catch (e) {
    console.error('Failed to persist named saves:', e);
  }
}

function openSaveArchiveModal() {
  if (dom.saveArchiveModal) {
    dom.saveArchiveModal.style.display = 'flex';
    // 自動預填建議存檔名稱
    if (dom.newSaveNameInput) {
      const pName = state.saveState?.meta?.playerProfile?.name || '女主';
      const targetName = state.saveState?.meta?.playerProfile?.targetLeadName || '主線';
      const turn = state.saveState?.turnCount || 1;
      dom.newSaveNameInput.value = `${pName}-${targetName}第${turn}回`;
    }
    renderSaveArchivesList();
  }
}

function closeSaveArchiveModal() {
  if (dom.saveArchiveModal) dom.saveArchiveModal.style.display = 'none';
}

function createNamedSave(saveName) {
  const name = (saveName || '').trim();
  if (!name) {
    alert('請輸入存檔名稱！');
    return;
  }

  if (!state.chapterData && (!state.chapterHistoryList || state.chapterHistoryList.length === 0)) {
    alert('當前尚未有遊戲進度可儲存！請先開局或進行回合。');
    return;
  }

  const saves = getNamedSavesList();
  const profile = state.saveState?.meta?.playerProfile || { name: '阮思薇', targetLeadName: '徐令謙' };
  const lastChapter = state.chapterHistoryList[state.chapterHistoryList.length - 1] || state.chapterData;

  const newSaveEntry = {
    id: 'save_' + Date.now(),
    name: name,
    timestamp: new Date().toLocaleString('zh-TW', { hour12: false }),
    turnCount: state.saveState?.turnCount || 1,
    chapterTitle: lastChapter?.title || '第 1 回',
    playerProfile: profile,
    saveState: state.saveState,
    chapterData: state.chapterData,
    chapterHistoryList: state.chapterHistoryList || []
  };

  // 新存檔置頂
  saves.unshift(newSaveEntry);
  persistNamedSavesList(saves);
  renderSaveArchivesList();
  renderHomeRecentSaves();
  alert(`🎉 存檔「${name}」已成功儲存至存檔庫！`);
}

function loadNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) {
    alert('找不到該筆存檔資料！');
    return;
  }

  // 還原遊戲全域狀態
  state.saveState = target.saveState;
  state.chapterData = target.chapterData;
  state.chapterHistoryList = target.chapterHistoryList || [];

  // 渲染畫面
  if (dom.novelStreamContainer) dom.novelStreamContainer.innerHTML = '';
  
  if (state.chapterHistoryList.length > 0) {
    state.chapterHistoryList.forEach((item, idx) => {
      const isLatest = idx === state.chapterHistoryList.length - 1;
      const chObj = {
        chapterTitle: item.title,
        prose: item.prose,
        statusPanel: item.statusPanel,
        choices: isLatest ? (state.chapterData?.choices || []) : []
      };
      
      const chapterCard = document.createElement('div');
      chapterCard.className = 'novel-chapter-card bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl mb-8';
      
      let playerActionHtml = '';
      if (item.actionText) {
        playerActionHtml = `
          <div class="player-action-pill mb-4 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/40 text-brand-gold text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
            <span>✦ 玩家行動：</span>
            <span>${escapeHtml(item.actionText)}</span>
          </div>
        `;
      }

      chapterCard.innerHTML = `
        ${playerActionHtml}
        ${renderChapterStatusPanelHtml(chObj.statusPanel)}
        <div class="border-t border-brand-border/40 pt-4">
          <h2 class="font-serif font-black text-xl sm:text-2xl text-brand-gold tracking-wide mb-4">${escapeHtml(chObj.chapterTitle)}</h2>
          <div class="prose-text text-sm sm:text-base leading-relaxed text-slate-200 font-serif space-y-4">
            ${renderCleanProseParagraphs(chObj.prose)}
          </div>
        </div>
      `;
      dom.novelStreamContainer.appendChild(chapterCard);
    });
  } else if (state.chapterData) {
    renderStoryStream(state.chapterData);
  }

  renderChoices(state.chapterData?.choices || []);
  renderSaveState();
  closeSaveArchiveModal();
  closeDrawer();
  switchView('gameplay');
  alert(`📖 已成功讀取存檔：「${target.name}」！`);
}

function overwriteNamedSave(saveId) {
  const saves = getNamedSavesList();
  const idx = saves.findIndex(s => s.id === saveId);
  if (idx === -1) return;

  if (!confirm(`確定要以當前進度覆蓋存檔「${saves[idx].name}」嗎？`)) return;

  const profile = state.saveState?.meta?.playerProfile || { name: '阮思薇', targetLeadName: '徐令謙' };
  const lastChapter = state.chapterHistoryList[state.chapterHistoryList.length - 1] || state.chapterData;

  saves[idx] = {
    ...saves[idx],
    timestamp: new Date().toLocaleString('zh-TW', { hour12: false }),
    turnCount: state.saveState?.turnCount || 1,
    chapterTitle: lastChapter?.title || '第 1 回',
    playerProfile: profile,
    saveState: state.saveState,
    chapterData: state.chapterData,
    chapterHistoryList: state.chapterHistoryList || []
  };

  persistNamedSavesList(saves);
  renderSaveArchivesList();
  renderHomeRecentSaves();
  alert(`💾 存檔「${saves[idx].name}」已成功覆蓋更新！`);
}

function renameNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return;

  const newName = prompt('請輸入新的存檔名稱：', target.name);
  if (newName && newName.trim()) {
    target.name = newName.trim();
    persistNamedSavesList(saves);
    renderSaveArchivesList();
    renderHomeRecentSaves();
  }
}

function deleteNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return;

  if (confirm(`確定要刪除存檔「${target.name}」嗎？刪除後無法復原。`)) {
    const updated = saves.filter(s => s.id !== saveId);
    persistNamedSavesList(updated);
    renderSaveArchivesList();
    renderHomeRecentSaves();
  }
}

function renderSaveArchivesList(filterTerm = '') {
  if (!dom.saveArchivesList) return;
  const saves = getNamedSavesList();
  
  let filtered = saves;
  if (filterTerm && filterTerm.trim()) {
    const term = filterTerm.trim().toLowerCase();
    filtered = saves.filter(s => 
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.playerProfile?.name && s.playerProfile.name.toLowerCase().includes(term)) ||
      (s.playerProfile?.targetLeadName && s.playerProfile.targetLeadName.toLowerCase().includes(term)) ||
      (s.chapterTitle && s.chapterTitle.toLowerCase().includes(term))
    );
  }

  if (filtered.length === 0) {
    dom.saveArchivesList.innerHTML = `
      <div class="text-center text-slate-500 py-8 bg-brand-dark rounded-xl border border-brand-border">
        ${filterTerm ? '找不到符合搜尋條件的存檔' : '存檔庫目前為空。您可以在上方輸入名稱，隨時儲存當前進度！'}
      </div>
    `;
    return;
  }

  dom.saveArchivesList.innerHTML = filtered.map(s => `
    <div class="bg-brand-dark p-3.5 rounded-xl border border-brand-border hover:border-brand-gold/40 transition space-y-2">
      <div class="flex flex-wrap items-center justify-between gap-1">
        <div class="font-bold text-white text-sm flex items-center gap-1.5">
          <span class="text-brand-gold">💾</span>
          <span>${escapeHtml(s.name)}</span>
        </div>
        <div class="text-[11px] text-slate-400 font-mono">
          ${s.timestamp || ''}
        </div>
      </div>

      <div class="text-xs text-slate-300 flex flex-wrap items-center gap-3 bg-brand-surface px-2.5 py-1.5 rounded-lg border border-brand-border/60">
        <span>女主：<b class="text-brand-gold">${escapeHtml(s.playerProfile?.name || '未知')}</b></span>
        <span>攻略：<b class="text-rose-400">${escapeHtml(s.playerProfile?.targetLeadName || '主線')}</b></span>
        <span>進度：<b class="text-sky-300">第 ${s.turnCount || 1} 回</b></span>
        <span class="text-slate-400 truncate max-w-[200px]">${escapeHtml(s.chapterTitle || '')}</span>
      </div>

      <div class="flex items-center justify-end gap-1.5 pt-1">
        <button class="load-named-btn px-3 py-1 rounded bg-brand-gold hover:bg-yellow-500 text-slate-950 font-bold text-xs transition" data-id="${s.id}">
          📖 讀取進度
        </button>
        <button class="overwrite-named-btn px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-brand-border text-xs transition" data-id="${s.id}" title="以當前進度覆蓋本存檔">
          🔄 覆蓋
        </button>
        <button class="rename-named-btn px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-brand-border text-xs transition" data-id="${s.id}" title="修改存檔名稱">
          ✏️
        </button>
        <button class="delete-named-btn px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800/40 text-xs transition" data-id="${s.id}" title="刪除存檔">
          🗑
        </button>
      </div>
    </div>
  `).join('');

  // 綁定按鈕事件
  dom.saveArchivesList.querySelectorAll('.load-named-btn').forEach(btn => {
    btn.addEventListener('click', (e) => loadNamedSave(e.currentTarget.getAttribute('data-id')));
  });
  dom.saveArchivesList.querySelectorAll('.overwrite-named-btn').forEach(btn => {
    btn.addEventListener('click', (e) => overwriteNamedSave(e.currentTarget.getAttribute('data-id')));
  });
  dom.saveArchivesList.querySelectorAll('.rename-named-btn').forEach(btn => {
    btn.addEventListener('click', (e) => renameNamedSave(e.currentTarget.getAttribute('data-id')));
  });
  dom.saveArchivesList.querySelectorAll('.delete-named-btn').forEach(btn => {
    btn.addEventListener('click', (e) => deleteNamedSave(e.currentTarget.getAttribute('data-id')));
  });
}

function exportAllSavesJson() {
  const saves = getNamedSavesList();
  if (saves.length === 0) {
    alert('目前存檔庫中沒有任何存檔可匯出！');
    return;
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saves, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `undercurrent_saves_backup_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importAllSavesJson(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) {
        alert('匯入失敗：JSON 格式不符（需為存檔陣列）。');
        return;
      }
      const existing = getNamedSavesList();
      // 合併存檔並去重
      const existingIds = new Set(existing.map(s => s.id));
      const newItems = imported.filter(s => !existingIds.has(s.id));
      const merged = [...newItems, ...existing];
      persistNamedSavesList(merged);
      renderSaveArchivesList();
      renderHomeRecentSaves();
      alert(`🎉 成功匯入 ${newItems.length} 筆新存檔！`);
    } catch (err) {
      alert('匯入解析失敗：' + err.message);
    }
  };
  reader.readAsText(file);
}

function loadMockDataWithProfile(profile) {
  state.playerProfile = profile;
  localStorage.setItem('undercurrent_current_player_profile', JSON.stringify(profile));
  
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

  localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));


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
      console.warn('後端請求處理中轉入動態引擎:', e);
    }
  }

  if (!generatedSuccessfully) {
    state.saveState = state.saveState || {};
    state.saveState.turnCount = (state.saveState.turnCount || 1) + 1;
    
    // 嚴格確保玩家身分一致（絕不跳針或混淆）
    const profile = getActivePlayerProfile();
    state.saveState.meta = state.saveState.meta || {};
    state.saveState.meta.playerProfile = profile;
    localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));

    const nextStory = generateDynamicTurnChapter(
      state.saveState.turnCount,
      choiceId,
      customInput,
      profile
    );

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

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (parseErr) {
    console.warn(`[GAS API] 後端回傳非 JSON 資料 (可能需要授權或部署更新):`, text.slice(0, 150));
    throw new Error('伺服器需要授權或正在維護中');
  }
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
