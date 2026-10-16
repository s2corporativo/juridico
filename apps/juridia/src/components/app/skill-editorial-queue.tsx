"use client";
import { useEffect, useState } from "react";
import { BookMarked, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PendingSkill = {
  id: string; slug: string; version: number; area: string; description: string;
  content: string; status: string; requiredSources: string;
  canSubmit: boolean; canDecide: boolean;
};
type QueueReply = { items: PendingSkill[]; canReview: boolean };
const blank = { slug: "", area: "civil", description: "", content: "", triggers: "", sources: "" };
function splitList(value: string): string[] {
  return value.split(/[,\n]/).map((part) => part.trim()).filter(Boolean).slice(0, 30);
}
export function SkillEditorialQueue() {
  const [items, setItems] = useState<PendingSkill[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [form, setForm] = useState(blank);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  async function reload() {
    const result = await fetch("/api/skills/workflow", { cache: "no-store" });
    if (!result.ok) throw new Error("Fila editorial indisponível");
    const payload = await result.json() as QueueReply;
    setItems(payload.items ?? []);
    setCanReview(payload.canReview);
  }
  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/skills/workflow", { cache: "no-store", signal: abort.signal })
      .then(async (r) => r.ok ? r.json() as Promise<QueueReply> : null)
      .then((r) => { if (!abort.signal.aborted && r) { setItems(r.items ?? []); setCanReview(r.canReview); } })
      .catch(() => null);
    return () => abort.abort();
  }, []);
  async function send(action: "create" | "submit" | "approve" | "return", id?: string) {
    setBusy(true); setError(""); setInfo("");
    try {
      const payload = action === "create" ? {
        action, skill: {
          slug: form.slug, area: form.area, description: form.description, content: form.content,
          triggers: { keywords: splitList(form.triggers) },
          requiredSources: splitList(form.sources),
        },
      } : { action, id, reason };
      const response = await fetch("/api/skills/workflow", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(detail.error ?? "Não foi possível executar a ação");
      }
      if (action === "create") setForm(blank);
      if (action !== "create") setReason("");
      await reload();
      setInfo(action === "create" ? "Rascunho criado." :
        action === "submit" ? "Enviado para revisão independente." :
        action === "approve" ? "Versão aprovada e registrada." : "Devolvido ao autor.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao executar a operação");
    } finally { setBusy(false); }
  }
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader><CardTitle className="flex items-center gap-2 text-base">
        <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
        Curadoria de habilidades
      </CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          A aprovação exige revisor autenticado diferente do autor, justificativa e integridade do manifesto.
          Vínculo de conta e OAB informada não substituem verificação profissional ou revisão jurídica das fontes.
        </p>
        <details className="rounded-xl border border-border/70 p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Criar uma nova versão para revisão
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-xs">
              <span>Código da habilidade</span>
              <Input value={form.slug} placeholder="cpc-contestacao"
                onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </label>
            <label className="space-y-1 text-xs">
              <span>Área do direito</span>
              <Input value={form.area} placeholder="civil"
                onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </label>
            <label className="space-y-1 text-xs sm:col-span-2">
              <span>Nome e finalidade</span>
              <Input value={form.description} placeholder="Orientação para..."
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label className="space-y-1 text-xs sm:col-span-2">
              <span>Orientação jurídica proposta</span>
              <textarea value={form.content} rows={5}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary"
                onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </label>
            <label className="space-y-1 text-xs">
              <span>Gatilhos de pesquisa, separados por vírgula</span>
              <Input value={form.triggers} placeholder="contestação, preliminar"
                onChange={(e) => setForm({ ...form, triggers: e.target.value })} />
            </label>
            <label className="space-y-1 text-xs">
              <span>Fontes para revisão, separadas por vírgula</span>
              <Input value={form.sources} placeholder="CPC, jurisprudência oficial"
                onChange={(e) => setForm({ ...form, sources: e.target.value })} />
            </label>
            <div className="sm:col-span-2">
              <Button size="sm" disabled={busy || !form.slug.trim() || !form.content.trim()}
                onClick={() => void send("create")}>Salvar rascunho</Button>
            </div>
          </div>
        </details>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <BookMarked className="h-4 w-4 text-primary" aria-hidden="true" />
              Fila editorial <span className="text-muted-foreground">({items.length})</span>
            </h3>
            <Button size="sm" variant="outline" onClick={() => void reload().catch(() => setError("Erro ao atualizar a fila"))}>
              Atualizar
            </Button>
          </div>
          {canReview && (
            <label className="block space-y-1 text-xs">
              <span>Justificativa para a decisão editorial</span>
              <Input value={reason} placeholder="Fundamentação da revisão (mínimo de 12 caracteres)"
                onChange={(e) => setReason(e.target.value)} />
            </label>
          )}
          {items.length === 0 && (
            <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
              Nenhuma versão aguardando edição ou revisão.
            </p>
          )}
          {items.map((item) => (
            <details key={item.id} className="rounded-lg border border-border/70 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                {item.description}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  #{item.slug} · v{item.version} · {item.area} · {item.status === "review" ? "Em revisão" : "Rascunho"}
                </span>
              </summary>
              <div className="mt-3 space-y-3 border-t border-border pt-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{item.content}</p>
                <p className="text-xs text-muted-foreground">Fontes declaradas: {item.requiredSources}</p>
                <div className="flex flex-wrap gap-2">
                  {item.canSubmit && (
                    <Button size="sm" variant="outline" disabled={busy || reason.trim().length < 12}
                      onClick={() => void send("submit", item.id)}>Enviar para revisão</Button>
                  )}
                  {item.canDecide && (
                    <>
                      <Button size="sm" disabled={busy || reason.trim().length < 12}
                        onClick={() => void send("approve", item.id)}>Aprovar versão</Button>
                      <Button size="sm" variant="outline" disabled={busy || reason.trim().length < 12}
                        onClick={() => void send("return", item.id)}>Devolver ao autor</Button>
                    </>
                  )}
                  {!item.canSubmit && !item.canDecide && (
                    <span className="text-xs text-muted-foreground">Aguardando responsável habilitado para a próxima etapa.</span>
                  )}
                </div>
              </div>
            </details>
          ))}
        </div>
        {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
        {info && <p role="status" className="text-xs text-muted-foreground">{info}</p>}
      </CardContent>
    </Card>
  );
}
