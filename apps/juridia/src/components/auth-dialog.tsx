"use client";

import { useState } from "react";
import { Scale, Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

// Autenticação REAL: POST /api/auth/login (scrypt + cookie HttpOnly assinado).
// A autenticação client-side simulada foi removida — decisão de segurança.
export function AuthDialog() {
  const { authOpen, setAuthOpen, setView, setUser } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
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
          data?.error === "sso_login_disabled" ? "Login indisponível: segredo de sessão não configurado." :
          "Não foi possível entrar. Tente novamente."
        );
        return;
      }
      setUser({ email: data.user.email, name: data.user.name ?? null, plan: data.user.plan ?? null });
      setAuthOpen(false);
      setView("app");
      toast({ title: "Bem-vindo(a) ao Atlas Jurídico!", description: `Sessão iniciada como ${data.user.email}` });
    } catch {
      setError("Falha de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Scale className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Entrar no Atlas Jurídico
          </DialogTitle>
          <DialogDescription className="text-center">
            Acesse com as credenciais do seu escritório.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="auth-email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@escritorio.com.br"
                className="pl-9"
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="auth-password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
                autoComplete="current-password"
                onKeyDown={(e) => e.key === "Enter" && void signIn()}
              />
            </div>
          </div>
          {error && (
            <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button className="w-full" onClick={() => void signIn()} disabled={loading || !email || !password}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </div>

        <DialogFooter className="flex-col gap-2">
          <p className="text-center text-xs text-muted-foreground">
            Sessão protegida por cookie assinado HttpOnly. Não há cadastro sem convite do administrador.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
