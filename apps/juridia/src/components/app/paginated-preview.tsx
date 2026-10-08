"use client";

// PaginatedPreview — visualização PAGINADA da minuta em páginas A4 com
// timbrado com paginação visual.
//
// A paginação na tela é uma ESTIMATIVA (src/lib/paginate.ts); a paginação REAL
// na impressão/PDF é do navegador via @page. O timbrado deriva do perfil do
// advogado (store persistido) — nome do escritório, OAB, endereço e contato.

import { useMemo, useState } from "react";
import { paginateMarkdown } from "@/lib/paginate";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Stamp, PencilLine } from "lucide-react";

function Block({ block }: { block: string }) {
  if (block.startsWith("### "))
    return <h3 className="mt-4 mb-2 font-bold">{block.slice(4)}</h3>;
  if (block.startsWith("## "))
    return <h2 className="mt-5 mb-3 text-[1.1em] font-bold uppercase">{block.slice(3)}</h2>;
  if (block.startsWith("# "))
    return <h1 className="mb-4 text-center text-[1.25em] font-bold uppercase">{block.slice(2)}</h1>;
  if (/^[-*]\s/.test(block))
    return (
      <div className="ml-6 mb-1 before:mr-2 before:content-['•']">
        {block.replace(/^[-*]\s/, "")}
      </div>
    );
  if (/^\d+[.)]\s/.test(block))
    return <div className="ml-6 mb-1">{block}</div>;
  return <p className="mb-2 indent-8 text-justify">{block}</p>;
}

export function PaginatedPreview({ title, content }: { title: string; content: string }) {
  const profile = useAppStore((s) => s.profile);
  const { pages } = useMemo(
    () => paginateMarkdown(content, { firstPageCapacity: 26 }),
    [content]
  );
  const hasLetterhead = Boolean(profile.office || profile.name);

  return (
    <div className="space-y-6">
      {pages.map((page, pi) => (
        <div
          key={pi}
          className="relative mx-auto w-full max-w-[794px] rounded-sm bg-white px-[72px] pb-[88px] pt-[64px] text-black shadow-[0_2px_14px_rgba(0,0,0,0.28)] sm:px-[94px]"
          style={{ minHeight: 1123, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "12pt", lineHeight: 1.75 }}
        >
          {/* Timbrado — página 1 completa; páginas seguintes com linha curta */}
          {pi === 0 && hasLetterhead ? (
            <header className="mb-6 border-b-2 border-neutral-800 pb-3 text-center">
              <div className="text-[1.15em] font-bold uppercase tracking-wide">
                {profile.office || profile.name}
              </div>
              {profile.name && profile.office ? (
                <div className="text-[0.85em]">{profile.name} — OAB/{profile.oabUf || "____"} {profile.oab}</div>
              ) : null}
              {profile.address ? <div className="text-[0.8em]">{profile.address}</div> : null}
              {profile.phone || profile.email ? (
                <div className="text-[0.8em]">
                  {[profile.phone, profile.email].filter(Boolean).join(" · ")}
                </div>
              ) : null}
            </header>
          ) : pi > 0 && hasLetterhead ? (
            <header className="absolute inset-x-[72px] top-6 border-b border-neutral-300 pb-1 text-[0.7em] text-neutral-500 sm:inset-x-[94px]">
              {profile.office || profile.name} — OAB/{profile.oabUf || "____"} {profile.oab}
            </header>
          ) : null}

          {/* Título do documento só na primeira página */}
          {pi === 0 && (
            <h1 className="mb-6 text-center font-bold uppercase underline underline-offset-4">
              {title || "(sem título)"}
            </h1>
          )}

          {page.blocks.length === 0 && pi === 0 ? (
            <p className="text-center italic text-neutral-400">(documento vazio)</p>
          ) : (
            page.blocks.map((b, bi) => <Block key={bi} block={b} />)
          )}

          {/* Rodapé com numeração */}
          <footer className="absolute inset-x-[72px] bottom-5 border-t border-neutral-200 pt-1 text-center text-[0.7em] text-neutral-500 sm:inset-x-[94px]">
            Página {pi + 1} de {pages.length}
          </footer>
        </div>
      ))}
      <p className="text-center text-[11px] text-muted-foreground">
        Paginação estimada (A4, 12pt, margens 2,5 cm). Na exportação PDF/impressão o
        navegador faz a paginação real.
      </p>
    </div>
  );
}

/** Diálogo de edição do timbrado — edita o perfil persistido do advogado. */
export function LetterheadDialog() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Stamp className="mr-1.5 h-4 w-4" /> Timbrado
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PencilLine className="h-4 w-4 text-primary" /> Timbrado do escritório
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Aparece no cabeçalho das páginas (visualização paginada e exportações).
          Os dados ficam salvos neste navegador (perfil do advogado).
        </p>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="lh-office">Escritório / sociedade de advogados</Label>
            <Input
              id="lh-office"
              value={profile.office}
              onChange={(e) => setProfile({ office: e.target.value })}
              placeholder="De Paula Teixeira Advogados"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1">
              <Label htmlFor="lh-name">Nome do advogado(a)</Label>
              <Input
                id="lh-name"
                value={profile.name}
                onChange={(e) => setProfile({ name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lh-oab">OAB</Label>
              <Input
                id="lh-oab"
                value={profile.oab}
                onChange={(e) => setProfile({ oab: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label htmlFor="lh-uf">UF da OAB</Label>
              <Input
                id="lh-uf"
                value={profile.oabUf}
                onChange={(e) => setProfile({ oabUf: e.target.value })}
                placeholder="MG"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label htmlFor="lh-phone">Telefone</Label>
              <Input
                id="lh-phone"
                value={profile.phone}
                onChange={(e) => setProfile({ phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="lh-address">Endereço</Label>
            <Input
              id="lh-address"
              value={profile.address}
              onChange={(e) => setProfile({ address: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lh-email">E-mail</Label>
            <Input
              id="lh-email"
              value={profile.email}
              onChange={(e) => setProfile({ email: e.target.value })}
            />
          </div>
        </div>
        <Button className="w-full" onClick={() => setOpen(false)}>
          Concluir
        </Button>
      </DialogContent>
    </Dialog>
  );
}
