const WAIT_ANIMATION_TEXTS = [
  '他似乎正在斟酌用詞...',
  '他沒有立刻回答...',
  '他靜靜地看著你...',
  '對方若有所思...',
  '空氣中陷入短暫的沉默...',
  '你們之間陷入了一陣安靜...'
];

let loadingTimer = null;
let loadingStepInterval = null;

function showLoading(initialText, initialSubtext) {
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'flex';
    
    let stepIndex = Math.floor(Math.random() * WAIT_ANIMATION_TEXTS.length);
    
    if (dom.loadingText) {
      dom.loadingText.textContent = WAIT_ANIMATION_TEXTS[stepIndex];
      dom.loadingText.classList.add('animate-pulse', 'text-brand-gold');
      dom.loadingText.style.transition = 'opacity 0.5s ease-in-out';
    }
    if (dom.loadingSubtext) {
      dom.loadingSubtext.textContent = '暗流湧動，命運推演中……';
    }
    
    let secondsElapsed = 0;
    const timerSpan = document.getElementById('loading-timer-badge');
    if (timerSpan) timerSpan.textContent = ''; // 隱藏生硬的計時器

    if (loadingTimer) clearInterval(loadingTimer);
    loadingTimer = setInterval(() => {
      secondsElapsed++;
    }, 1000);

    if (loadingStepInterval) clearInterval(loadingStepInterval);
    loadingStepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % WAIT_ANIMATION_TEXTS.length;
      if (dom.loadingText) {
        dom.loadingText.style.opacity = '0';
        setTimeout(() => {
          dom.loadingText.textContent = WAIT_ANIMATION_TEXTS[stepIndex];
          dom.loadingText.style.opacity = '1';
        }, 500);
      }
    }, 8000);
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
  if (dom.loadingText) {
    dom.loadingText.style.opacity = '1';
    dom.loadingText.classList.remove('animate-pulse', 'text-brand-gold');
  }
}
