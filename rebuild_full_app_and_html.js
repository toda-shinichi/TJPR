// ⚠️ 已停用的一次性產生器（2026-08-16 快照）
// 這支腳本會整檔覆寫 index.html 與 app.js。其內建的樣板早於 Worker 串流、escapeHtml、
// extractGameData 解析器等改動，執行它會靜默抹除之後的所有修正。
// 若真的要重新產生，請先確認樣板已同步到目前檔案內容，
// 再以 ALLOW_STALE_CODEGEN=1 執行。
if (process.env.ALLOW_STALE_CODEGEN !== '1') {
  console.error('已中止：此產生器內容為 2026-08-16 舊快照，執行會覆蓋 index.html/app.js 並抹除後續所有修正。');
  console.error('確認要覆寫請執行：ALLOW_STALE_CODEGEN=1 node rebuild_full_app_and_html.js');
  process.exit(1);
}

const fs = require('fs');

// ==========================================
// 1. REBUILD index.html
// ==========================================

const htmlContent = `<!DOCTYPE html>
<html lang="zh-TW" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>《暗流》（UNDER CURRENT）- 沉浸式互動小說 RPG</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              gold: '#d4af37',
              dark: '#0a0a0c',
              card: '#121318',
              surface: '#181920',
              border: '#2a2b36',
              accent: '#8b0000',
              purple: '#4a154b',
              navy: '#0f172a'
            }
          },
          fontFamily: {
            serif: ['Noto Serif TC', 'Songti TC', 'STSong', 'serif'],
            sans: ['Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', 'sans-serif'],
            mono: ['JetBrains Mono', 'Fira Code', 'monospace']
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=Noto+Serif+TC:wght@400;600;700;900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="./style.css?v=20260816_v25">
</head>
<body class="bg-[#0a0a0c] text-slate-100 font-sans min-h-screen flex flex-col antialiased selection:bg-brand-gold selection:text-black">

  <!-- 頂部通用導航列 -->
  <header class="sticky top-0 z-40 bg-brand-surface/90 backdrop-blur-md border-b border-brand-border px-4 py-3 flex items-center justify-between shadow-lg">
    <div class="flex items-center gap-3">
      <button id="nav-home-btn" class="font-serif font-black text-lg sm:text-xl tracking-wider text-brand-gold hover:text-yellow-400 transition flex items-center gap-1.5 cursor-pointer" title="返回首頁主選單">
        <span>✦</span>
        <span>《暗流》</span>
      </button>
      <span class="text-xs text-slate-400 font-mono hidden md:inline border-l border-slate-700 pl-3">UNDER CURRENT · 沉浸式互動長篇</span>
    </div>

    <!-- 導航功能按鈕組 -->
    <div class="flex items-center gap-2">
      <!-- 🏠 首頁快捷鍵 -->
      <button id="header-home-btn" class="px-2.5 py-1.5 rounded-lg bg-brand-card hover:bg-brand-border border border-brand-border text-xs text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer" title="返回主選單">
        <span>🏠</span>
        <span class="hidden sm:inline">首頁</span>
      </button>

      <!-- 💾 存檔庫按鈕 -->
      <button id="nav-saves-btn" class="px-2.5 py-1.5 rounded-lg bg-brand-card hover:bg-brand-border border border-brand-border text-xs text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer" title="開啟存檔庫與讀取存檔">
        <span>💾</span>
        <span class="hidden sm:inline">存檔庫</span>
      </button>

      <!-- 登入身分指示器 -->
      <div id="user-badge" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-card border border-brand-border text-xs text-slate-300">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span id="username-display" class="font-mono text-brand-gold text-xs font-bold truncate max-w-[120px]">已登入</span>
        <button id="logout-btn" class="ml-1 text-[11px] text-slate-400 hover:text-rose-400 transition cursor-pointer" title="登出當前帳號">登出</button>
      </div>

      <!-- 側邊抽屜開關 -->
      <button id="open-drawer-btn" class="p-2 rounded-lg bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold transition cursor-pointer" title="打開角色狀態與設定">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>
  </header>

  <!-- 主內容容器 -->
  <main class="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col justify-start">
    
    <!-- 🏠 1. 首頁視圖 (Home View) -->
    <div id="home-view" class="space-y-6" style="display:block;">
      
      <!-- 英雄標題區 -->
      <div class="text-center py-6 px-4 rounded-2xl bg-gradient-to-b from-brand-card/90 via-brand-surface/70 to-transparent border border-brand-border shadow-2xl space-y-3">
        <div class="inline-block font-mono text-[11px] text-brand-gold tracking-widest uppercase bg-brand-gold/10 border border-brand-gold/20 px-3 py-0.5 rounded-full">
          UNDER CURRENT · 全台灣多方博弈極致情慾 RPG
        </div>
        <h1 class="font-serif font-black text-3xl sm:text-5xl text-brand-gold tracking-wide drop-shadow-md">
          《暗 流》
        </h1>
        
        <!-- 宏大世界觀與超高自由度介紹 -->
        <p class="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          全台政商暗夜修羅場 · 14 位專屬男主 × 超高自由度原創女主。<br class="hidden sm:inline">
          從士林德行事務所、信義金融核心、陽明山隱密山莊、淡水港灣至黑市暗道，<br class="hidden sm:inline">
          黑道二把手、地檢白日判官、冷血特警與政商巨擘，在多方博弈、權謀殺伐與極限性張力的深淵中由妳親自開局決策！
        </p>

        <!-- 當前登入者資訊列與帳號管理 -->
        <div class="pt-3 flex flex-wrap items-center justify-center gap-2.5 text-xs">
          <div class="bg-brand-card/90 px-3 py-1.5 rounded-lg border border-brand-border flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="text-slate-400">登入玩家：</span>
            <span id="home-username-display" class="font-mono text-brand-gold font-bold">載入中...</span>
          </div>
          <button id="home-logout-btn" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-brand-border transition flex items-center gap-1 cursor-pointer">
            <span>🚪</span>
            <span>登出帳號</span>
          </button>
          <button id="home-delete-account-btn" class="px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/60 transition flex items-center gap-1 cursor-pointer" title="永久註銷並刪除此帳號及所有存檔">
            <span>🗑️</span>
            <span>註銷帳號</span>
          </button>
          <button id="home-clear-all-data-btn" class="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition flex items-center gap-1 cursor-pointer" title="清空本機存檔重置">
            <span>💥</span>
            <span>清空本機存檔</span>
          </button>
        </div>
      </div>

      <!-- 首頁 4 大功能卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- 卡片 1: 開啟全新局 -->
        <div id="home-new-game-btn" class="group p-5 rounded-2xl bg-brand-card/90 hover:bg-brand-surface border border-brand-border hover:border-brand-gold/60 transition cursor-pointer shadow-xl relative overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">⚔️</span>
            <span class="font-mono text-[10px] font-bold text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/30">NEW GAME</span>
          </div>
          <h2 class="font-serif font-bold text-base text-white group-hover:text-brand-gold transition mb-1">
            開啟全新局 · 重新創角
          </h2>
          <p class="text-xs text-slate-400 leading-relaxed">
            重設進度並自由設定玩家身分、年齡背景、選擇 14 位專屬男主或修羅場模式，從第 1 回開始全新冒險。
          </p>
        </div>

        <!-- 卡片 2: 繼續當前冒險 -->
        <div id="home-continue-game-btn" class="group p-5 rounded-2xl bg-brand-card/90 hover:bg-brand-surface border border-brand-border hover:border-sky-500/60 transition cursor-pointer shadow-xl relative overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">📖</span>
            <span class="font-mono text-[10px] font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-700/50">RESUME</span>
          </div>
          <h2 class="font-serif font-bold text-base text-white group-hover:text-sky-300 transition mb-1">
            繼續當前冒險
          </h2>
          <p id="home-continue-desc" class="text-xs text-slate-400 leading-relaxed">
            回到正在進行中的章節進度，繼續做出關鍵決策。
          </p>
        </div>

        <!-- 卡片 3: 存檔庫與自訂命名存檔 -->
        <div id="home-open-saves-btn" class="group p-5 rounded-2xl bg-brand-card/90 hover:bg-brand-surface border border-brand-border hover:border-emerald-500/60 transition cursor-pointer shadow-xl relative overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">💾</span>
            <span class="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">ARCHIVES</span>
          </div>
          <h2 class="font-serif font-bold text-base text-white group-hover:text-emerald-300 transition mb-1">
            存檔庫與自訂命名存檔
          </h2>
          <p class="text-xs text-slate-400 leading-relaxed">
            無限儲存多個自訂命名的精彩回合，隨時查找並讀取不同女主與男主的劇情路線。
          </p>
        </div>

        <!-- 卡片 4: 人物與劇情設定檔 -->
        <div id="home-open-presets-btn" class="group p-5 rounded-2xl bg-brand-card/90 hover:bg-brand-surface border border-brand-border hover:border-purple-400/60 transition cursor-pointer shadow-xl relative overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">📝</span>
            <span class="font-mono text-[10px] font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-700/50">PRESETS</span>
          </div>
          <h2 class="font-serif font-bold text-base text-white group-hover:text-purple-200 transition mb-1">
            人物與劇情設定檔
          </h2>
          <p class="text-xs text-slate-400 leading-relaxed">
            管理、編輯並匯出多套女主背景範本與自訂開場情境（楊慕璃 / 阮思薇 / 自訂私設角色）。
          </p>
        </div>

      </div>

      <!-- 快速讀取最近存檔區 -->
      <div class="p-4 rounded-2xl bg-brand-card/60 border border-brand-border space-y-3">
        <div class="flex items-center justify-between border-b border-brand-border/60 pb-2">
          <h3 class="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡</span>
            <span>最近存檔快速讀取</span>
          </h3>
          <button id="home-view-all-saves-btn" class="text-xs text-sky-400 hover:underline cursor-pointer">
            查看全部存檔 →
          </button>
        </div>
        <div id="home-recent-saves-list" class="space-y-2">
          <!-- 動態渲染最近 3 筆存檔 -->
          <div class="text-xs text-slate-500 py-3 text-center">尚無存檔紀錄，點擊上方【開啟全新局】即刻啟程！</div>
        </div>
      </div>

    </div>

    <!-- 📖 2. 遊戲進行視圖 (Gameplay View) -->
    <div id="gameplay-view" class="space-y-6" style="display:none;">
      
      <!-- 📱 App 風格頂部返回與狀態條 -->
      <div class="sticky top-16 z-30 flex items-center justify-between p-2.5 rounded-xl bg-brand-surface/95 backdrop-blur-md border border-brand-border shadow-md">
        <button id="back-to-home-btn" class="px-3 py-1.5 rounded-lg bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>返回首頁</span>
        </button>

        <div id="gameplay-breadcrumb" class="text-xs font-serif text-slate-300 font-bold truncate max-w-[200px] sm:max-w-none text-center">
          第 1 幕 · 進行中
        </div>

        <div class="flex items-center gap-1.5">
          <button id="gameplay-quick-save-btn" class="px-2.5 py-1.5 rounded-lg bg-brand-card hover:bg-brand-border border border-brand-border text-xs text-slate-200 hover:text-white transition flex items-center gap-1 cursor-pointer" title="快速存檔">
            <span>💾</span>
            <span class="hidden sm:inline">存檔</span>
          </button>
          <button id="gameplay-drawer-btn" class="px-2.5 py-1.5 rounded-lg bg-brand-card hover:bg-brand-border border border-brand-border text-xs text-slate-200 hover:text-white transition flex items-center gap-1 cursor-pointer" title="角色狀態">
            <span>📊</span>
            <span class="hidden sm:inline">狀態</span>
          </button>
        </div>
      </div>

      <!-- 排隊與服務器狀態條 -->
      <div id="server-status-badge" class="flex items-center justify-between px-3 py-1.5 rounded-lg bg-brand-surface/80 border border-brand-border text-xs text-slate-400">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span id="server-status-text">AI 主筆作家在線 · 動態演繹就緒</span>
        </div>
        <div class="text-[11px] font-mono text-slate-500">RPM: 5/min</div>
      </div>

      <!-- 異常中斷救援橫幅 -->
      <div id="error-recovery-banner" class="p-3 rounded-xl bg-rose-950/80 border border-rose-700/60 text-rose-200 text-xs flex items-center justify-between shadow-lg" style="display:none;">
        <div class="flex items-center gap-2">
          <span class="text-base">⚠️</span>
          <span id="error-message-text">生成請求超時或中斷。</span>
        </div>
        <div class="flex items-center gap-2">
          <button id="retry-turn-btn" class="px-3 py-1 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold transition cursor-pointer">
            重試此回
          </button>
          <button id="dismiss-error-btn" class="text-rose-400 hover:text-white p-1 cursor-pointer">✕</button>
        </div>
      </div>

      <!-- 📜 連貫長篇小說瀑布流容器 (Continuous Novel Stream) -->
      <div id="novel-stream-container" class="space-y-6">
        <!-- 章節卡片由 JS 動態追加 (包含歷史回數，可直接向上滾動閱讀全文) -->
      </div>

      <!-- 抉擇與行動區塊 (Decisions Section) -->
      <section id="decisions-section" class="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-brand-border/60 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-brand-gold text-sm font-bold">✦ 妳的下一步抉擇</span>
            <span class="text-xs text-slate-400">（決定局勢走向與男主好感）</span>
          </div>
          <div class="text-xs text-slate-400 font-mono">CHOICES</div>
        </div>

        <!-- 3 個動態選項卡片容器 -->
        <div id="choices-container" class="space-y-3">
          <!-- 由 JS 依據回合動態渲染 [A], [B], [C] -->
        </div>

        <!-- 玩家自訂自由行動輸入列 -->
        <div class="pt-3 border-t border-brand-border/60 space-y-2">
          <div class="text-xs text-slate-300 font-bold flex items-center gap-1.5">
            <span>⚡ 自由行動／說話／肢體互動：</span>
          </div>
          <div class="flex gap-2">
            <input type="text" id="custom-action-input" placeholder="例如：傾身靠近他耳畔低語、抽出手提包裡的密錄筆、轉身走向大門……" class="flex-1 bg-brand-dark border border-brand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-brand-gold focus:outline-none">
            <button id="submit-custom-btn" class="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-yellow-500 text-slate-950 font-bold text-xs sm:text-sm transition shrink-0 shadow-lg shadow-brand-gold/10 cursor-pointer">
              執行行動
            </button>
          </div>
        </div>
      </section>

    </div>

  </main>

  <!-- 🔐 玩家帳號登入 / 註冊強制攔截門禁 (Strict Auth Gatekeeper Modal) -->
  <div id="auth-modal" class="fixed inset-0 bg-[#07080b]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 transition-opacity">
    <div class="bg-brand-surface border border-brand-gold/50 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-black space-y-6">
      
      <div class="text-center space-y-1">
        <div class="inline-block font-mono text-[11px] text-brand-gold tracking-widest uppercase bg-brand-gold/10 border border-brand-gold/20 px-2.5 py-0.5 rounded">
          MANDATORY AUTHENTICATION
        </div>
        <h2 class="font-serif font-black text-2xl text-brand-gold tracking-wide">《暗流》身分驗證大門</h2>
        <p class="text-xs text-slate-400">本作品採用專屬身分儲存機制，請登入或註冊以進入遊戲首頁。</p>
      </div>

      <div class="flex rounded-lg bg-brand-dark p-1 border border-brand-border text-xs font-bold">
        <button type="button" id="tab-login-btn" class="flex-1 py-2.5 rounded-md bg-brand-gold text-slate-950 transition cursor-pointer">
          ✦ 登入既有帳號
        </button>
        <button type="button" id="tab-register-btn" class="flex-1 py-2.5 rounded-md text-slate-400 hover:text-white transition cursor-pointer">
          ✦ 註冊全新玩家
        </button>
      </div>

      <form id="login-form" class="space-y-4 text-xs sm:text-sm">
        <div>
          <label class="block font-bold text-slate-300 mb-1">玩家帳號 / Email</label>
          <input type="text" id="login-username" required placeholder="請輸入您的帳號或 Email" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2.5 text-white focus:border-brand-gold focus:outline-none">
        </div>
        <div>
          <label class="block font-bold text-slate-300 mb-1">密碼</label>
          <input type="password" id="login-password" required placeholder="請輸入密碼" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2.5 text-white focus:border-brand-gold focus:outline-none">
        </div>
        <button type="submit" id="submit-login-btn" class="w-full bg-brand-gold hover:bg-yellow-500 text-slate-950 font-black py-3 rounded-xl transition text-sm shadow-xl shadow-brand-gold/15 cursor-pointer">
          ✦ 登入並進入遊戲首頁
        </button>
      </form>

      <form id="register-form" class="space-y-4 text-xs sm:text-sm" style="display:none;">
        <div>
          <label class="block font-bold text-slate-300 mb-1">設定玩家帳號 / Email *</label>
          <input type="text" id="reg-username" required placeholder="請設定您的帳號或 Email" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2.5 text-white focus:border-brand-gold focus:outline-none">
        </div>
        <div>
          <label class="block font-bold text-slate-300 mb-1">設定密碼（至少 6 碼） *</label>
          <input type="password" id="reg-password" minlength="6" required placeholder="請設定 6 碼以上安全密碼" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2.5 text-white focus:border-brand-gold focus:outline-none">
        </div>
        <button type="submit" id="submit-register-btn" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl transition text-sm shadow-xl shadow-emerald-900/20 cursor-pointer">
          ✦ 立即註冊並進入遊戲
        </button>
      </form>
    </div>
  </div>

  <!-- 🌟 開局創建玩家角色與人物設定表單彈窗 (Character Creation Modal) -->
  <div id="character-creation-modal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-[80] flex items-center justify-center p-4 overflow-y-auto transition-opacity" style="display:none;">
    <div class="bg-brand-surface border border-brand-gold/40 rounded-2xl max-w-xl w-full p-6 my-8 shadow-2xl shadow-black space-y-4">
      
      <div class="flex justify-between items-center pb-3 border-b border-brand-border">
        <div>
          <h2 class="font-serif font-bold text-lg text-brand-gold flex items-center gap-2">
            <span>🎭</span>
            <span>角色自訂與開局情境設定</span>
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">自訂玩家身分、攻略男主（支援修羅場多角模式）與自訂開場劇本。</p>
        </div>
        <button id="close-modal-btn" class="text-slate-400 hover:text-white p-1 cursor-pointer">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- 範本快速切換與管理工具列 -->
      <div class="bg-brand-card p-3 rounded-xl border border-brand-border space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold text-brand-gold uppercase tracking-wider">📁 快速載入設定範本：</label>
          <div class="flex gap-1.5">
            <button type="button" id="save-current-profile-btn" class="text-[11px] bg-brand-gold/15 hover:bg-brand-gold/30 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30 transition cursor-pointer">
              另存為自訂範本
            </button>
            <button type="button" id="delete-profile-preset-btn" class="text-[11px] bg-rose-950/60 hover:bg-rose-900 text-rose-300 px-2 py-0.5 rounded border border-rose-800/40 transition cursor-pointer">
              刪除範本
            </button>
          </div>
        </div>
        
        <select id="profile-presets-select" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:border-brand-gold focus:outline-none">
          <option value="preset_yang">👑 【預設】楊慕璃（弘楊集團公關總監 · 瑾和基金會執行長 · 修羅場模式）</option>
          <option value="preset_ruan">📁 【預設】阮思薇（司法政經調查記者 · 獨立主筆）</option>
          <option value="preset_custom">✏️ 【空白自訂】全新原創女主私設</option>
        </select>

        <div class="flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <span>支援跨裝置設定檔備份：</span>
          <div class="flex gap-2">
            <button type="button" id="export-profile-json-btn" class="text-sky-400 hover:underline cursor-pointer">📤 匯出 JSON</button>
            <label class="text-sky-400 hover:underline cursor-pointer">
              📥 匯入 JSON
              <input type="file" id="import-profile-json-input" accept=".json" class="hidden">
            </label>
          </div>
        </div>
      </div>

      <!-- 角色詳細屬性表單 -->
      <form id="char-creation-form" class="space-y-3.5 text-xs sm:text-sm">
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block font-bold text-slate-300 mb-1">主角姓名 *</label>
            <input type="text" id="form-player-name" required value="楊慕璃" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-white focus:border-brand-gold focus:outline-none">
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">性別</label>
            <select id="form-player-gender" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-white focus:border-brand-gold focus:outline-none">
              <option value="女" selected>女</option>
              <option value="男">男</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">年齡</label>
            <input type="text" id="form-player-age" value="24" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-white focus:border-brand-gold focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">職業 / 社會身分 *</label>
          <input type="text" id="form-player-profession" required value="弘楊集團公關總監 · 瑾和文教基金會執行長" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-white focus:border-brand-gold focus:outline-none">
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">身世背景與動機</label>
          <textarea id="form-player-background" rows="2" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-white text-xs focus:border-brand-gold focus:outline-none">台大法律/北大犯罪所畢業。身為楊家三房獨生女，在權謀風暴中憑藉智慧與魅力遊走於各方勢力之間。</textarea>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">外貌、穿著特徵與體香</label>
          <input type="text" id="form-player-appearance" value="及肩黑髮帶自然捲，美麗杏眼，白皙皮膚，精緻體態與若有似無的清甜體香，常著淡雅長裙或素雅洋裝" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-white focus:border-brand-gold focus:outline-none">
        </div>

        <!-- 攻略對象選擇（14 位男主 + 修羅場多角模式） -->
        <div>
          <label class="block font-bold text-brand-gold mb-1">✦ 攻略對象 / 互動模式 *</label>
          <select id="form-target-lead" class="w-full bg-brand-dark border border-brand-gold/60 rounded-lg px-3 py-2 text-white font-bold focus:border-brand-gold focus:outline-none">
            <option value="修羅場" data-name="修羅場" selected>⚡ 【全勢力修羅場】徐令謙 × 韓正寰 × 楊紹宸（多雄爭奪·極限拉扯）</option>
            <option value="01_徐令謙" data-name="徐令謙">01. 徐令謙（天裕會二把手 · 幕後制策者 · 儒雅深沉）</option>
            <option value="02_韓正寰" data-name="韓正寰">02. 韓正寰（士林地檢署檢察官 · 白日判官 · 冷峻自律）</option>
            <option value="03_楊紹宸" data-name="楊紹宸">03. 楊紹宸（弘楊集團少東 · 桀驁掌權者 · 侵略霸道）</option>
            <option value="04_顧霆淵" data-name="顧霆淵">04. 顧霆淵（警政署刑事局重案組長 · 孤狼特警）</option>
            <option value="05_陸子驍" data-name="陸子驍">05. 陸子驍（跨國投資銀行合夥人 · 頂級金融掠奪者）</option>
            <option value="06_沈淮安" data-name="沈淮安">06. 沈淮安（名門世家私生子 · 溫潤腹黑名醫）</option>
            <option value="07_江馭寒" data-name="江馭寒">07. 江馭寒（頂級私人安全顧問 · 冷血貼身保鏢）</option>
            <option value="08_齊銘" data-name="齊銘">08. 齊銘（黑市軍火與情報販子 · 狂放不羈梟雄）</option>
            <option value="09_謝雲深" data-name="謝雲深">09. 謝雲深（法務部特等通譯 · 神秘雙面間諜）</option>
            <option value="10_裴修遠" data-name="裴修遠">10. 裴修遠（立法院政黨黨鞭 · 權謀核心操盤手）</option>
            <option value="11_紀尋" data-name="紀尋">11. 紀尋（地下地下賽車場與酒吧主理人 · 狼系痞帥）</option>
            <option value="12_霍沉舟" data-name="霍沉舟">12. 霍沉舟（遠洋航運巨頭 · 陰鷙深沉寡頭）</option>
            <option value="13_白楚瑜" data-name="白楚瑜">13. 白楚瑜（當代天才鋼琴家 · 偏執病嬌藝術家）</option>
            <option value="14_楚天行" data-name="楚天行">14. 楚天行（特種作戰退役指揮官 · 鐵血硬漢）</option>
          </select>
        </div>

        <!-- R-18 與雷區設定 -->
        <div class="flex items-center justify-between p-3 rounded-lg bg-brand-card border border-brand-border">
          <div>
            <div class="font-bold text-white text-xs">成人情慾與肢體描寫模式 (R-18)</div>
            <div class="text-[11px] text-slate-400">啟用後將包含細緻露骨的性張力、體溫與情慾博弈描寫</div>
          </div>
          <input type="checkbox" id="form-allow-r18" checked class="w-4 h-4 accent-brand-gold cursor-pointer">
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">玩家個人雷區 / 禁忌標籤</label>
          <input type="text" id="form-player-taboos" value="禁止暴力侮辱，無特定雷區" class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-white text-xs focus:border-brand-gold focus:outline-none">
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">自訂開場劇本 / 特殊開局情境（可選）</label>
          <textarea id="form-custom-scenario" rows="2" placeholder="留空則使用預設經典暴雨德行事務所初會..." class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-white text-xs focus:border-brand-gold focus:outline-none">深夜德行法律事務所頂層制策室，暴雨傾盆，我代表弘楊集團前來與徐令謙商討併購暗帳，豈料士林地檢署檢察官韓正寰反手封門步步逼近……</textarea>
        </div>

        <button type="submit" id="submit-char-btn" class="w-full py-3 rounded-xl bg-brand-gold hover:bg-yellow-500 text-slate-950 font-black text-sm transition shadow-xl shadow-brand-gold/20 cursor-pointer">
          ✦ 正式入局 · 展開第 1 回長篇小說
        </button>

      </form>

    </div>
  </div>

  <!-- 💾 自訂命名無限存檔庫管理彈窗 (Save Archives Modal) -->
  <div id="save-archive-modal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-[85] flex items-center justify-center p-4 transition-opacity" style="display:none;">
    <div class="bg-brand-surface border border-brand-gold/40 rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl p-5 sm:p-6 space-y-4">
      
      <div class="flex justify-between items-center pb-3 border-b border-brand-border">
        <div>
          <h3 class="font-serif font-bold text-lg text-brand-gold flex items-center gap-2">
            <span>💾 存檔庫管理中心 (Save Archives)</span>
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">支援自訂命名、隨時存檔、回頭讀取、備份與跨設備匯出匯入。</p>
        </div>
        <button id="close-save-archive-btn" class="text-slate-400 hover:text-white p-1 cursor-pointer">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- ➕ 儲存當前進度為自訂存檔 -->
      <div class="bg-brand-card p-3.5 rounded-xl border border-brand-gold/30 space-y-2.5">
        <div class="text-xs font-bold text-slate-200">➕ 儲存當前遊戲進度為新存檔：</div>
        <div class="flex gap-2">
          <input type="text" id="new-save-name-input" placeholder="輸入存檔名稱（例：楊慕璃-修羅場暴雨第3回、謙哥深情暗道線...）" class="flex-1 bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-gold focus:outline-none">
          <button id="create-named-save-btn" class="px-4 py-2 rounded-lg bg-brand-gold text-slate-950 font-bold hover:bg-yellow-500 transition text-xs shrink-0 shadow-md cursor-pointer">
            💾 儲存存檔
          </button>
        </div>
      </div>

      <!-- 存檔搜尋與備份工具列 -->
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex-1 min-w-[180px]">
          <input type="text" id="search-save-input" placeholder="🔍 搜尋存檔名稱、角色名、攻略對象..." class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-brand-gold focus:outline-none">
        </div>
        <div class="flex items-center gap-1.5">
          <button id="export-all-saves-btn" class="px-2.5 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-brand-border transition text-[11px] cursor-pointer" title="匯出全部存檔至 JSON 檔案">
            📤 匯出存檔
          </button>
          <label class="px-2.5 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-brand-border transition text-[11px] cursor-pointer" title="從 JSON 檔案匯入存檔">
            📥 匯入存檔
            <input type="file" id="import-all-saves-input" accept=".json" class="hidden">
          </label>
        </div>
      </div>

      <!-- 存檔清單容器 -->
      <div id="save-archives-list" class="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
        <!-- 動態渲染存檔清單卡片 -->
      </div>

    </div>
  </div>

  <!-- 右側滑出式狀態抽屜 (Drawer) -->
  <div id="drawer-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity opacity-0 pointer-events-none"></div>
  <aside id="side-drawer" class="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-brand-surface border-l border-brand-border z-50 p-6 overflow-y-auto transform translate-x-full transition-transform duration-300 ease-in-out shadow-2xl space-y-6">
    <div class="flex justify-between items-center pb-4 border-b border-brand-border">
      <h2 class="font-serif font-bold text-lg text-white flex items-center gap-2">
        <svg class="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        角色狀態與系統管理
      </h2>
      <button id="close-drawer-btn" class="text-slate-400 hover:text-white p-1 cursor-pointer">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- 快捷導航：返回首頁 / 開啟存檔庫 -->
    <div class="grid grid-cols-2 gap-2">
      <button id="drawer-home-btn" class="w-full py-2 px-3 rounded-lg bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer">
        <span>🏠 返回首頁</span>
      </button>
      <button id="drawer-saves-btn" class="w-full py-2 px-3 rounded-lg bg-brand-card hover:bg-brand-border border border-brand-border text-slate-200 text-xs flex items-center justify-center gap-1.5 transition cursor-pointer">
        <span>💾 存檔庫管理</span>
      </button>
    </div>

    <!-- 角色卡摘要 -->
    <div class="bg-brand-card p-4 rounded-xl border border-brand-border space-y-2">
      <h3 class="text-xs font-bold uppercase tracking-wider text-brand-gold">當前角色檔案</h3>
      <div id="profile-card-name" class="font-serif font-bold text-sm text-white">楊慕璃（弘楊集團公關總監）</div>
      <div id="profile-card-lead" class="text-xs text-slate-300">攻略對象：修羅場 ｜ R-18：開啟</div>
      <div class="grid grid-cols-2 gap-2 pt-2 border-t border-brand-border/60 text-xs">
        <div>生命值 (HP): <span id="hp-display" class="font-mono text-emerald-400 font-bold">100</span></div>
        <div>理智值 (SAN): <span id="sanity-display" class="font-mono text-sky-400 font-bold">100</span></div>
      </div>
    </div>

    <!-- 男主好感度矩陣 -->
    <div class="bg-brand-card p-4 rounded-xl border border-brand-border space-y-2">
      <h3 class="text-xs font-bold uppercase tracking-wider text-brand-gold">男主關係與好感度</h3>
      <div id="relationships-list" class="space-y-1.5 text-xs text-slate-300">
        <!-- JS 動態生成好感條 -->
      </div>
    </div>

    <!-- 隨身行囊 -->
    <div class="bg-brand-card p-4 rounded-xl border border-brand-border space-y-2">
      <h3 class="text-xs font-bold uppercase tracking-wider text-brand-gold">隨身背包與關鍵底牌</h3>
      <div id="inventory-list" class="space-y-1 text-xs text-slate-300">
        <!-- JS 動態渲染道具 -->
      </div>
    </div>

    <!-- 卷末換窗 (Act Rebase) -->
    <div class="bg-brand-card p-4 rounded-xl border border-brand-border space-y-2">
      <h3 class="text-xs font-bold uppercase tracking-wider text-brand-gold">幕篇重整 (Act Rebase)</h3>
      <p class="text-[11px] text-slate-400">當前幕篇進行過長時，可將對話濃縮為 800 字檔案重整視窗，保留數值與道具。</p>
      <button id="rebase-act-btn" class="w-full bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold font-bold py-2 rounded-lg text-xs transition cursor-pointer">
        執行卷末換窗 (Act Rebase)
      </button>
    </div>

  </aside>

  <!-- 載入中動畫遮罩 -->
  <div id="loading-overlay" class="fixed inset-0 bg-[#0c0d12]/85 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4 transition-opacity" style="display:none;">
    <div class="w-12 h-12 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mb-4"></div>
    <div id="loading-text" class="font-serif text-brand-gold text-sm tracking-wide text-center mb-2">筆觸流轉中，主筆作家正在撰寫情節……</div>
    <div id="loading-subtext" class="text-xs text-slate-400 mb-6 text-center max-w-sm">正在依照《系統核心指令》與《情慾文學指引》構建多方博弈……</div>
    <button id="abort-generation-btn" class="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/50 text-rose-200 hover:text-white transition text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer">
      <span>🛑</span>
      <span>中止本次生成</span>
    </button>
  </div>

  <script src="./app.js?v=20260816_v25"></script>
</body>
</html>
`;

fs.writeFileSync('/Users/huanhsu/Desktop/程式碼專案/TJPR/index.html', htmlContent, 'utf8');
console.log('index.html fully rebuilt with character creation modal, app navbar, and universe intro!');
