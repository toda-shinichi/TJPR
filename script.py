with open("/Users/huanhsu/Desktop/程式碼專案/TJPR/app.js", "r") as f:
    lines = f.readlines()
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "async function generateStoryFromLLM(systemPrompt, userPrompt) {" in line:
        start_idx = i
    if start_idx != -1 and "throw new Error('所有 AI 創作模型生成逾時或回傳格式異常，請檢查網路連線。');" in line:
        end_idx = i + 1
        break
if start_idx != -1 and end_idx != -1:
    replacement = """async function generateStoryFromLLM(systemPrompt, userPrompt) {
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
        console.warn(`[Pure AI] Model ${model} HTTP ${response.status}: ${errText.slice(0, 100)}`);
        continue;
      }
      const data = await response.json();
      if (!data.success || !data.data || !data.data.content) {
        console.warn(`[Pure AI] Model ${model} returned empty or failed content via proxy.`);
        continue;
      }
      const rawContent = data.data.content;
      const parsed = parseJsonSafely(rawContent);
      if (parsed && parsed.prose) {
        console.log(`[Pure AI] Successfully generated with model: ${model} via proxy (${parsed.prose.length} chars)`);
        return parsed;
      }
    } catch (err) {
      console.warn(`[Pure AI] Model ${model} attempt error:`, err.message);
    }
  }
  throw new Error('所有 AI 創作模型生成逾時或回傳格式異常，請檢查網路連線。');
}
"""
    lines[start_idx:end_idx+1] = [replacement]
    with open("/Users/huanhsu/Desktop/程式碼專案/TJPR/app.js", "w") as f:
        f.writelines(lines)
    print("Replaced successfully")
else:
    print("Could not find bounds")
