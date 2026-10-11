"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, Loader2, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import type { DocumentDTO, TemplateDTO } from "@/lib/types";

export function BibliotecaMinutas() {
  const { setAppTab, setCurrentDocId, setSelectedTemplateSlug } = useAppStore();
  const [docs, setDocs] = useState<DocumentDTO[]>([]);
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const [documentsResponse, templatesResponse] = await Promise.all([
          fetch("/api/documents", { signal: controller.signal, cache: "no-store" }),
          fetch("/api/templates", { signal: controller.signal, cache: "no-store" }),
        ]);
        if (!documentsResponse.ok || !templatesResponse.ok) {
          throw new Error("Não foi possível consultar sua biblioteca autenticada.");
        }
        const [documentsData, templatesData] = await Promise.all([
          documentsResponse.json(), templatesResponse.json(),
        ]);
        if (controller.signal.aborted) return;
        setDocs(Array.isArray(documentsData.documents) ? documentsData.documents : []);
        setTemplates(Array.isArray(templatesData.templates) ? templatesData.templates : []);
        setError(null);
      } catch {
        if (!controller.signal.aborted) setError("Biblioteca indisponível. Confira sua sessão e tente novamente.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  const filteredDocs = useMemo(() => docs.filter(doc =>
    [doc.title, doc.templateName].join(" ").toLowerCase().includes(query.toLowerCase().trim())
  ), [docs, query]);
  const filteredTemplates = useMemo(() => templates.filter(template =>
    [template.name, template.description].join(" ").toLowerCase().includes(query.toLowerCase().trim())
  ), [templates, query]);

  function openDocument(id: string) {
    setCurrentDocId(id);
    setAppTab("editor");
  }
  function useTemplate(slug: string) {
    setSelectedTemplateSlug(slug);
    setAppTab("generator");
  }
  return (
    <section className="container-juridia space-y-6 py-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><BookOpen className="h-6 w-6 text-primary" /> Biblioteca de minutas</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seus rascunhos e modelos de redação. A consulta à jurisprudência e à legislação está em Pesquisa Jurídica.
        </p>
      </div>
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input aria-label="Pesquisar meus rascunhos e modelos" className="pl-9"
          placeholder="Pesquisar minutas ou modelos" value={query} onChange={event => setQuery(event.target.value)} />
      </div>
      {loading ? <p className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Carregando biblioteca…</p>
        : error ? <p role="alert" className="text-sm text-destructive">{error}</p> : (
        <>
          <div className="space-y-3">
            <h2 className="text-base font-semibold">Minutas salvas ({filteredDocs.length})</h2>
            {filteredDocs.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma minuta salva para este filtro.</p> :
              <div className="grid gap-3 md:grid-cols-2">
                {filteredDocs.map(doc => (
                  <Card key={doc.id}><CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0 space-y-1">
                      <p className="flex items-center gap-2 font-medium"><FileText className="h-4 w-4 shrink-0" /> <span className="truncate">{doc.title}</span></p>
                      <p className="text-xs text-muted-foreground">
                        {doc.templateName} · {doc.status === "draft" ? "Rascunho — revisão necessária" : "Conferir status antes do uso"}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => openDocument(doc.id)}>Abrir no editor</Button>
                  </CardContent></Card>
                ))}
              </div>}
          </div>
          <div className="space-y-3">
            <h2 className="text-base font-semibold">Modelos de redação ({filteredTemplates.length})</h2>
            {filteredTemplates.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum modelo encontrado.</p> :
              <div className="grid gap-3 md:grid-cols-2">
                {filteredTemplates.map(template => (
                  <Card key={template.id}><CardContent className="flex items-start justify-between gap-3 p-4">
                    <div className="space-y-1">
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => useTemplate(template.slug)}>Usar modelo</Button>
                  </CardContent></Card>
                ))}
              </div>}
          </div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Minutas e modelos não constituem conteúdo homologado sem revisão jurídica.
          </p>
        </>
      )}
    </section>
  );
}
