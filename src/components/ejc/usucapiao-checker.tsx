'use client';

// Verificador de Usucapião — implementação operacional da regra SE-ENTÃO da base EJC
// Fundamentos literais (LOTE-020): CC arts. 1.238-1.244 (extraordinária, rural, urbana, conjugal,
// ordinária, união de posses), art. 1.208 (tolerância), §§ 4º-5º do art. 1.228 (coletiva extensa)
// e Lei 6.015/73 art. 216-A (via extrajudicial).
// Importante (honestidade EJC): diagnóstico ESTIMATIVO em anos civis — a conferência final é do
// operador do direito, considerando o caso concreto, prova da posse e regulamentação registral.

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, LandPlot, XCircle, CheckCircle2, AlertTriangle, Info, Building2 } from 'lucide-react';

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatar(d: Date) {
  return `${`${d.getDate()}`.padStart(2, '0')}/${`${d.getMonth() + 1}`.padStart(2, '0')}/${d.getFullYear()}`;
}

interface Diagnostico {
  especie: string;
  prazoAnos: number;
  fundamento: string;
  requisitos: string[];
  faltamAnos: number | null;
  via: 'extrajudicial' | 'judicial' | 'ambas';
  viaJustificativa: string;
  bloqueado: { titulo: string; motivo: string } | null;
  registroCancelado?: boolean;
}

export function UsucapiaoChecker() {
  const [tipoImovel, setTipoImovel] = useState<'urbano' | 'rural'>('urbano');
  const [areaM2, setAreaM2] = useState<string>('');
  const [dataInicioPosse, setDataInicioPosse] = useState<string>('');
  const [uniaoAntecessores, setUniaoAntecessores] = useState(false);
  const [dataUniao, setDataUniao] = useState<string>('');
  const [moradia, setMoradia] = useState(false);
  const [obraProdutiva, setObraProdutiva] = useState(false);
  const [justoTitulo, setJustoTitulo] = useState(false);
  const [boaFe, setBoaFe] = useState(false);
  const [registroCancelado, setRegistroCancelado] = useState(false);
  const [naoProprietarioOutro, setNaoProprietarioOutro] = useState(false);
  const [exAbandonouLar, setExAbandonouLar] = useState(false);
  const [posseExclusiva, setPosseExclusiva] = useState(false);
  const [meraTolerancia, setMeraTolerancia] = useState(false);
  const [houveOposicao, setHouveOposicao] = useState(false);

  const area = Number(areaM2) || 0;
  const limite = tipoImovel === 'urbano' ? 250 : 50 * 10_000; // m² / 50 ha em m²
  const dentroLimite = area > 0 && area <= limite;

  const anosPosse = useMemo(() => {
    const parse = (iso: string): Date | null => {
      const [y, m, d] = iso.split('-').map(Number);
      if (!y || !m || !d) return null;
      return new Date(y, m - 1, d);
    };
    const inicio = parse(dataInicioPosse);
    if (!inicio) return null;
    const hoje = new Date();
    const hojeNorm = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    let anos = (hojeNorm.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (uniaoAntecessores) {
      const uniao = parse(dataUniao);
      if (uniao && uniao.getTime() < inicio.getTime()) {
        anos += (inicio.getTime() - uniao.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      }
    }
    return anos;
  }, [dataInicioPosse, dataUniao, uniaoAntecessores]);

  const diagnostico: Diagnostico | null = useMemo(() => {
    if (anosPosse === null || area <= 0) return null;

    // Red flags — CC art. 1.208 e posse contestada
    if (meraTolerancia) {
      return {
        especie: 'NÃO há usucapião (posse de mera tolerância)',
        prazoAnos: 0,
        fundamento: 'CC art. 1.208: não induzem posse os atos de mera permissão ou tolerância',
        requisitos: [],
        faltamAnos: null,
        via: 'judicial',
        viaJustificativa: 'Sem usucapião, avaliar direito real/obrigacional subjacente (aluguel, comodato) ou via possessória se houver turbação/esbulho.',
        bloqueado: { titulo: 'Mera tolerância', motivo: 'A posso derivada de permissão/tolerância do proprietário NÃO qualifica para usucapião, ainda que longa.' },
      };
    }
    if (houveOposicao) {
      return {
        especie: 'Prazo POSSIVELMENTE interrompido por oposição',
        prazoAnos: 0,
        fundamento: 'CC arts. 1.238/1.242 ("sem oposição") e 1.244 (causas da prescrição aplicáveis)',
        requisitos: [],
        faltamAnos: null,
        via: 'judicial',
        viaJustificativa: 'Oposição judicial ou extrajudicial pode quebrar a continuidade/incontestabilidade da posse — analisar a natureza do ato e recomeçar a contagem conforme o caso.',
        bloqueado: { titulo: 'Oposição à posse', motivo: 'Documentar a data e a natureza da oposição: alguns atos interrompem, outros não — avaliação casuística.' },
      };
    }

    // Conjugal — CC art. 1.240-A
    if (exAbandonouLar && posseExclusiva && tipoImovel === 'urbano' && dentroLimite && naoProprietarioOutro) {
      return fechar('Usucapião ESPECIAL CONJUGAL', 2, 'CC art. 1.240-A (Lei 12.424/2011) — imóvel urbano ≤ 250 m², posse direta e exclusiva, ex-cônjuge/companheiro que abandonou o lar', ['2 anos ininterruptos e sem oposição', 'posse direta com exclusividade', 'imóvel urbano ≤ 250 m²', 'propriedade dividida com ex-cônjuge/ex-companheiro que abandonou o lar', 'moradia própria ou da família', 'não ser proprietário de outro imóvel (urbano ou rural)'], false);
    }
    // Especial urbana — CC art. 1.240
    if (tipoImovel === 'urbano' && dentroLimite && moradia && naoProprietarioOutro) {
      return fechar('Usucapião ESPECIAL URBANA', 5, 'CC art. 1.240 — área urbana ≤ 250 m², moradia, não proprietário de outro imóvel', ['5 anos ininterruptos e sem oposição', 'área urbana ≤ 250 m²', 'moradia própria ou da família', 'não ser proprietário de outro imóvel urbano ou rural'], false);
    }
    // Especial rural — CC art. 1.239
    if (tipoImovel === 'rural' && dentroLimite && moradia && obraProdutiva && naoProprietarioOutro) {
      return fechar('Usucapião ESPECIAL RURAL', 5, 'CC art. 1.239 — área rural ≤ 50 hectares, produtiva, moradia, não proprietário de imóvel rural ou urbano', ['5 anos ininterruptos e sem oposição', 'área rural ≤ 50 hectares', 'produtividade por trabalho próprio ou da família', 'moradia no imóvel', 'não ser proprietário de imóvel rural ou urbano'], false);
    }
    // Ordinária — CC art. 1.242
    if (justoTitulo && boaFe) {
      const base = registroCancelado && (moradia || obraProdutiva) ? 5 : 10;
      return fechar(
        registroCancelado && (moradia || obraProdutiva) ? 'Usucapião ORDINÁRIA (prazo curto — registro cancelado)' : 'Usucapião ORDINÁRIA',
        base,
        base === 5 ? 'CC art. 1.242 p.ú. — aquisição onerosa com base em registro cancelado + moradia ou investimentos' : 'CC art. 1.242 — justo título e boa-fé, posse contínua e incontestada',
        base === 5
          ? ['5 anos com aquisição onerosa com base no registro cartorial, cancelado posteriormente', 'moradia estabelecida OU investimentos de interesse social e econômico', 'posse contínua e incontestada']
          : ['10 anos com justo título e boa-fé', 'posse contínua e incontestada'],
        false,
      );
    }
    // Extraordinária — CC art. 1.238
    const baseExtra = moradia || obraProdutiva ? 10 : 15;
    return fechar(
      moradia || obraProdutiva ? 'Usucapião EXTRAORDINÁRIA (prazo reduzido)' : 'Usucapião EXTRAORDINÁRIA',
      baseExtra,
      baseExtra === 10 ? 'CC art. 1.238 p.ú. — moradia habitual ou obra/serviço de caráter produtivo' : 'CC art. 1.238 caput — 15 anos, independentemente de título e boa-fé',
      baseExtra === 10
        ? ['10 anos (redução por moradia habitual ou obra/serviço produtivo)', 'posse "como seu", sem interrupção nem oposição', 'título e boa-fé NÃO exigidos']
        : ['15 anos de posse "como seu", sem interrupção nem oposição', 'título e boa-fé NÃO exigidos'],
      false,
    );

    function fechar(especie: string, prazoAnos: number, fundamento: string, requisitos: string[], registroCanceladoFlag: boolean): Diagnostico {
      const faltamAnos = anosPosse === null ? null : Math.max(0, prazoAnos - anosPosse);
      const consumado = faltamAnos !== null && faltamAnos < 1 / 365;
      const semOposicaoDocumentada = true; // oposição já tratada acima
      const viaExtrajudicialViavel = consumado && semOposicaoDocumentada;
      return {
        especie,
        prazoAnos,
        fundamento,
        requisitos,
        faltamAnos,
        via: viaExtrajudicialViavel ? 'ambas' : 'judicial',
        viaJustificativa: viaExtrajudicialViavel
          ? 'Prazo consumado e sem oposição: via extrajudicial cabível (Lei 6.015, art. 216-A — ata notarial, planta+ART, certidões, impostos; notificações de 15 dias) OU ação judicial (procedimento comum + citação pessoal dos confinantes e edital).'
          : 'Prazo ainda não consumado ou situação litigiosa: via judicial com prova robusta; extrajudicial somente quando consumado o prazo e documentada a posse.',
        bloqueado: null,
        registroCancelado: registroCanceladoFlag,
      };
    }
  }, [anosPosse, area, tipoImovel, dentroLimite, moradia, obraProdutiva, justoTitulo, boaFe, registroCancelado, naoProprietarioOutro, exAbandonouLar, posseExclusiva, meraTolerancia, houveOposicao]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Home className="size-4 text-amber-600" /> Verificador de usucapião
        </CardTitle>
        <CardDescription>
          Diagnóstico por espécie e prazo literais do CC arts. 1.238-1.244 e via extrajudicial da Lei 6.015, art. 216-A (LOTE-020). Estimativa — a conferência final é do operador do direito.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="usu-tipo">Natureza do imóvel</Label>
            <Select value={tipoImovel} onValueChange={(v) => setTipoImovel(v as 'urbano' | 'rural')}>
              <SelectTrigger id="usu-tipo" aria-label="Natureza do imóvel"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="urbano"><span className="flex items-center gap-2"><Building2 className="size-3.5" /> Urbano</span></SelectItem>
                <SelectItem value="rural"><span className="flex items-center gap-2"><LandPlot className="size-3.5" /> Rural</span></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="usu-area">Área (m²){tipoImovel === 'rural' ? ' — 50 ha = 500.000 m²' : ''}</Label>
            <Input id="usu-area" type="number" min={1} placeholder={tipoImovel === 'urbano' ? 'ex.: 180' : 'ex.: 40000'} value={areaM2} onChange={(e) => setAreaM2(e.target.value)} />
            {area > 0 && (
              <p className={`text-[11px] ${dentroLimite ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {dentroLimite ? `Dentro do limite da espécie especial (${tipoImovel === 'urbano' ? '≤ 250 m²' : '≤ 50 ha'})` : `Acima do limite da espécie especial (${tipoImovel === 'urbano' ? '250 m²' : '50 ha'}) — restam a extraordinária (15/10) e a ordinária`}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="usu-inicio">Início da posse</Label>
            <Input id="usu-inicio" type="date" value={dataInicioPosse} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDataInicioPosse(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { id: 'uniao', label: 'Unir posse de antecessores (CC 1.243)', checked: uniaoAntecessores, set: setUniaoAntecessores },
            { id: 'moradia', label: 'Moradia habitual (própria/família)', checked: moradia, set: setMoradia },
            { id: 'obra', label: 'Obra/serviço produtivo', checked: obraProdutiva, set: setObraProdutiva },
            { id: 'justo', label: 'Justo título (contrato etc.)', checked: justoTitulo, set: setJustoTitulo },
            { id: 'boafe', label: 'Boa-fé (ignorava o vício)', checked: boaFe, set: setBoaFe },
            { id: 'registro', label: 'Registro cartorial cancelado depois', checked: registroCancelado, set: setRegistroCancelado },
            { id: 'nao-prop', label: 'NÃO é proprietário de outro imóvel', checked: naoProprietarioOutro, set: setNaoProprietarioOutro },
            { id: 'ex-lar', label: 'Ex-cônjuge/companheiro abandonou o lar', checked: exAbandonouLar, set: setExAbandonouLar },
            { id: 'exclusiva', label: 'Posse direta e exclusiva', checked: posseExclusiva, set: setPosseExclusiva },
            { id: 'tolerancia', label: 'Posse vem de mera tolerância/permissão', checked: meraTolerancia, set: setMeraTolerancia },
            { id: 'oposicao', label: 'Houve oposição à posse (ação/notificação)', checked: houveOposicao, set: setHouveOposicao },
          ].map((c) => (
            <label key={c.id} htmlFor={`usu-${c.id}`} className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/40">
              <Checkbox id={`usu-${c.id}`} checked={c.checked} onCheckedChange={(v) => c.set(v === true)} />
              <span className="min-w-0">{c.label}</span>
            </label>
          ))}
        </div>

        {uniaoAntecessores && (
          <div className="max-w-xs space-y-1.5">
            <Label htmlFor="usu-uniao">Posse do antecessor começou em</Label>
            <Input id="usu-uniao" type="date" value={dataUniao} onChange={(e) => setDataUniao(e.target.value)} />
            <p className="text-[11px] text-muted-foreground">A união de posses soma antecessores com posse contínua e pacífica (e, na ordinária, com justo título e boa-fé — art. 1.243).</p>
          </div>
        )}

        {diagnostico && (
          <div className="space-y-3">
            <div className={`flex items-start gap-3 rounded-lg border p-3 ${diagnostico.bloqueado ? 'border-red-500/30 bg-red-500/5' : diagnostico.faltamAnos !== null && diagnostico.faltamAnos <= 0 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
              {diagnostico.bloqueado
                ? <XCircle className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden />
                : diagnostico.faltamAnos !== null && diagnostico.faltamAnos <= 0
                  ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  : <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-500" aria-hidden />}
              <div className="min-w-0 space-y-1">
                <p className={`text-sm font-semibold ${diagnostico.bloqueado ? 'text-red-700 dark:text-red-400' : diagnostico.faltamAnos !== null && diagnostico.faltamAnos <= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-500'}`}>
                  {diagnostico.especie}
                </p>
                {!diagnostico.bloqueado && diagnostico.faltamAnos !== null && (
                  <p className="text-xs">
                    {diagnostico.faltamAnos <= 0
                      ? `Prazo de ${diagnostico.prazoAnos} ano(s) CONSUMADO com ${anosPosse.toFixed(1)} anos de posse${uniaoAntecessores ? ' (com união de posses)' : ''}. Sentença/pedido = título para o registro.`
                      : `Faltam ~${diagnostico.faltamAnos.toFixed(1)} ano(s) dos ${diagnostico.prazoAnos} exigidos (posse atual: ${anosPosse.toFixed(1)} ano(s)).`}
                  </p>
                )}
                {diagnostico.bloqueado && (
                  <p className="text-xs">{diagnostico.bloqueado.motivo}</p>
                )}
                <p className="text-xs text-muted-foreground">Fundamento: {diagnostico.fundamento}.</p>
              </div>
            </div>

            {!diagnostico.bloqueado && (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {diagnostico.requisitos.map((r) => (
                    <Badge key={r} variant="outline" className="text-[11px] font-normal">{r}</Badge>
                  ))}
                </div>
                <div className={`rounded-lg border p-3 text-xs leading-relaxed ${diagnostico.via === 'ambas' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-muted/30'}`}>
                  <p className="mb-1 flex items-center gap-1.5 font-semibold"><Info className="size-3.5 shrink-0 text-amber-600" aria-hidden /> Via recomendada: {diagnostico.via === 'ambas' ? 'EXTRAJUDICIAL OU JUDICIAL' : 'JUDICIAL'}</p>
                  <p className="text-muted-foreground">{diagnostico.viaJustificativa}</p>
                </div>
              </>
            )}
          </div>
        )}

        <div className="space-y-2 rounded-lg border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
          <p className="flex items-start gap-2"><AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" aria-hidden /> O edital e a citação PESSOAL dos confinantes são obrigatórios na via judicial (CPC arts. 259 I e 235 § 3º — unidade autônoma de condomínio dispensa a citação dos confinantes).</p>
          <p className="flex items-start gap-2"><Info className="mt-0.5 size-3.5 shrink-0 text-amber-600" aria-hidden /> Via extrajudicial (Lei 6.015, art. 216-A): ata notarial + planta/memorial com ART + certidões negativas + impostos; notificações de 15 dias — silêncio = CONCORDÂNCIA na redação vigente (Lei 13.465/2017; a redação original de 2015 dizia discordância). Rejeição não impede a ação (§ 9º); impugnação justificada desloca ao juízo (§ 10).</p>
          <p className="flex items-start gap-2"><Info className="mt-0.5 size-3.5 shrink-0 text-amber-600" aria-hidden /> O CPC/2015 não tem rito especial de usucapião — a via judicial segue o procedimento comum, com sentença servindo de título para o registro (CC arts. 1.238 in fine e 1.241 p.ú.).</p>
          <p className="flex items-start gap-2"><Info className="mt-0.5 size-3.5 shrink-0 text-amber-600" aria-hidden /> Usucapião coletiva extensa (CC art. 1.228 §§ 4º-5º): extensa área, posse de boa-fé por mais de 5 anos de número considerável de pessoas com obras/serviços de interesse social — justa indenização ao proprietário. Valide cada caso concreto — este verificador é referência didática ancorada no texto literal (consulta 2026-08-30).</p>
        </div>
      </CardContent>
    </Card>
  );
}
