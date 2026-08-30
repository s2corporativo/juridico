'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarInput } from '@/components/ejc/calendar-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, CalendarClock, CalendarPlus, Calculator, ChevronRight, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AlcadaChecker } from '@/components/ejc/alcada-checker';
import { PrescricaoChecker } from '@/components/ejc/prescricao-checker';
import { UsucapiaoChecker } from '@/components/ejc/usucapiao-checker';
import { DataJudChecker } from '@/components/ejc/datajud-checker';

// ---------------------------------------------------------------------------
// Fundamento do cálculo (conteúdo já validado na base EJC):
// - CPC art. 219 (LOTE-001/LOTE-007): na contagem de prazo em DIAS, exclui-se o
//   dia do começo e inclui-se o do vencimento; § 1º: só contam dias úteis
//   (aplica-se aos prazos processuais). § 2º a 4º: início no 1º dia útil
//   seguinte à publicação/intimação; § 3º: prazos só começam a correr do
//   primeiro dia útil seguinte após a publicação (com regra de feriado da
//   quarta-feira a sábado — ver nota).
// - Prazos em dias CORRIDOS (ex.: administrativos da Lei 9.784/98 art. 66,
//   CDC art. 49) contam-se do dia seguinte, incluindo fins de semana.
// ---------------------------------------------------------------------------

function pascoa(ano: number): Date {
  // Algoritmo de Gauss/Meeus — cálculo calendárico objetivo da Páscoa (gregoriano)
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes - 1, dia);
}

function deslocar(base: Date, dias: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + dias);
}

function mesmaData(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Feriados nacionais FIXOS em lei + pontos de suspensão usuais (móveis, derivados da Páscoa). */
function feriadosNacionais(ano: number, comMoveis: boolean): Set<string> {
  const datas: Date[] = [
    new Date(ano, 0, 1), // Confraternização Universal
    new Date(ano, 3, 21), // Tiradentes
    new Date(ano, 4, 1), // Dia do Trabalho
    new Date(ano, 8, 7), // Independência
    new Date(ano, 9, 12), // N. Sra. Aparecida
    new Date(ano, 10, 2), // Finados
    new Date(ano, 10, 15), // Proclamação da República
    new Date(ano, 10, 20), // Consciência Negra (Lei 14.759/2023)
    new Date(ano, 11, 25), // Natal
  ];
  if (comMoveis) {
    const p = pascoa(ano);
    datas.push(deslocar(p, -48)); // Carnaval (segunda)
    datas.push(deslocar(p, -47)); // Carnaval (terça)
    datas.push(deslocar(p, -2)); // Sexta-feira da Paixão
    datas.push(deslocar(p, 60)); // Corpus Christi
  }
  const ch = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return new Set(datas.map(ch));
}

function ehDiaUtil(d: Date, feriados: Set<string>): boolean {
  const dow = d.getDay();
  if (dow === 0 || dow === 6) return false;
  const ch = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return !feriados.has(ch);
}

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const DIAS_SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatar(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} (${DIAS_SEMANA[d.getDay()]})`;
}

function formatarCurto(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/** Prazos frequentes — todos os fundamentos estão na base EJC (documentos vinculados nas descrições). */
const PRAGOS_RAPIDOS = [
  { label: 'Apelação', dias: 15, tipo: 'uteis' as const, base: 'CPC art. 1.003 § 5º' },
  { label: 'REsp / RE', dias: 15, tipo: 'uteis' as const, base: 'CPC art. 1.003 § 5º' },
  { label: 'Agravo interno', dias: 15, tipo: 'uteis' as const, base: 'CPC art. 1.021 § 2º' },
  { label: 'Embargos de declaração', dias: 5, tipo: 'uteis' as const, base: 'CPC art. 1.023' },
  { label: 'Contrarrazões (recurso)', dias: 15, tipo: 'uteis' as const, base: 'CPC arts. 1.007 e 1.010 § 1º' },
  { label: 'Contestação', dias: 15, tipo: 'uteis' as const, base: 'CPC art. 335' },
  { label: 'Embargos à execução', dias: 15, tipo: 'uteis' as const, base: 'CPC art. 915' },
  { label: 'Defesa auto infração ambiental', dias: 20, tipo: 'corridos' as const, base: 'Decreto 6.514/2008 (prazo adm.)' },
  { label: 'Arrependimento (CDC)', dias: 7, tipo: 'corridos' as const, base: 'CDC art. 49' },
  { label: 'Reparo do vício (fornecedor)', dias: 30, tipo: 'corridos' as const, base: 'CDC art. 18 § 1º' },
  { label: 'Recurso ordinário (CLT)', dias: 8, tipo: 'uteis' as const, base: 'CLT arts. 895 e 775' },
  { label: 'Contrarrazões (CLT)', dias: 8, tipo: 'uteis' as const, base: 'CLT art. 900' },
  { label: 'Verbas rescisórias (empregador)', dias: 10, tipo: 'corridos' as const, base: 'CLT art. 477 § 6º' },
  { label: 'Agravo de instrumento', dias: 15, tipo: 'uteis' as const, base: 'CPC art. 1.003 § 5º' },
  { label: 'Juntada do agravo na origem', dias: 3, tipo: 'uteis' as const, base: 'CPC art. 1.018 § 2º' },
  { label: 'Recurso inominado (JEC)', dias: 10, tipo: 'uteis' as const, base: 'Lei 9.099 art. 42 c/c art. 12-A' },
  { label: 'Resposta ao recurso (JEC)', dias: 10, tipo: 'uteis' as const, base: 'Lei 9.099 art. 42 § 2º' },
  { label: 'Intimação de testemunhas (JEC)', dias: 5, tipo: 'corridos' as const, base: 'Lei 9.099 art. 34 § 1º (antes da audiência)' },
  { label: 'Recall: comunicar investigação', dias: 1, tipo: 'corridos' as const, base: 'Portaria MJSP 618/2019 art. 2º (24 horas)' },
  { label: 'Recall: investigação interna', dias: 10, tipo: 'uteis' as const, base: 'Portaria MJSP 618/2019 art. 2º § 1º' },
  { label: 'Recall: comunicar chamamento', dias: 2, tipo: 'uteis' as const, base: 'Portaria MJSP 618/2019 art. 3º' },
  { label: 'MS: informações da coatora', dias: 10, tipo: 'uteis' as const, base: 'Lei 12.016 art. 7º I' },
  { label: 'MS: caducidade da liminar', dias: 3, tipo: 'uteis' as const, base: 'Lei 12.016 art. 8º (inércia do impetrante)' },
  { label: 'MS: agravo contra suspensão', dias: 5, tipo: 'corridos' as const, base: 'Lei 12.016 art. 15 caput' },
  { label: 'Cumprimento: pagamento voluntário', dias: 15, tipo: 'uteis' as const, base: 'CPC art. 523 caput' },
  { label: 'Cumprimento: impugnação', dias: 15, tipo: 'uteis' as const, base: 'CPC art. 525 caput' },
  { label: 'Alimentos: intimação pessoal', dias: 3, tipo: 'corridos' as const, base: 'CPC art. 528 caput' },
  { label: 'Impugnação à assistência', dias: 15, tipo: 'uteis' as const, base: 'CPC art. 120 caput' },
  { label: 'Citação do denunciado/chamado', dias: 30, tipo: 'corridos' as const, base: 'CPC art. 131 (2 meses se outra comarca)' },
  { label: 'Manifestação no IDPJ', dias: 15, tipo: 'uteis' as const, base: 'CPC art. 135' },
  { label: 'Revogação de doação (ingratidão)', dias: 365, tipo: 'corridos' as const, base: 'CC art. 559 (1 ano do duplo conhecimento)' },
  { label: 'Anulação: doação cônjuge adúltero', dias: 730, tipo: 'corridos' as const, base: 'CC art. 550 (2 anos da dissolução)' },
  { label: 'Entidade futura: constituição', dias: 730, tipo: 'corridos' as const, base: 'CC art. 554 (2 anos — caducidade)' },
  { label: 'Usucapião 216-A: notificações/edital', dias: 15, tipo: 'corridos' as const, base: 'Lei 6.015 art. 216-A §§ 2º-4º (titulares, entes, terceiros)' },
  { label: 'Possessória: citação pelo autor', dias: 5, tipo: 'uteis' as const, base: 'CPC art. 564 (contestação do réu: 15 dias)' },
];

export function ToolsTab() {
  const hoje = useMemo(() => new Date(), []);
  const [dataBase, setDataBase] = useState<string>(toISO(hoje));
  const [dias, setDias] = useState<string>('15');
  const [tipo, setTipo] = useState<'uteis' | 'corridos'>('uteis');
  const [comMoveis, setComMoveis] = useState(true);
  const [direcao, setDirecao] = useState<'futuro' | 'retro'>('futuro');

  const resultado = useMemo(() => {
    if (!dataBase || !dias || Number.isNaN(Number(dias)) || Number(dias) <= 0) return null;
    const [y, m, d] = dataBase.split('-').map(Number);
    if (!y || !m || !d) return null;
    const base = new Date(y, m - 1, d);
    const n = Number(dias);
    const anos = [base.getFullYear(), base.getFullYear() + 1, base.getFullYear() - 1];
    const feriados = new Set<string>();
    for (const a of anos) for (const f of feriadosNacionais(a, comMoveis)) feriados.add(f);

    if (tipo === 'corridos') {
      const fim = deslocar(base, direcao === 'futuro' ? n : -n);
      return { fim, diasCorridos: n, diasUteisEnvolvidos: null, observacao: null };
    }
    // Dias úteis: contagem inicia no 1º dia seguinte à data-base; para prazo futuro
    // processual (publicação/intimação), se a data-base cair em dia não útil ou
    // entre quarta e sábado (regra do art. 219 § 3º), a contagem só começa no 1º
    // dia útil seguinte — aqui aplicamos a regra básica: começar no primeiro dia
    // útil após a data-base.
    let contador = 0;
    let cursor = base;
    let inicio: Date | null = null;
    const passo = direcao === 'futuro' ? 1 : -1;
    while (contador < n) {
      cursor = deslocar(cursor, passo);
      if (ehDiaUtil(cursor, feriados)) {
        if (!inicio) inicio = cursor;
        contador++;
      }
    }
    return { fim: cursor, diasCorridos: null, diasUteisEnvolvidos: n, inicio, observacao: null };
  }, [dataBase, dias, tipo, comMoveis, direcao]);

  const feriadosProximos = useMemo(() => {
    const lista: { data: Date; nome: string }[] = [];
    for (const ano of [hoje.getFullYear(), hoje.getFullYear() + 1]) {
      const p = pascoa(ano);
      lista.push(
        { data: new Date(ano, 0, 1), nome: 'Confraternização Universal' },
        { data: deslocar(p, -48), nome: 'Carnaval (segunda)' },
        { data: deslocar(p, -47), nome: 'Carnaval (terça)' },
        { data: new Date(ano, 3, 21), nome: 'Tiradentes' },
        { data: new Date(ano, 4, 1), nome: 'Dia do Trabalho' },
        { data: deslocar(p, -2), nome: 'Sexta-feira da Paixão' },
        { data: deslocar(p, 60), nome: 'Corpus Christi' },
        { data: new Date(ano, 8, 7), nome: 'Independência' },
        { data: new Date(ano, 9, 12), nome: 'N. Sra. Aparecida' },
        { data: new Date(ano, 10, 2), nome: 'Finados' },
        { data: new Date(ano, 10, 15), nome: 'Proclamação da República' },
        { data: new Date(ano, 10, 20), nome: 'Consciência Negra' },
        { data: new Date(ano, 11, 25), nome: 'Natal' },
      );
    }
    return lista.filter((f) => f.data >= hoje).sort((a, b) => a.data.getTime() - b.data.getTime()).slice(0, 6);
  }, [hoje]);

  const aplicarPrazo = (dias: number, t: 'uteis' | 'corridos') => {
    setDias(String(dias));
    setTipo(t);
  };

  // Exporta o vencimento calculado como evento .ics (iCalendar) — integração com calendários externos
  const exportarIcs = () => {
    if (!resultado) return;
    const dt = resultado.fim;
    const stamp = (x: Date) => `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, '0')}${String(x.getDate()).padStart(2, '0')}`;
    const uid = `ejc-${stamp(new Date())}-${Math.random().toString(36).slice(2, 8)}@ejc-local`;
    const resumo = `Vencimento: ${Number(dias)} dias ${tipo === 'uteis' ? 'úteis' : 'corridos'} (EJC)`;
    const desc = `Calculado pelo EJC a partir de ${formatarCurto(new Date(dataBase + 'T12:00:00'))} (${direcao === 'futuro' ? 'futuro' : 'retroativo'}). Fundamentos na base EJC (CPC art. 219 / CLT arts. 775 e 477). Feriados forenses locais não inclusos.`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EJC Ecossistema Juridico Clovis//PT-BR',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stamp(new Date())}T000000Z`,
      `DTSTART;VALUE=DATE:${stamp(dt)}`,
      `SUMMARY:${resumo}`,
      `DESCRIPTION:${desc}`,
      'BEGIN:VALARM',
      'TRIGGER:-P2D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Lembrete EJC: prazo a vencer em 2 dias',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ejc-prazo-${stamp(dt)}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Evento .ics baixado', description: 'Abra o arquivo para adicionar ao calendário (Google, Outlook, Apple).' });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Calculadora */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Calculator className="size-4 text-amber-600" /> Calculadora de prazos</CardTitle>
            <CardDescription>
              Prazos em dias úteis (CPC art. 219 § 1º): fins de semana e feriados não contam e a contagem inicia no 1º dia útil seguinte à publicação/intimação. Prazos em dias corridos contam do dia seguinte, todos os dias.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="prazo-data">Data-base (publicação / intimação / evento)</Label>
                <CalendarInput id="prazo-data" value={dataBase} onChange={setDataBase} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prazo-dias">Quantidade de dias</Label>
                <Input id="prazo-dias" type="number" min={1} value={dias} onChange={(e) => setDias(e.target.value)} placeholder="Ex.: 15" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg border p-0.5" role="group" aria-label="Tipo de contagem">
                {(['uteis', 'corridos'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipo(t)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${tipo === t ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-pressed={tipo === t}
                  >
                    {t === 'uteis' ? 'Dias úteis (processual)' : 'Dias corridos'}
                  </button>
                ))}
              </div>
              <div className="inline-flex rounded-lg border p-0.5" role="group" aria-label="Direção da contagem">
                {(['futuro', 'retro'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDirecao(d)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${direcao === d ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-pressed={direcao === d}
                  >
                    {d === 'futuro' ? 'Vencimento futuro' : 'Retroagir'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
              <Switch checked={comMoveis} onCheckedChange={setComMoveis} aria-label="Considerar recessos móveis" className="mt-0.5" />
              <div>
                <Label className="text-xs font-medium">Considerar recessos usuais (Carnaval, Sexta-feira da Paixão, Corpus Christi)</Label>
                <p className="text-[11px] text-muted-foreground">Feriados nacionais fixos em lei (incl. Consciência Negra — Lei 14.759/2023) são sempre considerados. Feriados forenses locais NÃO estão inclusos — confira o calendário da comarca.</p>
              </div>
            </div>

            {resultado && (
              <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><CalendarClock className="size-3.5 text-amber-600" /> {tipo === 'uteis' ? (direcao === 'futuro' ? 'Vencimento (dias úteis)' : 'Data retroativa (dias úteis)') : (direcao === 'futuro' ? 'Vencimento (dias corridos)' : 'Data retroativa (dias corridos)')}</p>
                <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-400">{formatar(resultado.fim)}</p>
                {tipo === 'uteis' && resultado.inicio && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Início da contagem no 1º dia útil seguinte: <span className="font-medium text-foreground">{formatarCurto(resultado.inicio)}</span>
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[10px]">{Number(dias)} dias {tipo === 'uteis' ? 'úteis' : 'corridos'}</Badge>
                  {tipo === 'corridos' && Number(dias) >= 1 && (
                    <Badge variant="outline" className="text-[10px]">
                      ≈ {Math.max(1, Math.round((Number(dias) * 5) / 7))} dias úteis equivalentes
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 h-8 gap-1.5 border-amber-500/40 text-xs text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
                  onClick={exportarIcs}
                  aria-label="Baixar evento para calendário (.ics)"
                >
                  <CalendarPlus className="size-3.5" /> Adicionar ao calendário (.ics)
                </Button>
              </div>
            )}
            <div className="flex items-start gap-2 rounded-lg border border-orange-500/30 bg-orange-500/5 p-3 text-xs text-orange-700 dark:text-orange-400">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              <p>Ferramenta de APOIO estimativo: não substitui a verificação do processo concreto, das regras locais (feriados forenses, horário de fechamento de portais) e de eventuais suspensões de prazos (ex.: recesso do art. 220 CPC).</p>
            </div>
          </CardContent>
        </Card>

        {/* Prazos rápidos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><ChevronRight className="size-4 text-amber-600" /> Prazos frequentes da base</CardTitle>
            <CardDescription>Clique para preencher a calculadora. Todos com fundamento registrado na base EJC.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="scrollbar-thin max-h-[440px] space-y-1.5 overflow-y-auto pr-1">
            {PRAGOS_RAPIDOS.map((p) => (
              <button
                key={p.label}
                onClick={() => aplicarPrazo(p.dias, p.tipo)}
                className="flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors hover:border-amber-500/40 hover:bg-amber-500/5"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{p.label}</span>
                  <span className="block truncate text-[10px] text-muted-foreground">{p.base}</span>
                </span>
                <Badge variant="outline" className={`shrink-0 text-[10px] ${p.tipo === 'uteis' ? 'border-amber-500/40 text-amber-700 dark:text-amber-400' : ''}`}>
                  {p.dias} dias {p.tipo === 'uteis' ? 'úteis' : 'corridos'}
                </Badge>
              </button>
            ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verificador de alçada dos Juizados (LOTE-012) */}
      <AlcadaChecker />

      {/* Verificador de prescrição civil (LOTE-018) */}
      <PrescricaoChecker />

      {/* Verificador de usucapião (LOTE-020) */}
      <UsucapiaoChecker />

      {/* Consulta processual pública DataJud/CNJ (foco MG) */}
      <DataJudChecker />

      {/* Feriados próximos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Info className="size-4 text-amber-600" /> Feriados e recessos próximos (nacionais)</CardTitle>
          <CardDescription>Lista gerada do calendário legal vigente (fixos) e dos móveis derivados da Páscoa, quando habilitados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {feriadosProximos.map((f) => (
              <div key={f.nome + formatarCurto(f.data)} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
                <span className="truncate text-sm">{f.nome}</span>
                <Badge variant="outline" className="shrink-0 font-mono text-[10px]">{formatarCurto(f.data)} · {MESES[f.data.getMonth()]}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
