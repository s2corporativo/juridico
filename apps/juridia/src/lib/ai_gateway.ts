// ai_gateway.ts — única porta de saída para LLMs externos/locais.
// Regra do Atlas Jurídico: nenhuma camada de negócio escolhe provider nem envia PII diretamente.

import { performance } from "node:perf_hooks";
import {
  getSanitizationMode,
  resolveProviders,
  SanitizationMode,
  type ProviderSpec,
} from "@/lib/ai_governance";
import { pseudonymize, rehydrate, type PseudonymMap } from "@/lib/pseudonymizer";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface AIRequest {
  messages: AIMessage[];
  taskType: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  sanitizationMode?: SanitizationMode;
}

export interface AIResponse {
  text: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  sanitizationMode: SanitizationMode;
}

export class AIProviderUnavailable extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIProviderUnavailable";
  }
}

type PreparedMessages = {
  messages: AIMessage[];
  map: PseudonymMap | null;
};

function prepareMessages(messages: AIMessage[], mode: SanitizationMode): PreparedMessages {
  if (mode === SanitizationMode.LOCAL_COMPLETO) return { messages, map: null };

  const tagged = messages
    .map((m, i) => `<<<ATLASMSG_${i}_${m.role.toUpperCase()}>>>\n${m.content}`)
    .join("\n");
  const p = pseudonymize(tagged);

  const rebuilt: AIMessage[] = messages.map((m, i) => {
    const marker = `<<<ATLASMSG_${i}_${m.role.toUpperCase()}>>>\n`;
    const next = i + 1 < messages.length
      ? `<<<ATLASMSG_${i + 1}_${messages[i + 1].role.toUpperCase()}>>>\n`
      : null;
    const start = p.text.indexOf(marker);
    if (start < 0) return { ...m, content: "" };
    const contentStart = start + marker.length;
    const end = next ? p.text.indexOf(next, contentStart) : p.text.length;
    return { ...m, content: p.text.slice(contentStart, end < 0 ? p.text.length : end).trim() };
  });

  return { messages: rebuilt, map: p.map };
}

function restoreIfNeeded(text: string, mode: SanitizationMode, map: PseudonymMap | null): string {
  if (!map) return text;
  if (mode === SanitizationMode.MASCARAMENTO) return text;
  return rehydrate(text, map);
}

async function callZai(spec: ProviderSpec, request: AIRequest, messages: AIMessage[]): Promise<Omit<AIResponse, "latencyMs" | "sanitizationMode">> {
  const ZAI = (await import("z-ai-web-dev-sdk")).default;
  const zai = await ZAI.create();
  const c = await zai.chat.completions.create({
    messages,
    thinking: { type: "disabled" },
    temperature: request.temperature ?? 0.2,
    max_tokens: request.maxTokens ?? 2000,
    ...(request.model || spec.model ? { model: request.model || spec.model } : {}),
  });
  const usage = (c as unknown as { usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } }).usage;
  return {
    text: c.choices[0]?.message?.content || "",
    provider: spec.name,
    model: request.model || spec.model || String((c as unknown as { model?: string }).model || "zai-default"),
    inputTokens: usage?.prompt_tokens || 0,
    outputTokens: usage?.completion_tokens || 0,
    totalTokens: usage?.total_tokens || 0,
  };
}

async function callOllama(spec: ProviderSpec, request: AIRequest, messages: AIMessage[]): Promise<Omit<AIResponse, "latencyMs" | "sanitizationMode">> {
  const base = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
  const model = request.model || spec.model || process.env.OLLAMA_MODEL || "qwen2.5:14b";
  const resp = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature: request.temperature ?? 0.2,
        num_predict: request.maxTokens ?? 2000,
      },
    }),
    signal: AbortSignal.timeout(180_000),
  });
  if (!resp.ok) throw new Error(`Ollama ${resp.status}: ${await resp.text()}`);
  const data = await resp.json() as {
    message?: { content?: string };
    prompt_eval_count?: number;
    eval_count?: number;
  };
  const input = data.prompt_eval_count || 0;
  const output = data.eval_count || 0;
  return {
    text: data.message?.content || "",
    provider: spec.name,
    model,
    inputTokens: input,
    outputTokens: output,
    totalTokens: input + output,
  };
}

async function callOpenAICompatible(spec: ProviderSpec, request: AIRequest, messages: AIMessage[]): Promise<Omit<AIResponse, "latencyMs" | "sanitizationMode">> {
  const prefix = spec.name.toUpperCase();
  const base = process.env[`${prefix}_BASE_URL`]?.replace(/\/$/, "");
  const apiKey = process.env[`${prefix}_API_KEY`];
  const model = request.model || spec.model || process.env[`${prefix}_MODEL`];
  if (!base || !apiKey || !model) throw new Error(`${spec.name}: BASE_URL, API_KEY e MODEL são obrigatórios`);
  const resp = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages,
      temperature: request.temperature ?? 0.2,
      max_tokens: request.maxTokens ?? 2000,
    }),
    signal: AbortSignal.timeout(180_000),
  });
  if (!resp.ok) throw new Error(`${spec.name} ${resp.status}: ${await resp.text()}`);
  const data = await resp.json() as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };
  return {
    text: data.choices?.[0]?.message?.content || "",
    provider: spec.name,
    model,
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
    totalTokens: data.usage?.total_tokens || 0,
  };
}

async function callProvider(spec: ProviderSpec, request: AIRequest, messages: AIMessage[]) {
  if (spec.name === "zai") return callZai(spec, request, messages);
  if (spec.name === "ollama") return callOllama(spec, request, messages);
  if (spec.name === "groq" || spec.name === "maritaca") return callOpenAICompatible(spec, request, messages);
  throw new Error(`Provider ${spec.name} ainda não possui adapter ativo no gateway`);
}

export async function aiGatewayChat(request: AIRequest): Promise<AIResponse> {
  const mode = request.sanitizationMode ?? getSanitizationMode(request.taskType);
  const candidates = resolveProviders(request.taskType, mode);
  if (candidates.length === 0) {
    throw new AIProviderUnavailable(`Nenhum provider elegível para task=${request.taskType}, mode=${mode}`);
  }

  const prepared = prepareMessages(request.messages, mode);
  let lastError: unknown = null;
  for (const provider of candidates) {
    const started = performance.now();
    try {
      const raw = await callProvider(provider, request, prepared.messages);
      return {
        ...raw,
        text: restoreIfNeeded(raw.text, mode, prepared.map),
        latencyMs: Math.round(performance.now() - started),
        sanitizationMode: mode,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw new AIProviderUnavailable(
    lastError instanceof Error ? lastError.message : "Todos os providers elegíveis falharam",
  );
}

export function extractJson<T>(text: string): T | null {
  const objectMatch = text.match(/\{[\s\S]*\}/);
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  const raw = objectMatch?.[0] || arrayMatch?.[0];
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export async function aiGatewayJson<T>(request: AIRequest): Promise<{ data: T; response: AIResponse }> {
  const response = await aiGatewayChat(request);
  const data = extractJson<T>(response.text);
  if (data == null) throw new Error("Provider não retornou JSON válido");
  return { data, response };
}

export interface WebSearchResult {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
}

export async function governedWebSearch(query: string, taskType = "pesquisa", num = 8): Promise<WebSearchResult[]> {
  const mode = getSanitizationMode(taskType);
  if (mode === SanitizationMode.LOCAL_COMPLETO) {
    throw new AIProviderUnavailable("Pesquisa web externa bloqueada pela política LOCAL_COMPLETO");
  }
  const p = pseudonymize(query);
  const ZAI = (await import("z-ai-web-dev-sdk")).default;
  const zai = await ZAI.create();
  const raw = await zai.functions.invoke("web_search", { query: p.text, num });
  return Array.isArray(raw) ? (raw as WebSearchResult[]).slice(0, num) : [];
}

export function inferSensitiveTask(text: string): "criminal" | "menores" | "brain_classify" {
  const lower = text.toLowerCase();
  if (/estupro|abuso sexual|exploração sexual|criança|adolescente|menor de idade/.test(lower)) return "menores";
  if (/crime|criminal|penal|prisão|homicídio|furto|roubo|tráfico|inquérito policial|denúncia criminal/.test(lower)) return "criminal";
  return "brain_classify";
}
