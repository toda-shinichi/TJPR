#!/usr/bin/env node
/**
 * 資產版號戳記與部署副本同步。
 *
 * 解決兩個一直靠人工、且一定會忘記的步驟：
 *   1. index.html 的 ?v=... 快取破壞字串必須隨 app.js / style.css 內容改變，
 *      否則瀏覽器會繼續吃舊檔（實測發生過：style.css 改了但版號沒動，
 *      新的 CSS 規則整條沒載入）。
 *   2. root 的 app.js / index.html / style.css 必須與
 *      project-epilogue/frontend-web/ 的部署副本保持一致（debug_checks.js 會驗證）。
 *
 * 版號取自 app.js + style.css 內容的 SHA-256 前 10 碼，因此
 * 「內容有變 → 版號必變、內容沒變 → 版號不變」。
 *
 * 用法：
 *   node tools/stamp-assets.js          套用變更
 *   node tools/stamp-assets.js --check   只檢查，有落差則以非零結束（供 CI 用）
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const DEPLOY_DIR = path.join(ROOT, 'project-epilogue', 'frontend-web');
const HTML = path.join(ROOT, 'index.html');
const ASSETS = ['app.js', 'style.css'];
const SYNCED = ['app.js', 'index.html', 'style.css'];

const checkOnly = process.argv.includes('--check');

function computeVersion() {
  const hash = crypto.createHash('sha256');
  for (const name of ASSETS) {
    hash.update(name);
    hash.update(fs.readFileSync(path.join(ROOT, name)));
  }
  return hash.digest('hex').slice(0, 10);
}

function stampHtml(version) {
  const original = fs.readFileSync(HTML, 'utf8');
  // 只改 app.js / style.css 的查詢字串，不動其他 URL
  const stamped = original.replace(
    /(["'](?:\.\/)?(?:app\.js|style\.css))\?v=[^"']*(["'])/g,
    `$1?v=${version}$2`
  );
  const refs = (original.match(/(?:app\.js|style\.css)\?v=/g) || []).length;
  if (refs === 0) {
    throw new Error('index.html 找不到帶 ?v= 的 app.js / style.css 引用，請確認引用格式。');
  }
  const changed = stamped !== original;
  if (changed && !checkOnly) fs.writeFileSync(HTML, stamped);
  return { changed, refs };
}

function syncDeployCopies() {
  const changed = [];
  for (const name of SYNCED) {
    const src = path.join(ROOT, name);
    const dest = path.join(DEPLOY_DIR, name);
    const srcBuf = fs.readFileSync(src);
    const destBuf = fs.existsSync(dest) ? fs.readFileSync(dest) : null;
    if (!destBuf || !srcBuf.equals(destBuf)) {
      changed.push(name);
      if (!checkOnly) fs.writeFileSync(dest, srcBuf);
    }
  }
  return changed;
}

try {
  const version = computeVersion();
  const { changed: htmlChanged, refs } = stampHtml(version);
  const syncChanged = syncDeployCopies();

  if (checkOnly) {
    if (htmlChanged || syncChanged.length) {
      console.error('資產戳記不同步。請執行：node tools/stamp-assets.js');
      if (htmlChanged) console.error(`  - index.html 版號應為 ?v=${version}`);
      if (syncChanged.length) console.error(`  - 部署副本落後：${syncChanged.join(', ')}`);
      process.exit(1);
    }
    console.log(`資產戳記已同步（?v=${version}）。`);
    process.exit(0);
  }

  const notes = [];
  if (htmlChanged) notes.push(`index.html 版號更新為 ?v=${version}（${refs} 處引用）`);
  if (syncChanged.length) notes.push(`同步部署副本：${syncChanged.join(', ')}`);
  console.log(notes.length ? notes.join('\n') : `無變更（?v=${version}）。`);
} catch (err) {
  console.error('stamp-assets 失敗：' + err.message);
  process.exit(1);
}
