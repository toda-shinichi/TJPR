# Project Epilogue (AI 互動長篇小說引擎) — 完整部署與操作手冊

本專案是一個具備**雙模型記憶管線 (Dual-LLM Pipeline)** 與 **Serverless 無伺服器架構**（Google Apps Script + Google Drive + Google Sheets）的行動優先互動小說引擎。

---

## 專案結構一覽

```
/project-epilogue
├── /backend-gas
│   ├── Config.js              # API 伺服器、雙模型、Drive 資料夾與 Sheet ID 配置
│   ├── AIService.js           # OpenAI 相容 API 客戶端（Mistral-Large-3 / Gemini-3.6-Flash）
│   ├── StorageService.js      # Google Drive / Sheets 檔案與存檔讀寫管理
│   ├── MemoryPipeline.js      # 分層設定集注入、5回合摘要壓縮、10回合稽核與 Act Rebase
│   └── Code.js                # 後端 Web App 入口：doPost 路由、權杖驗證與 CORS 處理
├── /frontend-web
│   ├── index.html             # 行動優先響應式小說閱讀器
│   ├── app.js                 # 狀態管理、打字機動效、決策送出與 API 串接
│   ├── style.css              # 精緻深色模式與現代字體樣式表
│   └── mock_data.json         # 本機離線測試假資料
├── /assets-templates
│   ├── character_template.md  # Tier 1 主角 / Tier 2 NPC 角色卡 Markdown 模板
│   ├── global_rules.md        # 全域敘事與 PG-15 創作準則
│   └── save_state_schema.json # save_slot.json 存檔結構定義
└── README.md                  # 本操作指南
```

---

## 🚀 完整後續操作步驟（從 Google 雲端到正式上線）

### 第一步：Google Drive 資料夾檔案上傳

您已建立以下 3 個 Google Drive 資料夾：
1. **規則資料夾 (`RULES_FOLDER_ID: 1I-_R2LOJErsxuTk1ChHyffOPMpRPYiTo`)**：
   - 請將 [`assets-templates/global_rules.md`](file:///Users/huanhsu/Desktop/程式碼專案/TJPR/project-epilogue/assets-templates/global_rules.md) 直接上傳到此資料夾中。
2. **角色設定資料夾 (`CHARACTERS_FOLDER_ID: 1r9HQYfxeApbQLSxrTQuV6RAVTtURzTTH`)**：
   - 請參考 [`assets-templates/character_template.md`](file:///Users/huanhsu/Desktop/程式碼專案/TJPR/project-epilogue/assets-templates/character_template.md) 建立您的角色 Markdown 檔案（例如：`character_protagonist_01.md`），並上傳至此資料夾。
3. **存檔資料夾 (`SAVES_FOLDER_ID: 1RQEErlJE4f6eaTHlpB9OlGP5Vd0EvIKM`)**：
   - 系統在玩家遊玩時會自動在此資料夾下為每位使用者建立專屬子資料夾（如 `User_usr_xxx`），並自動生成 `save_slot.json` 與 `Full_Novel.md`。

---

### 第二步：Google Sheet 索引表 (`Master_Index`) 欄位確認

您的 Google Sheet 網址：`https://docs.google.com/spreadsheets/d/1lP2etciUuoE4JYfJcuDVZt9XcrdYm6409Wb9hH8DN1s`

請確認工作表名稱與第一列（標題欄）包含以下欄位：
1. **工作表 1：`Users`**（若無此工作表，系統首次執行時也會自動建立）
   - 欄 A (1): `User_ID`
   - 欄 B (2): `Email`
   - 欄 C (3): `Password_Hash`
   - 欄 D (4): `Salt`
   - 欄 E (5): `API_Token`
   - 欄 F (6): `Drive_Folder_ID`
   - 欄 G (7): `Created_At`
   - 欄 H (8): `Last_Active`

---

### 第三步：建立與部署 Google Apps Script (GAS)

1. 開啟 [Google Apps Script 官方控制台](https://script.google.com/)，點擊左上角 **「新增專案」**。
2. 將專案命名為 **`Project Epilogue Backend`**。
3. 在左側檔案清單中，建立以下 5 個腳本檔案，並將本專案 `/backend-gas` 中的程式碼內容複製貼上：
   - `Config.gs` 👈 貼入 `backend-gas/Config.js` 內容
   - `AIService.gs` 👈 貼入 `backend-gas/AIService.js` 內容
   - `StorageService.gs` 👈 貼入 `backend-gas/StorageService.js` 內容
   - `MemoryPipeline.gs` 👈 貼入 `backend-gas/MemoryPipeline.js` 內容
   - `Code.gs` 👈 貼入 `backend-gas/Code.js` 內容
4. **設定環境金鑰 (Script Properties)**：
   - 點擊左側齒輪圖示 **「專案設定 (Project Settings)」**。
   - 捲動至最下方的 **「指令碼屬性 (Script Properties)」**，點擊「新增指令碼屬性」：
     - 屬性：`API_KEY`，值：`<請填入新建立的 API 金鑰>`（禁止把真實金鑰寫入程式碼、文件或版本控制）
     - 屬性：`SPREADSHEET_ID`，值：`1lP2etciUuoE4JYfJcuDVZt9XcrdYm6409Wb9hH8DN1s`
     - `JWT_SECRET` 不需手動設定：首次呼叫時會自動產生一把隨機密鑰並存入指令碼屬性。

   > ⚠️ **金鑰同時存在兩條路徑**：前端會先呼叫 Cloudflare Worker
   > (`LLM_CONFIG.WORKER_URL`)，失敗才退回這個 GAS Proxy。
   > 輪換 API 金鑰時**兩邊都要更新**，只改 GAS 等於沒有生效。
   > Worker 端：`npx wrangler secret put API_KEY --name tjpr-llm-proxy`
   > 或 Cloudflare Dashboard → Workers & Pages → 該 Worker → Settings → Variables and Secrets。
5. **部署為網頁應用程式 (Web App)**：
   - 點擊右上角藍色按鈕 **「部署」 -> 「新增部署」**。
   - 齒輪圖示選擇 **「網頁應用程式 (Web App)」**。
   - **說明**：`v1.0.0 Production`
   - **執行身分**：選擇 **「我 (您的 Google 帳號)」**。
   - **誰可以存取**：選擇 **「所有人 (Anyone)」**（此設定才能讓前端跨網域發送請求）。
   - 點擊 **「部署」** 並授權存取 Google 帳號權限。
   - **複製取得的「網頁應用程式網址」**（格式為 `https://script.google.com/macros/s/.../exec`）。

---

### 第四步：啟動前端網頁閱讀器

1. 使用任何瀏覽器開啟 [`frontend-web/index.html`](file:///Users/huanhsu/Desktop/程式碼專案/TJPR/project-epilogue/frontend-web/index.html)（或透過本機伺服器如 Live Server / `python -m http.server` 預覽）。
2. 點擊畫面底部的 **狀態抽屜**。
3. 在最下方的 **「GAS 後端 Web App URL 設定」** 欄位中，貼上剛才第三步複製的 Apps Script 部署網址，並點擊 **「儲存」**。
4. 系統將正式連線至 Google Apps Script 雲端後端，開始調用 `deepseek/deepseek-v4-pro` 展開 1,200~1,500 字的長篇互動分支冒險！

---

## 前端資產維護（快取版號與部署副本）

`index.html` 以 `?v=<hash>` 破壞瀏覽器快取，同時 root 的
`app.js` / `index.html` / `style.css` 必須與 `project-epilogue/frontend-web/`
的部署副本逐位元一致（`debug_checks.js` 會驗證）。

這兩件事已自動化，**不要手動改版號或手動複製檔案**：

```bash
node tools/stamp-assets.js          # 依內容雜湊重算版號並同步部署副本
node tools/stamp-assets.js --check   # 只檢查，不同步則以非零結束（供 CI 使用）
```

版號取自 `app.js` + `style.css` 的內容雜湊，因此內容有變版號必變、
內容沒變版號不動。

一次性啟用 pre-commit 掛鉤（提交前自動戳記並跑 `debug_checks.js`）：

```bash
git config core.hooksPath .githooks
```

## 本機偵錯

```bash
node debug_checks.js
```

驗證項目包含：root 與部署副本一致性、`index.html` id 唯一性、HTML 轉義、
段落切分規則一致性、回退還原、後端認證拒絕偽造 token、記憶管線好感度上限、
卷末換窗重置行為。

---

## Cloudflare Worker（LLM 代理，主要生成路徑）

原始碼：[`worker/index.js`](../worker/index.js)、設定：[`worker/wrangler.toml`](../worker/wrangler.toml)

前端會**先**呼叫這個 Worker（`LLM_CONFIG.WORKER_URL`），失敗才退回 GAS Proxy。
也就是說輪換 API 金鑰時這裡是第一優先，只改 GAS 不會生效。

### 首次部署

```bash
cd worker

# 1. 金鑰（secret，不進版控）
npx wrangler secret put API_KEY

# 2. 速率限制用的 KV namespace，把回傳的 id 填進 wrangler.toml
npx wrangler kv namespace create RATE_LIMIT_KV

# 3. 選用：給測試腳本／伺服器端使用的共享密鑰
npx wrangler secret put CLIENT_SHARED_KEY

# 4. 部署
npx wrangler deploy
```

### 安全設計與其限制

| 機制 | 作用 | 限制 |
| --- | --- | --- |
| Origin 白名單 | 擋掉直接拿 URL 呼叫的濫用 | curl 可偽造 Origin，**不是**真正的認證 |
| 缺 Origin 一律拒絕 | 瀏覽器跨來源 POST 必定送 Origin，缺少代表非網頁來源 | 需 `CLIENT_SHARED_KEY` 才能從伺服器端呼叫 |
| 模型白名單 | 避免有人指定任意昂貴模型 | 需隨 `LLM_CONFIG` 同步更新 |
| `max_tokens` 夾制 4096 | 限制單次成本 | — |
| KV 速率限制（每 IP 每分鐘 12 次） | 讓濫用成本可控 | 未綁 KV 時自動略過 |

> ⚠️ **`ALLOWED_ORIGINS` 必須與前端實際部署網址一致**，否則會全面回 403。
> 目前設定為 `https://toda-shinichi.github.io`（GitHub Pages）＋本機開發用的
> `localhost:8731`。origin 不含路徑 —— project page 的 `/TJPR/` 不算在內。

**尚未實作的真正認證**：讓 Worker 拿前端帶來的 `token` 去 GAS 的 `auth/verify`
驗證，只有登入玩家能用。代價是每回多一次往返，目前以上述組合作為折衷。

### 已知行為

- 回應的 `Content-Type` 沿用上游，不再無條件寫死 `text/event-stream`
  （否則上游回 JSON 錯誤時，前端的 SSE 解析器會拿到看不懂的內容、錯誤原因被吃掉）。
- `stream` 一律強制為 `true`。
- 未設定 `API_KEY` 時直接回 500 並明確說明，而不是把空金鑰送上游、
  換回一句難以追查的「无效的令牌」。

---

## 角色人設的三份來源與實際生效者

| 來源 | 內容量 | 是否生效 |
| --- | --- | --- |
| Google Drive `CHARACTERS_FOLDER_ID`（14 份 `.md`） | 50,896 字元 | ✅ 由 `lore/get-character` 調閱後注入 Tier 1／Tier 2 |
| `characters/` 與 `assets-templates/characters/`（本機複本，內容相同） | 50,896 字元 | 上傳 Drive 的來源，執行期不讀 |
| `app.js` 的 `OFFICIAL_DRIVE_CHARACTERS` | 約 7,000 字元 | ✅ 降級用（Drive 取不到時） |

`OFFICIAL_DRIVE_CHARACTERS` 這個名稱容易誤導 —— 它是硬編常數，與 Drive 無關。
它只保留 13 個扁平欄位，**缺少** Drive 版本的關係網絡、家族背景、幕僚系統、
宿敵設定與部分角色專屬的風格防火牆，而長局最容易漂移的正是這些內容。

### 運作方式

- 開局、續玩、載入存檔時**預熱**主攻對象與指定配角的角色卡（不阻塞第 1 回）。
- 偵測到新的在場配角時順手調閱，下一回即可用上全文。
- 快取在 localStorage，TTL 24 小時；記憶體層避免同回合反覆 parse。
- **在 Drive 上編輯角色卡後**，用選單抽屜的「📜 重新調閱 Drive 角色卡」
  讓修改立即生效，不必等快取到期。抽屜內的狀態行會顯示目前用的是
  Drive 完整人設（附字元數）還是內建精簡版。
- 本機模式（`tok_local_*`）與離線時自動沿用硬編資料，遊戲不會中斷。

### 為什麼可以整份注入

單張角色卡最大 8,512 字元（徐承勳）；注入後整份提示詞約 13,300 字元
≈ 23k tokens，而 mistral-large 有 128k 視窗。因此不需要精打細算，
主攻角色一律注入完整檔案。

### 防漂移校準

每 5 回在提示詞加入一段明確的重新對標指令（`buildLoreRecalibrationNote`）。
滾動摘要池會把早期劇情壓縮成事實條目，語氣與性格細節在壓縮中流失最快；
角色卡雖然每回都在提示詞裡，但明確要求模型重新通讀並校正偏移，
效果比單純放著好得多。

### 未採用「改走後端 `novel/next-turn`」的原因

`MemoryPipeline` 那條路徑的三層注入設計是對的，本次即參考它的架構。
但 GAS 無法串流，改走該路徑會讓逐字流出的閱讀體驗消失，因此改為
**保留 Worker 串流，只把角色卡取回前端快取後注入提示詞**。
後端路徑目前仍未被前端使用。
