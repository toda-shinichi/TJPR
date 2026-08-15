/**
 * 《暗流》（UNDER CURRENT）- Frontend Web Client Application
 * 檔案：app.js
 * 
 * 管理玩家身分驗證（登入/註冊/隱私隔離）、角色設定檔範本、多存檔槽管理器 (Save Slots)、打字機動效與 GAS API 串接。
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
  isDrawerOpen: false
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
  
  // 即時狀態面板
  inlineStatusPanel: document.getElementById('inline-status-panel'),
  panelTimeLocation: document.getElementById('panel-time-location'),
  panelTension: document.getElementById('panel-tension'),
  panelIntoxication: document.getElementById('panel-intoxication'),
  panelInteraction: document.getElementById('panel-interaction'),
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
  apiUrlInput: document.getElementById('api-url-input'),
  saveSettingsBtn: document.getElementById('save-settings-btn')
};

// 初始化
window.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  loadSavedProfilePresets();

  if (dom.apiUrlInput) {
    dom.apiUrlInput.value = state.gasApiUrl;
  }

  // 檢查是否已登入，未登入則彈出身分驗證鎖定視窗
  checkAuthSession();
});

function setupEventListeners() {
  // 登入 / 註冊 Tab 切換
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

  // 送出登入表單
  if (dom.loginForm) {
    dom.loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleUserLogin();
    });
  }

  // 送出註冊表單
  if (dom.registerForm) {
    dom.registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleUserRegister();
    });
  }

  // 訪客試玩
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

  // 登出
  if (dom.logoutBtn) {
    dom.logoutBtn.addEventListener('click', handleLogout);
  }

  // 創角彈窗控制
  if (dom.openCreateCharBtn) {
    dom.openCreateCharBtn.addEventListener('click', () => {
      dom.charCreationModal.style.display = 'flex';
    });
  }
  if (dom.closeModalBtn) {
    dom.closeModalBtn.addEventListener('click', () => {
      dom.charCreationModal.style.display = 'none';
    });
  }

  // 設定檔範本切換
  if (dom.profilePresetsSelect) {
    dom.profilePresetsSelect.addEventListener('change', (e) => {
      loadProfilePresetIntoForm(e.target.value);
    });
  }

  if (dom.saveCurrentProfileBtn) {
    dom.saveCurrentProfileBtn.addEventListener('click', saveCurrentFormAsPreset);
  }

  if (dom.exportProfileJsonBtn) {
    dom.exportProfileJsonBtn.addEventListener('click', exportProfileJson);
  }

  if (dom.importProfileJsonInput) {
    dom.importProfileJsonInput.addEventListener('change', importProfileJson);
  }

  if (dom.deleteProfilePresetBtn) {
    dom.deleteProfilePresetBtn.addEventListener('click', deleteSelectedProfilePreset);
  }

  // 快捷情境按鈕
  document.querySelectorAll('.preset-scenario-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = e.target.getAttribute('data-text');
      const textarea = document.getElementById('form-custom-scenario');
      if (textarea) textarea.value = text;
    });
  });

  // 提交開局創角表單
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

  // 遊戲存檔槽按鈕監聽 (Slot 1, 2, 3)
  document.querySelectorAll('.save-slot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const slot = e.target.getAttribute('data-slot');
      saveGameStateToSlot(slot);
    });
  });

  document.querySelectorAll('.load-slot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const slot = e.target.getAttribute('data-slot');
      loadGameStateFromSlot(slot);
    });
  });

  if (dom.quickSaveBtn) {
    dom.quickSaveBtn.addEventListener('click', () => {
      saveGameStateToSlot('1');
    });
  }

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
      if (e.key === 'Enter') {
        const customText = (dom.customActionInput.value || '').trim();
        if (!customText) return;
        makeChoice(null, customText);
        dom.customActionInput.value = '';
      }
    });
  }

  // 卷末換窗
  if (dom.rebaseActBtn) {
    dom.rebaseActBtn.addEventListener('click', handleActRebase);
  }

  // 儲存後端 API 設定
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
// 使用者身分驗證 (Auth Security Handlers)
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
    // 降級本地登入
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
// 角色設定檔 (Profile Presets) 存讀管理
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
// 遊戲存檔槽管理 (Game Save Slots)
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
    alert(`【讀檔成功】已載入存檔欄位 ${slotIndex}！`);
  } catch (err) {
    alert('讀取存檔失敗: ' + err.message);
  }
}

// ==========================================
// 故事主流程與 API 連線
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
        saveGameStateToSlot('1');
      } else {
        alert('開局生成失敗：' + (res.error?.message || '未知錯誤'));
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
      name: profile.targetLeadName,
      hp: 100,
      sanity: 100
    },
    inventory: [
      { id: 'item_card', name: '調查記者證 / 隨身底牌', count: 1, desc: '隨身攜帶的關鍵身分與線索。' }
    ],
    relationships: {
      [profile.targetLeadName]: 20
    },
    questFlags: {
      main_quest: `初會：與 ${profile.targetLeadName} 的交鋒`
    },
    summaryPool: `玩家 ${profile.name} 正式入局，與 ${profile.targetLeadName} 展開首次交鋒。`,
    turnHistory: []
  };

  const initialMockChapter = {
    chapterTitle: `第 1 回．初會 ${profile.targetLeadName}`,
    prose: `五月的台北士林，窗外暴雨如注，瘋狂敲打著德行法律事務所頂層制策室的防彈落地窗。\n\n${profile.name}將大衣下擺稍稍攏起，指尖觸碰到手提包內層那枚冰冷而沉重的密錄隨身碟。室內空氣中瀰漫著淺焙手沖咖啡的微酸香氣——那是從三峽思慕咖啡專程送達、由主人親自烘焙磨製的豆子——以及對面男人身上那股若有似無的柑橘木質菸草香。\n\n${profile.targetLeadName}坐在深色胡桃木長桌的另一端，戴著金邊眼鏡，修長而骨節分明的手指輕輕搖晃著水晶杯，目光精準如手術刀般落在她身上。\n\n「${profile.name}，在台北敢帶著這份帳冊底牌直接找進來的人，妳是第一個。」`,
    statusPanel: {
      timeLocation: '2026年5月12日 21:30 星期二 於 台北市士林區德行法律事務所頂樓制策室',
      tension: '張力值 [45%]',
      intoxication: '微醺度 [20%]',
      interaction: `初次交鋒 ｜ 與 ${profile.targetLeadName} 隔著長桌對坐，目光交鋒`,
      outfit: `${profile.name}（${profile.appearance || '深黑大衣'}） ｜ ${profile.targetLeadName}（手工深灰西裝、金錶）`,
      inventory: '調查記者證、洗錢弊案密錄隨身碟',
      rumors: '政壇傳言士林地檢署韓正寰正秘密盯梢天裕會金流，黑白兩道暗潮洶湧',
      pageCode: 'P.001'
    },
    choices: [
      { id: 'opt_a', label: '[A] 順應節奏：神情自若地拉開椅子坐下，將隨身碟推向桌心', risk: 'low', hint: '展現職業從容，以籌碼換取信任' },
      { id: 'opt_b', label: `[B] 反向推拉：冷靜反詰「看來你很清楚這份帳冊能掀起多大風浪」`, risk: 'medium', hint: '言語機鋒試探底線' },
      { id: 'opt_c', label: `[C] 情慾暗示：迎著他的視線傾身靠近，壓低聲音「那您打算怎麼處置我？」`, risk: 'high', hint: '主動拉近物理距離，挑動危險氛圍' }
    ]
  };

  state.chapterData = initialMockChapter;
  renderChapter(initialMockChapter);
  renderSaveState();
}

function renderChapter(chapter) {
  if (!chapter) return;
  dom.chapterBadge.textContent = `第 ${state.saveState?.meta?.currentAct || 1} 幕 · 第 ${state.saveState?.turnCount || 1} 回合`;
  dom.chapterTitle.textContent = chapter.chapterTitle || '未命名章節';

  if (chapter.statusPanel && dom.inlineStatusPanel) {
    dom.inlineStatusPanel.style.display = 'block';
    dom.panelTimeLocation.textContent = chapter.statusPanel.timeLocation || '-';
    dom.panelTension.textContent = chapter.statusPanel.tension || '張力 0%';
    dom.panelIntoxication.textContent = chapter.statusPanel.intoxication || '微醺 0%';
    dom.panelInteraction.textContent = chapter.statusPanel.interaction || '-';
    dom.panelRumors.textContent = chapter.statusPanel.rumors || '-';
  }

  typewriterEffect(chapter.prose, dom.proseContent, () => {
    renderChoices(chapter.choices || []);
  });
}

function typewriterEffect(text, targetEl, onComplete) {
  targetEl.innerHTML = '';
  state.isTyping = true;
  dom.choicesContainer.innerHTML = '';

  const paragraphs = text.split('\n\n');
  let pIndex = 0;
  let charIndex = 0;

  let currentP = document.createElement('p');
  currentP.className = 'mb-6 indent-8';
  targetEl.appendChild(currentP);

  const speed = 10;

  function typeNextChar() {
    if (pIndex < paragraphs.length) {
      const pText = paragraphs[pIndex];
      if (charIndex < pText.length) {
        currentP.textContent += pText.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, speed);
      } else {
        pIndex++;
        charIndex = 0;
        if (pIndex < paragraphs.length) {
          currentP = document.createElement('p');
          currentP.className = 'mb-6 indent-8';
          targetEl.appendChild(currentP);
          setTimeout(typeNextChar, speed * 2);
        } else {
          state.isTyping = false;
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
    const riskLabel = choice.risk === 'high' ? '高風險' : (choice.risk === 'medium' ? '推拉' : '穩健');

    card.innerHTML = `
      <div class="font-serif font-bold text-white text-base leading-snug flex items-start gap-2">
        <span class="text-xs font-mono font-bold px-2 py-0.5 rounded border ${riskColor} shrink-0 mt-0.5">${riskLabel}</span>
        <span>${choice.label}</span>
      </div>
      <div class="text-xs text-slate-400 mt-1.5 ml-14 leading-relaxed">${choice.hint || ''}</div>
    `;

    card.addEventListener('click', () => {
      if (state.isTyping) return;
      makeChoice(choice.id, choice.label);
    });

    dom.choicesContainer.appendChild(card);
  });
}

async function makeChoice(choiceId, customInput) {
  showLoading('以太筆觸流轉中，主筆作家正在撰寫後續長篇情節...');

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
      } else {
        alert('生成章節失敗：' + (res.error?.message || '未知伺服器錯誤'));
      }
    } catch (e) {
      alert('無法連線後端 API：' + e.message);
    }
  } else {
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
    }, 1200);
  }

  hideLoading();
}

async function handleActRebase() {
  if (!confirm('確定要執行【卷末換窗 (Act Rebase)】嗎？\n這將把本幕所有章節濃縮為 800 字檔案並歸零對話視窗，但會保留當前數值與道具。')) {
    return;
  }

  showLoading('正在執行卷末換窗，編年史記錄官正在生成幕篇檔案 (Act Dossier)...');

  if (state.gasApiUrl) {
    try {
      const res = await callBackendApi('novel/rebase', {
        saveState: state.saveState
      });
      if (res.success && res.data) {
        state.saveState = res.data.saveState;
        renderSaveState();
        alert('【卷末換窗成功】已正式晉升至第 ' + state.saveState.meta.currentAct + ' 幕！');
      }
    } catch (e) {
      alert('卷末換窗失敗: ' + e.message);
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
    body: JSON.stringify(body)
  });

  return await response.json();
}

function showLoading(text) {
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'flex';
    dom.loadingText.textContent = text || '載入中...';
  }
}

function hideLoading() {
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'none';
  }
}
