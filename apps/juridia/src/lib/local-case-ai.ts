/**
 * Local-only completion for confidential legal case context.
 * Fixed loopback endpoint: no arbitrary URLs, credentials or outbound requests.
 * Answers are unverified draft suggestions, NEVER legal authorities.
 */
type ModelMessage = { role: "system" | "user" | "assistant"; content: string };
export type LocalCaseCompletion = {
  choices: Array<{ message: { content: string } }>;
  usage: { total_tokens: number };
};

export async function completeLocalCase(
  messages: ModelMessage[],
  opts: { temperature?: number; max_tokens?: number } = {},
): Promise<LocalCaseCompletion> {
  if (!Array.isArray(messages) || messages.length < 2 ||
      messages.some(m => !["system", "user", "assistant"].includes(m.role) ||
        typeof m.content !== "string")) {
    throw new Error("LOCAL_CASE_AI_MESSAGES_INVALID");
  }

  const model = process.env.JURIDIA_LOCAL_CASE_MODEL?.trim() || "qwen3:4b-instruct";
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,90}$/.test(model)) {
    throw new Error("LOCAL_CASE_AI_MODEL_INVALID");
  }

  const timeout = AbortSignal.timeout(90_000);
  const response = await fetch("http://127.0.0.1:11434/api/chat", {
    method: "POST",
    signal: timeout,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature: Math.max(0, Math.min(1, opts.temperature ?? 0.3)),
        num_predict: Math.max(128, Math.min(4096, opts.max_tokens ?? 1500)),
      },
    }),
  });
  if (!response.ok) throw new Error("LOCAL_CASE_AI_UNAVAILABLE");
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") throw new Error("LOCAL_CASE_AI_RESPONSE_INVALID");
  const data = payload as {
    message?: { content?: unknown };
    prompt_eval_count?: number;
    eval_count?: number;
  };
  if (typeof data.message?.content !== "string" || data.message.content.length > 150_000) {
    throw new Error("LOCAL_CASE_AI_RESPONSE_INVALID");
  }
  return {
    choices: [{ message: { content: data.message.content } }],
    usage: { total_tokens: Math.max(0, (data.prompt_eval_count || 0) + (data.eval_count || 0)) },
  };
}

/** Compatibility with the existing completion-call shape, but strictly local. */
export async function createLocalCaseClient() {
  return {
    chat: {
      completions: {
        create: (input: {
          messages: ModelMessage[];
          thinking?: { type: "disabled" | "enabled" };
          temperature?: number;
          max_tokens?: number;
        }) => completeLocalCase(input.messages, input),
      },
    },
  };
}
