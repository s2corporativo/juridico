"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

type SkillUsage = {
  id: string; skillSlug: string; skillVersion: number;
  contentHash: string; contentSnapshot: string; createdAt: string;
};

/** Mostra o texto do snapshot persistido, não reconstruído da versão atual. */
export function DocumentSkillAudit({ documentId }: { documentId: string }) {
  const [usage, setUsage] = useState<SkillUsage[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setUsage(null);
    setError(false);
    fetch("/api/documents/skills?documentId=" + encodeURIComponent(documentId), {
      signal: controller.signal, cache: "no-store",
    }).then(async (response) => {
      if (!response.ok) throw new Error("auditoria indisponível");
      return response.json() as Promise<{ usage?: SkillUsage[] }>;
    }).then((data) => {
      if (!controller.signal.aborted) setUsage(data.usage ?? []);
    }).catch(() => {
      if (!controller.signal.aborted) setError(true);
    });
    return () => controller.abort();
  }, [documentId]);

  return (
    <details className="mb-5 rounded-xl border border-border/80 bg-card px-4 py-3">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
        <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
        Habilidades utilizadas e registro de auditoria
        <span className="ml-auto text-xs text-muted-foreground">
          {usage ? usage.length + " registro(s)" : error ? "indisponível" : "consultando"}
        </span>
      </summary>
      <div className="mt-4 space-y-3 border-t border-border pt-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Os textos abaixo são os snapshots registrados quando o documento foi criado.
          Registros históricos anteriores à correção da auditoria podem divergir do contexto
          efetivamente transmitido ao modelo e exigem verificação adicional.
        </p>
        {error && <p role="alert" className="text-sm text-destructive">Não foi possível consultar os registros.</p>}
        {usage?.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma habilidade aprovada registrada para este documento.</p>}
        {usage?.map((skill) => (
          <details key={skill.id} className="rounded-lg border border-border/70 p-3">
            <summary className="cursor-pointer text-sm font-medium">
              {skill.skillSlug} · versão {skill.skillVersion}
            </summary>
            <div className="mt-3 space-y-2 text-xs">
              <p className="break-all font-mono text-muted-foreground">SHA-256: {skill.contentHash}</p>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted/70 p-3 font-sans leading-relaxed">{skill.contentSnapshot}</pre>
            </div>
          </details>
        ))}
      </div>
    </details>
  );
}
