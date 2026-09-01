'use client';

import { useEffect, useRef, useState } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { consumirAcao, agendarAcao } from '@/lib/ejc/ui-actions';
import { BrainCircuit, Briefcase, FileText, LayoutDashboard, Library, Network, FlaskConical, Rss, ScanSearch, Search, Sparkles, TrendingUp, Wrench } from 'lucide-react';

interface DocItem {
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  confiabilidade: string;
}

const ABAS = [
  { valor: 'visao', label: 'Visão Geral', icone: LayoutDashboard },
  { valor: 'jurimetria', label: 'Jurimetria (cidades e varas)', icone: TrendingUp },
  { valor: 'base', label: 'Base de Conhecimento', icone: Library },
  { valor: 'consulta', label: 'Consulta Jurídica (IA)', icone: BrainCircuit },
  { valor: 'grafo', label: 'Grafo', icone: Network },
  { valor: 'ferramentas', label: 'Ferramentas', icone: Wrench },
  { valor: 'casos', label: 'Casos Privados', icone: Briefcase },
  { valor: 'fontes', label: 'Atualizações (Fontes)', icone: Rss },
  { valor: 'testes', label: 'Testes RAG', icone: FlaskConical },
  { valor: 'integridade', label: 'Integridade da Curadoria', icone: ScanSearch },
];

/** Remove diacríticos para busca ("sumula" encontra "Súmula"). */
function normalizar(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Paleta de comandos (⌘K / Ctrl+K): navegação entre abas, salto direto a
 * documentos e despacho de consulta IA. Comunicação entre abas via
 * CustomEvents ('ejc:abrir-doc' e 'ejc:perguntar') + ação pendente no mount.
 */
export function CommandPalette({ onNavegar, open, onOpenChange }: { onNavegar: (aba: string) => void; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [termo, setTermo] = useState('');
  const carregouRef = useRef(false);

  // Atalho global ⌘K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  // Carrega a lista de documentos na primeira abertura (base pequena → 1 fetch)
  useEffect(() => {
    if (!open || carregouRef.current) return;
    carregouRef.current = true;
    fetch('/api/ejc/documents?page=1&pageSize=1000')
      .then((r) => r.json())
      .then((d) => setDocs(d.documentos ?? []))
      .catch(() => setDocs([]));
  }, [open]);

  const navegar = (aba: string) => {
    onOpenChange(false);
    onNavegar(aba);
  };

  const abrirDoc = (slug: string) => {
    onOpenChange(false);
    onNavegar('base');
    // marca a ação pendente ANTES do dispatch (a aba remontada também a consome no mount)
    agendarAcao('abrirDoc', slug);
    setTimeout(() => window.dispatchEvent(new CustomEvent('ejc:abrir-doc', { detail: { slug } })), 60);
  };

  const perguntar = (texto: string) => {
    onOpenChange(false);
    onNavegar('consulta');
    agendarAcao('perguntar', texto);
    setTimeout(() => window.dispatchEvent(new CustomEvent('ejc:perguntar', { detail: { texto } })), 60);
  };

  const docsFiltrados = termo.trim()
    ? docs.filter((d) => normalizar(`${d.titulo} ${d.slug} ${d.area} ${d.tipoDocumento}`).includes(normalizar(termo))).slice(0, 12)
    : docs.filter((d) => d.confiabilidade === 'A').slice(0, 6);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} aria-label="Paleta de comandos Jurimetria DPT">
      <CommandInput value={termo} onValueChange={setTermo} placeholder="Buscar documentos, abas ou perguntar à IA..." aria-label="Buscar na paleta de comandos" />
      <CommandList className="max-h-[70vh]">
        <CommandEmpty>Nenhum resultado. Tente outros termos jurídicos.</CommandEmpty>

        {termo.trim() && (
          <CommandGroup heading="Consultar IA">
            <CommandItem onSelect={() => perguntar(termo)} className="gap-2">
              <Sparkles className="size-4 text-amber-600" />
              Perguntar à IA: “{termo.length > 48 ? `${termo.slice(0, 48)}…` : termo}”
            </CommandItem>
          </CommandGroup>
        )}

        <CommandGroup heading="Navegação">
          {ABAS.map((a) => (
            <CommandItem key={a.valor} onSelect={() => navegar(a.valor)} className="gap-2">
              <a.icone className="size-4 text-muted-foreground" />
              {a.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={termo.trim() ? `Documentos (${docsFiltrados.length} de ${docs.length})` : 'Documentos nível A — destaque'}>
          {docsFiltrados.map((d) => (
            <CommandItem key={d.slug} value={`${d.titulo} ${d.slug}`} onSelect={() => abrirDoc(d.slug)} className="gap-2">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{d.titulo}</span>
              <Badge variant={d.confiabilidade === 'A' ? 'secondary' : 'outline'} className="shrink-0 text-[9px]">
                {d.confiabilidade === 'A' ? 'Fonte A' : d.confiabilidade}
              </Badge>
            </CommandItem>
          ))}
          {!termo.trim() && docs.length === 0 && (
            <CommandItem disabled className="text-muted-foreground"><Search className="mr-2 size-4" /> Base ainda carregando...</CommandItem>
          )}
        </CommandGroup>
      </CommandList>
      <div className="border-t px-3 py-2 text-[10px] text-muted-foreground">
        <kbd className="rounded border bg-muted px-1 py-0.5 font-mono">⌘K</kbd> abrir/fechar · <kbd className="rounded border bg-muted px-1 py-0.5 font-mono">Enter</kbd> selecionar
      </div>
    </CommandDialog>
  );
}
