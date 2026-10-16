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
