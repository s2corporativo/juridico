"use client";

// Página de login local do JuridIA.
// - Usada diretamente (usuários do escritório) e pelo fluxo SSO
//   (/api/auth/oidc/authorize redireciona para cá com ?next=...).
// - Autenticação real via POST /api/auth/login (scrypt + cookie assinado).

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Scale } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data?.error === "invalid_credentials" ? "E-mail ou senha inválidos." :
          data?.error === "too_many_attempts" ? "Muitas tentativas. Aguarde um minuto." :
          data?.error === "sso_login_disabled" ? "Login indisponível: segredo de sessão não configurado no servidor." :
          "Não foi possível entrar. Tente novamente."
        );
        return;
      }
      // Anti open-redirect: aceita apenas caminhos relativos ou URLs da MESMA
      // origem (o fluxo SSO volta para /api/auth/oidc/authorize, URL absoluta).
      let safeNext = "/";
      try {
        const u = new URL(next, window.location.origin);
        if (u.origin === window.location.origin) safeNext = u.pathname + u.search + u.hash;
      } catch {
        safeNext = "/";
      }
      router.push(safeNext);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm space-y-5"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Scale className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">JuridIA</h1>
          <p className="text-sm text-muted-foreground">Acesse com suas credenciais do escritório.</p>
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Senha</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Sessão protegida por cookie assinado (HttpOnly). Nenhuma credencial é armazenada no navegador.
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
