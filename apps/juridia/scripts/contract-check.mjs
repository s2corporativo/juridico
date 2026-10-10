#!/usr/bin/env node
/**
 * contract-check.mjs — verifica a MATRIZ DE ROTAS do JuridIA contra uma
 * instância em execução (default: http://127.0.0.1:3005).
 *
 * Contrato: apps/juridia/docs/contrato-operacional-bot.md
 *           apps/atlas-forense/docs/auditoria-rotas-juridia.md §3
 *
 * Rodar APÓS CADA deploy/rewrite do bot. Exit 1 = contrato violado.
 *   node scripts/contract-check.mjs [baseURL]
 *
 * Expectativas (sem sessão):
 *   - Rotas PÚBLICAS por design  → 200 (discovery/jwks aceitam 503 se não configurado)
 *   - Rotas CONFIDENCIAIS        → 401 (guard exige sessão; 403 se sessão inválida)
 *   - Rotas de ADMIN (anônimo)   → 401 (o guard roda antes da checagem de papel)
 *   - 200/404/400 em rota confidencial anônima = VIOLAÇÃO (200 vaza dado;
 *     404 = rota do contrato sumiu do build — drifted)
 */

const base = process.argv[2] || "http://127.0.0.1:3005";

const PUBLIC = [
  { m: "GET", p: "/api/auth/oidc", ok: [200, 503] },
  { m: "GET", p: "/api/auth/oidc/jwks", ok: [200, 503] },
  { m: "GET", p: "/api/auth/oidc/.well-known/openid-configuration", ok: [200, 503] },
  { m: "GET", p: "/api/fontes/ibge", ok: [200] },
  { m: "GET", p: "/api/fontes/querido-diario", ok: [200] },
  { m: "GET", p: "/api/news", ok: [200] },
];

const CONFIDENTIAL = [
  { m: "GET", p: "templates" }, { m: "GET", p: "documents" },
  { m: "GET", p: "skills" }, { m: "GET", p: "legal-sources" },
  { m: "GET", p: "brain" }, { m: "GET", p: "cases" },
  { m: "GET", p: "clients" }, { m: "GET", p: "alertas" },
  { m: "GET", p: "prazos" }, { m: "GET", p: "audiencias" },
  { m: "GET", p: "financeiro" }, { m: "GET", p: "intimacoes" },
  { m: "GET", p: "stats" }, { m: "POST", p: "anonymize" },
  { m: "GET", p: "assistente" }, { m: "POST", p: "calculadora-juridica" },
  { m: "GET", p: "case-analysis" }, { m: "POST", p: "citations/verify" },
  { m: "GET", p: "datajud" }, { m: "GET", p: "grafo" },
  { m: "POST", p: "molde" }, { m: "POST", p: "suggest" },
  { m: "POST", p: "skill-router" }, { m: "POST", p: "triagem-documento" },
  { m: "POST", p: "valor-causa" }, { m: "POST", p: "vedacao-surpresa" },
  { m: "POST", p: "atlas/theses" },
];

const ADMIN_ANON = [
  { m: "POST", p: "/api/advogados", body: {} },
  { m: "POST", p: "/api/legal-sources", body: {} },
  { m: "POST", p: "/api/generate-minuta", body: {} },
  { m: "POST", p: "/api/generate-minuta/stream", body: {} },
];

let fails = 0;

async function probe(method, path, body) {
  try {
    const res = await fetch(base + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    return res.status;
  } catch {
    return 0; // conexão falhou
  }
}

console.log(`contrato de rotas — ${base}\n`);

for (const r of PUBLIC) {
  const s = await probe(r.m, r.p);
  const ok = r.ok.includes(s);
  if (!ok) fails++;
  console.log(`${ok ? "OK  " : "FAIL"} público  ${r.m} ${r.p} → ${s} (esperado ${r.ok.join("/")})`);
}

for (const r of CONFIDENTIAL) {
  const s = await probe(r.m, `/api/${r.p}`, r.m === "POST" ? {} : undefined);
  const ok = s === 401 || s === 403;
  if (!ok) fails++;
  console.log(`${ok ? "OK  " : "FAIL"} guarda  ${r.m} /api/${r.p} → ${s} (esperado 401)`);
}

for (const r of ADMIN_ANON) {
  const s = await probe(r.m, r.p, r.body);
  const ok = s === 401 || s === 403;
  if (!ok) fails++;
  console.log(`${ok ? "OK  " : "FAIL"} guarda  ${r.m} ${r.p} (anônimo) → ${s} (esperado 401/403)`);
}

console.log(fails === 0 ? "\nCONTRATO ÍNTEGRO ✅" : `\nCONTRATO VIOLADO — ${fails} divergência(s) ❌\nMatriz de referência: apps/juridia/docs/contrato-operacional-bot.md`);
process.exit(fails === 0 ? 0 : 1);
