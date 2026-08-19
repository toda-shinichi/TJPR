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
      }, 50000); // 延長至 50 秒以配合 GAS 代理

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'llm/proxy',
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: LLM_CONFIG.TEMPERATURE,
          max_tokens: 2500,
          token: state.token,
          userId: state.userId
        }),
        redirect: 'follow'
      };
      
      if (controller) {
        fetchOptions.signal = controller.signal;
      }

      const response = await fetch(state.gasApiUrl, fetchOptions);
      clearTimeout(timeoutId);
      lastRequestTimestamp = Date.now();

      if (!response.ok) {
        const errText = await response.text();
        console.warn();
        continue;
      }

      const data = await response.json();
      
      if (!data.success || !data.data || !data.data.content) {
        console.warn();
        continue;
      }

      const rawContent = data.data.content;
      const parsed = parseJsonSafely(rawContent);
      if (parsed && parsed.prose) {
        console.log();
        return parsed;
      }
    } catch (err) {
      console.warn(, err.message);
    }
  }
  throw new Error('All models failed to generate content via GAS proxy.');
}