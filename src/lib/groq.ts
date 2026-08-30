interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Groq AI wrapper using llama-3.3-70b-versatile.
 * Returns null on missing key or any network failure so callers
 * can gracefully fall back.
 */
export async function groqChat(
  messages: ChatMessage[],
  {
    model = "llama-3.3-70b-versatile",
    temperature = 0.3,
    maxTokens = 800,
    jsonMode = false,
  }: GroqOptions = {}
): Promise<string | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  try {
    const payload: Record<string, unknown> = {
      model,
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
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.choices?.[0]?.message?.content as string | undefined) ?? null;
  } catch {
    return null;
  }
}
