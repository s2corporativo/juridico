'use client';

// Verificador de Prescrição Civil — implementação operacional das regras SE-ENTÃO da base EJC
// Fundamentos literais (LOTE-018): CC arts. 189 (termo inicial), 205 (10 anos), 206 (especiais),
// 197-202 (não-fluência e interrupção), 206-A (intercorrente); CDC art. 27 (reparação 3 anos).
// Importante (honestidade EJC): cálculo ESTIMATIVO em dias corridos — a conferência final é do
// operador do direito, considerando o caso concreto, leis especiais e decisões aplicáveis.

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hourglass, CalendarClock, XCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface Pretensao {
  id: string;
  nome: string;
  anos: number;
  fundamento: string;
  termoInicial: string;
  fonte: string;
}

const PRETENSOES: Pretensao[] = [
  { id: 'reparacao-civil', nome: 'Reparação civil (não-consumidor)', anos: 3, fundamento: 'CC art. 206 § 3º V', termoInicial: 'Violação do direito (art. 189) — ato/dano', fonte: 'Código Civil (Planalto, 2026-08-30)' },
  { id: 'enriquecimento', nome: 'Ressarcimento de enriquecimento sem causa', anos: 3, fundamento: 'CC art. 206 § 3º IV', termoInicial: 'Violação do direito (art. 189)', fonte: 'Código Civil (Planalto, 2026-08-30)' },
  { id: 'alugueis', nome: 'Aluguéis de prédios urbanos/rústicos', anos: 3, fundamento: 'CC art. 206 § 3º I', termoInicial: 'Violação (inadimplemento de cada aluguel)', fonte: 'Código Civil (Planalto, 2026-08-30)' },
  { id: 'juros-dividendos', nome: 'Juros, dividendos e prestações acessórias (períodos ≤ 1 ano)', anos: 3, fundamento: 'CC art. 206 § 3º III', termoInicial: 'Vencimento de cada prestação', fonte: 'Código Civil (Planalto, 2026-08-30)' },
  { id: 'titulo-credito', nome: 'Título de crédito (salvo lei especial)', anos: 3, fundamento: 'CC art. 206 § 3º VIII', termoInicial: 'Vencimento do título', fonte: 'Código Civil (Planalto, 2026-08-30)' },
  { id: 'alimentos', nome: 'Prestações alimentares vencidas', anos: 2, fundamento: 'CC art. 206 § 2º', termoInicial: 'Vencimento de cada prestação', fonte: 'Código Civil (Planalto, 2026-08-30)' },
  { id: 'divida-liquida', nome: 'Cobrança de dívida líquida (instrumento público/particular)', anos: 5, fundamento: 'CC art. 206 § 5º I', termoInicial: 'Violação (inadimplemento)', fonte: 'Código Civil (Planalto, 2026-08-30)' },
  { id: 'honorarios-liberais', nome: 'Honorários de profissionais liberais, procuradores, curadores e professores', anos: 5, fundamento: 'CC art. 206 § 5º II', termoInicial: 'Conclusão dos serviços / cessação do contrato ou mandato', fonte: 'Código Civil (Planalto, 2026-08-30)' },
  { id: 'hospedagem', nome: 'Hospedagem/víveres consumidos no estabelecimento', anos: 1, fundamento: 'CC art. 206 § 1º I', termoInicial: 'Violação', fonte: 'Código Civil (Planalto, 2026-08-30)' },
  { id: 'tutela', nome: 'Pretensão relativa à tutela', anos: 4, fundamento: 'CC art. 206 § 4º', termoInicial: 'Aprovação das contas', fonte: 'Código Civil (Planalto, 2026-08-30)' },
  { id: 'geral', nome: 'Pretensão SEM prazo especial (residual)', anos: 10, fundamento: 'CC art. 205', termoInicial: 'Violação do direito (art. 189)', fonte: 'Código Civil (Planalto, 2026-08-30)' },
];

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function toISO(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dd}`;
}

export function PrescricaoChecker() {
  const [pretensaoId, setPretensaoId] = useState<string>('reparacao-civil');
  const [dataFato, setDataFato] = useState<string>('');
  const [houveInterrupcao, setHouveInterrupcao] = useState(false);

  const pretensao = PRETENSOES.find((p) => p.id === pretensaoId) ?? PRETENSOES[0];

  const resultado = useMemo(() => {
    if (!dataFato) return null;
    const [y, m, d] = dataFato.split('-').map(Number);
    if (!y || !m || !d) return null;
    const base = new Date(y, m - 1, d);
    const fim = new Date(y + pretensao.anos, m - 1, d);
    // Contagem civil em dias corridos (EJC usa o aniversário do fato como referência prática)
    const hoje = new Date();
    const hojeNorm = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimNorm = new Date(fim.getFullYear(), fim.getMonth(), fim.getDate());
    const restantesMs = fimNorm.getTime() - hojeNorm.getTime();
    const restantes = Math.ceil(restantesMs / (1000 * 60 * 60 * 24));
    const decorridos = pretensao.anos * 365 - restantes; // aproximação honesta para percentual
    const pct = Math.max(0, Math.min(100, Math.round((decorridos / (pretensao.anos * 365)) * 100)));
    const expirado = restantes < 0;
    return { fim, restantes, pct, expirado };
  }, [dataFato, pretensao]);

  const formatar = (d: Date) => `${`${d.getDate()}`.padStart(2, '0')}/${`${d.getMonth() + 1}`.padStart(2, '0')}/${d.getFullYear()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Hourglass className="size-4 text-amber-600" /> Verificador de prescrição civil
        </CardTitle>
        <CardDescription>
          Prazos literais do CC arts. 205-206 (LOTE-018). Estimativa em dias corridos — a conferência final é do operador do direito.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="presc-preten">Pretensão</Label>
            <Select value={pretensaoId} onValueChange={setPretensaoId}>
              <SelectTrigger id="presc-preten" aria-label="Tipo de pretensão"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-72">
                {PRETENSOES.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="presc-data">{pretensao.id === 'alimentos' || pretensao.id === 'titulo-credito' ? 'Vencimento da prestação/título' : pretensao.id === 'honorarios-liberais' ? 'Conclusão dos serviços / cessação' : pretensao.id === 'tutela' ? 'Aprovação das contas' : 'Data da violação (fato)'}</Label>
            <Input id="presc-data" type="date" value={dataFato} max={toISO(new Date())} onChange={(e) => setDataFato(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 font-mono text-amber-700 dark:text-amber-400">{pretensao.anos} {pretensao.anos > 1 ? 'anos' : 'ano'}</Badge>
          <Badge variant="outline" className="text-xs">{pretensao.fundamento}</Badge>
        </div>

        {resultado && (
          <div className="space-y-3">
            <div className={`flex items-start gap-3 rounded-lg border p-3 ${resultado.expirado ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
              {resultado.expirado
                ? <XCircle className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden />
                : <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />}
              <div className="min-w-0 space-y-1">
                <p className={`text-sm font-semibold ${resultado.expirado ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                  {resultado.expirado
                    ? `Prazo estimado encerrado em ${formatar(resultado.fim)}`
                    : `Prazo estimado: ${formatar(resultado.fim)} — ${resultado.restantes} dia(s) restante(s)`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Termo inicial: {pretensao.termoInicial}. Fonte: {pretensao.fonte}.
                </p>
              </div>
            </div>

            {!resultado.expirado && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarClock className="size-3" /> tempo decorrido (estimativa)</span>
                  <span className="font-mono">{resultado.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={resultado.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Tempo decorrido do prazo prescricional">
                  <div className={`h-full rounded-full ${resultado.pct > 80 ? 'bg-red-500' : resultado.pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${resultado.pct}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 rounded-lg border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
          <p className="flex items-start gap-2"><AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" aria-hidden /> A interrupção (CC art. 202) só ocorre <strong>uma única vez</strong> e o prazo recomeça por inteiro da data do ato interruptivo ou do último ato do processo{houveInterrupcao ? ' — houve interrupção? recompute a partir da data dela' : ''}.</p>
          <p className="flex items-start gap-2"><Info className="mt-0.5 size-3.5 shrink-0 text-amber-600" aria-hidden /> Não corre a prescrição entre cônjuges, ascendentes/descendentes, tutores e curatelas (art. 197), contra incapazes do art. 3º, ausentes em serviço público e Forças Armadas em guerra (art. 198), pendendo condição suspensiva, prazo não vencido ou evicção (art. 199), nem antes da sentença definitiva criminal quando o fato depender dessa apuração (art. 200).</p>
          <p className="flex items-start gap-2"><Info className="mt-0.5 size-3.5 shrink-0 text-amber-600" aria-hidden /> Relação de consumo? Reparação segue o CDC art. 27 (3 anos) e vícios têm decadência própria (CDC arts. 26-27). Execução parada: CC art. 206-A c/c art. 921 CPC; Execução Fiscal: art. 40 LEF + Tema 390/STF.</p>
          <p className="flex items-start gap-2"><Info className="mt-0.5 size-3.5 shrink-0 text-amber-600" aria-hidden /> Todo prazo deve ser validado à luz do processo concreto, legislação vigente, expediente forense e decisões aplicáveis — este verificador é referência didática ancorada no texto literal (consulta 2026-08-30).</p>
        </div>
      </CardContent>
    </Card>
  );
}
