'use client';

// EJC — Tour guiado de primeiros passos (P3).
// Overlay educacional que percorre as 12 abas da plataforma na primeira visita
// (persistido em localStorage) ou quando acionado pelo botão "Tour" do header /
// pela paleta de comandos (evento 'ejc:abrir-tour'). Ao avançar, navega para a
// aba correspondente para que o usuário veja a seção real descrita no passo.

import { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  BrainCircuit,
  Briefcase,
  Compass,
  FileSearch,
  FlaskConical,
  LayoutDashboard,
  Library,
  Network,
  Rss,
  ScanSearch,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

const CHAVE_VISTO = 'dpt-tour-visto-v1';
const EVENTO_ABRIR = 'ejc:abrir-tour';

interface Passo {
  aba: string;
  titulo: string;
  descricao: string;
  icone: LucideIcon;
}

const PASSOS: Passo[] = [
  {
    aba: 'visao',
    titulo: 'Bem-vindo à Jurimetria DPT',
    descricao:
      'Plataforma de inteligência jurídica da De Paula Teixeira Advocacia: compêndio curado, jurimetria DataJud e IA com rastreabilidade até a fonte oficial. Este tour rápido mostra cada área em ~1 minuto.',
    icone: Compass,
  },
  {
    aba: 'visao',
    titulo: 'Visão Geral',
    descricao:
      'Painel de indicadores do acervo (documentos, chunks, lotes, integridade) com atalhos para as áreas principais. Comece por aqui no dia a dia.',
    icone: LayoutDashboard,
  },
  {
    aba: 'jurimetria',
    titulo: 'Jurimetria',
    descricao:
      'Retratos estatísticos do TJMG via API DataJud: comarcas (Belo Horizonte, Betim, Contagem, Igarapé), varas, áreas do direito, classes e tempos processuais — com números reproduzíveis.',
    icone: TrendingUp,
  },
  {
    aba: 'compendio',
    titulo: 'Compêndio',
    descricao:
      'Acervo curado em capítulos por área: legislação, súmulas, jurisprudência, teses, peças, contratos, checklists e fluxos. Cada item com fonte, URL e data de consulta.',
    icone: BookOpen,
  },
  {
    aba: 'base',
    titulo: 'Base de Conhecimento',
    descricao:
      'Busca direta no corpus completo com filtros por área, tipo e confiabilidade (A/B/C). É a camada que alimenta a IA — tudo aqui é auditável.',
    icone: Library,
  },
  {
    aba: 'consulta',
    titulo: 'Consulta IA',
    descricao:
      'Pergunte em linguagem natural. O motor híbrido (BM25 + embeddings) expande termos, recupera fontes e responde com citações [FONTE n] — clique nelas para ver o documento de origem.',
    icone: BrainCircuit,
  },
  {
    aba: 'pesquisa',
    titulo: 'Pesquisa agêntica + verificação',
    descricao:
      'O agente planeja, busca, critica e sintetiza em iterações um memo de fundamentação com verificação de citação (checksum CNJ, súmulas, DataJud ao vivo) e exportação .docx para a peça.',
    icone: FileSearch,
  },
  {
    aba: 'grafo',
    titulo: 'Grafo do conhecimento',
    descricao:
      'Relações entre documentos do acervo (cita, fundamenta, complementa). Clique em um nó para navegar ao documento.',
    icone: Network,
  },
  {
    aba: 'ferramentas',
    titulo: 'Ferramentas',
    descricao:
      'Calculadora de prazos processuais (CPC, dias úteis, feriados), verificadores de prescrição, usucapião e alçada, e consulta DataJud ao vivo por número de processo.',
    icone: Wrench,
  },
  {
    aba: 'casos',
    titulo: 'Casos',
    descricao:
      'Caderno privado do caso: notas, minutas e relatório .docx. Dados sensíveis permanecem no servidor local (LGPD) — nada é enviado a serviços externos.',
    icone: Briefcase,
  },
  {
    aba: 'fontes',
    titulo: 'Fontes públicas',
    descricao:
      'Feed de atualização com metadados e link ao inteiro teor oficial, além do status das coletas (DataJud, Planalto, STJ, Câmara). Nada é inventado: o que não confirma fica em revisão humana.',
    icone: Rss,
  },
  {
    aba: 'testes',
    titulo: 'Governança: Testes e Integridade',
    descricao:
      'Suíte RAG de regressão (39 perguntas-âncora com Recall@10, MRR e Hit Rate) e auditoria de integridade 0–100 da curadoria. Dica final: use ⌘K/Ctrl+K para navegar rápido.',
    icone: FlaskConical,
  },
];

export function TourGuiado({ onNavegar }: { onNavegar: (aba: string) => void }) {
  const [aberto, setAberto] = useState(false);
  const [idx, setIdx] = useState(0);

  // Primeira visita: abre automaticamente após o carregamento inicial.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(CHAVE_VISTO)) return;
      const t = setTimeout(() => setAberto(true), 1200);
      return () => clearTimeout(t);
    } catch {
      return;
    }
  }, []);

  // Botão "Tour" do header e paleta ⌘K disparam via CustomEvent.
  useEffect(() => {
    const abrir = () => setAberto(true);
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, []);

  const fechar = useCallback(() => {
    setAberto(false);
    try {
      window.localStorage.setItem(CHAVE_VISTO, '1');
    } catch {
      /* armazenamento indisponível — tour apenas reaparece */
    }
  }, []);

  const irPara = useCallback(
    (n: number) => {
      const prox = Math.max(0, Math.min(PASSOS.length - 1, n));
      setIdx(prox);
      const aba = PASSOS[prox].aba;
      if (aba) onNavegar(aba);
    },
    [onNavegar],
  );

  const passo = PASSOS[idx];
  const Icone = passo.icone;
  const ultimo = idx === PASSOS.length - 1;

  return (
    <Dialog
      open={aberto}
      onOpenChange={(o) => {
        if (!o) fechar();
      }}
    >
      <DialogContent className="sm:max-w-md" aria-describedby="tour-desc">
        <DialogHeader>
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden>
            <Icone className="size-5" />
          </div>
          <DialogTitle className="text-left text-lg leading-snug">
            <span className="mr-2 text-xs font-medium tabular-nums text-muted-foreground">
              {idx + 1}/{PASSOS.length}
            </span>
            {passo.titulo}
          </DialogTitle>
          <DialogDescription id="tour-desc" className="text-left text-sm leading-relaxed">
            {passo.descricao}
          </DialogDescription>
        </DialogHeader>

        {/* Progresso em pontos */}
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Progresso do tour">
          {PASSOS.map((p, i) => (
            <button
              key={p.titulo}
              type="button"
              role="tab"
              aria-selected={i === idx}
              aria-label={`Passo ${i + 1}: ${p.titulo}`}
              onClick={() => irPara(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? 'w-6 bg-primary' : i < idx ? 'w-1.5 bg-primary/50 hover:bg-primary/70' : 'w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/45'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={fechar}
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Pular tour
          </button>
          <div className="flex gap-2">
            {idx > 0 && (
              <Button variant="outline" size="sm" onClick={() => irPara(idx - 1)}>
                Voltar
              </Button>
            )}
            {ultimo ? (
              <Button size="sm" onClick={fechar} className="gap-1.5">
                <Compass className="size-4" /> Começar a usar
              </Button>
            ) : (
              <Button size="sm" onClick={() => irPara(idx + 1)} className="gap-1.5">
                Próximo <span aria-hidden>→</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Dispara o tour programaticamente (paleta de comandos / atalhos). */
export function abrirTour() {
  try {
    window.dispatchEvent(new CustomEvent(EVENTO_ABRIR));
  } catch {
    /* ambiente sem window */
  }
}
