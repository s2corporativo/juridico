import { getTableName } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { THESIS_REVIEW_STAGES } from "@shared/thesis-bank";

/**
 * Os quatro gates humanos são a garantia editorial do Banco Nacional de Teses:
 * nenhuma tese chega ao público sem revisão sequencial por revisores distintos,
 * fundamento oficial verificado e score documentado. Essa lógica não tinha
 * cobertura alguma.
 */

type Row = Record<string, unknown>;

/** Banco em memória: guarda o que foi escrito e responde por tabela. */
function makeDb(tables: Record<string, Row[]>) {
  const writes: Array<{ table: string; values: unknown }> = [];

  function tableNameOf(target: unknown): string {
    try {
      return getTableName(target as never);
    } catch {
      return "";
    }
  }

  const db: Record<string, unknown> = {
    select() {
      let rows: Row[] = [];
      const chain: Record<string, unknown> = {
        then: (resolve: (value: unknown) => unknown) => resolve(rows),
      };
      chain.from = (target: unknown) => {
        rows = tables[tableNameOf(target)] ?? [];
        return chain;
      };
      for (const method of ["innerJoin", "leftJoin", "where", "orderBy", "groupBy", "limit"]) {
        chain[method] = () => chain;
      }
      return chain;
    },
    insert(target: unknown) {
      const table = tableNameOf(target);
      return {
        values(values: unknown) {
          writes.push({ table, values });
          const result: Record<string, unknown> = {
            then: (resolve: (value: unknown) => unknown) => resolve([{ id: 1 }]),
            $returningId: () => Promise.resolve([{ id: 1 }]),
            onDuplicateKeyUpdate: () => Promise.resolve([{ id: 1 }]),
          };
          return result;
        },
      };
    },
    update() {
      return { set: () => ({ where: () => Promise.resolve([]) }) };
    },
  };
  db.transaction = (fn: (tx: unknown) => Promise<unknown>) => fn(db);
  return { db, writes };
}

async function loadBank(tables: Record<string, Row[]>) {
  vi.resetModules();
  const { db, writes } = makeDb(tables);
  vi.doMock("./db", () => ({ getDb: () => Promise.resolve(db) }));
  const bank = await import("./thesis-bank");
  return { bank, writes };
}

function reviewSteps(approvedBy: Array<number | null>) {
  return THESIS_REVIEW_STAGES.map((stage, index) => ({
    id: index + 1,
    thesisId: 1,
    thesisVersion: 1,
    stage,
    status: approvedBy[index] == null ? "pending" : "approved",
    reviewerUserId: approvedBy[index] ?? null,
  }));
}

const THESIS = { id: 1, topicId: 1, title: "Tese", description: "Descrição", position: "favoravel" };
const PROFILE = { thesisId: 1, publicId: "ATLAS-T-000001", version: 1, lifecycleStatus: "legal_review", useType: "attack" };

async function codeOf(promise: Promise<unknown>) {
  try {
    await promise;
    return null;
  } catch (error) {
    return error instanceof TRPCError ? error.code : "ERRO_NAO_TRPC";
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock("./db");
});

describe("gates de revisão do Banco de Teses", () => {
  it("recusa aprovação fora de ordem", async () => {
    const { bank } = await loadBank({
      legal_theses: [{ thesis: THESIS, profile: PROFILE }],
      legal_thesis_review_steps: reviewSteps([null, null, null, null]),
    });
    // Validador antes do pesquisador: a etapa anterior não está aprovada.
    expect(await codeOf(bank.reviewThesis(1, "validator", "approved", "ok", 10))).toBe("PRECONDITION_FAILED");
  });

  it("exige revisor distinto em cada etapa", async () => {
    const { bank } = await loadBank({
      legal_theses: [{ thesis: THESIS, profile: PROFILE }],
      legal_thesis_review_steps: reviewSteps([7, null, null, null]),
    });
    // Mesmo usuário que aprovou a etapa anterior tentando aprovar a seguinte.
    expect(await codeOf(bank.reviewThesis(1, "validator", "approved", "ok", 7))).toBe("PRECONDITION_FAILED");
  });

  it("aprova etapa seguinte com revisor distinto e registra auditoria", async () => {
    const { bank, writes } = await loadBank({
      legal_theses: [{ thesis: THESIS, profile: PROFILE }],
      legal_thesis_review_steps: reviewSteps([7, null, null, null]),
    });
    await expect(bank.reviewThesis(1, "validator", "approved", "conferido", 8)).resolves.toEqual({ success: true });
    expect(writes.some((write) => write.table === "audit_events")).toBe(true);
  });

  it("congela conteúdo após a primeira aprovação e a jurimetria após o auditor", async () => {
    const { bank } = await loadBank({
      legal_thesis_review_steps: reviewSteps([7, null, null, null]).filter((step) => step.status === "approved"),
    });
    const parcial = await bank.editingState(1, 1);
    expect(parcial.contentLocked).toBe(true);
    expect(parcial.quantitativeLocked).toBe(false);

    const { bank: bank2 } = await loadBank({
      legal_thesis_review_steps: reviewSteps([7, 8, 9, 10]),
    });
    const auditada = await bank2.editingState(1, 1);
    expect(auditada.quantitativeLocked).toBe(true);
  });

  it("bloqueia publicação sem os quatro gates aprovados", async () => {
    const { bank } = await loadBank({
      legal_theses: [{ thesis: THESIS, profile: PROFILE }],
      legal_thesis_review_steps: reviewSteps([7, 8, null, null]),
      legal_thesis_legal_basis: [],
      thesis_authorities: [],
      legal_thesis_scores: [],
      legal_thesis_counterarguments: [],
    });
    expect(await codeOf(bank.transitionThesisStatus(1, "validated", "publicar", 11))).toBe("PRECONDITION_FAILED");
  });

  it("registra transição de status sem colidir com a chave única de versões", async () => {
    const { bank, writes } = await loadBank({
      legal_theses: [{ thesis: THESIS, profile: PROFILE }],
    });
    // Status não público: dispensa os gates, exercita só a gravação da trilha.
    await expect(bank.transitionThesisStatus(1, "outdated", "revisão vencida", 11)).resolves.toEqual({ success: true });
    const audit = writes.filter((write) => write.table === "audit_events");
    expect(audit).toHaveLength(1);
    // A trilha não pode voltar a ser escrita em legal_thesis_versions: a chave
    // (thesisId, version) já existe e a violação era engolida silenciosamente.
    expect(writes.some((write) => write.table === "legal_thesis_versions")).toBe(false);
  });
});
