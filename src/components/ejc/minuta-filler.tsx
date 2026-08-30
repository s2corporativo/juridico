'use client';

// EJC — Preencher minuta: transforma modelos com {{VARIAVEL}} em documentos preenchidos,
// com formulário por variável, pré-visualização, cópia e download (.txt/.md).
// Regra de integridade: impede exportação enquanto houver variável vazia (proibido inventar fatos).

import { useMemo, useState } from 'react';
import { AlertTriangle, Check, ClipboardCopy, Download, FileSignature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Markdown } from '@/components/ejc/markdown';
import { useToast } from '@/hooks/use-toast';

const VAR_RE = /\{\{([A-Z0-9_· -]+)\}\}/g;

export function extrairVariaveis(conteudo: string): string[] {
  const ordem: string[] = [];
  for (const m of conteudo.matchAll(VAR_RE)) {
    const v = m[1].trim();
    if (!ordem.includes(v)) ordem.push(v);
  }
  return ordem;
}

interface MinutaFillerProps {
  aberto: boolean;
  onOpenChange: (o: boolean) => void;
  titulo: string;
  conteudo: string;
}

export function MinutaFiller({ aberto, onOpenChange, titulo, conteudo }: MinutaFillerProps) {
  const { toast } = useToast();
  const variaveis = useMemo(() => extrairVariaveis(conteudo), [conteudo]);
  // Estado inicial limpo: o componente é remontado via key a cada abertura (sem setState em efeito)
  const [valores, setValores] = useState<Record<string, string>>({});
  const [copiado, setCopiado] = useState(false);
  void aberto;

  const preenchidas = variaveis.filter((v) => (valores[v] ?? '').trim().length > 0).length;
  const restantes = variaveis.length - preenchidas;

  const preenchido = useMemo(() => {
    let saida = conteudo;
    for (const [k, v] of Object.entries(valores)) {
      if (!v.trim()) continue;
      saida = saida.split(`{{${k}}}`).join(v.trim());
    }
    return saida;
  }, [conteudo, valores]);

  const copiar = async () => {
    if (restantes > 0) return;
    try {
      await navigator.clipboard.writeText(preenchido);
      setCopiado(true);
      toast({ title: 'Minuta copiada', description: 'Revise todas as variáveis antes do uso profissional.' });
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      toast({ title: 'Não foi possível copiar', description: 'Use o botão de download como alternativa.', variant: 'destructive' });
    }
  };

  const baixar = () => {
    if (restantes > 0) return;
    const blob = new Blob([preenchido], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minuta-${titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Download iniciado', description: 'Arquivo .md com a minuta preenchida.' });
  };

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b bg-gradient-to-r from-muted/60 to-amber-500/[0.06] px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileSignature className="size-4 text-amber-600" />
            Preencher minuta
          </DialogTitle>
          <DialogDescription className="text-xs">
            {titulo}
          </DialogDescription>
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <Badge variant="outline" className="text-[10px]">{variaveis.length} variáveis</Badge>
            <Badge variant="outline" className={`text-[10px] ${restantes === 0 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
              {restantes === 0 ? 'pronta para exportar' : `${restantes} pendentes`}
            </Badge>
            <Badge variant="outline" className="text-[10px]">dados do caso — nada é inventado</Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="formulario" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b px-5 pt-3">
            <TabsList className="h-8">
              <TabsTrigger value="formulario" className="h-6 text-xs">Formulário</TabsTrigger>
              <TabsTrigger value="preview" className="h-6 text-xs">Pré-visualização</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="formulario" className="min-h-0 flex-1 px-0 data-[state=inactive]:hidden">
            <ScrollArea className="max-h-[calc(88vh-220px)]">
              <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
                {variaveis.length === 0 && (
                  <p className="text-sm text-muted-foreground sm:col-span-2">Este modelo não possui variáveis <code className="rounded bg-muted px-1 py-0.5 text-[11px]">{`{{ }}`}</code>.</p>
                )}
                {variaveis.map((v) => (
                    <div key={v} className="grid gap-1.5">
                      <Label htmlFor={`var-${v}`} className="flex items-center gap-1.5 font-mono text-[11px]">
                        {v}
                        {(valores[v] ?? '').trim() && <Check className="size-3 text-emerald-600" aria-label="preenchida" />}
                      </Label>
                      {/narrativa|fatos|descricao|fundament|raciocinio|hipotese|justific|riscos|observ|pedido|indicacao/i.test(v) ? (
                        <Textarea
                          id={`var-${v}`}
                          rows={3}
                          value={valores[v] ?? ''}
                          onChange={(e) => setValores((s) => ({ ...s, [v]: e.target.value }))}
                          placeholder="Somente com fatos reais e documentos do dossiê"
                          className="text-xs"
                        />
                      ) : (
                        <Input
                          id={`var-${v}`}
                          value={valores[v] ?? ''}
                          onChange={(e) => setValores((s) => ({ ...s, [v]: e.target.value }))}
                          placeholder="preencher"
                          className="h-8 text-xs"
                          autoComplete="off"
                        />
                      )}
                    </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview" className="min-h-0 flex-1 px-0 data-[state=inactive]:hidden">
            <ScrollArea className="max-h-[calc(88vh-220px)]">
              <div className="px-5 py-4 text-sm">
                <Markdown>{restantes === 0 ? preenchido : preenchido}</Markdown>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />
        <div className="flex flex-col gap-2 bg-muted/30 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          {restantes > 0 ? (
            <p className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-3.5" /> Preencha todas as variáveis antes de copiar ou baixar.
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
              <Check className="size-3.5" /> Todas as variáveis preenchidas — confira antes de protocolar.
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled={restantes > 0} onClick={copiar} aria-label="Copiar minuta preenchida">
              {copiado ? <Check className="size-3.5 text-emerald-600" /> : <ClipboardCopy className="size-3.5" />} copiar
            </Button>
            <Button size="sm" className="h-8 text-xs" disabled={restantes > 0} onClick={baixar} aria-label="Baixar minuta preenchida">
              <Download className="size-3.5" /> baixar .md
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
