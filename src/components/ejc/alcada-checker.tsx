'use client';

// Verificador de Alçada dos Juizados — implementação operacional das regras SE-ENTÃO da base EJC
// Fundamentos literais (LOTE-012): Lei 9.099/1995 art. 3º (40 SM) e art. 8º; Lei 10.259/2001 art. 3º (60 SM);
// Lei 12.153/2009 art. 2º (60 SM). Roteiro de triagem: triagem-jec-competencia-partes; regra-se-jec-competencia-por-valor.
// Importante (honestidade EJC): a matéria excluída é checklist orientativo — a conferência final é do operador do direito.

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, Building2, Landmark, User, XCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type TipoReu = 'pessoa-fisica' | 'federal' | 'estadual-municipal';

const MATTERIAS_EXCLUIDAS_JEC = [
  'Fazenda Pública (sem juizado próprio no foro)',
  'Alimentar',
  'Falimentar',
  'Fiscal',
  'Acidente de trabalho',
  'Resíduos',
  'Estado e capacidade das pessoas',
];

const MATERIAS_EXCLUIDAS_FAZENDA = [
  'Mandado de segurança',
  'Desapropriação, divisão e demarcação, populares',
  'Improbidade administrativa',
  'Execuções fiscais',
  'Direitos difusos e coletivos',
  'Bens imóveis do ente',
  'Pena de demissão/sanção disciplinar de servidor',
];

export function AlcadaChecker() {
  const [tipoReu, setTipoReu] = useState<TipoReu>('pessoa-fisica');
  const [valorCausa, setValorCausa] = useState('');
  const [salarioMinimo, setSalarioMinimo] = useState('');
  const [materiaExcluida, setMateriaExcluida] = useState(false);
  const [autorPJ, setAutorPJ] = useState(false);

  const resultado = useMemo(() => {
    const valor = Number(valorCausa);
    const sm = Number(salarioMinimo);
    if (!valor || !sm || valor <= 0 || sm <= 0) return null;
    const emSM = valor / sm;

    // SE autor é PJ fora das exceções do art. 8º § 1º ENTÃO JEC incabível como autor
    if (tipoReu === 'pessoa-fisica' && autorPJ) {
      return {
        verdict: 'FORO COMUM',
        cor: 'vermelho' as const,
        motivo:
          'Pessoa jurídica comum não pode ser AUTORA no JEC estadual (Lei 9.099 art. 8º). Podem ser autoras: pessoas físicas capazes, MEI/MEE/EPP (LC 123), OSCIP e sociedades de crédito ao microempreendedor.',
        limite: null as number | null,
        emSM,
      };
    }

    if (materiaExcluida) {
      return {
        verdict: 'FORO COMUM',
        cor: 'vermelho' as const,
        motivo:
          tipoReu === 'pessoa-fisica'
            ? 'A matéria está entre as excluídas do JEC estadual (Lei 9.099 art. 3º § 2º: alimentar, falimentar, fiscal, Fazenda Pública, acidentes de trabalho, resíduos, estado e capacidade).'
            : 'A matéria está entre as excluídas do Juizado da Fazenda (art. 2º § 1º da lei correspondente: mandado de segurança, desapropriação, improbidade, execução fiscal, difusos/coletivos, bens imóveis do ente, sanções a servidores).',
        limite: null,
        emSM,
      };
    }

    if (tipoReu === 'federal') {
      if (emSM <= 60) {
        return {
          verdict: 'JEC FEDERAL (JEF)',
          cor: 'verde' as const,
          motivo: 'Causa de competência da Justiça Federal até 60 salários mínimos (Lei 10.259/2001 art. 3º). Atenção às exclusões do § 1º (MS, desapropriação, execuções fiscais, improbidade, difusos/coletivos etc.).',
          limite: 60,
          emSM,
        };
      }
      return {
        verdict: 'FORO COMUM FEDERAL',
        cor: 'vermelho' as const,
        motivo: `Valor ≈ ${emSM.toFixed(1)} SM excede o limite de 60 SM do JEF (Lei 10.259 art. 3º caput). Lembrar: soma de 12 parcelas vincendas não pode exceder o teto (art. 3º § 2º).`,
        limite: 60,
        emSM,
      };
    }

    if (tipoReu === 'estadual-municipal') {
      if (emSM <= 60) {
        return {
          verdict: 'JEC DA FAZENDA PÚBLICA',
          cor: 'verde' as const,
          motivo:
            'Causa cível de interesse de Estado/DF/Territórios/Municípios até 60 SM (Lei 12.153/2009 art. 2º) — CONDICIONADA à instalação do Juizado da Fazenda no foro (competência absoluta onde houver — art. 2º § 4º). Se não houver juizado instalado, foro comum. Atenção: pagamento sem precatório só até o teto de pequeno valor do ente (art. 13 §§ 2º-5º).',
          limite: 60,
          emSM,
        };
      }
      return {
        verdict: 'FORO COMUM',
        cor: 'vermelho' as const,
        motivo: `Valor ≈ ${emSM.toFixed(1)} SM excede os 60 SM do JEC-Fazenda (Lei 12.153 art. 2º). Não se aplica a Lei 9.099 contra Fazenda (art. 3º § 2º).`,
        limite: 60,
        emSM,
      };
    }

    // pessoa física / PJ comum como réu
    if (emSM <= 40) {
      return {
        verdict: 'JEC ESTADUAL',
        cor: 'verde' as const,
        motivo: 'Causa cível de menor complexidade até 40 salários mínimos (Lei 9.099/1995 art. 3º I). Atenção à renúncia ao excedente na opção pelo rito (art. 3º § 3º, excetuada a conciliação).',
        limite: 40,
        emSM,
      };
    }
    return {
      verdict: 'FORO COMUM',
      cor: 'vermelho' as const,
      motivo: `Valor ≈ ${emSM.toFixed(1)} SM excede os 40 SM do JEC (Lei 9.099 art. 3º I).`,
      limite: 40,
      emSM,
    };
  }, [tipoReu, valorCausa, salarioMinimo, materiaExcluida, autorPJ]);

  const cores = resultado?.cor === 'verde'
    ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent'
    : resultado?.cor === 'vermelho'
      ? 'border-red-500/40 bg-gradient-to-br from-red-500/10 to-transparent'
      : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Scale className="size-4 text-amber-600" /> Verificador de alçada dos Juizados
        </CardTitle>
        <CardDescription>
          Direciona o foro por réu e valor (regras SE-ENTÃO da base): JEC estadual (Lei 9.099 art. 3º — 40 SM), JEF (Lei 10.259 art. 3º — 60 SM) e JEC-Fazenda (Lei 12.153 art. 2º — 60 SM).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5 sm:col-span-1">
            <Label htmlFor="alcada-reu">Réu</Label>
            <Select value={tipoReu} onValueChange={(v) => setTipoReu(v as TipoReu)}>
              <SelectTrigger id="alcada-reu" aria-label="Tipo de réu">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pessoa-fisica"><span className="flex items-center gap-2"><User className="size-3.5" /> Pessoa física / PJ comum</span></SelectItem>
                <SelectItem value="federal"><span className="flex items-center gap-2"><Landmark className="size-3.5" /> União / autarquia / empresa pública federal</span></SelectItem>
                <SelectItem value="estadual-municipal"><span className="flex items-center gap-2"><Building2 className="size-3.5" /> Estado / DF / Município</span></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="alcada-valor">Valor da causa (R$)</Label>
            <Input id="alcada-valor" type="number" min={0} inputMode="decimal" value={valorCausa} onChange={(e) => setValorCausa(e.target.value)} placeholder="Ex.: 45000" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="alcada-sm">Salário mínimo vigente (R$)</Label>
            <Input id="alcada-sm" type="number" min={0} inputMode="decimal" value={salarioMinimo} onChange={(e) => setSalarioMinimo(e.target.value)} placeholder="Ex.: 1518" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tipoReu === 'pessoa-fisica' && (
            <button
              onClick={() => setAutorPJ(!autorPJ)}
              aria-pressed={autorPJ}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${autorPJ ? 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'text-muted-foreground hover:border-amber-500/40 hover:bg-amber-500/5'}`}
            >
              Autor é pessoa jurídica (fora das exceções do art. 8º)
            </button>
          )}
          <button
            onClick={() => setMateriaExcluida(!materiaExcluida)}
            aria-pressed={materiaExcluida}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${materiaExcluida ? 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400' : 'text-muted-foreground hover:border-amber-500/40 hover:bg-amber-500/5'}`}
          >
            Matéria excluída por lei
          </button>
        </div>

        {materiaExcluida && (
          <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3 text-xs">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium">Checklist de matérias excluídas (conferir qual incide):</p>
              <p className="mt-1 text-muted-foreground">
                {(tipoReu === 'pessoa-fisica' ? MATTERIAS_EXCLUIDAS_JEC : MATERIAS_EXCLUIDAS_FAZENDA).join(' · ')}
              </p>
            </div>
          </div>
        )}

        {resultado && (
          <div className={`rounded-xl border p-4 ${cores}`}>
            <div className="flex flex-wrap items-center gap-2">
              {resultado.cor === 'verde' ? (
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="size-5 text-red-600 dark:text-red-400" />
              )}
              <p className={`text-lg font-bold ${resultado.cor === 'verde' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                {resultado.verdict}
              </p>
              <Badge variant="outline" className="text-[10px] font-mono">
                ≈ {resultado.emSM.toFixed(1)} SM{resultado.limite ? ` / limite ${resultado.limite} SM` : ''}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{resultado.motivo}</p>
          </div>
        )}

        <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
          <p>
            Ferramenta de APOIO de triagem — baseada nos textos literais das Leis 9.099/1995, 10.259/2001 e 12.153/2009 (LOTE-012 da base EJC). A opção pelo rito renuncia ao crédito excedente (art. 3º § 3º) e a conferência final das exclusões é do operador do direito.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
