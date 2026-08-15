/**
 * Project Epilogue - Frontend Web Client Application
 * 檔案：app.js
 * 
 * 管理讀者端狀態、開局創建角色表單、打字機動效、狀態抽屜與 Google Apps Script API 串接。
 */

// 全域狀態
const state = {
  gasApiUrl: localStorage.getItem('epilogue_gas_url') || 'https://script.google.com/macros/s/AKfycbyY78x300KS_pBXxf9uFt6Av9PoNJJnqBRtH1J1JRGSNj4VfpNXj7TOI8rNgZcM3OPueQ/exec',
  token: localStorage.getItem('epilogue_token') || 'epi_mock_test_token_889922',
  userId: localStorage.getItem('epilogue_user_id') || 'usr_test_01',
  currentTurn: 1,
  currentAct: 1,
  chapterData: null,
  saveState: null,
  isTyping: false,
  isDrawerOpen: false
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

  // 創角表單彈窗
  openCreateCharBtn: document.getElementById('open-create-char-btn'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  charCreationModal: document.getElementById('character-creation-modal'),
  charCreationForm: document.getElementById('char-creation-form'),
  
  // 側邊狀態抽屜
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
  if (dom.apiUrlInput) {
    dom.apiUrlInput.value = state.gasApiUrl;
  }

  // 載入遊戲狀態（連線後端或本地降級）
  await initializeStory();
});

function setupEventListeners() {
  // 創角表單彈窗控制
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

  // 快捷情境建議填入
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

  // 右上角側邊抽屜開關
  if (dom.openDrawerBtn) {
    dom.openDrawerBtn.addEventListener('click', openDrawer);
  }
  if (dom.closeDrawerBtn) {
    dom.closeDrawerBtn.addEventListener('click', closeDrawer);
  }
  if (dom.drawerBackdrop) {
    dom.drawerBackdrop.addEventListener('click', closeDrawer);
  }

  // 自訂行動送出按鈕
  if (dom.submitCustomBtn) {
    dom.submitCustomBtn.addEventListener('click', () => {
      const customText = (dom.customActionInput.value || '').trim();
      if (!customText) return;
      makeChoice(null, customText);
      dom.customActionInput.value = '';
    });
  }

  // 自訂行動按下 Enter 鍵送出
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

  // 『卷末換窗』(Act Rebase) 按鈕
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

function openDrawer() {
  state.isDrawerOpen = true;
  dom.sideDrawer.classList.remove('translate-x-full');
  dom.drawerBackdrop.classList.remove('opacity-0', 'pointer-events-none');
  dom.drawerBackdrop.classList.add('opacity-100');
}

function closeDrawer() {
  state.isDrawerOpen = false;
  dom.sideDrawer.classList.add('translate-x-full');
  dom.drawerBackdrop.classList.remove('opacity-100');
  dom.drawerBackdrop.classList.add('opacity-0', 'pointer-events-none');
}

/**
 * 處理玩家創角表單送出 -> 呼叫 novel/init
 */
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
      } else {
        alert('開局生成失敗：' + (res.error?.message || '未知錯誤'));
      }
    } catch (err) {
      alert('連線後端失敗：' + err.message);
      loadMockDataWithProfile(playerProfile);
    }
  } else {
    loadMockDataWithProfile(playerProfile);
  }

  hideLoading();
}

/**
 * 載入或初始化小說
 */
async function initializeStory() {
  showLoading('正在連接世界線，讀取故事進度...');

  await loadMockData(); // 先載入正宗台灣權謀世界開場

  if (state.gasApiUrl) {
    try {
      const res = await callBackendApi('novel/load-state', {});
      if (res.success && res.data && res.data.saveState) {
        state.saveState = res.data.saveState;
        renderSaveState();
      } else {
        // 無存檔時主動彈出創角表單
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

/**
 * 載入本機測試假資料
 */
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
      userId: 'usr_local',
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
      { id: 'item_press', name: '特許採訪證 / 密錄隨身碟', count: 1, desc: '隨身攜帶的關鍵調查底牌。' }
    ],
    relationships: {
      [profile.targetLeadName]: 15
    },
    questFlags: {
      main_quest: `初會：與 ${profile.targetLeadName} 的交鋒`
    },
    summaryPool: `玩家 ${profile.name} 正式入局，與 ${profile.targetLeadName} 於雨夜展開首次交鋒。`,
    turnHistory: []
  };

  const initialMockChapter = {
    chapterTitle: `第 1 回．初會 ${profile.targetLeadName}`,
    prose: `士林思慕咖啡的二樓VIP室，暴雨正以一種近乎狂暴的節奏敲打著落地窗。\n\n${profile.name}拉平了西裝領口，指尖觸碰到口袋中那枚冰冷的密錄隨身碟。室內瀰漫著淺焙耶加雪菲與雪松木質調香水的氣息。\n\n桌子對面，${profile.targetLeadName}優雅地將水晶威士忌杯擱在深色胡桃木桌上，鏡片後那雙深邃的眸子微微抬起，目光精準如手術刀般落在她身上。\n\n「阮小姐，在台北敢把這份帳冊直接帶到我面前的人，妳是第一個。」男人的聲音低沉磁性，語調中帶著一種上位者特有的從容與審視。`,
    statusPanel: {
      timeLocation: '2026年5月12日 21:30 星期二 於 台北士林思慕咖啡VIP室',
      tension: '張力值 [45%]',
      intoxication: '微醺度 [20%]',
      interaction: '初次會面 ｜ 隔著胡桃木長桌對坐，目光交鋒',
      outfit: `${profile.name}（深黑西裝大衣） ｜ ${profile.targetLeadName}（手工深灰西裝）`,
      inventory: '特許採訪證、密錄隨身碟',
      rumors: '政壇傳言特偵組正秘密調查天裕會金流',
      pageCode: 'P.001'
    },
    choices: [
      { id: 'opt_a', label: '[A] 順應節奏：神情自若地拉開椅子坐下，將隨身碟推向桌心', risk: 'low', hint: '展現職業從容，以籌碼換取信任' },
      { id: 'opt_b', label: '[B] 反向推拉：冷靜反詰「看來二爺很清楚這份帳冊能掀起多大風浪」', risk: 'medium', hint: '言語機鋒試探底線' },
      { id: 'opt_c', label: '[C] 情慾暗示：迎著他的視線傾身靠近，壓低聲音「那二爺打算怎麼處置我？」', risk: 'high', hint: '主動拉近物理距離，挑動危險氛圍' }
    ]
  };

  state.chapterData = initialMockChapter;
  renderChapter(initialMockChapter);
  renderSaveState();
}

/**
 * 渲染章節內文與分支選項（打字機效果）
 */
function renderChapter(chapter) {
  if (!chapter) return;
  dom.chapterBadge.textContent = `第 ${state.saveState?.meta?.currentAct || 1} 幕 · 第 ${state.saveState?.turnCount || 1} 回合`;
  dom.chapterTitle.textContent = chapter.chapterTitle || '未命名章節';

  // 渲染狀態面板
  if (chapter.statusPanel && dom.inlineStatusPanel) {
    dom.inlineStatusPanel.style.display = 'block';
    dom.panelTimeLocation.textContent = chapter.statusPanel.timeLocation || '-';
    dom.panelTension.textContent = chapter.statusPanel.tension || '張力 0%';
    dom.panelIntoxication.textContent = chapter.statusPanel.intoxication || '微醺 0%';
    dom.panelInteraction.textContent = chapter.statusPanel.interaction || '-';
    dom.panelRumors.textContent = chapter.statusPanel.rumors || '-';
  }

  // 執行打字機動畫
  typewriterEffect(chapter.prose, dom.proseContent, () => {
    renderChoices(chapter.choices || []);
  });
}

/**
 * 打字機逐字動態呈現
 */
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

/**
 * 渲染 3 個預設互動決策選項
 */
function renderChoices(choices) {
  dom.choicesContainer.innerHTML = '';
  choices.forEach((choice, index) => {
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

/**
 * 玩家做成分支選擇或送出自訂行動
 */
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
    // 離線展示
    setTimeout(() => {
      state.saveState.turnCount += 1;
      const targetName = state.saveState?.meta?.playerProfile?.targetLeadName || '徐令謙';
      const nextMock = {
        chapterTitle: `第 1 幕 第 ${state.saveState.turnCount} 回：暗湧與博弈`,
        prose: `妳選擇了「${customInput || choiceId}」。\n\n${targetName}的嘴角勾起一抹極淡的弧度，指尖輕扣桌面。室內的空氣彷彿瞬間凝固了幾分，那股若有似無的木質雪松香氣在兩人近距離的呼吸間蔓延開來。\n\n「在士林，很少有人敢用這種語氣跟我說話。」他站起身，修長挺拔的身影投下一片優雅的陰影，目光深沉地注視著妳……`,
        statusPanel: {
          timeLocation: '2026年5月12日 21:45 星期二 於 台北士林思慕咖啡VIP室',
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

/**
 * 執行『卷末換窗』(Act Rebase)
 */
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

/**
 * 渲染狀態抽屜數據 (HP / SAN / 角色卡 / 好感度 / 背包 / 摘要池)
 */
function renderSaveState() {
  if (!state.saveState) return;
  const p = state.saveState.protagonist || { hp: 100, sanity: 100 };
  if (dom.hpDisplay) dom.hpDisplay.textContent = p.hp;
  if (dom.sanityDisplay) dom.sanityDisplay.textContent = p.sanity;

  // 玩家角色卡簡介
  const prof = state.saveState?.meta?.playerProfile;
  if (prof && dom.profileCardName && dom.profileCardLead) {
    dom.profileCardName.textContent = `${prof.name}（${prof.profession || '調查者'}）`;
    dom.profileCardLead.textContent = `攻略對象：${prof.targetLeadName || '徐令謙'} ｜ R-18：${prof.allowR18 ? '開啟' : '關閉'}`;
  }

  // 1. 人物好感度
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

  // 2. 物品背包清單
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

  // 3. 高密度記憶摘要池
  if (dom.summaryPoolContent) {
    dom.summaryPoolContent.textContent = state.saveState.summaryPool || '（尚無記憶摘要，將於第 5 回合自動生成）';
  }
}

/**
 * 發送請求至 Google Apps Script Web App
 */
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
