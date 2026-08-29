import { ShieldAlert, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

/**
 * Portão administrativo único das páginas de governança.
 *
 * A ordem loading → não autenticado → sem papel admin evita que um administrador
 * legítimo veja "acesso negado" enquanto `auth.me` ainda está em voo.
 */
export default function AdminGate({ children }: { children: ReactNode }) {
  const { user, loading, login } = useAuth();

  if (loading) {
    return (
      <main className="loading">
        <Settings2 size={20} /> Verificando acesso…
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page">
        <div className="notice warn">
          <ShieldAlert size={16} /> Autenticação necessária para a área de governança.
        </div>
        <button className="button" onClick={login} style={{ marginTop: 12 }}>
          Entrar
        </button>
      </main>
    );
  }

  if (user.role !== "admin") {
    return (
      <main className="page">
        <div className="notice error">
          <ShieldAlert size={16} /> Acesso administrativo necessário. Sua conta não possui perfil de
          administrador do Atlas.
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
