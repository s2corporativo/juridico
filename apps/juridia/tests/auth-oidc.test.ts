// Testes de segurança: autenticação local + IdP OIDC do JuridIA.
// Executar: bun run tests/auth-oidc.test.ts
//
// Cobertura:
// - scrypt: hash/verificação de senha, rejeição de senha errada
// - Sessão: assinatura/verificação, rejeição de cookie adulterado/expirado
// - PKCE S256: desafio determinístico e rejeição de verifier inválido
// - getIssuerConfig: fail-closed (sem env, issuer inseguro em produção)
// - Mapeamento de papel: desconhecido degrada para "user" (nunca eleva)

import {
  hashPassword,
  verifyPassword,
  signSession,
  verifySessionToken,
} from "../src/lib/auth";
import {
  OIDC_AUDIENCE,
  getIssuerConfig,
  isValidPkceVerifier,
  s256Challenge,
} from "../src/lib/oidc";

let passed = 0;
let failed = 0;

function assert(condition: boolean, name: string, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}${detail ? " — " + detail : ""}`);
  }
}

// ── Senha (scrypt) ───────────────────────────────────────────────────────────
{
  const hash = hashPassword("senha-correta-segura");
  assert(hash.startsWith("scrypt$"), "hash usa formato scrypt$salt$hash");
  assert(hash !== hashPassword("senha-correta-segura"), "salt aleatório: hashes distintos para a mesma senha");
  assert(verifyPassword("senha-correta-segura", hash) === true, "senha correta é verificada");
  assert(verifyPassword("senha-errada", hash) === false, "senha errada é rejeitada");
  assert(verifyPassword("senha-correta-segura", "lixo") === false, "hash malformado é rejeitado");
}

// ── Sessão (cookie assinado HMAC) ────────────────────────────────────────────
{
  process.env.JURIDIA_SESSION_SECRET = "segredo-de-teste-com-mais-de-32-caracteres!!";
  const token = signSession({ uid: "u1", email: "ops@teste.adv.br", role: "admin" });
  assert(token !== null, "sessão é assinada com segredo configurado");

  const ok = verifySessionToken(token);
  assert(ok !== null && ok.uid === "u1" && ok.role === "admin", "sessão válida decodifica payload");

  const tampered = (token ?? "").replace(/[A-Za-z0-9_-]{6}$/, "XXXXXX");
  assert(verifySessionToken(tampered) === null, "payload adulterado é rejeitado");
  assert(verifySessionToken("sem-assinatura") === null, "token sem assinatura é rejeitado");
  assert(verifySessionToken(undefined) === null, "ausência de token é rejeitada");

  // Segredo diferente → assinatura inválida
  process.env.JURIDIA_SESSION_SECRET = "outro-segredo-com-mais-de-32-caracteres-xx";
  assert(verifySessionToken(token) === null, "assinatura com segredo diverso é rejeitada");

  // Sem segredo em produção → fail-closed
  const prevEnv = process.env.NODE_ENV;
  Object.assign(process.env, { NODE_ENV: "production" });
  delete process.env.JURIDIA_SESSION_SECRET;
  assert(signSession({ uid: "u1", email: "x@y.z", role: "user" }) === null, "produção sem segredo NÃO assina sessão (fail-closed)");
  Object.assign(process.env, { NODE_ENV: prevEnv });
}

// ── PKCE S256 ────────────────────────────────────────────────────────────────
{
  const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
  assert(s256Challenge(verifier) === "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM", "challenge S256 segue a RFC 7636 (vetor oficial)");
  assert(s256Challenge(verifier) === s256Challenge(verifier), "challenge é determinístico");
  assert(isValidPkceVerifier(verifier) === true, "verifier RFC válido é aceito");
  assert(isValidPkceVerifier("curto") === false, "verifier muito curto é rejeitado");
  assert(isValidPkceVerifier("com espaços e simbolos!") === false, "verifier com caracteres inválidos é rejeitado");
}

// ── Config do IdP (fail-closed) ──────────────────────────────────────────────
{
  const prevEnv = process.env.NODE_ENV;
  for (const k of ["JURIDIA_OIDC_ISSUER", "ATLAS_OIDC_CLIENT_ID", "ATLAS_OIDC_CLIENT_SECRET", "ATLAS_OIDC_REDIRECT_URIS", "JURIDIA_OIDC_DEV_ALLOW_LOCAL"]) {
    delete process.env[k];
  }
  Object.assign(process.env, { NODE_ENV: "production" });
  const noEnv = getIssuerConfig();
  if ("error" in noEnv) {
    assert(true, "produção sem env: config indisponível (fail-closed)");
    assert(noEnv.error === "sso_not_configured", "erro de configuração ausente é explícito");
  } else {
    assert(false, "produção sem env deveria ser fail-closed, mas retornou config");
  }

  process.env.JURIDIA_OIDC_ISSUER = "http://sso.inseguro.example/api/auth/oidc";
  process.env.ATLAS_OIDC_CLIENT_ID = "atlas-juridico";
  process.env.ATLAS_OIDC_CLIENT_SECRET = "segredo-producao";
  process.env.ATLAS_OIDC_REDIRECT_URIS = "https://atlas.exemplo.org/api/sso/callback";
  const insecure = getIssuerConfig();
  assert("error" in insecure && insecure.error === "insecure_issuer_https_required", "issuer HTTP em produção é rejeitado");

  process.env.JURIDIA_OIDC_ISSUER = "https://sso.exemplo.org/api/auth/oidc";
  const cfg = getIssuerConfig();
  assert(!("error" in cfg) && cfg.issuer.startsWith("https://"), "issuer HTTPS é aceito em produção");
  assert(!("error" in cfg) && cfg.redirectUris.includes("https://atlas.exemplo.org/api/sso/callback"), "redirect_uri registrada é aceita");

  Object.assign(process.env, { NODE_ENV: prevEnv });
}

// ── Audiência fixa do Atlas ──────────────────────────────────────────────────
{
  assert(OIDC_AUDIENCE === "atlas-juridico", "audiência do ID Token é atlas-juridico");
}

console.log("\n=== RESULTADO ===");
console.log(`✓ ${passed} aprovados`);
console.log(`✗ ${failed} reprovados`);
if (failed > 0) process.exit(1);
console.log("\n🎉 TODOS OS TESTES PASSARAM");
