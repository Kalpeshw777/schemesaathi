interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  apiKey?: string;
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Active candidate models in priority order verified on Groq API
const CANDIDATE_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "groq/compound-mini",
  "qwen/qwen3.8-27b",
  "groq/compound",
  "qwen/qwen3.6-27b",
];

/**
 * Groq AI wrapper with smart multi-model fallback.
 * Returns null on missing key or failure so callers can gracefully fall back.
 */
export async function groqChat(
  messages: ChatMessage[],
  {
    model,
    temperature = 0.3,
    maxTokens = 800,
    jsonMode = false,
    apiKey,
  }: GroqOptions = {}
): Promise<string | null> {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) return null;

  const modelsToTry = model ? [model, ...CANDIDATE_MODELS.filter((m) => m !== model)] : CANDIDATE_MODELS;

  for (const m of modelsToTry) {
    try {
      const payload: Record<string, unknown> = {
        model: m,
        temperature,
        max_tokens: maxTokens,
        messages,
      };
      if (jsonMode) {
        payload.response_format = { type: "json_object" };
      }
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) continue;
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content as string | undefined;
      if (content) return content;
    } catch {
      continue;
    }
  }

  return null;
}
