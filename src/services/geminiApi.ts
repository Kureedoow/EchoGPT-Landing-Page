// Gemini API Service for EchoGPT Workspace
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
export type ModelName = 'GPT-5' | 'Claude' | 'Gemini' | 'DeepSeek';
const MODEL_PERSONAS: Record<ModelName, string> = {
  'GPT-5': 'You are GPT-5 by OpenAI, the most advanced generalist AI model accessed via EchoGPT unified multi-model workspace. Be precise, solution-oriented, and structured. Use markdown formatting. Provide production-ready code when asked. Be helpful, concise yet thorough.',
  'Claude': 'You are Claude by Anthropic, an AI known for nuanced long-form writing, analytical depth, and human-aligned prose, accessed via EchoGPT. Be thoughtful, precise, and elegant. Use rich markdown. Be thorough but never verbose. Offer structured reasoning and highlight trade-offs.',
  'Gemini': 'You are Gemini by Google, a native multimodal AI known for speed, creativity, and rapid information retrieval, accessed via EchoGPT. Be fast, creative, and direct. Use bullet points liberally. Be snappy and clear. Users rely on your speed.',
  'DeepSeek': 'You are DeepSeek by DeepSeek AI, a high-efficiency reasoning engine specialized in mathematics, algorithms, and deep programmatic logic, accessed via EchoGPT. Be methodical and technically precise. Show reasoning steps. Explain complexity. Format code carefully.',
};
const GEMINI_MODEL_ID = "gemini-3.8-flash";
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}
export interface GeminiApiResult {
  content: string;
  reasoningTime: string;
  error?: string;
}
export function getApiKey(): string {
  return localStorage.getItem('echogpt_gemini_api_key') || '';
}
export function setApiKey(key: string): void {
  localStorage.setItem('echogpt_gemini_api_key', key.trim());
}
export function hasApiKey(): boolean {
  return Boolean(getApiKey());
}
export function buildGeminiHistory(
  messages: Array<{ sender: 'user' | 'assistant'; content: string }>
): GeminiMessage[] {
  return messages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
}
export async function callGeminiApi(
  prompt: string,
  model: ModelName,
  history: GeminiMessage[] = []
): Promise<GeminiApiResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { content: '', reasoningTime: '0s', error: 'NO_API_KEY' };
  }
  const startTime = performance.now();
  const systemInstruction = MODEL_PERSONAS[model];
  const requestBody = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: [
      ...history,
      { role: 'user', parts: [{ text: prompt }] },
    ],
    generationConfig: {
      temperature: model === 'Claude' ? 0.85 : model === 'Gemini' ? 0.7 : 0.6,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };
  try {
    const response = await fetch(
      GEMINI_API_BASE + '/' + GEMINI_MODEL_ID + ':generateContent?key=' + apiKey,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
    );
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const errMessage = errBody?.error?.message || 'HTTP ' + response.status;
      if (response.status === 400 && errMessage.includes('API_KEY')) return { content: '', reasoningTime: elapsed + 's', error: 'INVALID_API_KEY' };
      if (response.status === 429) return { content: '', reasoningTime: elapsed + 's', error: 'RATE_LIMITED' };
      return { content: '', reasoningTime: elapsed + 's', error: 'API_ERROR: ' + errMessage };
    }
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) return { content: '', reasoningTime: elapsed + 's', error: 'EMPTY_RESPONSE' };
    return { content: text, reasoningTime: ((performance.now() - startTime) / 1000).toFixed(2) + 's' };
  } catch (err: unknown) {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('fetch') || message.toLowerCase().includes('failed to fetch')) return { content: '', reasoningTime: elapsed + 's', error: 'NETWORK_ERROR' };
    return { content: '', reasoningTime: elapsed + 's', error: 'UNEXPECTED: ' + message };
  }
}
export function getErrorMessage(error: string): { title: string; detail: string; action?: string } {
  if (error === 'NO_API_KEY') return { title: 'No API Key', detail: 'Enter your Gemini API key in Settings to enable real AI responses.', action: 'open_settings' };
  if (error === 'INVALID_API_KEY') return { title: 'Invalid API Key', detail: 'Your Gemini API key was rejected. Please check it in Settings.', action: 'open_settings' };
  if (error === 'RATE_LIMITED') return { title: 'Rate Limited', detail: 'You have hit the Gemini API rate limit. Wait a moment and try again.' };
  if (error === 'NETWORK_ERROR') return { title: 'Network Error', detail: 'Could not reach the Gemini API. Check your internet connection.' };
  if (error === 'EMPTY_RESPONSE') return { title: 'Empty Response', detail: 'The AI returned an empty response. Try rephrasing your prompt.' };
  return { title: 'API Error', detail: error.replace('API_ERROR: ', '').replace('UNEXPECTED: ', '') };
}
