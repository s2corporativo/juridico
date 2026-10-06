// REST API bridge — Atlas Forense -> JuridIA (Cérebro Jurídico / EJC).
// Typed helpers that call JuridIA's cognitive REST endpoints with an X-API-Token.
//
// Configuration (env vars):
//   JURIDIA_API_URL     — base URL of JuridIA (default: http://localhost:3000)
//   JURIDIA_API_TOKEN   — shared bearer/API token accepted by JuridIA's auth middleware
//   JURIDIA_BRIDGE_PERSONA — default persona when calling the Cérebro (default: "advogado")
//
// Confidentiality: only public metadata and case-agnostic prompts cross this bridge.
// Any payload that might contain private case data MUST be redacted upstream.

export const JURIDIA_API_URL =
  process.env.JURIDIA_API_URL || "http://localhost:3000";

function getApiToken(): string | undefined {
  return process.env.JURIDIA_API_TOKEN;
}

function getDefaultPersona(): string {
  return process.env.JURIDIA_BRIDGE_PERSONA || "advogado";
}

interface BridgeOptions {
  token?: string;
  persona?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
}

function withTimeout(signal: AbortSignal | undefined, ms: number): AbortSignal {
  if (signal) return signal;
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

async function doPost<TBody, TResp>(
  path: string,
  body: TBody,
  opts: BridgeOptions = {},
): Promise<TResp> {
  const url = `${JURIDIA_API_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Token": opts.token || getApiToken() || "",
    "X-Source-App": "atlas-forense",
  };
  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: withTimeout(opts.signal, opts.timeoutMs ?? 60_000),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new BridgeError(
      `JuridIA bridge POST ${path} failed: ${resp.status} ${text}`,
      resp.status,
    );
  }
  return (await resp.json()) as TResp;
}

async function doGet<TResp>(
  path: string,
  opts: BridgeOptions = {},
): Promise<TResp> {
  const url = `${JURIDIA_API_URL}${path}`;
  const headers: Record<string, string> = {
    "X-API-Token": opts.token || getApiToken() || "",
    "X-Source-App": "atlas-forense",
  };
  const resp = await fetch(url, {
    method: "GET",
    headers,
    signal: withTimeout(opts.signal, opts.timeoutMs ?? 30_000),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new BridgeError(
      `JuridIA bridge GET ${path} failed: ${resp.status} ${text}`,
      resp.status,
    );
  }
  return (await resp.json()) as TResp;
}

export class BridgeError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "BridgeError";
    this.status = status;
  }
}

// ── callCerebro: invokes JuridIA's /api/brain (legal reasoning) ────────────
export interface CerebroFacts {
  descricao?: string;
  partes?: string[];
  marcos?: { date: string; event: string }[];
  documentos?: { name: string; text: string }[];
  area?: string;
  [k: string]: unknown;
}

export interface CerebroResult {
  ramoJuridico?: string;
  ramoConfianca?: number;
  parties?: { role: string; name?: string; type: string; state: string }[];
  timeline?: { date: string; event: string; state: string }[];
  summary?: string;
  [k: string]: unknown;
}

export async function callCerebro(
  facts: CerebroFacts,
  persona?: string,
  opts: BridgeOptions = {},
): Promise<CerebroResult> {
  return doPost<CerebroFacts & { persona: string }, CerebroResult>(
    "/api/brain",
    { ...facts, persona: persona || opts.persona || getDefaultPersona() },
    opts,
  );
}

// ── generateMinuta: invokes JuridIA's /api/generate-minuta ────────────────
export interface GenerateMinutaInput {
  template: string;
  facts: Record<string, unknown>;
  skills?: string[];
  persona?: string;
}

export interface GenerateMinutaResult {
  minuta?: string;
  citations?: unknown[];
  warnings?: string[];
  [k: string]: unknown;
}

export async function generateMinuta(
  template: string,
  facts: Record<string, unknown>,
  skills: string[] = [],
  opts: BridgeOptions = {},
): Promise<GenerateMinutaResult> {
  return doPost<GenerateMinutaInput, GenerateMinutaResult>(
    "/api/generate-minuta",
    {
      template,
      facts,
      skills,
      persona: opts.persona || getDefaultPersona(),
    },
    opts,
  );
}

// ── getBiblioteca: aggregates JuridIA skills + legal sources ───────────────
export interface BibliotecaSkill {
  id?: string;
  name?: string;
  command?: string;
  description?: string;
  [k: string]: unknown;
}

export interface BibliotecaSource {
  id?: string;
  label?: string;
  kind?: string;
  url?: string;
  [k: string]: unknown;
}

export interface Biblioteca {
  skills: BibliotecaSkill[];
  legalSources: BibliotecaSource[];
}

export async function getBiblioteca(
  opts: BridgeOptions = {},
): Promise<Biblioteca> {
  const [skills, legalSources] = await Promise.allSettled([
    doGet<BibliotecaSkill[]>("/api/skills", opts),
    doGet<{ sources?: BibliotecaSource[] } | BibliotecaSource[]>(
      "/api/legal-sources",
      opts,
    ),
  ]);
  const skillsVal = skills.status === "fulfilled" ? skills.value : [];
  let legalSourcesVal: BibliotecaSource[] = [];
  if (legalSources.status === "fulfilled") {
    const v = legalSources.value;
    legalSourcesVal = Array.isArray(v) ? v : v.sources ?? [];
  }
  return { skills: skillsVal, legalSources: legalSourcesVal };
}

// ── checkSalvaguardas: invokes JuridIA's salvaguardas (safeguards) check ──
export interface SalvaguardasInput {
  text: string;
  context?: Record<string, unknown>;
}

export interface SalvaguardasResult {
  ok: boolean;
  findings?: { kind: string; detail: string; severity?: string }[];
  blockedItems?: string[];
  [k: string]: unknown;
}

export async function checkSalvaguardas(
  text: string,
  opts: BridgeOptions = {},
): Promise<SalvaguardasResult> {
  return doPost<SalvaguardasInput, SalvaguardasResult>(
    "/api/salvaguardas",
    { text },
    opts,
  );
}

// ── verifyJwt: delegates JWT validation to JuridIA's /api/auth/oidc/verify ──
export interface OidcVerifyInput {
  token: string;
}

export interface OidcVerifyResult {
  valid: boolean;
  claims?: {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    auth_time: number;
    role: string;
    persona: string;
    email?: string;
  };
  error?: string;
}

export async function verifyJuridiaJwt(
  token: string,
  opts: BridgeOptions = {},
): Promise<OidcVerifyResult> {
  return doPost<OidcVerifyInput, OidcVerifyResult>(
    "/api/auth/oidc/verify",
    { token },
    opts,
  );
}

export const juridiaBridge = {
  callCerebro,
  generateMinuta,
  getBiblioteca,
  checkSalvaguardas,
  verifyJuridiaJwt,
};
