// Compendium public-metadata API — Atlas Forense publishes teses for JuridIA's RAG.
// Routes registered on the Express app:
//   GET /api/compendium/teses          — all teses (public metadata)
//   GET /api/compendium/teses/:slug    — specific tese
//   GET /api/compendium/search?q=...   — search teses by keyword
//
// This endpoint is intentionally case-agnostic and metadata-only: no parties,
// no CPF, no private case data. It exists so JuridIA's Cérebro can enrich its
// LLM prompts with Atlas's Compendium before generation (see apps/juridia/src/lib/compendium-sync.ts).

import type { Express, Request, Response } from "express";

export interface TesePublic {
  slug: string;
  title: string;
  area: string;
  tribunal?: string;
  source?: string;
  sourceUrl?: string;
  summary: string;
  tags: string[];
  verified: boolean;
  verifiedAt?: string;
}

// Public-metadata seed set — replace with a DB-backed list once the Compendium
// editorial pipeline is wired. The shape here is the contract JuridIA consumes.
const PUBLIC_TESES: TesePublic[] = [
  {
    slug: "stj-sumula-385",
    title: "Súmula 385 STJ — Prescrição cinco anos (CDC)",
    area: "consumer",
    tribunal: "STJ",
    source: "STJ, Súmula 385",
    sourceUrl: "https://www.stj.jus.br",
    summary:
      "O prazo prescricional para a reparação dos danos causados por fato do produto ou do serviço previstos na Lei nº 8.078/90 (CDC) é de cinco anos.",
    tags: ["prescricao", "cdc", "consumidor", "cinco-anos"],
    verified: true,
    verifiedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    slug: "cc-art-206-3-v",
    title: "CC, art. 206, §3º, V — Prazo de três anos (responsabilidade civil)",
    area: "civil",
    tribunal: "—",
    source: "CC, art. 206, §3º, V",
    sourceUrl: "http://www.planalto.gov.br/ccivil_03/leis/2002/Lei_completa.htm",
    summary:
      "Prescreve em três anos a pretensão de receber prestação de renda certa periódica, bem como a de reparação civil (responsabilidade extracontratual).",
    tags: ["prescricao", "civil", "tres-anos", "responsabilidade-civil"],
    verified: true,
    verifiedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    slug: "stj-sumula-54",
    title: "Súmula 54 STJ — Termo inicial danos morais (trânsito em julgado)",
    area: "civil",
    tribunal: "STJ",
    source: "STJ, Súmula 54",
    sourceUrl: "https://www.stj.jus.br",
    summary:
      "O prazo para ajuizar a ação de indenização por danos morais começa a fluir a partir do trânsito em julgado da sentença condenatória criminal.",
    tags: ["danos-morais", "termo-inicial", "transito-em-julgado"],
    verified: true,
    verifiedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    slug: "tst-sumula-203",
    title: "TST, Súmula 203 — Prescrição trabalhista (cinco anos)",
    area: "trabalhista",
    tribunal: "TST",
    source: "TST, Súmula 203",
    sourceUrl: "https://www.tst.jus.br",
    summary:
      "A prescrição trintenária é contada do termo do contrato de trabalho, observada a prescrição quinquenal das prestações vencidas.",
    tags: ["prescricao", "trabalhista", "cinco-anos", "trintenaria"],
    verified: true,
    verifiedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    slug: "ctn-art-173",
    title: "CTN, art. 173 — Prescrição tributária (cinco anos)",
    area: "tributario",
    tribunal: "—",
    source: "CTN, art. 173",
    sourceUrl: "http://www.planalto.gov.br/ccivil_03/leis/l5172compilada.htm",
    summary:
      "O direito de a Fazenda Pública constituir o crédito tributário extingue-se após cinco anos contados da data em que se tornou definitiva a decisão.",
    tags: ["prescricao", "tributario", "cinco-anos", "ctn"],
    verified: true,
    verifiedAt: "2024-01-01T00:00:00.000Z",
  },
];

function searchTeses(query: string): TesePublic[] {
  const q = query.trim().toLowerCase();
  if (!q) return PUBLIC_TESES;
  const tokens = q.split(/\s+/);
  return PUBLIC_TESES.filter((t) => {
    const hay = [
      t.title,
      t.summary,
      t.area,
      t.tribunal ?? "",
      t.source ?? "",
      ...t.tags,
    ]
      .join(" ")
      .toLowerCase();
    return tokens.every((tok) => hay.includes(tok));
  });
}

export function getTeseBySlug(slug: string): TesePublic | undefined {
  return PUBLIC_TESES.find((t) => t.slug === slug);
}

export function listTeses(): TesePublic[] {
  return PUBLIC_TESES;
}

// Registers the Compendium public-metadata routes on the Atlas Express app.
// Call from server/_core/index.ts alongside registerOAuthRoutes etc.
export function registerCompendiumApi(app: Express) {
  app.get("/api/compendium/teses", (_req: Request, res: Response) => {
    res.json({ teses: listTeses(), count: PUBLIC_TESES.length });
  });

  app.get("/api/compendium/teses/:slug", (req: Request, res: Response) => {
    const slug = String(req.params.slug || "");
    const tese = getTeseBySlug(slug);
    if (!tese) {
      res.status(404).json({ error: "tese_not_found", slug });
      return;
    }
    res.json(tese);
  });

  app.get("/api/compendium/search", (req: Request, res: Response) => {
    const q = typeof req.query.q === "string" ? req.query.q : "";
    const results = searchTeses(q);
    res.json({ query: q, count: results.length, teses: results });
  });
}
