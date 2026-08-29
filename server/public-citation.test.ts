import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * O dossiê é servido por `compendium.dossier`, um publicProcedure. O contrato
 * do README é explícito: nenhuma informação administrativa atravessa rota
 * pública. Estes testes invocam `getCitationDossier` de verdade contra um
 * duplo de banco, em vez de inspecionar uma lista de nomes escrita no teste.
 */

const RECORD = {
  id: 7,
  externalId: "TJMG-0001",
  cnjNumber: "1234567-89.2024.8.13.0027",
  tribunal: "TJMG",
  justice: "Estadual",
  city: "Betim",
  decisionType: "acórdão",
  decisionDate: new Date("2025-03-04T00:00:00Z"),
  legalArea: "Consumidor",
  theme: "Negativação indevida",
  reasoningSummary: "Resumo público.",
  validationNote: "Conferir inteiro teor.",
  sourceStatus: "official_confirmed",
};

const SOURCE = {
  id: 3,
  label: "Portal TJMG",
  sourceType: "official_url",
  sourceUrl: "https://www.tjmg.jus.br/decisao",
  hashSha256: "a".repeat(64),
  publicStatus: "official_confirmed",
  note: "Nota interna sobre a coleta da fonte.",
  lastVerifiedAt: new Date("2025-03-05T00:00:00Z"),
};

const BATCH = {
  id: 11,
  batchKey: "tjmg-2025-03",
  sourceLabel: "Coleta TJMG",
  sourceHash: "b".repeat(64),
  status: "imported",
  itemsDiscovered: 120,
  itemsImported: 100,
  itemsExcluded: 20,
  method: "Consulta paginada ao portal, com deduplicação por número CNJ.",
  note: "Lote revisado internamente.",
};

/**
 * Duplo de banco: cada `select()` recebe o resultado da posição correspondente
 * da fila. A ordem das chamadas de `select()` é determinística — base, tópicos,
 * teses, revisão — independentemente de quando cada consulta é aguardada.
 */
function fakeDb(queue: unknown[][]) {
  let selectIndex = 0;
  return {
    select() {
      const rows = queue[selectIndex++] ?? [];
      const chain: Record<string, unknown> = {
        then: (resolve: (value: unknown) => unknown) => resolve(rows),
      };
      for (const method of ["from", "innerJoin", "leftJoin", "where", "orderBy", "groupBy", "limit"]) {
        chain[method] = () => chain;
      }
      return chain;
    },
  };
}

async function loadDossier(queue: unknown[][]) {
  vi.resetModules();
  const db = fakeDb(queue);
  vi.doMock("drizzle-orm/mysql2", () => ({ drizzle: () => db }));
  process.env.DATABASE_URL = "mysql://atlas:atlas@127.0.0.1:3306/atlas_test";
  const module = await import("./db");
  return module.getCitationDossier("TJMG-0001");
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock("drizzle-orm/mysql2");
  delete process.env.DATABASE_URL;
});

describe("dossiê público de citação", () => {
  it("não expõe estado da fila administrativa nem trilha de auditoria", async () => {
    const dossier = await loadDossier([
      [{ record: RECORD, source: SOURCE, batch: BATCH }],
      [{ id: 1, pathKey: "consumidor/negativacao", title: "Negativação" }],
      [{ id: 2, title: "Dano moral in re ipsa", position: "favoravel" }],
      [{ id: 9, reviewedAt: new Date("2025-03-06T00:00:00Z") }],
    ]);

    expect(dossier).not.toBeNull();
    const serialized = JSON.stringify(dossier);

    // Estado e prioridade da fila de revisão são internos.
    expect(dossier).not.toHaveProperty("review");
    expect(dossier).not.toHaveProperty("events");
    for (const leak of ["priority", "routine", "elevated", "urgent", "review_rejected", "review_enqueued", "assignedToUserId", "reviewedByUserId"]) {
      expect(serialized).not.toContain(leak);
    }
  });

  it("não expõe metadados operacionais de ingestão nem notas internas da fonte", async () => {
    const dossier = await loadDossier([
      [{ record: RECORD, source: SOURCE, batch: BATCH }],
      [],
      [],
      [],
    ]);

    const serialized = JSON.stringify(dossier);
    expect(serialized).not.toContain(BATCH.method);
    expect(serialized).not.toContain(BATCH.note);
    expect(serialized).not.toContain(SOURCE.note);
    expect(serialized).not.toContain("itemsExcluded");
    expect(serialized).not.toContain("hashSha256");
  });

  it("preserva a proveniência que sustenta a citação", async () => {
    const dossier = await loadDossier([
      [{ record: RECORD, source: SOURCE, batch: BATCH }],
      [],
      [],
      [{ id: 9, reviewedAt: null }],
    ]);

    expect(dossier?.source.label).toBe("Portal TJMG");
    expect(dossier?.source.sourceUrl).toBe("https://www.tjmg.jus.br/decisao");
    expect(dossier?.source.publicStatus).toBe("official_confirmed");
    expect(dossier?.batch.batchKey).toBe("tjmg-2025-03");
    expect(dossier?.batch.sourceHash).toBe(BATCH.sourceHash);
    expect(dossier?.record.externalId).toBe("TJMG-0001");
    // Revisão vira um sinal binário, sem status interno nem datas administrativas.
    expect(dossier?.humanReview.verified).toBe(false);
    expect(dossier?.humanReview.statement).toContain("fonte oficial");
  });
});
