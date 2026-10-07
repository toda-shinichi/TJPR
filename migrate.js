// 遊戲已搬到新網址：這個舊網址只負責把本機存檔帶過去。
(function () {
  var NEW_SITE = 'https://tjpr-undercurrent.pages.dev';
  var KEY_PATTERN = /^undercurrent_/;

  function collect() {
    var items = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (KEY_PATTERN.test(k)) items[k] = localStorage.getItem(k);
    }
    return items;
  }

  function hasData() {
    return Object.keys(collect()).some(function (k) { return k !== 'undercurrent_theme' && k !== 'undercurrent_font_size' && k !== 'undercurrent_type_speed'; });
  }

  function render() {
    var box = document.createElement('div');
    box.id = 'tjpr-move-overlay';
    box.setAttribute('style', 'position:fixed;inset:0;z-index:2147483647;background:rgba(30,20,25,.82);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,"PingFang TC","Noto Sans TC",sans-serif;');
    var withData = hasData();
    box.innerHTML =
      '<div style="background:#fdf8f5;color:#3b2a30;max-width:420px;width:100%;border-radius:16px;padding:28px 24px;text-align:center;line-height:1.7;box-shadow:0 20px 60px rgba(0,0,0,.35)">' +
      '<div style="font-size:20px;font-weight:700;margin-bottom:8px">《暗流》搬家了</div>' +
      '<div style="font-size:14px;margin-bottom:18px">新網址：<br><a href="' + NEW_SITE + '" style="color:#8a4b5c;word-break:break-all">' + NEW_SITE.replace('https://', '') + '</a></div>' +
      (withData
        ? '<div style="font-size:14px;margin-bottom:18px">這台裝置上有你在舊網址的存檔。按下面的按鈕，會開啟新網址並把存檔一起帶過去。</div>' +
          '<button id="tjpr-move-btn" style="background:#8a4b5c;color:#fff;border:0;border-radius:10px;padding:12px 20px;font-size:15px;font-weight:600;width:100%;cursor:pointer">搬存檔並前往新網址</button>'
        : '<a href="' + NEW_SITE + '" style="display:block;background:#8a4b5c;color:#fff;border-radius:10px;padding:12px 20px;font-size:15px;font-weight:600;text-decoration:none">前往新網址</a>') +
      '<div id="tjpr-move-msg" style="font-size:13px;margin-top:14px;color:#6b5560"></div>' +
      '<div style="font-size:12px;margin-top:10px;color:#8f7a83">請用同一個瀏覽器操作。帳號與雲端存檔不受影響。</div>' +
      '</div>';
    document.body.appendChild(box);
    var btn = document.getElementById('tjpr-move-btn');
    if (btn) btn.addEventListener('click', start);
  }

  function setMsg(text) { var m = document.getElementById('tjpr-move-msg'); if (m) m.textContent = text; }

  function start() {
    var items = collect();
    var win = window.open(NEW_SITE + '/#migrate-from-old', '_blank');
    if (!win) { setMsg('瀏覽器擋下了新分頁，請允許彈出視窗後再按一次。'); return; }
    setMsg('正在搬移存檔……');
    var done = false;
    window.addEventListener('message', function (event) {
      if (event.origin !== NEW_SITE) return;
      var msg = event.data || {};
      if (msg.type === 'tjpr-migrate-ready') {
        win.postMessage({ type: 'tjpr-migrate-data', items: items }, NEW_SITE);
      } else if (msg.type === 'tjpr-migrate-done') {
        done = true;
        setMsg('存檔已搬好（' + msg.count + ' 項），請到新分頁繼續遊戲。這個分頁可以關掉了。');
      } else if (msg.type === 'tjpr-migrate-failed') {
        done = true;
        setMsg('搬移失敗：' + msg.message + '。請聯絡開發者 todashinchi@gmail.com');
      }
    });
    setTimeout(function () { if (!done) setMsg('還沒收到新網址的回應。若新分頁已打開卻沒有存檔，請回到這裡再按一次。'); }, 20000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
