"use client";

import { useState } from "react";
import { Pencil, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

type SkillVersion = {
  id: string;
  slug: string;
  version: number;
  area: string;
  description: string;
  content: string;
  triggers: unknown;
  requiredSources: unknown;
  requiredEvidence: unknown;
  rules: unknown;
  exceptions: unknown;
  forbiddenClaims: unknown;
  allowedTools: unknown;
  outputSchema: unknown;
  status: string;
  contentHash: string;
  approvedBy: string | null;
  approvedAt: string | null;
};

export function SkillVersionEditor({ slug, onSaved }: { slug: string; onSaved?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState<SkillVersion[]>([]);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/skills/versions?q=${encodeURIComponent(slug)}&pageSize=50`);
      if (!res.ok) throw new Error("Falha ao carregar versões");
      const data = await res.json();
      const exact = (data.skills || [])
        .filter((s: SkillVersion) => s.slug === slug)
        .sort((a: SkillVersion, b: SkillVersion) => b.version - a.version);
      setVersions(exact);
      const latest = exact[0];
      setDescription(latest?.description || "");
      setContent(latest?.content || "");
    } catch (e) {
      toast({ title: "Não foi possível carregar a skill", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function saveNewVersion() {
    const latest = versions[0];
    if (!latest || !content.trim() || !description.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/skills/versions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug,
          area: latest.area,
          description,
          content,
          triggers: latest.triggers,
          requiredSources: latest.requiredSources,
          requiredEvidence: latest.requiredEvidence,
          rules: latest.rules,
          exceptions: latest.exceptions,
          forbiddenClaims: latest.forbiddenClaims,
          allowedTools: latest.allowedTools,
          outputSchema: latest.outputSchema,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao criar versão");
      toast({ title: `Versão ${data.skill.version} criada`, description: "A nova versão ficou em revisão; a versão aprovada atual continua em produção." });
      await load();
      onSaved?.();
    } catch (e) {
      toast({ title: "Erro ao salvar versão", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(id: string, status: "approved" | "retired") {
    setSaving(true);
    try {
      const res = await fetch("/api/skills/versions", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao alterar status");
      toast({ title: status === "approved" ? "Versão aprovada" : "Versão retirada" });
      await load();
      onSaved?.();
    } catch (e) {
      toast({ title: "Erro ao alterar status", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const latest = versions[0];

  return (
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (value) void load(); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="mt-3 w-full">
          <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar e versionar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Skill versionada</DialogTitle>
          <DialogDescription>{slug}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : latest ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge>v{latest.version}</Badge>
              <Badge variant={latest.status === "approved" ? "default" : "secondary"}>{latest.status}</Badge>
              <Badge variant="outline">{latest.area}</Badge>
              <code className="text-[10px] text-muted-foreground">{latest.contentHash.slice(0, 12)}</code>
            </div>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} aria-label="Descrição da skill" />
            <Textarea className="min-h-[320px] font-mono text-xs" value={content} onChange={(e) => setContent(e.target.value)} />
            <div>
              <div className="mb-2 text-xs font-medium">Histórico</div>
              <div className="space-y-1">
                {versions.map((v) => (
                  <div key={v.id} className="flex items-center justify-between rounded border px-3 py-2 text-xs">
                    <span>v{v.version} · {v.status} · {v.contentHash.slice(0, 10)}</span>
                    <div className="flex gap-1">
                      {v.status === "review" && (
                        <Button size="sm" variant="outline" disabled={saving} onClick={() => changeStatus(v.id, "approved")}>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Aprovar
                        </Button>
                      )}
                      {v.status === "approved" && (
                        <Button size="sm" variant="ghost" disabled={saving} onClick={() => changeStatus(v.id, "retired")}>
                          Retirar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : <p className="text-sm text-muted-foreground">Nenhuma versão encontrada.</p>}

        <DialogFooter>
          <Button disabled={saving || loading || !latest} onClick={saveNewVersion}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pencil className="mr-2 h-4 w-4" />}
            Salvar como nova versão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
