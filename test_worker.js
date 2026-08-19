const url = "https://tjpr-llm-proxy.todashinchi.workers.dev/";
const payload = {
  model: "mistral-large-3",
  messages: [
    { role: 'system', content: 'You are an AI.' },
    { role: 'user', content: 'Return a JSON {"prose": "hello world"}' }
  ],
  temperature: 0.85,
  max_tokens: 100,
  stream: true
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
}).then(async res => {
  console.log("Status:", res.status);
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    console.log("Chunk:", decoder.decode(value, { stream: true }));
  }
}).catch(console.error);
