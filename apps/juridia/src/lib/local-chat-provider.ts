/**
 * An Ollama-only, fail-closed adapter to the existing minimal chat SDK surface.
 * No user-supplied host, no proxy, no automatic cloud fallback.
 */
export interface ChatInput {
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}
export interface ChatResult {
  choices: { message: { content: string } }[];
  usage: { total_tokens: number };
}
const ENDPOINT = "http://127.0.0.1:11434";
const DEFAULT_MODEL = "qwen3:4b-instruct";

export function localModelName(env: { JURIDIA_LOCAL_AI_MODEL?: string } = process.env as unknown as { JURIDIA_LOCAL_AI_MODEL?: string }): string {
  const model = env.JURIDIA_LOCAL_AI_MODEL || DEFAULT_MODEL;
  if (!/^[a-zA-Z0-9_.:/-]{1,90}$/.test(model) || model.includes("..") ||
      /(?:embed|nomic)/i.test(model)) throw new Error("INVALID_LOCAL_GENERATION_MODEL");
  // Qwen2.5-3B has research-only licensing in the published weights.
  if (/^qwen2\.5:3b(?:-|$)/i.test(model)) throw new Error("MODEL_LICENSE_NOT_APPROVED");
  return model;
}

export function assertLocalAiEnabled(env: NodeJS.ProcessEnv = process.env) {
  if (env.JURIDIA_AI_ENABLED === "false" || env.JURIDIA_LOCAL_AI_ENABLED !== "true") {
    throw new Error("LOCAL_GENERATION_DISABLED");
  }
  localModelName({ JURIDIA_LOCAL_AI_MODEL: env.JURIDIA_LOCAL_AI_MODEL });
}

export function createLocalChatAdapter(fetchImpl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> = fetch) {
  assertLocalAiEnabled();
  const model = localModelName();
  const encoder = new TextEncoder();
  const ceilingRaw = Number(process.env.JURIDIA_LOCAL_AI_MAX_TOKENS || "1800");
  const ceiling = Number.isSafeInteger(ceilingRaw) && ceilingRaw >= 64 && ceilingRaw <= 1800
    ? ceilingRaw : 1800;
  const tokenLimit = (requested?: number) =>
    Math.min(Math.max(requested ?? 600, 64), ceiling);
  const prepare = (input: ChatInput) => {
    if (!Array.isArray(input.messages) || input.messages.length < 1 ||
        input.messages.length > 12 ||
        input.messages.reduce((sum, m) => sum + (typeof m.content === "string" ? m.content.length : 0), 0) > 85_000 ||
        input.messages.some(m => !["system", "user", "assistant"].includes(m.role) ||
                                  typeof m.content !== "string" || m.content.length > 70_000)) {
      throw new Error("INVALID_LOCAL_MESSAGES");
    }
    return {
      model, messages: input.messages, stream: Boolean(input.stream), think: false,
      options: {
        temperature: Math.max(0, Math.min(input.temperature ?? 0.2, 0.7)),
        num_predict: tokenLimit(input.max_tokens),
        num_ctx: 8192,
      },
      keep_alive: "2m",
    };
  };
  const request = async (input: ChatInput) => {
    const response = await fetchImpl(ENDPOINT + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prepare(input)),
      signal: AbortSignal.timeout(155_000),
    });
    if (!response.ok) throw new Error("LOCAL_MODEL_UNAVAILABLE");
    return response;
  };
  const create = async (input: ChatInput): Promise<ChatResult | ReadableStream<Uint8Array>> => {
    const response = await request(input);
    if (!input.stream) {
      const data = await response.json() as {
        message?: { content?: string }; prompt_eval_count?: number; eval_count?: number;
      };
      return {
        choices: [{ message: { content: data.message?.content || "" } }],
        usage: { total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0) },
      };
    }
    if (!response.body) throw new Error("LOCAL_STREAM_UNAVAILABLE");
    const upstream = response.body.getReader();
    return new ReadableStream<Uint8Array>({
      async start(controller) {
        const decoder = new TextDecoder();
        let buffer = "";
        let sawDone = false;
        try {
          while (true) {
            const chunk = await upstream.read();
            if (chunk.done) break;
            buffer += decoder.decode(chunk.value, { stream: true });
            let newline: number;
            while ((newline = buffer.indexOf("\n")) >= 0) {
              const line = buffer.slice(0, newline);
              buffer = buffer.slice(newline + 1);
              if (!line.trim()) continue;
              const data = JSON.parse(line) as {
                message?: { content?: string }; done?: boolean;
                prompt_eval_count?: number; eval_count?: number;
              };
              if (data.message?.content) {
                controller.enqueue(encoder.encode("data: " + JSON.stringify({
                  choices: [{ delta: { content: data.message.content } }],
                }) + "\n\n"));
              }
              if (data.done) sawDone = true;
              if (data.done) controller.enqueue(encoder.encode("data: " + JSON.stringify({
                usage: { total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0) },
              }) + "\n\n"));
            }
          }
          if (!sawDone) throw new Error("LOCAL_STREAM_TRUNCATED");
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          // Abort instead of delivering a truncated generation as successful.
          controller.error(new Error("LOCAL_STREAM_INTERRUPTED"));
        } finally {
          upstream.releaseLock();
        }
      },
    });
  };
  return {
    chat: { completions: { create } },
    functions: { invoke: async () => { throw new Error("LOCAL_WEB_SEARCH_DISABLED"); } },
  };
}
