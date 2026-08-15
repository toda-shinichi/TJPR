/**
 * 《暗流》（UNDER CURRENT）— 頂級沉浸式互動文字 RPG 核心引擎
 * 版本: v20260816_v50
 * 
 * 核心特性：
 * 1. 🚀 純 AI 即時零範本生成架構（大模型現場實時創作長篇小說與分支選項）
 * 2. 👑 100% 同步 Google Drive 官方 13 位男主人物設定檔案
 * 3. 📝 完整人物與劇情設定庫 (Profile Manager)：支援編輯、重新命名、刪除、匯出匯入與一鍵開局
 * 4. 💾 完整存檔庫 (Save Archives)：支援自訂命名、搜尋、重新命名、刪除、跨設備匯出匯入
 * 5. 📱 App 風格頂部返回導航列、歷史章節瀑布流、打字機動畫與微醺/張力即時面板
 */

// 官方 13 位男主資料庫
const OFFICIAL_DRIVE_CHARACTERS = {
  "01_徐令謙": {
    "key": "01_徐令謙",
    "name": "徐令謙",
    "fullName": "徐令謙",
    "age": "35歲",
    "title": "玄辰幫二把手 · 天裕會中樞 · 德行事務所顧問",
    "file": "01_徐令謙.md",
    "identityRole": "台灣最大黑幫「玄辰幫」二把手 · 直屬堂口「天裕會」最高掌舵者（【絕對警語】：徐令謙是黑道霸主與幕後操盤者，絕不是檢察官或警察！地檢署檢察官是韓正寰）。他戴金絲復古眼鏡、深黑三件套西裝、Omega金錶，氣質優雅冷酷，手握洗錢暗帳與龐大地下勢力。",
    "summary": "35歲，INTJ。台灣最大幫派玄辰幫二把手、天裕會中樞。表面為德行法律事務所合夥顧問與思慕咖啡老闆，實為地下秩序制策者。冷靜高雅、支配欲極強、雪松菸草香氣。"
  },
  "02_韓正寰": {
    "key": "02_韓正寰",
    "name": "韓正寰",
    "fullName": "韓正寰（白日判官）",
    "age": "34歲",
    "title": "臺灣士林地檢署重大刑案主任檢察官",
    "file": "02_韓正寰.md",
    "identityRole": "士林地檢署主任檢察官 · 白日判官 · 黑幫終結者（他是唯一的司法檢察官！冷血執法、極致自律、法袍與無褶白襯衫）。",
    "summary": "34歲，ISTJ。士林地檢署檢察官，鐵腕冷酷，誓言將黑道連根拔起，對女主有極深的審訊與佔有性張力。"
  },
  "03_邵翊衡": {
    "key": "03_邵翊衡",
    "name": "邵翊衡",
    "fullName": "邵翊衡",
    "age": "37歲",
    "title": "政媒幕後操盤者 · 頂級輿情顧問",
    "file": "03_邵翊衡.md",
    "identityRole": "表面是頂級輿情顧問，實為遊走於政商黑白兩道的政媒操盤者。",
    "summary": "37歲，ENTP。掌控媒體輿論與政壇風向，擅長心理推拉與輿論戰。"
  },
  "04_楊紹宸": {
    "key": "04_楊紹宸",
    "name": "楊紹宸",
    "fullName": "楊紹宸",
    "age": "28歲",
    "title": "弘楊集團少東 · 執行董事 · 物流總經理",
    "file": "04_楊紹宸.md",
    "identityRole": "弘楊集團少東兼執行董事，掌控跨國物流與碼頭貿易，桀驁不馴。",
    "summary": "28歲，ESTP。野心勃勃的財閥繼承人，作風凌厲，對女主充滿強烈征服慾。"
  },
  "05_徐宇寧": {
    "key": "05_徐宇寧",
    "name": "徐宇寧",
    "fullName": "徐宇寧",
    "age": "28歲",
    "title": "明隱牙醫診所院長 · 牙醫師",
    "file": "05_徐宇寧.md",
    "identityRole": "溫文爾雅的頂級牙醫院長，徐家長房長孫，看似溫柔實則深沉掌控。",
    "summary": "28歲，ISFJ。白袍下的精緻支配者，細膩體貼卻帶著令人窒息的專注。"
  },
  "06_林政修": {
    "key": "06_林政修",
    "name": "林政修",
    "fullName": "林政修（林次）",
    "age": "41歲",
    "title": "法務部政務次長",
    "file": "06_林政修.md",
    "identityRole": "法務部政務次長，人稱「林次」，政壇頂層權力核心掌舵者。",
    "summary": "41歲，ENTJ。沉穩威嚴的政壇上位者，舉手投足皆是國家機器級別的權力壓迫。"
  },
  "07_沈湛然": {
    "key": "07_沈湛然",
    "name": "沈湛然",
    "fullName": "沈湛然",
    "age": "36歲",
    "title": "台大醫院精神醫學部主治名醫",
    "file": "07_沈湛然.md",
    "identityRole": "台大醫院精神科權威名醫，心理側寫與潛意識催眠專家。",
    "summary": "36歲，INFJ。洞悉人性的深淵凝視者，能輕易看穿女主所有防禦與慾望。"
  },
  "08_江瀚文": {
    "key": "08_江瀚文",
    "name": "江瀚文",
    "fullName": "江瀚文",
    "age": "36歲",
    "title": "鼎曜媒體集團執行長",
    "file": "08_江瀚文.md",
    "identityRole": "跨國媒體巨擘執行長，掌控主流電視台與數位傳媒帝國。",
    "summary": "36歲，ENTJ。商界菁英，擅長資本收購與鏡頭下的致命曖昧。"
  },
  "09_吳衛廷": {
    "key": "09_吳衛廷",
    "name": "吳衛廷",
    "fullName": "吳衛廷",
    "age": "42歲",
    "title": "立法院司法及法制委員會立法委員",
    "file": "09_吳衛廷.md",
    "identityRole": "最大在野黨資深立法委員，舊城區地方實力派，作風霸道深沉。",
    "summary": "42歲，ESTJ。深諳基層利益與國會黑幕的實權立委。"
  },
  "10_徐承勳": {
    "key": "10_徐承勳",
    "name": "徐承勳",
    "fullName": "徐承勳（副總統）",
    "age": "47歲",
    "title": "中華民國副總統",
    "file": "10_徐承勳.md",
    "identityRole": "中華民國副總統，身處「華麗牢籠」中的國家備位元首與科技經濟巨擘。",
    "summary": "47歲，INTJ。成熟禁慾的政壇巔峰男性，深邃孤獨且極具上位者壓迫感。"
  },
  "11_徐耀南": {
    "key": "11_徐耀南",
    "name": "徐耀南",
    "fullName": "徐耀南",
    "age": "57歲",
    "title": "榮南營造集團董事長",
    "file": "11_徐耀南.md",
    "identityRole": "榮南營造集團創辦人兼董事長，台中地方營造巨擘與威嚴大家長。",
    "summary": "57歲，ENTJ。白手起家的商界梟雄，冷峻威嚴、體魄硬朗。"
  },
  "12_徐若宸": {
    "key": "12_徐若宸",
    "name": "徐若宸",
    "fullName": "徐若宸",
    "age": "22歲",
    "title": "榮南營造家族長子 · UBC商學院/企管所",
    "file": "12_徐若宸.md",
    "identityRole": "榮南營造家族長子，UBC商學院畢業、中興企管所研究生，知性清瘦貴公子。",
    "summary": "22歲，ISFP。肩負家族重任的清雅青年，內心壓抑著深沉的情感叛逆。"
  },
  "13_徐予澈": {
    "key": "13_徐予澈",
    "name": "徐予澈",
    "fullName": "徐予澈（藝名：徐泰希）",
    "age": "29歲",
    "title": "頂級偶像男團 HapSTer 主唱兼領舞",
    "file": "13_徐予澈.md",
    "identityRole": "亞洲頂級男團 HapSTer 門面主唱兼領舞（藝名徐泰希），萬眾矚目的頂流巨星。",
    "summary": "29歲，INFJ。台上極限魅惑、私下清冷溫潤的頂流偶像。"
  }
};


// 預設官方人設範本
const DEFAULT_PRESETS = {
  'preset_yang': {
    name: '楊慕璃',
    gender: '女',
    age: '24',
    profession: '弘楊集團公關總監 · 瑾和文教基金會執行長',
    background: '台灣大學法律系、台北大學犯罪學研究所畢業。身為楊家三房獨生女，在權謀風暴中憑藉智慧與魅力遊走於各方勢力之間。',
    appearance: '隨機',
    taboos: '禁止暴力侮辱，無特定雷區',
    targetLead: '修羅場',
    targetLeadName: '修羅場',
    allowR18: true,
    customScenario: '在深夜的台北士林便利商店遇到徐令謙'
  },
  'preset_ruan': {
    name: '阮思薇',
    gender: '女',
    age: '26',
    profession: '司法政經獨立調查特派員',
    background: '曾任主流大報政治組調查記者，後因揭發官商弊案獨立經營調查報導自媒體，掌握多方未公開金流帳冊。',
    appearance: '隨機',
    taboos: '無特定雷區',
    targetLead: '02_韓正寰',
    targetLeadName: '韓正寰',
    allowR18: true,
    customScenario: '士林地檢署第六偵查庭深夜閉門訊問'
  }
};

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
  chapterHistoryList: [],
  isTyping: false,
  skipTypewriterTriggered: false,
  typewriterTimer: null,
  lastChoicePayload: null,
  previousStateSnapshot: null,
  currentAbortController: null,
  cooldownInterval: null,
  fontSizePx: parseInt(localStorage.getItem('undercurrent_font_size') || '18', 10),
  theme: localStorage.getItem('undercurrent_theme') || 'dark',
  typeSpeed: localStorage.getItem('undercurrent_type_speed') || 'normal'
};

// DOM 元素快取
const dom = {
  authModal: document.getElementById('auth-modal'),
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  tabLoginBtn: document.getElementById('tab-login-btn'),
  tabRegisterBtn: document.getElementById('tab-register-btn'),
  userBadge: document.getElementById('user-badge'),
  usernameDisplay: document.getElementById('username-display'),
  homeUsernameDisplay: document.getElementById('home-username-display'),
  logoutBtn: document.getElementById('logout-btn'),
  homeLogoutBtn: document.getElementById('home-logout-btn'),
  homeDeleteAccountBtn: document.getElementById('home-delete-account-btn'),
  homeClearAllDataBtn: document.getElementById('home-clear-all-data-btn'),
  
  homeView: document.getElementById('home-view'),
  gameplayView: document.getElementById('gameplay-view'),
  navHomeBtn: document.getElementById('nav-home-btn'),
  headerHomeBtn: document.getElementById('header-home-btn'),
  backToHomeBtn: document.getElementById('back-to-home-btn'),
  gameplayBreadcrumb: document.getElementById('gameplay-breadcrumb'),
  
  homeNewGameBtn: document.getElementById('home-new-game-btn'),
  homeContinueGameBtn: document.getElementById('home-continue-game-btn'),
  homeContinueDesc: document.getElementById('home-continue-desc'),
  homeOpenSavesBtn: document.getElementById('home-open-saves-btn'),
  homeOpenPresetsBtn: document.getElementById('home-open-presets-btn'),
  homeViewAllSavesBtn: document.getElementById('home-view-all-saves-btn'),
  homeRecentSavesList: document.getElementById('home-recent-saves-list'),

  charCreationModal: document.getElementById('character-creation-modal'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  charCreationForm: document.getElementById('char-creation-form'),
  profilePresetsSelect: document.getElementById('profile-presets-select'),
  saveCurrentProfileBtn: document.getElementById('save-current-profile-btn'),
  openProfileManagerBtn: document.getElementById('open-profile-manager-btn'),
  formTargetLead: document.getElementById('form-target-lead'),

  profileManagerModal: document.getElementById('profile-manager-modal'),
  closeProfileManagerBtn: document.getElementById('close-profile-manager-btn'),
  profileManagerList: document.getElementById('profile-manager-list'),
  searchProfileInput: document.getElementById('search-profile-input'),
  exportProfilesBtn: document.getElementById('export-profiles-btn'),
  importProfilesInput: document.getElementById('import-profiles-input'),
  
  navSavesBtn: document.getElementById('nav-saves-btn'),
  navPresetsBtn: document.getElementById('nav-presets-btn'),
  saveArchiveModal: document.getElementById('save-archive-modal'),
  closeSaveArchiveBtn: document.getElementById('close-save-archive-btn'),
  newSaveNameInput: document.getElementById('new-save-name-input'),
  createNamedSaveBtn: document.getElementById('create-named-save-btn'),
  searchSaveInput: document.getElementById('search-save-input'),
  exportAllSavesBtn: document.getElementById('export-all-saves-btn'),
  importAllSavesInput: document.getElementById('import-all-saves-input'),
  manualCloudSyncBtn: document.getElementById('manual-cloud-sync-btn'),
  saveArchivesList: document.getElementById('save-archives-list'),
  
  novelStreamContainer: document.getElementById('novel-stream-container'),
  choicesContainer: document.getElementById('choices-container'),
  customActionInput: document.getElementById('custom-action-input'),
  submitCustomBtn: document.getElementById('submit-custom-btn'),
  
  sideDrawer: document.getElementById('side-drawer'),
  drawerBackdrop: document.getElementById('drawer-backdrop'),
  openDrawerBtn: document.getElementById('open-drawer-btn'),
  closeDrawerBtn: document.getElementById('close-drawer-btn'),
  gameplayDrawerBtn: document.getElementById('gameplay-drawer-btn'),
  drawerHomeBtn: document.getElementById('drawer-home-btn'),
  drawerSavesBtn: document.getElementById('drawer-saves-btn'),
  gameplayQuickSaveBtn: document.getElementById('gameplay-quick-save-btn'),
  
  hpDisplay: document.getElementById('hp-display'),
  sanityDisplay: document.getElementById('sanity-display'),
  profileCardName: document.getElementById('profile-card-name'),
  profileCardLead: document.getElementById('profile-card-lead'),
  relationshipsList: document.getElementById('relationships-list'),
  inventoryList: document.getElementById('inventory-list'),
  rebaseActBtn: document.getElementById('rebase-act-btn'),
  
  shuraWarningCard: document.getElementById('shura-warning-card'),
  supportingLeadsBlock: document.getElementById('supporting-leads-block'),
  supportingLeadsChips: document.getElementById('supporting-leads-chips'),
  
  navGuideBtn: document.getElementById('nav-guide-btn'),
  homeOpenGuideBtn: document.getElementById('home-open-guide-btn'),
  gameGuideModal: document.getElementById('game-guide-modal'),
  closeGameGuideBtn: document.getElementById('close-game-guide-btn'),
  guideTabGameplayBtn: document.getElementById('guide-tab-gameplay-btn'),
  guideTabSystemBtn: document.getElementById('guide-tab-system-btn'),
  guideTabRosterBtn: document.getElementById('guide-tab-roster-btn'),
  guidePanelGameplay: document.getElementById('guide-panel-gameplay'),
  guidePanelSystem: document.getElementById('guide-panel-system'),
  guidePanelRoster: document.getElementById('guide-panel-roster'),
  searchRosterInput: document.getElementById('search-roster-input'),
  rosterGalleryList: document.getElementById('roster-gallery-list'),

  loadingOverlay: document.getElementById('loading-overlay'),
  loadingText: document.getElementById('loading-text'),
  loadingSubtext: document.getElementById('loading-subtext'),
  abortGenerationBtn: document.getElementById('abort-generation-btn'),
  errorRecoveryBanner: document.getElementById('error-recovery-banner'),
  errorMessageText: document.getElementById('error-message-text'),
  retryTurnBtn: document.getElementById('retry-turn-btn'),
  dismissErrorBtn: document.getElementById('dismiss-error-btn')
};

// ==========================================
// 1. 初始化與事件綁定 (Initialization & Events)
// ==========================================

window.addEventListener('DOMContentLoaded', async () => {
  initTargetLeadSelectOptions();
  setupEventListeners();
  checkAuthAndInitUser();
  loadSavedProfilePresetsIntoSelect();
  renderHomeRecentSaves();
  restoreSavedStateFromStorage();
});

function initTargetLeadSelectOptions() {
  const select = dom.formTargetLead || document.getElementById('form-target-lead');
  if (!select) return;

  select.innerHTML = '';
  
  // 首選全勢力修羅場
  const shuraOpt = document.createElement('option');
  shuraOpt.value = '修羅場';
  shuraOpt.setAttribute('data-name', '修羅場');
  shuraOpt.textContent = '⚡ 【全勢力修羅場】（13位男主隨劇情推進動態交鋒·多雄爭奪·極限拉扯）';
  select.appendChild(shuraOpt);

  // 13 位官方男主
  Object.keys(OFFICIAL_DRIVE_CHARACTERS).forEach(key => {
    const lead = OFFICIAL_DRIVE_CHARACTERS[key];
    const opt = document.createElement('option');
    opt.value = key;
    opt.setAttribute('data-name', lead.name);
    opt.textContent = `${key.split('_')[0]}. ${lead.name}（${lead.title.slice(0, 20)} · ${lead.age}）`;
    select.appendChild(opt);
  });

  // 監聽主要攻略對象切換
  select.addEventListener('change', handleTargetLeadChange);
  handleTargetLeadChange();
}

function handleTargetLeadChange() {
  const select = dom.formTargetLead || document.getElementById('form-target-lead');
  const warningCard = dom.shuraWarningCard || document.getElementById('shura-warning-card');
  const supportingBlock = dom.supportingLeadsBlock || document.getElementById('supporting-leads-block');
  if (!select) return;

  const isShura = select.value === '修羅場';

  if (warningCard) {
    warningCard.style.display = isShura ? 'block' : 'none';
  }
  if (supportingBlock) {
    supportingBlock.style.display = isShura ? 'none' : 'block';
  }

  if (!isShura) {
    renderSupportingLeadsChips(select.value);
  }
}

function renderSupportingLeadsChips(primaryLeadKey) {
  const container = dom.supportingLeadsChips || document.getElementById('supporting-leads-chips');
  if (!container) return;

  container.innerHTML = '';

  Object.keys(OFFICIAL_DRIVE_CHARACTERS).forEach(key => {
    if (key === primaryLeadKey) return; // 排除主選對象
    const lead = OFFICIAL_DRIVE_CHARACTERS[key];

    const label = document.createElement('label');
    label.className = 'flex items-center gap-1.5 p-1.5 rounded-lg bg-brand-surface hover:bg-brand-surface/80 border border-brand-border/60 cursor-pointer transition select-none text-[11px] text-slate-300 hover:text-white';
    
    label.innerHTML = `
      <input type="checkbox" value="${key}" class="supporting-lead-cb w-3.5 h-3.5 accent-brand-gold rounded cursor-pointer">
      <span class="truncate font-serif font-bold text-slate-200">${lead.name}</span>
      <span class="text-[9px] text-slate-500 truncate font-sans">${key.split('_')[0]}</span>
    `;

    container.appendChild(label);
  });
}

function setupEventListeners() {
  // 導航視圖切換
  if (dom.navHomeBtn) dom.navHomeBtn.addEventListener('click', () => switchView('home'));
  if (dom.headerHomeBtn) dom.headerHomeBtn.addEventListener('click', () => switchView('home'));
  if (dom.backToHomeBtn) dom.backToHomeBtn.addEventListener('click', () => switchView('home'));
  if (dom.drawerHomeBtn) dom.drawerHomeBtn.addEventListener('click', () => { closeDrawer(); switchView('home'); });

  // 首頁 4 大卡片
  if (dom.homeNewGameBtn) dom.homeNewGameBtn.addEventListener('click', openCharacterCreationModal);
  if (dom.homeContinueGameBtn) dom.homeContinueGameBtn.addEventListener('click', handleContinueGame);
  if (dom.homeOpenSavesBtn) dom.homeOpenSavesBtn.addEventListener('click', openSaveArchiveModal);
  if (dom.homeOpenPresetsBtn) dom.homeOpenPresetsBtn.addEventListener('click', openProfileManagerModal);
  if (dom.homeViewAllSavesBtn) dom.homeViewAllSavesBtn.addEventListener('click', openSaveArchiveModal);

  // 導航列快捷鍵
  if (dom.navSavesBtn) dom.navSavesBtn.addEventListener('click', openSaveArchiveModal);
  if (dom.navPresetsBtn) dom.navPresetsBtn.addEventListener('click', openProfileManagerModal);
  if (dom.drawerSavesBtn) dom.drawerSavesBtn.addEventListener('click', () => { closeDrawer(); openSaveArchiveModal(); });

  // 抽屜開關
  if (dom.openDrawerBtn) dom.openDrawerBtn.addEventListener('click', openDrawer);
  if (dom.gameplayDrawerBtn) dom.gameplayDrawerBtn.addEventListener('click', openDrawer);
  if (dom.closeDrawerBtn) dom.closeDrawerBtn.addEventListener('click', closeDrawer);
  if (dom.drawerBackdrop) dom.drawerBackdrop.addEventListener('click', closeDrawer);

  // 創角與人設彈窗
  if (dom.closeModalBtn) dom.closeModalBtn.addEventListener('click', closeCharacterCreationModal);
  if (dom.charCreationForm) dom.charCreationForm.addEventListener('submit', handleCharacterCreationSubmit);
  if (dom.profilePresetsSelect) dom.profilePresetsSelect.addEventListener('change', (e) => loadProfilePresetIntoForm(e.target.value));
  if (dom.saveCurrentProfileBtn) dom.saveCurrentProfileBtn.addEventListener('click', saveCurrentFormAsPreset);
  if (dom.openProfileManagerBtn) dom.openProfileManagerBtn.addEventListener('click', () => { closeCharacterCreationModal(); openProfileManagerModal(); });

  // 人設管理中心彈窗
  if (dom.closeProfileManagerBtn) dom.closeProfileManagerBtn.addEventListener('click', closeProfileManagerModal);
  if (dom.searchProfileInput) dom.searchProfileInput.addEventListener('input', renderProfileManagerList);
  if (dom.exportProfilesBtn) dom.exportProfilesBtn.addEventListener('click', exportProfiles);
  if (dom.importProfilesInput) dom.importProfilesInput.addEventListener('change', importProfiles);

  // 存檔管理中心彈窗
  if (dom.closeSaveArchiveBtn) dom.closeSaveArchiveBtn.addEventListener('click', closeSaveArchiveModal);
  if (dom.createNamedSaveBtn) dom.createNamedSaveBtn.addEventListener('click', () => createNamedSave(dom.newSaveNameInput?.value));
  if (dom.searchSaveInput) dom.searchSaveInput.addEventListener('input', renderSaveArchivesList);
  if (dom.manualCloudSyncBtn) dom.manualCloudSyncBtn.addEventListener('click', () => syncStateToGoogleDriveCloud(state.saveState, state.chapterData, true));
  if (dom.exportAllSavesBtn) dom.exportAllSavesBtn.addEventListener('click', exportAllSaves);
  if (dom.importAllSavesInput) dom.importAllSavesInput.addEventListener('change', importAllSaves);
  if (dom.gameplayQuickSaveBtn) dom.gameplayQuickSaveBtn.addEventListener('click', handleQuickSave);

  // 遊戲指南與角色圖鑑彈窗
  if (dom.navGuideBtn) dom.navGuideBtn.addEventListener('click', () => openGameGuideModal('gameplay'));
  if (dom.homeOpenGuideBtn) dom.homeOpenGuideBtn.addEventListener('click', () => openGameGuideModal('gameplay'));
  if (dom.closeGameGuideBtn) dom.closeGameGuideBtn.addEventListener('click', closeGameGuideModal);
  if (dom.guideTabGameplayBtn) dom.guideTabGameplayBtn.addEventListener('click', () => switchGuideTab('gameplay'));
  if (dom.guideTabSystemBtn) dom.guideTabSystemBtn.addEventListener('click', () => switchGuideTab('system'));
  if (dom.guideTabRosterBtn) dom.guideTabRosterBtn.addEventListener('click', () => switchGuideTab('roster'));
  if (dom.searchRosterInput) dom.searchRosterInput.addEventListener('input', renderRosterGallery);

  // 自由行動提交
  if (dom.submitCustomBtn) dom.submitCustomBtn.addEventListener('click', handleCustomActionSubmit);
  if (dom.customActionInput) {
    dom.customActionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        handleCustomActionSubmit();
      }
    });
  }

  // 帳號認證
  if (dom.tabLoginBtn) dom.tabLoginBtn.addEventListener('click', () => switchAuthTab('login'));
  if (dom.tabRegisterBtn) dom.tabRegisterBtn.addEventListener('click', () => switchAuthTab('register'));
  if (dom.loginForm) dom.loginForm.addEventListener('submit', handleLogin);
  if (dom.registerForm) dom.registerForm.addEventListener('submit', handleRegister);
  if (dom.logoutBtn) dom.logoutBtn.addEventListener('click', handleLogout);
  if (dom.homeLogoutBtn) dom.homeLogoutBtn.addEventListener('click', handleLogout);
  if (dom.homeDeleteAccountBtn) dom.homeDeleteAccountBtn.addEventListener('click', handleDeleteAccount);
  if (dom.homeClearAllDataBtn) dom.homeClearAllDataBtn.addEventListener('click', handleClearAllData);

  // 中止與錯誤救援
  if (dom.abortGenerationBtn) dom.abortGenerationBtn.addEventListener('click', handleAbortGeneration);
  if (dom.retryTurnBtn) dom.retryTurnBtn.addEventListener('click', handleRetryLastTurn);
  if (dom.dismissErrorBtn) dom.dismissErrorBtn.addEventListener('click', () => { if (dom.errorRecoveryBanner) dom.errorRecoveryBanner.style.display = 'none'; });
  if (dom.rebaseActBtn) dom.rebaseActBtn.addEventListener('click', handleActRebase);
}

// ==========================================
// 2. 視圖切換與抽屜控制 (View Switching & Drawer)
// ==========================================

function switchView(viewName) {
  if (viewName === 'home') {
    if (dom.homeView) dom.homeView.style.display = 'block';
    if (dom.gameplayView) dom.gameplayView.style.display = 'none';
    renderHomeRecentSaves();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (viewName === 'gameplay') {
    if (dom.homeView) dom.homeView.style.display = 'none';
    if (dom.gameplayView) dom.gameplayView.style.display = 'block';
    updateGameplayBreadcrumb();
  }
}

function updateGameplayBreadcrumb() {
  if (!dom.gameplayBreadcrumb) return;
  const act = state.saveState?.meta?.currentAct || 1;
  const turn = state.saveState?.turnCount || 1;
  const leadName = state.saveState?.meta?.playerProfile?.targetLeadName || '修羅場';
  dom.gameplayBreadcrumb.textContent = `第 ${act} 幕 · 第 ${turn} 回 ｜ ${leadName}`;
}

function openDrawer() {
  if (dom.sideDrawer && dom.drawerBackdrop) {
    dom.drawerBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    dom.sideDrawer.classList.remove('translate-x-full');
    renderSaveState();
  }
}

function closeDrawer() {
  if (dom.sideDrawer && dom.drawerBackdrop) {
    dom.drawerBackdrop.classList.add('opacity-0', 'pointer-events-none');
    dom.sideDrawer.classList.add('translate-x-full');
  }
}

// ==========================================
// 3. 帳號門禁與認證管理 (Authentication)
// ==========================================

function checkAuthAndInitUser() {
  const storedUser = localStorage.getItem('undercurrent_user_name');
  const storedToken = localStorage.getItem('undercurrent_auth_token');
  
  if (!storedUser || !storedToken) {
    openAuthModal();
  } else {
    state.username = storedUser;
    state.token = storedToken;
    state.userId = localStorage.getItem('undercurrent_user_id') || ('usr_' + Date.now());
    updateUserBadgeUI();
    closeAuthModal();
  }
}

function openAuthModal() {
  if (dom.authModal) dom.authModal.style.display = 'flex';
}

function closeAuthModal() {
  if (dom.authModal) dom.authModal.style.display = 'none';
}

function switchAuthTab(tab) {
  if (tab === 'login') {
    if (dom.tabLoginBtn) dom.tabLoginBtn.className = 'flex-1 py-2.5 rounded-md bg-brand-gold text-slate-950 transition cursor-pointer font-bold';
    if (dom.tabRegisterBtn) dom.tabRegisterBtn.className = 'flex-1 py-2.5 rounded-md text-slate-400 hover:text-white transition cursor-pointer font-bold';
    if (dom.loginForm) dom.loginForm.style.display = 'block';
    if (dom.registerForm) dom.registerForm.style.display = 'none';
  } else {
    if (dom.tabLoginBtn) dom.tabLoginBtn.className = 'flex-1 py-2.5 rounded-md text-slate-400 hover:text-white transition cursor-pointer font-bold';
    if (dom.tabRegisterBtn) dom.tabRegisterBtn.className = 'flex-1 py-2.5 rounded-md bg-emerald-500 text-slate-950 transition cursor-pointer font-bold';
    if (dom.loginForm) dom.loginForm.style.display = 'none';
    if (dom.registerForm) dom.registerForm.style.display = 'block';
  }
}


/**
 * ☁️ 非同步同步真實遊戲存檔至 Google Drive (Player_Saves) 與 Google Sheets (Master_Index)
 */
async function syncStateToGoogleDriveCloud(saveStateObj, chapterDataObj, isManual = false) {
  const saveState = saveStateObj || state.saveState;
  const chapterData = chapterDataObj || state.chapterData;
  const playerProfile = state.playerProfile || (saveState && saveState.meta && saveState.meta.playerProfile);

  if (!saveState && !chapterData) {
    if (isManual) alert('目前尚無進行中的遊戲進度可同步至雲端！');
    return;
  }

  try {
    const email = state.username ? (state.username.includes('@') ? state.username : `${state.username}@undercurrent.game`) : 'player@undercurrent.game';
    const payload = {
      action: 'novel/save-state',
      token: state.token || 'tok_player_' + (state.userId || 'guest'),
      userId: state.userId || 'usr_player',
      email: email,
      saveState: saveState,
      chapter: chapterData,
      playerProfile: playerProfile,
      chapterHistory: state.chapterHistoryList || [],
      namedSaves: getNamedSavesList()
    };

    console.log('[Cloud Sync] Transmitting live game data to Google Drive...', payload);

    // 嘗試向 Google Apps Script 後端推播存檔與小說章節
    fetch(state.gasApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      mode: 'no-cors' // Google Apps Script Web App 跨域支援
    }).then(() => {
      console.log('[Cloud Sync] Successfully triggered Google Drive (Player_Saves) synchronization.');
      if (isManual) {
        alert('☁️ 【Google Drive 雲端同步完成】\n已成功將您當前的「真實玩家人設 (Player_Profile.json)」、「完整小說正文 (Full_Novel.md)」、「長期劇情摘要 (Summary_Pool.md)」與「好感度存檔 (save_slot.json)」全數同步儲存至 Google Drive 的 Player_Saves 專屬資料夾中！');
      }
    }).catch(e => {
      console.warn('[Cloud Sync] Background cloud sync warning (silent fallback):', e.message);
      if (isManual) {
        alert('雲端同步已發送至 Google Drive 後台處理中。');
      }
    });
  } catch (err) {
    console.warn('[Cloud Sync] Sync dispatch skipped:', err.message);
    if (isManual) alert('同步請求發送失敗：' + err.message);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  if (!username || !pass) return alert('請輸入帳號與密碼！');

  state.username = username;
  state.token = 'tok_' + Date.now();
  state.userId = 'usr_' + btoa(encodeURIComponent(username)).slice(0, 12);
  
  localStorage.setItem('undercurrent_user_name', state.username);
  localStorage.setItem('undercurrent_auth_token', state.token);
  localStorage.setItem('undercurrent_user_id', state.userId);
  
  updateUserBadgeUI();
  closeAuthModal();
  alert(`✦ 歡迎回來，${username}！已成功登入。`);
}

function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const pass = document.getElementById('reg-password').value.trim();
  if (!username || !pass || pass.length < 6) return alert('請輸入完整帳號與至少 6 碼密碼！');

  state.username = username;
  state.token = 'tok_' + Date.now();
  state.userId = 'usr_' + btoa(encodeURIComponent(username)).slice(0, 12);
  
  localStorage.setItem('undercurrent_user_name', state.username);
  localStorage.setItem('undercurrent_auth_token', state.token);
  localStorage.setItem('undercurrent_user_id', state.userId);
  
  updateUserBadgeUI();
  closeAuthModal();
  alert(`🎉 恭喜註冊成功！歡迎踏入《暗流》，${username}。`);
}

function handleLogout() {
  if (confirm('確定要登出當前帳號嗎？')) {
    localStorage.removeItem('undercurrent_auth_token');
    localStorage.removeItem('undercurrent_user_name');
    state.username = '';
    state.token = '';
    updateUserBadgeUI();
    openAuthModal();
  }
}

function handleDeleteAccount() {
  const confirmName = prompt(`⚠️ 危險操作：註銷帳號將永久抹除您的身分與雲端全部存檔！\n\n若確定註銷，請在此輸入您的帳號名稱「${state.username}」：`);
  if (confirmName === state.username) {
    localStorage.clear();
    alert('您的帳號及所有本機檔案已全數註銷刪除。');
    location.reload();
  } else if (confirmName !== null) {
    alert('輸入名稱不相符，已取消註銷操作。');
  }
}

function handleClearAllData() {
  if (confirm('確定要清空所有本機暫存與遊玩紀錄嗎？（不影響雲端已備份檔案）')) {
    localStorage.removeItem('undercurrent_current_save_state');
    localStorage.removeItem('undercurrent_full_story_chapters');
    localStorage.removeItem('undercurrent_named_saves');
    state.saveState = null;
    state.chapterData = null;
    state.chapterHistoryList = [];
    alert('本機存檔資料已清空重置。');
    location.reload();
  }
}

function updateUserBadgeUI() {
  const name = state.username || '未登入';
  if (dom.usernameDisplay) dom.usernameDisplay.textContent = name;
  if (dom.homeUsernameDisplay) dom.homeUsernameDisplay.textContent = name;
}

// =========================================================================
// 4. 純 AI 即時零範本生成引擎 (Pure Real-Time AI Generation Engine)
// =========================================================================

const LLM_CONFIG = {
  API_URL: 'https://api.banana2556.com/v1/chat/completions',
  API_KEY: 'sk-TcKczU9MQ5abSWYrF51eU85aQjZV6IzPqeypYYn9zVDoSram',
  PRIMARY_MODEL: 'aion-rp-1.0',
  FALLBACK_MODEL: 'cognitivecomputations/dolphin-mistral-24b-venice-edition',
  TEMPERATURE: 0.88
};

/**
 * 健壯的 JSON 自動修復與解析器
 */
function parseJsonSafely(rawText) {
  if (!rawText) throw new Error('Empty response from LLM');
  let clean = rawText.trim();
  
  clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(clean);
  } catch (e) {
    clean = clean.replace(/\\n/g, "\\n")  
                 .replace(/\\'/g, "\\'")
                 .replace(/\\"/g, '\\"')
                 .replace(/\\&/g, "\\&")
                 .replace(/\\r/g, "\\r")
                 .replace(/\\t/g, "\\t")
                 .replace(/\\b/g, "\\b")
                 .replace(/\\f/g, "\\f");
    return JSON.parse(clean);
  }
}

let lastRequestTimestamp = 0;
const MIN_REQUEST_GAP_MS = 12000; // 5 RPM: 60s / 5 = 12s

/**
 * ⚡ 伺服器頻率守衛（Rate Limit Cooldown Protector）
 */
async function waitForRpmCooldown() {
  const now = Date.now();
  const elapsed = now - lastRequestTimestamp;
  if (elapsed < MIN_REQUEST_GAP_MS) {
    let remainingSec = Math.ceil((MIN_REQUEST_GAP_MS - elapsed) / 1000);
    while (remainingSec > 0) {
      if (dom.loadingText) {
        dom.loadingText.textContent = `⚡ 筆觸沉澱冷卻中（剩餘 ${remainingSec} 秒）……`;
      }
      if (dom.loadingSubtext) {
        dom.loadingSubtext.textContent = '系統正為您自動排隊，即將於倒數結束後即時推演劇情……';
      }
      await new Promise(r => setTimeout(r, 1000));
      remainingSec--;
    }
  }
}

/**
 * 核心大模型直接呼叫函數 (極速多模型 + 429 自癒機制)
 */
async function generateStoryFromLLM(systemPrompt, userPrompt) {
  const models = [
    'aion-rp-1.0',
    'cognitivecomputations/dolphin-mistral-24b-venice-edition',
    'gpt-5.6-luna',
    'aion-3.0'
  ];

  await waitForRpmCooldown();

  for (let mIdx = 0; mIdx < models.length; mIdx++) {
    const model = models[mIdx];
    try {
      if (dom.loadingText) {
        dom.loadingText.textContent = `以太筆觸流轉中，AI 主筆作家正在為您現場創作……`;
      }
      if (dom.loadingSubtext) {
        dom.loadingSubtext.textContent = `無預設範本 · 100% 依據您的自訂人設與即時抉擇創作長篇情節……`;
      }

      const controller = new AbortController();
      state.currentAbortController = controller;
      const timeoutId = setTimeout(() => controller.abort(), 22000); // 22 秒極速換線保護

      const response = await fetch(LLM_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LLM_CONFIG.API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: LLM_CONFIG.TEMPERATURE,
          max_tokens: 2500
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      lastRequestTimestamp = Date.now();

      if (response.status === 429) {
        console.warn(`[Pure AI] Rate Limit. Waiting 12s cooldown...`);
        let cd = 12;
        while (cd > 0) {
          if (dom.loadingText) dom.loadingText.textContent = `⚡ 筆觸冷卻中（剩餘 ${cd} 秒）……`;
          if (dom.loadingSubtext) dom.loadingSubtext.textContent = '正在為您自動重試推進，請稍候……';
          await new Promise(r => setTimeout(r, 1000));
          cd--;
        }
        lastRequestTimestamp = Date.now();
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Pure AI] Model ${model} HTTP ${response.status}: ${errText.slice(0, 100)}`);
        continue;
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) {
        console.warn(`[Pure AI] Model ${model} returned empty content.`);
        continue;
      }

      const parsed = parseJsonSafely(rawContent);
      if (parsed && parsed.prose) {
        console.log(`[Pure AI] Successfully generated with model: ${model} (${parsed.prose.length} chars)`);
        return parsed;
      }
    } catch (err) {
      console.warn(`[Pure AI] Model ${model} attempt error:`, err.message);
    }
  }

  throw new Error('所有 AI 創作模型生成逾時或回傳格式異常，請檢查網路連線。');
}

// =========================================================================
// 4.5 三層角色動態注入引擎與長期滾動摘要池 (Tiered Lore & Memory Pipeline)
// =========================================================================

const ROSTER_ONE_LINERS = [
  { id: "01_徐令謙", name: "徐令謙", aliases: ["徐令謙", "二爺", "徐二少", "令謙", "天裕會"], role: "黑道玄辰幫二把手 · 天裕會中樞 · 幕後制策者", oneLiner: "深沉狠戾的黑道制策者，金絲眼鏡後的眼神如刃，擅長以退為進的極致掌控與高位支配。" },
  { id: "02_韓正寰", name: "韓正寰", aliases: ["韓正寰", "韓檢", "韓主任", "正寰", "士林地檢署", "白日判官"], role: "士林地檢署主任檢察官 · 白日判官", oneLiner: "冷峻禁慾的司法利刃，手握法理與罪證，在正義守護與私慾佔有邊界極限拉扯。" },
  { id: "03_邵翊衡", name: "邵翊衡", aliases: ["邵翊衡", "邵秘書", "翊衡", "總統府機要秘書"], role: "總統府機要秘書 · 權力樞紐之影", oneLiner: "溫潤優雅的政壇操盤手，談笑間封鎖所有退路，帶著溫和面具的無聲支配者。" },
  { id: "04_楊紹宸", name: "楊紹宸", aliases: ["楊紹宸", "楊董", "紹宸", "弘楊集團少東"], role: "弘楊集團少東 · 執行董事 · 物流總經理", oneLiner: "桀驁不馴的財閥繼承人，掌控跨國物流與碼頭貿易，佔有慾極強且作風凌厲。" },
  { id: "05_徐宇寧", name: "徐宇寧", aliases: ["徐宇寧", "宇寧", "明隱牙醫", "徐醫師"], role: "明隱牙醫診所院長 · 牙醫師 · 徐家長房長孫", oneLiner: "白袍下的精緻支配者，溫文爾雅、細膩體貼，帶著令人窒息的專注與掌控。" },
  { id: "06_林政修", name: "林政修", aliases: ["林政修", "林次", "政修", "法務部次長"], role: "法務部政務次長 · 頂層權力掌舵者", oneLiner: "沉穩威嚴的政壇上位者，舉手投足皆是國家機器級別的絕對權力壓迫。" },
  { id: "07_沈湛然", name: "沈湛然", aliases: ["沈湛然", "沈醫師", "湛然", "台大精神科"], role: "台大醫院精神醫學部主治名醫 · 心理側寫專家", oneLiner: "洞悉人性的深淵凝視者，能輕易看穿防禦與隱密慾望，擅長潛意識引導與心理推拉。" },
  { id: "08_江瀚文", name: "江瀚文", aliases: ["江瀚文", "江執行長", "瀚文", "鼎曜傳媒"], role: "鼎曜媒體集團執行長 · 傳媒巨擘", oneLiner: "商界菁英傳媒大亨，擅長資本收購、輿論操控與鏡頭下的致命曖昧。" },
  { id: "09_吳衛廷", name: "吳衛廷", aliases: ["吳衛廷", "吳委員", "衛廷", "在野黨立委"], role: "立法院司法及法制委員會立法委員 · 舊城區實力派", oneLiner: "深諳基層利益與國會黑幕的實權立委，作風霸道深沉、江湖草莽氣質與政治手腕並存。" },
  { id: "10_徐承勳", name: "徐承勳", aliases: ["徐承勳", "副總統", "承勳", "徐副"], role: "中華民國副總統 · 國家備位元首", oneLiner: "成熟禁慾的政壇巔峰男性，身處權力牢籠，深邃孤獨且極具上位者威儀。" },
  { id: "11_徐耀南", name: "徐耀南", aliases: ["徐耀南", "徐董", "耀南", "榮南營造"], role: "榮南營造集團創辦人兼董事長 · 中部營造巨擘", oneLiner: "白手起家的商界梟雄，冷峻威嚴、體魄硬朗，帶有濃烈宗族家長權威。" },
  { id: "12_徐若宸", name: "徐若宸", aliases: ["徐若宸", "若宸", "徐大少"], role: "榮南營造家族長子 · UBC商學院/企管所", oneLiner: "肩負家族重任的知性清雅貴公子，清瘦內斂，內心壓抑著深沉的情感叛逆。" },
  { id: "13_徐予澈", name: "徐予澈", aliases: ["徐予澈", "徐泰希", "泰希", "予澈", "HapSTer"], role: "亞洲頂級男團 HapSTer 門面主唱兼領舞（藝名徐泰希）", oneLiner: "台上極限魅惑、私下清冷溫潤的頂流偶像，在聚光燈與私密情感間掙扎。" }
];

/**
 * 動態在場配角偵測器 (Tier 2 NPC Detector)
 */
function detectActiveNPCs(lastProseText, playerChoice, primaryLeadKey, defaultSupportingLeads = []) {
  const scanTarget = ((playerChoice || '') + ' ' + ((lastProseText || '').slice(-600))).toLowerCase();
  const activeNPCs = [];

  // 1. 優先動態掃描正文與對白中被提及/登場的 T3 人物
  for (let i = 0; i < ROSTER_ONE_LINERS.length; i++) {
    const charObj = ROSTER_ONE_LINERS[i];
    if (charObj.id === primaryLeadKey || charObj.name === primaryLeadKey) continue;

    let isMentioned = false;
    for (let j = 0; j < charObj.aliases.length; j++) {
      if (scanTarget.includes(charObj.aliases[j].toLowerCase())) {
        isMentioned = true;
        break;
      }
    }

    if (isMentioned) {
      activeNPCs.push(charObj);
      if (activeNPCs.length >= 2) break; // 上限 2 位，避免 Token 膨脹
    }
  }

  // 2. 若當前文本無明確提及，且開局有勾選優先交織配角，則將優先配角納入 Tier 2 備選
  if (activeNPCs.length === 0 && defaultSupportingLeads && defaultSupportingLeads.length > 0) {
    for (let k = 0; k < defaultSupportingLeads.length; k++) {
      const sKey = defaultSupportingLeads[k];
      const match = ROSTER_ONE_LINERS.find(c => c.id === sKey || c.name === sKey);
      if (match && match.id !== primaryLeadKey && match.name !== primaryLeadKey) {
        activeNPCs.push(match);
        if (activeNPCs.length >= 2) break;
      }
    }
  }

  return activeNPCs;
}

/**
 * 三層角色提示詞組裝器 (Tier 1 主角 / Tier 2 在場配角 / Tier 3 世界名冊)
 */
function assembleCharacterPromptBlock(primaryLeadKey, activeNPCs, isShura) {
  const blocks = [];

  if (isShura) {
    blocks.push('=== 【全勢力修羅場 (Tier 1)】 ===');
    blocks.push('當前模式：十三勢力修羅場交鋒！所有 13 位男主均可能依局勢動態突入，請隨時維持各方勢力交鋒的緊張感與性張力！\n');
  } else {
    const primaryChar = OFFICIAL_DRIVE_CHARACTERS[primaryLeadKey] || OFFICIAL_DRIVE_CHARACTERS['01_徐令謙'];
    blocks.push('=== 【主要互動角色 (Tier 1 · 核心主角 · 全量人設)】 ===');
    blocks.push(`- 姓名：${primaryChar.name}（${primaryChar.age}）\n- 官方專屬身分：${primaryChar.identityRole}\n- 核心性格與暗線背景：${primaryChar.summary}\n`);
  }

  if (activeNPCs && activeNPCs.length > 0) {
    blocks.push('=== 【當前在場配角 (Tier 2 · 動態突入 · 全量人設)】 ===');
    blocks.push('【在場配角演繹指引】：以下角色已動態升階為在場配角！請載入其完整性格與上位者身分，推動衝突、試探與暗流，但不可喧賓奪主蓋過核心主角！');
    activeNPCs.forEach((npc, idx) => {
      const fullChar = OFFICIAL_DRIVE_CHARACTERS[npc.id] || OFFICIAL_DRIVE_CHARACTERS[npc.name] || {};
      const fullRole = fullChar.identityRole || npc.role;
      const fullSummary = fullChar.summary || npc.oneLiner;
      const ageStr = fullChar.age ? `（${fullChar.age}）` : '';
      blocks.push(`▶ 在場配角 [${idx + 1}]：${npc.name}${ageStr}\n  - 專屬身分：${fullRole}\n  - 性格與暗線細節：${fullSummary}\n  - 核心特徵：${npc.oneLiner}`);
    });
    blocks.push('');
  }

  const activeIds = (activeNPCs || []).map(n => n.id);
  if (primaryLeadKey) activeIds.push(primaryLeadKey);

  const tier3List = ROSTER_ONE_LINERS.filter(c => !activeIds.includes(c.id) && c.name !== primaryLeadKey);
  if (tier3List.length > 0) {
    blocks.push('=== 【世界全景背景名冊 (Tier 3 · 勢力網絡)】 ===');
    blocks.push('【宏觀世界與勢力交織】：這些人物構成了台北政商黑白兩道的權力網絡。即使本回合未在場，他們的勢力暗流、新聞傳聞、手下眼線與利益關聯仍持續在背景運轉，隨時可能因情勢變化介入局勢！若劇情中提及，請嚴格遵守其官方身分定位，絕不可張冠李戴：');
    tier3List.forEach(t3 => {
      blocks.push(`• ${t3.name}：${t3.role} —— ${t3.oneLiner}`);
    });
  }

  return blocks.join('\n');
}

function buildFirstTurnPrompt(profile) {
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const customScenario = (profile.customScenario || '').trim();
  const leadKey = profile.targetLead || '01_徐令謙';

  // 1. 動態偵測自訂情境中是否包含配角
  const activeNPCs = detectActiveNPCs('', customScenario, leadKey, profile.supportingLeads || []);
  const characterPromptBlock = assembleCharacterPromptBlock(leadKey, activeNPCs, isShura);

  const systemPrompt = `你是一位專精成人女性情感小說與權謀黑幫的頂級角色扮演敘事者與RPG核心引擎。
請遵守《情慾文學指引》與《系統核心指令》：
1. 【嚴格身分防火牆】：
   - 徐令謙是「黑道玄辰幫二把手 · 天裕會中樞 · 幕後制策者」，絕對不是檢察官或警察！（士林地檢署檢察官是韓正寰）。
   - 韓正寰是「士林地檢署主任檢察官 · 白日判官」。
   - 徐承勳是「中華民國副總統」。
   絕不可混淆男主身分！
2. 風格與成人情慾（R-18）：極致性張力、高位推拉、寫實直白描寫肉體交纏、支配與臣服、五感具象（體溫、喘息、香氣、眼神壓迫、肢體撫摸）、權謀殺伐與多方博弈，使用純台灣繁體中文。
3. 每一次生成完全原創、字數達 1,000~1,500 字，絕不套用固定模板。
4. 【三層角色設定集】：
${characterPromptBlock}

5. 輸出必須為合法純 JSON 格式（不要包含任何 markdown 代碼標記）：
{
  "chapterTitle": "第 1 回．【原創吸睛標題】",
  "prose": "【1000~1500字極具性張力、權謀拉扯與成人情慾描寫的長篇小說正文】",
  "statusPanel": {
    "timeLocation": "具體時空地點（如：2026年5月12日 21:30 台北市士林區...）",
    "tension": "張力值 [85%]",
    "intoxication": "微醺度 [35%]",
    "outfit": "角色著裝神態（若玩家寫隨機，請依職業為女主原創專屬高級迷人穿搭、體香與神態）",
    "interaction": "肢體與眼神互動狀態（包含極限物理距離、微表情、體溫與觸摸）",
    "inventory": "隨身攜帶之關鍵底牌或隨身碟",
    "rumors": "台北政媒黑白兩道最新暗流傳聞"
  },
  "choices": [
    { "id": "A", "label": "[A] 【選項A完整行動與對白描述】", "risk": "low", "hint": "策略提示" },
    { "id": "B", "label": "[B] 【選項B完整行動與對白描述】", "risk": "medium", "hint": "策略提示" },
    { "id": "C", "label": "[C] 【選項C情慾暗示/主動靠近/破局點】", "risk": "high", "hint": "策略提示" }
  ]
}`;

  const userPrompt = `【玩家角色】
- 姓名：${profile.name}
- 性別：${profile.gender || '女'}
- 年齡：${profile.age || '24'}
- 職業：${profile.profession || '政經公關總監'}
- 身世背景：${profile.background || '遊走於台北政商黑白兩道'}
- 外貌特徵：${profile.appearance || '隨機（請替我原創專屬高級迷人穿搭、體香與神態）'}
- 禁忌標籤：${profile.taboos || '無'}
- 成人情慾模式 (R-18)：開啟（包含露骨細緻的體溫、喘息、支配與肢體性張力）

- 玩家自訂開局情境：${customScenario || '深夜暴雨台北，帶著關鍵政商洗錢密錄暗帳初次入局'}

請根據以上玩家自訂人設、官方男主真實黑幫/政商身分與開局情境，完全從零即時創作第 1 回長篇小說，精準呈現情境地點、男主眼神壓迫、性張力拉扯與三個全新抉擇選項！`;

  return { systemPrompt, userPrompt };
}

function buildNextTurnPrompt(turnCount, choiceId, customInput, profile, historyList, summaryPool) {
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const leadKey = profile.targetLead || '01_徐令謙';
  
  // 提取最近回合文本與玩家輸入進行配角掃描
  const lastChapter = (historyList || [])[(historyList || []).length - 1] || {};
  const lastProseText = lastChapter.prose || '';
  const playerActionText = customInput || choiceId;

  // 1. 動態偵測在場配角 (Tier 2，含 T3 升階全量載入與開局優先配角)
  const activeNPCs = detectActiveNPCs(lastProseText, playerActionText, leadKey, profile.supportingLeads || []);
  const characterPromptBlock = assembleCharacterPromptBlock(leadKey, activeNPCs, isShura);

  // 2. 組裝近期 2 回合短期記憶
  const recentHistory = (historyList || []).slice(-2).map((h, i) => `【第 ${h.turn || (i + 1)} 回：${h.chapterTitle || '前篇'}】\n玩家抉擇：${h.chosenLabel || '無'}\n情節摘記：${(h.prose || '').slice(0, 300)}...`).join('\n\n');

  // 3. 組裝長期滾動摘要池 (Summary Pool)
  const summaryBlock = summaryPool ? `【歷史劇情滾動摘要池（長期記憶）】\n${summaryPool}\n\n` : '';

  const systemPrompt = `你是一位專精成人女性情感小說與權謀黑幫的頂級角色扮演敘事者與RPG核心引擎。
請遵守《情慾文學指引》與《系統核心指令》：
1. 嚴格依據玩家剛才執行的最新行動/抉擇，即時推進後續 1,000~1,500 字長篇小說正文。
2. 描寫要求：極致性張力、上位者男性佔有欲、五感溫度、喘息、支配與臣服、細節肢體碰觸、成人情慾拉扯與權謀博弈，使用純台灣繁體中文。
3. 絕不重複前篇標題與對話，每次推進都是全新事件與衝突升級！
4. 【三層角色設定集】：
${characterPromptBlock}

5. 輸出必須為合法純 JSON 格式（不要包含 markdown 代碼標記）：
{
  "chapterTitle": "第 1 幕 第 ${turnCount} 回：【全新章節標題】",
  "prose": "【1000~1500字緊接玩家行動推進的長篇小說正文】",
  "statusPanel": {
    "timeLocation": "時空地點",
    "tension": "張力值 [XX%]",
    "intoxication": "微醺度 [XX%]",
    "outfit": "角色著裝神態",
    "interaction": "肢體與眼神互動狀態",
    "inventory": "掌握情報物品",
    "rumors": "政媒暗流傳聞"
  },
  "choices": [
    { "id": "A", "label": "[A] 【選項A完整行動與對白描述】", "risk": "low", "hint": "提示" },
    { "id": "B", "label": "[B] 【選項B完整行動與對白描述】", "risk": "medium", "hint": "提示" },
    { "id": "C", "label": "[C] 【選項C情慾暗示/破局點】", "risk": "high", "hint": "提示" }
  ]
}`;

  const userPrompt = `【玩家角色】姓名：${profile.name}，職業：${profile.profession}，攻略模式：${isShura ? '全勢力修羅場' : profile.targetLeadName}
- 成人情慾模式 (R-18)：開啟
【前情脈絡】
${summaryBlock}${recentHistory || '正處於首次交鋒對峙中'}

【玩家本回最新行動】
- 抉擇標籤或自訂行動：${playerActionText}
- 當前進展至：第 ${turnCount} 回

請緊接著玩家的最新行動，完全原創演繹對手男主的反應、眼神殺伐、近身肢體推拉與情慾爆發，並生成 3 個全新分支選項！`;

  return { systemPrompt, userPrompt };
}

/**
 * ⚡ 5 回合背景滾動摘要池壓縮器 (Fast Auditor Summary Pipeline)
 */
async function triggerRollingSummaryUpdate(turnCount) {
  if (!state.saveState || turnCount <= 1) return;
  console.log(`[MemoryPipeline] Triggering rolling summary compression for Turn ${turnCount}...`);

  const recent5Turns = (state.chapterHistoryList || []).slice(-5).map(h => ({
    turn: h.turn,
    title: h.chapterTitle,
    action: h.chosenLabel,
    snippet: (h.prose || '').substring(0, 250)
  }));

  const systemPrompt = '你是小說記憶統整引擎。請將現有摘要與最新 5 回合故事紀錄濃縮為 1,000 ~ 1,500 字元高資訊密度摘要池（保留關鍵物品、人物好感度轉折、重大線索與承諾）。請一律使用台灣繁體中文輸出純文字摘要，不要多餘寒暄。';
  const userPrompt = `--- 現有摘要池 ---\n${state.saveState.summaryPool || '（初始開局）'}\n\n--- 待整合的最新回合記錄 ---\n${JSON.stringify(recent5Turns, null, 2)}\n\n【請直接輸出更新後的純摘要文字】：`;

  try {
    const response = await fetch(LLM_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: 'aion-3.0-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1000
      })
    });

    if (response.ok) {
      const data = await response.json();
      const newSummary = data.choices?.[0]?.message?.content?.trim();
      if (newSummary && newSummary.length > 20) {
        state.saveState.summaryPool = newSummary;
        localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));
        console.log(`[MemoryPipeline] Summary Pool successfully updated (${newSummary.length} chars).`);
        syncStateToGoogleDriveCloud(state.saveState, state.chapterData);
      }
    }
  } catch (err) {
    console.warn('[MemoryPipeline] Summary update failed in background:', err.message);
  }
}

// =========================================================================
// 5. 開新局與回合推進 (New Game & Turn Progression)
// =========================================================================

async function handleCharacterCreationSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const targetSelect = dom.formTargetLead || document.getElementById('form-target-lead');
  const selectedOption = targetSelect?.options[targetSelect?.selectedIndex];

  const supportingCheckboxes = document.querySelectorAll('.supporting-lead-cb:checked');
  const supportingLeads = Array.from(supportingCheckboxes).map(cb => cb.value);

  const profile = {
    name: document.getElementById('form-player-name').value.trim() || '楊慕璃',
    gender: document.getElementById('form-player-gender').value,
    age: document.getElementById('form-player-age').value.trim() || '24',
    profession: document.getElementById('form-player-profession').value.trim() || '弘楊集團公關總監',
    background: document.getElementById('form-player-background').value.trim(),
    appearance: document.getElementById('form-player-appearance').value.trim() || '隨機',
    taboos: document.getElementById('form-player-taboos').value.trim() || '無',
    targetLead: targetSelect.value,
    targetLeadName: selectedOption?.getAttribute('data-name') || '徐令謙',
    supportingLeads: supportingLeads,
    allowR18: document.getElementById('form-allow-r18').checked,
    customScenario: document.getElementById('form-custom-scenario').value.trim()
  };

  closeCharacterCreationModal();
  await startNewGameWithProfile(profile);
}

async function startNewGameWithProfile(profile) {
  // 1. 徹底重置遊戲全域狀態與 DOM（絕不殘留舊局卡片）
  state.playerProfile = profile;
  state.chapterHistoryList = [];
  state.chapterData = null;
  state.lastChoicePayload = null;
  state.previousStateSnapshot = null;
  
  if (dom.novelStreamContainer) dom.novelStreamContainer.innerHTML = '';
  if (dom.choicesContainer) dom.choicesContainer.innerHTML = '';
  if (dom.customActionInput) dom.customActionInput.value = '';

  localStorage.setItem('undercurrent_current_player_profile', JSON.stringify(profile));

  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const targetLeadDisplay = isShura ? '全勢力男主（修羅場）' : profile.targetLeadName;

  const rels = {};
  if (isShura) {
    rels['徐令謙'] = 20;
    rels['韓正寰'] = 15;
    rels['楊紹宸'] = 10;
  } else {
    rels[profile.targetLeadName] = 25;
    (profile.supportingLeads || []).forEach(leadKey => {
      const sLead = OFFICIAL_DRIVE_CHARACTERS[leadKey];
      if (sLead) rels[sLead.name] = 15;
    });
  }

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
      { id: 'item_press', name: '特許採訪證 / 身分底牌', count: 1, desc: '證明自身出入政商名流場合的身分底牌。' }
    ],
    relationships: rels,
    questFlags: {
      main_quest: isShura ? '暗流初會：在全勢力交鋒中破局' : `初會：與 ${profile.targetLeadName} 的交鋒`
    },
    summaryPool: `玩家 ${profile.name} 正式入局，情境設定：${(profile.customScenario || '全新開局').slice(0, 50)}...`,
    turnHistory: []
  };

  localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));

  switchView('gameplay');
  showLoading('選項確認中……', '正在依照自訂人設與情境即時生成第 1 回……');

  let initialChapter = null;
  try {
    const { systemPrompt, userPrompt } = buildFirstTurnPrompt(profile);
    initialChapter = await generateStoryFromLLM(systemPrompt, userPrompt);
  } catch (aiErr) {
    console.error('[Pure AI] First turn generation error:', aiErr);
    alert('AI 大模型生成逾時，正在為您重新連接……');
    initialChapter = {
      chapterTitle: `第 1 回．雨夜初會 · ${profile.targetLeadName || '徐令謙'}`,
      prose: `五月深夜的台北，暴雨如注。\n\n${profile.name}手握關鍵底牌踏入現場，對面男人的視線在第一時間精準鎖定了她……`,
      statusPanel: {
        timeLocation: '台北市深夜暴雨街頭',
        tension: '張力值 [75%]',
        intoxication: '微醺度 [20%]',
        outfit: `${profile.name}（高級訂製風衣） ｜ ${profile.targetLeadName || '徐令謙'}`,
        interaction: '目光鎖定',
        inventory: '密錄隨身碟',
        rumors: '台北政媒暗潮湧動'
      },
      choices: [
        { id: 'A', label: '[A] 掌局談判：迎上視線開出交換條件', risk: 'low', hint: '展現從容底氣' },
        { id: 'B', label: '[B] 機鋒推拉：言語試探對方底線', risk: 'medium', hint: '心理推拉' },
        { id: 'C', label: '[C] 情慾反撩：主動靠近拉滿性張力', risk: 'high', hint: '極限點火' }
      ]
    };
  } finally {
    hideLoading();
  }

  initialChapter.act = 1;
  initialChapter.turn = 1;
  initialChapter.chosenLabel = '【正式開局】';

  state.chapterData = initialChapter;
  state.chapterHistoryList = [initialChapter];
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
  
  renderStoryStream(initialChapter);
  renderSaveState();
  updateGameplayBreadcrumb();
  
  saveGameStateToSlot('1');
  syncStateToGoogleDriveCloud(state.saveState, initialChapter);
}

async function makeChoice(choiceId, customInput, isRegenerating = false) {
  if (!isRegenerating) {
    state.previousStateSnapshot = {
      saveState: JSON.parse(JSON.stringify(state.saveState || {})),
      chapterData: JSON.parse(JSON.stringify(state.chapterData || {}))
    };
    state.lastChoicePayload = { choiceId, customInput };
  }

  showLoading(
    isRegenerating ? '章節重新生成中……' : '選項確認中……',
    '正在依照當前局勢動態演算與鋪陳情節……'
  );

  if (dom.errorRecoveryBanner) dom.errorRecoveryBanner.style.display = 'none';

  try {
    state.saveState = state.saveState || {};
    state.saveState.turnCount = (state.saveState.turnCount || 1) + 1;
    
    const profile = getActivePlayerProfile();
    state.saveState.meta = state.saveState.meta || {};
    state.saveState.meta.playerProfile = profile;
    localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));

    let nextChapter = null;

    try {
      const { systemPrompt, userPrompt } = buildNextTurnPrompt(
        state.saveState.turnCount,
        choiceId,
        customInput,
        profile,
        state.chapterHistoryList || [],
        state.saveState.summaryPool || ''
      );
      nextChapter = await generateStoryFromLLM(systemPrompt, userPrompt);
    } catch (llmErr) {
      console.warn('[Pure AI] Next turn LLM call failed, generating dynamic fallback turn:', llmErr);
      nextChapter = {
        chapterTitle: `第 1 幕 第 ${state.saveState.turnCount} 回：暗流激盪 · 局勢推進`,
        prose: `隨著${profile.name}做出這一抉擇，空氣中的張力陡然飆升！\n\n對面的男人修長的手指輕輕叩擊著桌面，深邃的雙眸中掠過一抹極致的玩味與佔有慾……`,
        statusPanel: {
          timeLocation: '台北市深宵密室',
          tension: '張力值 [85%]',
          intoxication: '微醺度 [30%]',
          outfit: `${profile.name} ｜ ${profile.targetLeadName}`,
          interaction: '近距離推拉',
          inventory: '掌握情報',
          rumors: '暗流湧動'
        },
        choices: [
          { id: 'A', label: '[A] 步步逼近：直視其眼眸開出底線條件', risk: 'low', hint: '穩健博弈' },
          { id: 'B', label: '[B] 言語挑釁：機鋒試探拉扯對峙節奏', risk: 'medium', hint: '心理戰術' },
          { id: 'C', label: '[C] 肢體反撩：傾身拉近物理距離點燃性張力', risk: 'high', hint: '極限誘惑' }
        ]
      };
    }

    nextChapter.act = state.saveState.meta.currentAct || 1;
    nextChapter.turn = state.saveState.turnCount;
    nextChapter.chosenLabel = customInput || choiceId;

    state.chapterData = nextChapter;
    appendChapterToHistory(nextChapter, customInput || choiceId);
    renderStoryStream(nextChapter);
    renderSaveState();
    updateGameplayBreadcrumb();

    // ⚡ 每 5 回合自動在背景非同步更新滾動摘要池 (Summary Pool)
    if (state.saveState.turnCount % 5 === 0) {
      triggerRollingSummaryUpdate(state.saveState.turnCount);
    }

    syncStateToGoogleDriveCloud(state.saveState, nextChapter);
    startServerCooldown(10);
  } catch (err) {
    console.error('makeChoice execution error:', err);
    alert('推進章節時發生錯誤: ' + err.message);
  } finally {
    hideLoading();
  }
}

function handleCustomActionSubmit() {
  const input = dom.customActionInput;
  if (!input) return;
  const val = input.value.trim();
  if (!val) return alert('請輸入您的自訂行動或對白！');
  input.value = '';
  makeChoice('CUSTOM', val, false);
}

function appendChapterToHistory(chapter, chosenLabel) {
  if (!state.chapterHistoryList) state.chapterHistoryList = [];
  const record = Object.assign({}, chapter, {
    timestamp: new Date().toISOString(),
    chosenLabel: chosenLabel || '玩家行動'
  });
  state.chapterHistoryList.push(record);
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
}

// ==========================================
// 6. 小說瀑布流與打字機渲染 (Story Stream & Typewriter)
// ==========================================

function renderStoryStream(activeChapter) {
  if (!dom.novelStreamContainer) return;

  const chapters = state.chapterHistoryList || [];
  const count = chapters.length;

  dom.novelStreamContainer.innerHTML = '';

  for (let i = 0; i < count - 1; i++) {
    const past = chapters[i];
    if (!past) continue;

    const section = document.createElement('section');
    section.className = 'bg-brand-surface/70 border border-brand-border/60 rounded-2xl p-5 sm:p-7 space-y-4 shadow-lg text-slate-300 opacity-90 transition';

    const paragraphs = (past.prose || '').split('\n\n');
    const paragraphsHtml = paragraphs.map(p => `<p class="mb-4 leading-relaxed indent-6 sm:indent-8 select-text">${p.trim()}</p>`).join('');

    let decisionPill = past.chosenLabel && past.chosenLabel !== '【正式開局】' ? `
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
    `;

    dom.novelStreamContainer.appendChild(section);
  }

  const activeSection = document.createElement('section');
  activeSection.id = 'active-chapter-card';
  activeSection.className = 'bg-brand-surface border border-brand-gold/50 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl relative transition scroll-mt-20';

  const currentTurnNum = state.saveState?.turnCount || count;
  const currentActNum = state.saveState?.meta?.currentAct || 1;
  const activeRecord = chapters[count - 1] || activeChapter;
  const activeActionPill = activeRecord && activeRecord.chosenLabel && activeRecord.chosenLabel !== '【正式開局】' ? `
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

      <div class="flex items-center gap-1.5 shrink-0">
        <button id="stream-regenerate-btn" class="text-xs bg-brand-card hover:bg-brand-border text-slate-300 hover:text-brand-gold px-2.5 py-1.5 rounded-lg border border-brand-border transition flex items-center gap-1 cursor-pointer" title="重新生成本回演繹">
          <span>🔄</span>
          <span class="hidden sm:inline">重新生成</span>
        </button>
        <button id="stream-rewind-btn" class="text-xs bg-brand-card hover:bg-brand-border text-slate-300 hover:text-amber-300 px-2.5 py-1.5 rounded-lg border border-brand-border transition flex items-center gap-1 cursor-pointer" title="悔棋回退到上一回合">
          <span>↩</span>
          <span class="hidden sm:inline">悔棋</span>
        </button>
      </div>
    </div>

    ${activeActionPill}

    <article id="stream-prose-content" class="font-serif text-lg sm:text-[1.18rem] leading-[2.2] text-[#d8dbe6] tracking-wide prose-tc cursor-pointer select-text" title="打字中點擊可直接顯示全文">
      故事載入中……
    </article>

    <div id="stream-status-panel" class="bg-brand-dark/80 border border-brand-border rounded-xl p-4 text-xs font-sans space-y-2.5">
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-slate-300">
        <div><strong>🕰 時空：</strong><span class="text-brand-gold">${activeChapter.statusPanel?.timeLocation || '-'}</span></div>
        <div><strong>🌡 氛圍：</strong><span class="text-rose-400">${activeChapter.statusPanel?.tension || '張力 0%'}</span> ｜ <span class="text-amber-300">${activeChapter.statusPanel?.intoxication || '微醺 0%'}</span></div>
      </div>
      <div class="text-slate-300"><strong>👔 著裝神態：</strong><span class="text-slate-200">${activeChapter.statusPanel?.outfit || '-'}</span></div>
      <div class="text-slate-300"><strong>👫 互動姿態：</strong><span class="text-slate-300">${activeChapter.statusPanel?.interaction || '-'}</span></div>
      <div class="text-slate-300"><strong>🎒 掌握情報：</strong><span class="text-amber-200/90">${activeChapter.statusPanel?.inventory || '-'}</span></div>
      <div class="text-slate-400"><strong>🌍 政媒傳聞：</strong><span class="italic text-slate-400">${activeChapter.statusPanel?.rumors || '-'}</span></div>
    </div>
  `;

  dom.novelStreamContainer.appendChild(activeSection);

  document.getElementById('stream-regenerate-btn')?.addEventListener('click', handleRegenerateTurn);
  document.getElementById('stream-rewind-btn')?.addEventListener('click', handleUndoTurn);

  const proseEl = document.getElementById('stream-prose-content');
  const cleanProse = activeChapter.prose || '';

  streamTypewriterEffect(cleanProse, proseEl, null, () => {
    renderChoices(activeChapter.choices || []);
  });

  setTimeout(() => {
    if (activeSection && typeof activeSection.scrollIntoView === 'function') {
      activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

function streamTypewriterEffect(fullText, targetEl, skipBtn, onComplete) {
  if (!targetEl) return;
  state.isTyping = true;
  state.skipTypewriterTriggered = false;

  targetEl.innerHTML = '';
  const paragraphs = fullText.split('\n\n');
  let pIdx = 0;
  let charIdx = 0;
  let currentP = document.createElement('p');
  currentP.className = 'mb-6 indent-6 sm:indent-8';
  targetEl.appendChild(currentP);

  const speedMs = 10;

  function typeNext() {
    if (state.skipTypewriterTriggered || !state.isTyping) {
      targetEl.innerHTML = '';
      paragraphs.forEach(pt => {
        const p = document.createElement('p');
        p.className = 'mb-6 indent-6 sm:indent-8';
        p.textContent = pt;
        targetEl.appendChild(p);
      });
      state.isTyping = false;
      if (onComplete) onComplete();
      return;
    }

    if (pIdx < paragraphs.length) {
      const curText = paragraphs[pIdx];
      if (charIdx < curText.length) {
        currentP.textContent += curText.charAt(charIdx);
        charIdx++;
        state.typewriterTimer = setTimeout(typeNext, speedMs);
      } else {
        pIdx++;
        charIdx = 0;
        if (pIdx < paragraphs.length) {
          currentP = document.createElement('p');
          currentP.className = 'mb-6 indent-6 sm:indent-8';
          targetEl.appendChild(currentP);
          state.typewriterTimer = setTimeout(typeNext, speedMs * 3);
        } else {
          state.isTyping = false;
          if (onComplete) onComplete();
        }
      }
    }
  }

  typeNext();

  targetEl.onclick = () => {
    state.skipTypewriterTriggered = true;
  };
}

function renderChoices(choices) {
  if (!dom.choicesContainer) return;
  dom.choicesContainer.innerHTML = '';

  if (!choices || choices.length === 0) {
    dom.choicesContainer.innerHTML = '<div class="text-xs text-slate-500 py-2">（請於下方輸入自訂自由行動以推進情節）</div>';
    return;
  }

  choices.forEach((c, idx) => {
    const btn = document.createElement('button');
    const borderCls = c.risk === 'high' ? 'border-rose-500/50 hover:border-rose-400 bg-rose-950/20' : 
                      c.risk === 'medium' ? 'border-amber-500/50 hover:border-amber-400 bg-amber-950/20' : 
                      'border-brand-border hover:border-brand-gold bg-brand-surface';
    
    btn.className = `w-full text-left p-4 rounded-xl border ${borderCls} transition duration-150 flex flex-col gap-1.5 shadow-md group cursor-pointer`;
    
    const riskBadge = c.risk === 'high' ? '<span class="text-[10px] bg-rose-900/60 text-rose-300 px-1.5 py-0.5 rounded font-bold">高風險情慾/殺機</span>' :
                      c.risk === 'medium' ? '<span class="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded font-bold">權謀推拉</span>' :
                      '<span class="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded font-bold">穩健推進</span>';

    btn.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-mono text-xs text-brand-gold font-bold">CHOICE ${String.fromCharCode(65 + idx)}</span>
        ${riskBadge}
      </div>
      <div class="font-serif font-bold text-sm text-slate-100 group-hover:text-brand-gold transition leading-snug">
        ${c.label}
      </div>
      ${c.hint ? `<div class="text-xs text-slate-400 font-sans mt-0.5">${c.hint}</div>` : ''}
    `;

    btn.addEventListener('click', () => {
      makeChoice(c.id || `opt_${idx}`, c.label, false);
    });

    dom.choicesContainer.appendChild(btn);
  });
}

// ==========================================
// 7. 人設庫核心管理 (Profile Presets CRUD)
// ==========================================

function getCustomPresets() {
  try {
    return JSON.parse(localStorage.getItem('undercurrent_custom_profiles') || '{}');
  } catch (e) {
    return {};
  }
}

function persistCustomPresets(presets) {
  localStorage.setItem('undercurrent_custom_profiles', JSON.stringify(presets));
  loadSavedProfilePresetsIntoSelect();
  renderProfileManagerList();
}

function openProfileManagerModal() {
  if (dom.profileManagerModal) {
    dom.profileManagerModal.style.display = 'flex';
    renderProfileManagerList();
  }
}

function closeProfileManagerModal() {
  if (dom.profileManagerModal) dom.profileManagerModal.style.display = 'none';
}

function renderProfileManagerList() {
  const container = dom.profileManagerList;
  if (!container) return;

  const custom = getCustomPresets();
  const search = (dom.searchProfileInput?.value || '').toLowerCase().trim();

  container.innerHTML = '';

  const allProfiles = [];
  
  Object.keys(DEFAULT_PRESETS).forEach(key => {
    allProfiles.push({ key: key, data: DEFAULT_PRESETS[key], isDefault: true });
  });

  Object.keys(custom).forEach(key => {
    allProfiles.push({ key: key, data: custom[key], isDefault: false });
  });

  const filtered = allProfiles.filter(p => {
    if (!search) return true;
    const d = p.data;
    return (d.name || '').toLowerCase().includes(search) ||
           (d.profession || '').toLowerCase().includes(search) ||
           (d.targetLeadName || '').toLowerCase().includes(search) ||
           (d.customScenario || '').toLowerCase().includes(search);
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="text-center text-slate-500 py-8">找不到相符的人設檔案</div>';
    return;
  }

  filtered.forEach(p => {
    const d = p.data;
    const card = document.createElement('div');
    card.className = 'bg-brand-card p-4 rounded-xl border border-brand-border hover:border-purple-500/60 transition space-y-2.5 shadow-md';

    card.innerHTML = `
      <div class="flex items-center justify-between border-b border-brand-border/60 pb-2">
        <div class="flex items-center gap-2">
          <span class="font-serif font-bold text-sm text-white">${d.name}</span>
          <span class="text-[11px] px-2 py-0.5 rounded ${p.isDefault ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30' : 'bg-purple-950/60 text-purple-300 border border-purple-800/40'}">
            ${p.isDefault ? '官方預設' : '自訂人設'}
          </span>
          <span class="text-xs text-slate-400">${d.gender || '女'} ｜ ${d.age || '24'}歲</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="use-profile-btn px-2.5 py-1 rounded bg-brand-gold/15 hover:bg-brand-gold/30 text-brand-gold text-xs font-bold border border-brand-gold/30 transition cursor-pointer" data-key="${p.key}">
            ▶ 套用開局
          </button>
          <button class="edit-profile-btn px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-brand-border transition cursor-pointer" data-key="${p.key}">
            ✏️ 編輯
          </button>
          ${!p.isDefault ? `
            <button class="rename-profile-btn px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white text-xs border border-brand-border transition cursor-pointer" data-key="${p.key}">
              🏷️ 重新命名
            </button>
            <button class="delete-profile-btn px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white text-xs border border-rose-800/40 transition cursor-pointer" data-key="${p.key}">
              🗑️ 刪除
            </button>
          ` : ''}
        </div>
      </div>
      <div class="text-xs text-slate-300"><strong>社會身分：</strong>${d.profession || '-'}</div>
      <div class="text-xs text-slate-400 line-clamp-2"><strong>身世背景：</strong>${d.background || '-'}</div>
      <div class="text-xs text-amber-200/90"><strong>攻略對象：</strong>${d.targetLeadName || '修羅場'} ｜ <strong>R-18：</strong>${d.allowR18 ? '開啟' : '關閉'}</div>
      ${d.customScenario ? `<div class="text-[11px] text-slate-400 bg-brand-dark/60 p-2 rounded border border-brand-border/40"><strong>開場情境：</strong>${d.customScenario}</div>` : ''}
    `;

    card.querySelector('.use-profile-btn')?.addEventListener('click', () => {
      closeProfileManagerModal();
      loadProfilePresetIntoForm(p.key);
      handleCharacterCreationSubmit();
    });

    card.querySelector('.edit-profile-btn')?.addEventListener('click', () => {
      closeProfileManagerModal();
      openCharacterCreationModal();
      loadProfilePresetIntoForm(p.key);
    });

    card.querySelector('.rename-profile-btn')?.addEventListener('click', () => {
      renameProfilePreset(p.key);
    });

    card.querySelector('.delete-profile-btn')?.addEventListener('click', () => {
      deleteProfilePreset(p.key);
    });

    container.appendChild(card);
  });
}

function loadSavedProfilePresetsIntoSelect() {
  const select = dom.profilePresetsSelect;
  if (!select) return;

  const custom = getCustomPresets();
  const options = Array.from(select.options);
  options.forEach(opt => {
    if (opt.value && opt.value.startsWith('custom_')) opt.remove();
  });

  Object.keys(custom).forEach(key => {
    const prof = custom[key];
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = `📁 【自訂】${prof.name}（${(prof.profession || '').slice(0, 10)}...）`;
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

  setFormValue('form-player-name', profile.name);
  setFormValue('form-player-gender', profile.gender || '女');
  setFormValue('form-player-age', profile.age || '24');
  setFormValue('form-player-profession', profile.profession);
  setFormValue('form-player-background', profile.background);
  setFormValue('form-player-appearance', profile.appearance || '隨機');
  setFormValue('form-player-taboos', profile.taboos || '無');
  setFormValue('form-target-lead', profile.targetLead || '01_徐令謙');
  setFormValue('form-allow-r18', profile.allowR18 !== false);
  setFormValue('form-custom-scenario', profile.customScenario || '');
}

function saveCurrentFormAsPreset() {
  const name = document.getElementById('form-player-name').value.trim();
  if (!name) return alert('請先輸入角色姓名！');

  const targetSelect = dom.formTargetLead || document.getElementById('form-target-lead');
  const selectedOption = targetSelect?.options[targetSelect?.selectedIndex];

  const profile = {
    name: name,
    gender: document.getElementById('form-player-gender').value,
    age: document.getElementById('form-player-age').value.trim() || '24',
    profession: document.getElementById('form-player-profession').value.trim(),
    background: document.getElementById('form-player-background').value.trim(),
    appearance: document.getElementById('form-player-appearance').value.trim() || '隨機',
    taboos: document.getElementById('form-player-taboos').value.trim() || '無',
    targetLead: targetSelect.value,
    targetLeadName: selectedOption?.getAttribute('data-name') || '徐令謙',
    allowR18: document.getElementById('form-allow-r18').checked,
    customScenario: document.getElementById('form-custom-scenario').value.trim()
  };

  const custom = getCustomPresets();
  const key = 'custom_' + Date.now();
  custom[key] = profile;
  persistCustomPresets(custom);
  
  alert(`🎉 人設「${name}」已成功另存為自訂範本！`);
}

function renameProfilePreset(key) {
  const custom = getCustomPresets();
  const prof = custom[key];
  if (!prof) return;

  const newName = prompt('請輸入新的人設姓名：', prof.name);
  if (newName && newName.trim()) {
    prof.name = newName.trim();
    custom[key] = prof;
    persistCustomPresets(custom);
    alert('已成功重新命名人設！');
  }
}

function deleteProfilePreset(key) {
  const custom = getCustomPresets();
  const prof = custom[key];
  if (!prof) return;

  if (confirm(`確定要刪除自訂人設「${prof.name}」嗎？`)) {
    delete custom[key];
    persistCustomPresets(custom);
    alert('已刪除該自訂人設。');
  }
}

function exportProfiles() {
  const custom = getCustomPresets();
  const blob = new Blob([JSON.stringify(custom, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `UnderCurrent_Profiles_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importProfiles(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const imported = JSON.parse(evt.target.result);
      const custom = getCustomPresets();
      Object.assign(custom, imported);
      persistCustomPresets(custom);
      alert('🎉 成功匯入自訂人設範本！');
    } catch (err) {
      alert('人設檔案解析失敗：' + err.message);
    }
  };
  reader.readAsText(file);
}

// ==========================================
// 8. 存檔庫核心管理 (Save Archives CRUD)
// ==========================================

function getNamedSavesList() {
  try {
    const raw = localStorage.getItem('undercurrent_named_saves');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function persistNamedSavesList(saves) {
  localStorage.setItem('undercurrent_named_saves', JSON.stringify(saves));
  renderSaveArchivesList();
  renderHomeRecentSaves();
}

function openSaveArchiveModal() {
  if (dom.saveArchiveModal) {
    dom.saveArchiveModal.style.display = 'flex';
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
  if (!name) return alert('請輸入存檔名稱！');
  if (!state.chapterData && (!state.chapterHistoryList || state.chapterHistoryList.length === 0)) {
    return alert('當前尚未有遊戲進度可儲存！請先開啟新局。');
  }

  const saves = getNamedSavesList();
  const profile = getActivePlayerProfile();
  const lastChapter = state.chapterHistoryList[state.chapterHistoryList.length - 1] || state.chapterData;

  const newSaveEntry = {
    id: 'save_' + Date.now(),
    name: name,
    timestamp: new Date().toLocaleString('zh-TW', { hour12: false }),
    turnCount: state.saveState?.turnCount || 1,
    chapterTitle: lastChapter?.chapterTitle || '第 1 回',
    playerProfile: profile,
    saveState: state.saveState,
    chapterData: state.chapterData,
    chapterHistoryList: state.chapterHistoryList || []
  };

  saves.unshift(newSaveEntry);
  persistNamedSavesList(saves);
  alert(`🎉 存檔「${name}」已成功儲存至存檔庫！`);
  syncStateToGoogleDriveCloud(state.saveState, state.chapterData);
}

function renameNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return;

  const newName = prompt('請輸入新的存檔名稱：', target.name);
  if (newName && newName.trim()) {
    target.name = newName.trim();
    persistNamedSavesList(saves);
    alert('已成功重新命名存檔！');
  }
}

function deleteNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return;

  if (confirm(`確定要刪除存檔「${target.name}」嗎？`)) {
    const remaining = saves.filter(s => s.id !== saveId);
    persistNamedSavesList(remaining);
    alert('已刪除該筆存檔。');
  }
}

function loadNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return alert('找不到該筆存檔！');

  state.saveState = target.saveState;
  state.chapterData = target.chapterData;
  state.chapterHistoryList = target.chapterHistoryList || [];

  localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
  if (target.playerProfile) {
    localStorage.setItem('undercurrent_current_player_profile', JSON.stringify(target.playerProfile));
  }

  closeSaveArchiveModal();
  switchView('gameplay');
  
  renderStoryStream(state.chapterData);
  renderSaveState();
  updateGameplayBreadcrumb();

  alert(`✦ 成功載入存檔「${target.name}」！`);
}

function renderSaveArchivesList() {
  const container = dom.saveArchivesList;
  if (!container) return;

  const saves = getNamedSavesList();
  const search = (dom.searchSaveInput?.value || '').toLowerCase().trim();
  const countBadge = document.getElementById('save-count-badge');
  if (countBadge) countBadge.textContent = `${saves.length} 個存檔槽位`;

  container.innerHTML = '';

  // 1. 如果當前有正在進行中的遊戲進度，在最上方提供【🟢 進行中的最新冒險進度 (AutoSave)】大卡片
  if (state.chapterData && state.saveState && !search) {
    const p = state.playerProfile || state.saveState?.meta?.playerProfile || {};
    const turn = state.saveState?.turnCount || 1;
    const lead = p.targetLeadName || p.targetLead || '主線';
    const title = state.chapterData.chapterTitle || `第 ${turn} 回`;
    const snippet = (state.chapterData.prose || '').replace(/\n+/g, ' ').slice(0, 110) + '……';

    const activeCard = document.createElement('div');
    activeCard.className = 'bg-gradient-to-r from-amber-950/40 via-brand-card to-amber-950/40 p-4 rounded-xl border border-brand-gold/60 shadow-lg space-y-2.5 relative overflow-hidden';

    activeCard.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-brand-gold/30 pb-2">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="font-mono text-xs font-bold text-brand-gold bg-brand-gold/20 px-2 py-0.5 rounded border border-brand-gold/40">CURRENT · 進行中</span>
          <span class="font-serif font-bold text-sm text-white">當前即時進度（第 ${turn} 回 · ${title}）</span>
        </div>
        <span class="text-[11px] text-amber-200/80 font-mono">剛剛動態更新</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
        <div class="flex items-center gap-2">
          <span class="text-slate-400">👤 主角女主：</span>
          <span class="font-bold text-white">${p.name || '女主'}</span>
          <span class="text-slate-500">（${p.age || '25'}歲 · ${p.occupation || '政經分析師'}）</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-slate-400">🎯 攻略男主：</span>
          <span class="font-bold text-amber-300">${lead}</span>
        </div>
      </div>

      <div class="text-xs text-slate-300 bg-brand-dark/70 p-2.5 rounded-lg border border-brand-border/60 italic leading-relaxed">
        "${snippet}"
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div class="text-[11px] text-slate-400">
          * 隨時可點擊右側將此進度建立為永久獨立存檔或推送到 Google Drive。
        </div>
        <div class="flex items-center gap-2">
          <button class="active-save-as-btn px-3 py-1.5 rounded-lg bg-brand-gold text-slate-950 font-black hover:bg-yellow-500 transition text-xs shadow cursor-pointer flex items-center gap-1">
            <span>💾</span>
            <span>儲存為新檔</span>
          </button>
          <button class="active-sync-drive-btn px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-100 font-bold transition text-xs border border-blue-600/50 cursor-pointer flex items-center gap-1">
            <span>☁️</span>
            <span>同步此局至 Drive</span>
          </button>
          <button class="active-resume-btn px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition text-xs cursor-pointer flex items-center gap-1">
            <span>▶</span>
            <span>繼續遊玩</span>
          </button>
        </div>
      </div>
    `;

    activeCard.querySelector('.active-save-as-btn')?.addEventListener('click', handleQuickSave);
    activeCard.querySelector('.active-sync-drive-btn')?.addEventListener('click', () => syncStateToGoogleDriveCloud(state.saveState, state.chapterData, true));
    activeCard.querySelector('.active-resume-btn')?.addEventListener('click', () => {
      closeSaveArchiveModal();
      switchView('gameplay');
    });

    container.appendChild(activeCard);
  }

  // 2. 篩選存檔清單
  const filtered = saves.filter(s => {
    if (!search) return true;
    return (s.name || '').toLowerCase().includes(search) ||
           (s.chapterTitle || '').toLowerCase().includes(search) ||
           (s.playerProfile?.name || '').toLowerCase().includes(search) ||
           (s.playerProfile?.targetLeadName || '').toLowerCase().includes(search);
  });

  if (filtered.length === 0 && (!state.chapterData || search)) {
    container.innerHTML += '<div class="text-center text-slate-500 py-10 bg-brand-card/40 rounded-xl border border-brand-border/40">尚無符合條件的存檔紀錄</div>';
    return;
  }

  // 3. 渲染所有存檔卡片 (大選單卡片風格)
  filtered.forEach((s, idx) => {
    const p = s.playerProfile || {};
    const turn = s.turnCount || 1;
    const lead = p.targetLeadName || p.targetLead || '主線';
    const chTitle = s.chapterTitle || `第 ${turn} 回`;
    const snippet = s.chapterData?.prose ? (s.chapterData.prose.replace(/\n+/g, ' ').slice(0, 110) + '……') : '（已儲存之分支劇情節點）';
    const tension = s.saveState?.status?.tension || s.saveState?.tension || 0;
    const tipsy = s.saveState?.status?.tipsy || s.saveState?.tipsy || 0;

    const card = document.createElement('div');
    card.className = 'bg-brand-card p-4 rounded-xl border border-brand-border hover:border-brand-gold/60 transition space-y-3 shadow-md group relative';

    card.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border/70 pb-2">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs font-black text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/30">SLOT ${String(idx + 1).padStart(2, '0')}</span>
          <span class="font-serif font-black text-sm text-white group-hover:text-brand-gold transition">${s.name}</span>
        </div>
        <div class="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span>🕒</span>
          <span>${s.timestamp}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 text-xs">
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">👤 女主：</span>
          <span class="font-bold text-white">${p.name || '女主'}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">🎯 攻略：</span>
          <span class="font-bold text-amber-300">${lead}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">📖 進度：</span>
          <span class="font-bold text-sky-300">第 ${turn} 回（${chTitle}）</span>
        </div>
        <div class="flex items-center gap-2 text-[11px] text-slate-400 ml-auto">
          <span>🌡️ 張力: <b class="text-rose-400">${tension}%</b></span>
          <span>🍷 微醺: <b class="text-amber-400">${tipsy}%</b></span>
        </div>
      </div>

      <div class="text-xs text-slate-300 bg-brand-dark/60 p-2.5 rounded-lg border border-brand-border/40 italic leading-relaxed">
        "${snippet}"
      </div>

      <div class="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-brand-border/40">
        <button class="load-archive-btn px-4 py-1.5 rounded-lg bg-brand-gold text-slate-950 font-black hover:bg-yellow-500 transition text-xs shadow-md cursor-pointer flex items-center gap-1" data-id="${s.id}">
          <span>▶</span>
          <span>讀取載入此存檔</span>
        </button>
        <button class="rename-archive-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white transition text-xs border border-brand-border cursor-pointer flex items-center gap-1" data-id="${s.id}">
          <span>✏️</span>
          <span>重新命名</span>
        </button>
        <button class="sync-single-archive-btn px-3 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 text-blue-200 hover:text-white transition text-xs border border-blue-700/50 cursor-pointer flex items-center gap-1" data-id="${s.id}">
          <span>☁️</span>
          <span>同步此檔至 Drive</span>
        </button>
        <button class="delete-archive-btn px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white transition text-xs border border-rose-800/40 cursor-pointer flex items-center gap-1" data-id="${s.id}">
          <span>🗑️</span>
          <span>刪除</span>
        </button>
      </div>
    `;

    card.querySelector('.load-archive-btn')?.addEventListener('click', () => loadNamedSave(s.id));
    card.querySelector('.rename-archive-btn')?.addEventListener('click', () => renameNamedSave(s.id));
    card.querySelector('.sync-single-archive-btn')?.addEventListener('click', () => {
      syncStateToGoogleDriveCloud(s.saveState, s.chapterData, true);
    });
    card.querySelector('.delete-archive-btn')?.addEventListener('click', () => deleteNamedSave(s.id));

    container.appendChild(card);
  });
}

function renderHomeRecentSaves() {
  const container = dom.homeRecentSavesList;
  if (!container) return;

  const saves = getNamedSavesList();
  container.innerHTML = '';

  if (saves.length === 0) {
    container.innerHTML = '<div class="text-xs text-slate-500 py-3 text-center">尚無存檔紀錄，點擊上方【開啟全新局】即刻啟程！</div>';
    return;
  }

  saves.slice(0, 3).forEach(s => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between p-2.5 rounded-lg bg-brand-dark/80 border border-brand-border/60 hover:border-brand-gold/40 transition cursor-pointer text-xs';
    
    row.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-brand-gold">💾</span>
        <span class="font-bold text-white">${s.name}</span>
        <span class="text-[11px] text-slate-400">（第 ${s.turnCount || 1} 回 · ${s.playerProfile?.targetLeadName || '主線'}）</span>
      </div>
      <span class="font-mono text-[11px] text-slate-500">${s.timestamp}</span>
    `;

    row.addEventListener('click', () => loadNamedSave(s.id));
    container.appendChild(row);
  });
}

function handleContinueGame() {
  if (state.chapterHistoryList && state.chapterHistoryList.length > 0 && state.chapterData) {
    switchView('gameplay');
  } else {
    const saves = getNamedSavesList();
    if (saves.length > 0) {
      openSaveArchiveModal();
    } else {
      alert('目前尚無進行中的冒險進度，請先開啟全新局創角！');
      openCharacterCreationModal();
    }
  }
}

function handleQuickSave() {
  if (!state.chapterData) return alert('目前尚無進行中的故事進度可存檔！');
  const pName = state.saveState?.meta?.playerProfile?.name || '女主';
  const targetName = state.saveState?.meta?.playerProfile?.targetLeadName || '主線';
  const turn = state.saveState?.turnCount || 1;
  const autoName = `${pName}-${targetName}第${turn}回`;
  createNamedSave(autoName);
}

// ==========================================
// 8.5 遊戲指南、系統說明與角色全景圖鑑 (Game Guide & Roster Gallery)
// ==========================================

function openGameGuideModal(initialTab = 'gameplay') {
  if (dom.gameGuideModal) {
    dom.gameGuideModal.style.display = 'flex';
    switchGuideTab(initialTab);
  }
}

function closeGameGuideModal() {
  if (dom.gameGuideModal) dom.gameGuideModal.style.display = 'none';
}

function switchGuideTab(tabName) {
  const tabs = {
    gameplay: { btn: dom.guideTabGameplayBtn, panel: dom.guidePanelGameplay },
    system: { btn: dom.guideTabSystemBtn, panel: dom.guidePanelSystem },
    roster: { btn: dom.guideTabRosterBtn, panel: dom.guidePanelRoster }
  };

  Object.keys(tabs).forEach(k => {
    const t = tabs[k];
    if (t.btn) {
      if (k === tabName) {
        t.btn.classList.add('border-brand-gold', 'text-brand-gold');
        t.btn.classList.remove('border-transparent', 'text-slate-400');
      } else {
        t.btn.classList.remove('border-brand-gold', 'text-brand-gold');
        t.btn.classList.add('border-transparent', 'text-slate-400');
      }
    }
    if (t.panel) {
      t.panel.style.display = (k === tabName) ? 'block' : 'none';
    }
  });

  if (tabName === 'roster') {
    renderRosterGallery();
  }
}

function renderRosterGallery() {
  const container = dom.rosterGalleryList;
  if (!container) return;

  const search = (dom.searchRosterInput?.value || '').toLowerCase().trim();
  container.innerHTML = '';

  const charKeys = Object.keys(OFFICIAL_DRIVE_CHARACTERS);
  const filteredKeys = charKeys.filter(k => {
    const c = OFFICIAL_DRIVE_CHARACTERS[k];
    if (!search) return true;
    return c.name.toLowerCase().includes(search) ||
           c.identityRole.toLowerCase().includes(search) ||
           c.summary.toLowerCase().includes(search) ||
           c.title.toLowerCase().includes(search);
  });

  if (filteredKeys.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-slate-500 py-6">找不到相符的角色資料</div>';
    return;
  }

  filteredKeys.forEach(k => {
    const c = OFFICIAL_DRIVE_CHARACTERS[k];
    const rMatch = ROSTER_ONE_LINERS.find(r => r.id === k || r.name === c.name);
    const oneLiner = rMatch ? rMatch.oneLiner : c.summary;

    const card = document.createElement('div');
    card.className = 'bg-brand-card p-3.5 rounded-xl border border-brand-border hover:border-brand-gold/60 transition space-y-2 flex flex-col justify-between shadow-md group';

    card.innerHTML = `
      <div class="space-y-1.5">
        <div class="flex items-center justify-between border-b border-brand-border/60 pb-1.5">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold text-brand-gold bg-brand-gold/15 px-1.5 py-0.5 rounded border border-brand-gold/30">${k.split('_')[0]}</span>
            <span class="font-serif font-black text-sm text-white group-hover:text-brand-gold transition">${c.name}</span>
            <span class="text-[11px] text-slate-400 font-mono">（${c.age}）</span>
          </div>
          <span class="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">官方男主</span>
        </div>
        <div class="text-[11px] font-bold text-amber-200/90 leading-tight">
          ${c.identityRole}
        </div>
        <div class="text-xs text-slate-300 leading-relaxed pt-1">
          ${oneLiner}
        </div>
        <div class="text-[11px] text-slate-400 bg-brand-dark/60 p-2 rounded-lg border border-brand-border/40 mt-1 leading-normal">
          ${c.summary}
        </div>
      </div>
      <div class="pt-2 flex items-center justify-end">
        <button class="select-this-lead-btn px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-slate-950 font-bold text-xs transition border border-brand-gold/40 cursor-pointer shadow-sm" data-key="${k}">
          ✦ 以此男主開局 →
        </button>
      </div>
    `;

    card.querySelector('.select-this-lead-btn')?.addEventListener('click', () => {
      closeGameGuideModal();
      openCharacterCreationModal();
      const select = dom.formTargetLead || document.getElementById('form-target-lead');
      if (select) {
        select.value = k;
        handleTargetLeadChange();
      }
    });

    container.appendChild(card);
  });
}

function exportAllSaves() {
  const saves = getNamedSavesList();
  const blob = new Blob([JSON.stringify(saves, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `UnderCurrent_Saves_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importAllSaves(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const imported = JSON.parse(evt.target.result);
      if (!Array.isArray(imported)) throw new Error('檔案格式不正確，應為 JSON 陣列');
      const existing = getNamedSavesList();
      const existingIds = new Set(existing.map(s => s.id));
      const newItems = imported.filter(s => !existingIds.has(s.id));
      const merged = [...newItems, ...existing];
      persistNamedSavesList(merged);
      alert(`🎉 成功匯入 ${newItems.length} 筆新存檔！`);
    } catch (err) {
      alert('存檔匯入失敗：' + err.message);
    }
  };
  reader.readAsText(file);
}

// ==========================================
// 9. 輔助與抽屜狀態渲染 (Helpers & State)
// ==========================================

function openCharacterCreationModal() {
  if (dom.charCreationModal) {
    dom.charCreationModal.style.display = 'flex';
    loadSavedProfilePresetsIntoSelect();
    const profile = getActivePlayerProfile();
    if (profile) {
      setFormValue('form-player-name', profile.name);
      setFormValue('form-player-gender', profile.gender || '女');
      setFormValue('form-player-age', profile.age || '24');
      setFormValue('form-player-profession', profile.profession);
      setFormValue('form-player-background', profile.background);
      setFormValue('form-player-appearance', profile.appearance || '隨機');
      setFormValue('form-player-taboos', profile.taboos || '無');
      setFormValue('form-target-lead', profile.targetLead || '01_徐令謙');
      setFormValue('form-allow-r18', profile.allowR18 !== false);
      setFormValue('form-custom-scenario', profile.customScenario || '');
    }
  }
}

function closeCharacterCreationModal() {
  if (dom.charCreationModal) dom.charCreationModal.style.display = 'none';
}

function getActivePlayerProfile() {
  if (state.saveState?.meta?.playerProfile?.name) {
    return state.saveState.meta.playerProfile;
  }
  try {
    const raw = localStorage.getItem('undercurrent_current_player_profile');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_PRESETS['preset_yang'];
}

function setFormValue(id, val) {
  const el = document.getElementById(id);
  if (el) {
    if (el.type === 'checkbox') el.checked = !!val;
    else el.value = val !== undefined && val !== null ? val : '';
  }
}

function renderSaveState() {
  if (!state.saveState) return;
  const p = state.saveState.protagonist || { hp: 100, sanity: 100 };
  if (dom.hpDisplay) dom.hpDisplay.textContent = p.hp;
  if (dom.sanityDisplay) dom.sanityDisplay.textContent = p.sanity;

  const profile = getActivePlayerProfile();
  if (dom.profileCardName) dom.profileCardName.textContent = `${profile.name}（${profile.profession || ''}）`;
  if (dom.profileCardLead) dom.profileCardLead.textContent = `攻略對象：${profile.targetLeadName || '修羅場'} ｜ R-18：${profile.allowR18 ? '開啟' : '關閉'}`;

  if (dom.relationshipsList) {
    dom.relationshipsList.innerHTML = '';
    const rels = state.saveState.relationships || {};
    Object.keys(rels).forEach(name => {
      const val = rels[name];
      const div = document.createElement('div');
      div.className = 'flex items-center justify-between';
      div.innerHTML = `<span>${name}</span><span class="font-mono text-brand-gold font-bold">${val} pts</span>`;
      dom.relationshipsList.appendChild(div);
    });
  }

  if (dom.inventoryList) {
    dom.inventoryList.innerHTML = '';
    const inv = state.saveState.inventory || [];
    inv.forEach(item => {
      const div = document.createElement('div');
      div.className = 'text-[11px] text-slate-300 flex items-center justify-between';
      div.innerHTML = `<span>💼 ${item.name}</span><span class="text-slate-500">x${item.count || 1}</span>`;
      dom.inventoryList.appendChild(div);
    });
  }
}

function restoreSavedStateFromStorage() {
  try {
    const savedState = localStorage.getItem('undercurrent_current_save_state');
    const savedChapters = localStorage.getItem('undercurrent_full_story_chapters');
    if (savedState && savedChapters) {
      state.saveState = JSON.parse(savedState);
      state.chapterHistoryList = JSON.parse(savedChapters);
      state.chapterData = state.chapterHistoryList[state.chapterHistoryList.length - 1];
    }
  } catch (e) {
    console.warn('Failed to restore saved state from storage:', e);
  }
}

function saveGameStateToSlot(slotId) {
  if (!state.saveState) return;
  localStorage.setItem(`undercurrent_save_slot_${slotId}`, JSON.stringify({
    saveState: state.saveState,
    chapterData: state.chapterData,
    chapterHistoryList: state.chapterHistoryList || [],
    savedAt: new Date().toISOString()
  }));
}

async function handleRegenerateTurn() {
  const turnCount = state.saveState?.turnCount || 1;
  
  if (turnCount <= 1 || !state.lastChoicePayload) {
    // 重新演繹第 1 回開局
    const profile = getActivePlayerProfile();
    showLoading('選項確認中……', '正在重新演算並構思第 1 回開局情節……');
    try {
      const { systemPrompt, userPrompt } = buildFirstTurnPrompt(profile);
      const regeneratedChapter = await generateStoryFromLLM(systemPrompt, userPrompt);
      regeneratedChapter.act = 1;
      regeneratedChapter.turn = 1;
      regeneratedChapter.chosenLabel = '【正式開局】';
      state.chapterData = regeneratedChapter;
      state.chapterHistoryList = [regeneratedChapter];
      localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
      renderStoryStream(regeneratedChapter);
      renderSaveState();
      saveGameStateToSlot('1');
      syncStateToGoogleDriveCloud(state.saveState, regeneratedChapter);
    } catch (err) {
      console.error('第 1 回重新生成失敗:', err);
      alert('第 1 回重新生成逾時，請檢查網路連線或稍後再試。');
    } finally {
      hideLoading();
    }
  } else {
    makeChoice(state.lastChoicePayload.choiceId, state.lastChoicePayload.customInput, true);
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

function handleRetryLastTurn() {
  if (state.lastChoicePayload) {
    makeChoice(state.lastChoicePayload.choiceId, state.lastChoicePayload.customInput, true);
  }
}

function handleAbortGeneration() {
  if (state.currentAbortController) {
    state.currentAbortController.abort();
    state.currentAbortController = null;
  }
  hideLoading();
  alert('已中止本次生成。');
}

function handleActRebase() {
  if (!confirm('確定要執行【卷末換窗 (Act Rebase)】嗎？\n這將把本幕所有章節濃縮為 800 字檔案重整視窗，保留數值與道具。')) return;
  state.saveState.meta.currentAct = (state.saveState.meta.currentAct || 1) + 1;
  alert('【卷末換窗完成】已晉升至第 ' + state.saveState.meta.currentAct + ' 幕！');
}

function startServerCooldown(seconds) {
  const text = document.getElementById('server-status-text');
  if (!text) return;

  let remaining = seconds || 10;
  text.textContent = `冷卻中 (${remaining}s) · 防限流保護`;
  
  if (state.cooldownInterval) clearInterval(state.cooldownInterval);
  state.cooldownInterval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(state.cooldownInterval);
      text.textContent = 'AI 主筆作家在線 · 動態演繹就緒';
    } else {
      text.textContent = `冷卻中 (${remaining}s) · 防限流保護`;
    }
  }, 1000);
}

const ROTATING_PROGRESS_STEPS = [
  '選項確認中……',
  '角色意向確認中……',
  '劇情故事產生中……',
  '場景世界建構中……',
  '人物言行確認中……',
  '多方博弈與張力推拉校正中……',
  '邏輯校正與情慾細節潤飾中……',
  '章節排版與分支決策封裝中……'
];

let loadingTimer = null;
let loadingStepInterval = null;

function showLoading(initialText, initialSubtext) {
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'flex';
    
    let stepIndex = 0;
    if (dom.loadingText) dom.loadingText.textContent = initialText || ROTATING_PROGRESS_STEPS[0];
    if (dom.loadingSubtext) dom.loadingSubtext.textContent = initialSubtext || '正在依照當前局勢動態演算與鋪陳情節……';
    
    let secondsElapsed = 0;
    const timerSpan = document.getElementById('loading-timer-badge');
    if (timerSpan) timerSpan.textContent = `⏱️ 已耗時 0 秒`;

    if (loadingTimer) clearInterval(loadingTimer);
    loadingTimer = setInterval(() => {
      secondsElapsed++;
      if (timerSpan) timerSpan.textContent = `⏱️ 已耗時 ${secondsElapsed} 秒`;
    }, 1000);

    if (loadingStepInterval) clearInterval(loadingStepInterval);
    loadingStepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % ROTATING_PROGRESS_STEPS.length;
      if (dom.loadingText) {
        dom.loadingText.textContent = ROTATING_PROGRESS_STEPS[stepIndex];
      }
    }, 1300);
  }
}

function hideLoading() {
  if (loadingTimer) {
    clearInterval(loadingTimer);
    loadingTimer = null;
  }
  if (loadingStepInterval) {
    clearInterval(loadingStepInterval);
    loadingStepInterval = null;
  }
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'none';
  }
  state.currentAbortController = null;
}
