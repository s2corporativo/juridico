'use client';

// EJC — Due diligence BrasilAPI (guia de integrações, P2).
// CNPJ → razão social, situação cadastral, endereço e sócios (dados públicos
// da Receita via BrasilAPI). CEP → endereço. Uso pontual, nada persistido.

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Loader2, MapPin, Search } from 'lucide-react';

interface CnpjInfo {
  cnpj: string;
  razao_social?: string;
  nome_fantasia?: string;
  descricao_situacao_cadastral?: string;
  data_situacao_cadastral?: string;
  cnae_fiscal_descricao?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  qsa?: { nome_socio?: string; qualificacao_socio?: string }[];
}

interface CepInfo {
  cep: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
}

export function DueDiligence() {
  const [tipo, setTipo] = useState<'cnpj' | 'cep'>('cnpj');
  const [valor, setValor] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [cnpj, setCnpj] = useState<CnpjInfo | null>(null);
  const [cep, setCep] = useState<CepInfo | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const buscar = async () => {
    setBuscando(true);
    setErro(null);
    setCnpj(null);
    setCep(null);
    try {
      const r = await fetch(`/api/ejc/brasilapi?tipo=${tipo}&valor=${encodeURIComponent(valor)}`);
      const d = await r.json();
      if (!r.ok || d.error) {
        setErro(d.error ?? 'Falha na consulta.');
        return;
      }
      if (tipo === 'cnpj') setCnpj(d.resultado);
      else setCep(d.resultado);
    } catch {
      setErro('Falha de rede na consulta.');
    } finally {
      setBuscando(false);
    }
  };

  const cnpjFormatado = (v: string) =>
    v.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5') || v;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="size-4 text-amber-600" /> Due diligence cadastral (BrasilAPI)
        </CardTitle>
        <CardDescription>Consulta pública de CNPJ (Receita Federal via BrasilAPI) e CEP — para qualificação de partes e validação de endereços em minutas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          {(['cnpj', 'cep'] as const).map((t) => (
            <Button key={t} variant={tipo === t ? 'default' : 'outline'} size="sm" onClick={() => { setTipo(t); setErro(null); }} className="uppercase">
              {t}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[220px] flex-1 space-y-1">
            <Label htmlFor="dd-valor" className="text-[11px]">{tipo === 'cnpj' ? 'CNPJ (14 dígitos ou formatado)' : 'CEP (8 dígitos)'}</Label>
            <Input
              id="dd-valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder={tipo === 'cnpj' ? '00.000.000/0001-91' : '30000-000'}
              className="text-sm"
              onKeyDown={(e) => e.key === 'Enter' && buscar()}
            />
          </div>
          <Button onClick={buscar} disabled={buscando || valor.trim().length < 8} size="sm" className="gap-1.5">
            {buscando ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />} Consultar
          </Button>
        </div>
        {erro && <p className="text-xs text-red-600 dark:text-red-400">{erro}</p>}

        {cnpj && (
          <div className="space-y-2 rounded-lg border p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{cnpj.razao_social ?? '—'}</span>
              {cnpj.nome_fantasia && <span className="text-xs text-muted-foreground">({cnpj.nome_fantasia})</span>}
              <Badge
                variant={cnpj.descricao_situacao_cadastral === 'ATIVA' ? 'secondary' : 'outline'}
                className={cnpj.descricao_situacao_cadastral === 'ATIVA' ? 'bg-emerald-600 text-white hover:bg-emerald-600' : ''}
              >
                {cnpj.descricao_situacao_cadastral ?? '—'}
              </Badge>
            </div>
            <p className="font-mono text-xs text-muted-foreground">{cnpjFormatado(cnpj.cnpj ?? '')}</p>
            {cnpj.cnae_fiscal_descricao && <p className="text-xs text-muted-foreground">CNAE: {cnpj.cnae_fiscal_descricao}</p>}
            {(cnpj.logradouro || cnpj.municipio) && (
              <p className="flex items-center gap-1.5 text-xs">
                <MapPin className="size-3 text-muted-foreground" />
                {cnpj.logradouro}, {cnpj.numero ?? 's/n'} {cnpj.complemento ?? ''} · {cnpj.bairro ?? ''} · {cnpj.municipio}/{cnpj.uf ?? ''} · CEP {cnpj.cep ?? '—'}
              </p>
            )}
            {cnpj.qsa && cnpj.qsa.length > 0 && (
              <div>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">QSA (quadro de sócios):</p>
                <div className="flex flex-wrap gap-1.5">
                  {cnpj.qsa.slice(0, 8).map((s, i) => (
                    <Badge key={i} variant="outline" className="max-w-full truncate text-[10px] font-normal">
                      {s.nome_socio} — {s.qualificacao_socio}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {cep && (
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-medium">{cep.street ?? '—'}</p>
            <p className="text-xs text-muted-foreground">
              {cep.neighborhood ?? ''} · {cep.city ?? '—'}/{cep.state ?? '—'} · CEP {cepFormatado(cep.cep ?? '')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function cepFormatado(v: string): string {
  return v.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2') || v;
}
