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

