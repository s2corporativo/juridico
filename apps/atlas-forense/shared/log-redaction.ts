const SENSITIVE_KEY = /^(authorization|cookie|set-cookie|token|access[_-]?token|refresh[_-]?token|session|cache|openid|open_id|name|email|phone|telefone|cpf|address|endereco|n[uú]mero[_-]?processo|process[_-]?number|cnjnumber)$/i;
const CPF_PATTERN = /\b\d{3}[.\s-]?\d{3}[.\s-]?\d{3}[-\s]?\d{2}\b/g;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const BEARER_PATTERN = /Bearer\s+[A-Za-z0-9._~+/=-]+/gi;

function redactString(value: string) {
  return value.replace(CPF_PATTERN, "[REDACTED]").replace(EMAIL_PATTERN, "[REDACTED]").replace(BEARER_PATTERN, "Bearer [REDACTED]");
}

export function redactDebugValue(value: unknown): unknown {
  if (typeof value === "string") return redactString(value);
  if (Array.isArray(value)) return value.map(redactDebugValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, nested]) => [key, SENSITIVE_KEY.test(key) ? "[REDACTED]" : redactDebugValue(nested)]));
}

export function redactDebugEntries(entries: unknown[]) {
  return entries.map(redactDebugValue);
}
