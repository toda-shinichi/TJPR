const ROTATING_PROGRESS_STEPS = [
  '選項確認中……',
  '角色意向確認中……',
  '劇情故事產生中……',
  '場景世界建構中……',
  '人物言行確認中……',
  '內容產出中……',
  '邏輯校正中……',
  '請稍候……'
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
    if (timerSpan) timerSpan.textContent = `已耗時 0 秒`;

    if (loadingTimer) clearInterval(loadingTimer);
    loadingTimer = setInterval(() => {
      secondsElapsed++;
      if (timerSpan) timerSpan.textContent = `已耗時 ${secondsElapsed} 秒`;
    }, 1000);

    if (loadingStepInterval) clearInterval(loadingStepInterval);
    loadingStepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % ROTATING_PROGRESS_STEPS.length;
      if (dom.loadingText) {
        dom.loadingText.textContent = ROTATING_PROGRESS_STEPS[stepIndex];
      }
    }, 4000);
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
