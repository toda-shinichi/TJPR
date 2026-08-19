 */
async function generateStoryFromLLM(systemPrompt, userPrompt) {
  const models = [
    'mistral-large-3',
    'gemini-3.6-flash',
    'cognitivecomputations/dolphin-mistral-24b-venice-edition',
    'aion-3.0',
    'gpt-5.6-luna'
  ];

  await waitForRpmCooldown();

  for (let mIdx = 0; mIdx < models.length; mIdx++) {
    const model = models[mIdx];
    try {
      const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      state.currentAbortController = controller;
      const timeoutId = setTimeout(() => {
        if (controller) controller.abort();
      }, 25000); // 25 秒極速換線保護

      const fetchOptions = {
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
        })
      };
      if (controller) {
        fetchOptions.signal = controller.signal;
      }

      const response = await fetch(LLM_CONFIG.API_URL, fetchOptions);
      clearTimeout(timeoutId);
      lastRequestTimestamp = Date.now();

      if (response.status === 429) {
        console.warn(`[Pure AI] Rate Limit. Waiting 12s cooldown...`);
        let cd = 12;
        while (cd > 0) {
          if (dom.loadingText) dom.loadingText.textContent = `筆觸冷卻中（剩餘 ${cd} 秒）……`;
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
