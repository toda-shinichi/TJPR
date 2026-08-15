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
     - 屬性：`API_KEY`，值：`sk-TcKczU9MQ5abSWYrF51eU85aQjZV6IzPqeypYYn9zVDoSram`
     - 屬性：`SPREADSHEET_ID`，值：`1lP2etciUuoE4JYfJcuDVZt9XcrdYm6409Wb9hH8DN1s`
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
4. 系統將正式連線至 Google Apps Script 雲端後端，開始調用 `mistral-large-3` 展開 1,200~1,500 字的長篇互動分支冒險！
