import { describe, expect, it } from "vitest";
import { previewControlledIngestion } from "./compendium.ingestion";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(role: "user" | "admin"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: `ingestion-${role}`,
      email: null,
      name: null,
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("controlled compendium ingestion", () => {
  it("accepts verifiable metadata and rejects duplicates, personal fields and unsafe official sources", () => {
    const preview = previewControlledIngestion("lote-teste", [
      { externalId: "tjmg-001", tribunal: "TJMG", justice: "Estadual", decisionType: "Acórdão", sourceStatus: "official_confirmed", sourceUrl: "https://www.tjmg.jus.br/acordao/001", metadata: { theme: "Tarifas" } },
      { externalId: "tjmg-001", tribunal: "TJMG", justice: "Estadual", decisionType: "Acórdão", sourceStatus: "official_confirmed", sourceUrl: "http://www.tjmg.jus.br/acordao/002", metadata: { cpfParte: "000.000.000-00" } },
    ]);

    expect(preview.accepted).toBe(1);
    expect(preview.rejected).toBe(1);
    expect(preview.items[1]?.reasons).toEqual(expect.arrayContaining([
      "Identificador externo duplicado no lote.",
      "Metadados contêm campo incompatível com a camada pública.",
      "URL da fonte deve usar HTTPS.",
    ]));
  });

  it("restricts ingestion preview to the administrative role", async () => {
    const candidate = { externalId: "tjmg-003", tribunal: "TJMG", justice: "Estadual", decisionType: "Acórdão", sourceStatus: "attachment_reviewed" as const };
    const userCaller = appRouter.createCaller(createContext("user"));
    const adminCaller = appRouter.createCaller(createContext("admin"));

    await expect(userCaller.compendium.ingestion.preview({ batchKey: "lote-admin", candidates: [candidate] })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(adminCaller.compendium.ingestion.preview({ batchKey: "lote-admin", candidates: [candidate] })).resolves.toMatchObject({ accepted: 1, rejected: 0 });
  });

  it("rejects personal identifiers in metadata values and malformed CNJ numbers", () => {
    const preview = previewControlledIngestion("lote-privacidade", [
      { externalId: "tjmg-004", cnjNumber: "123", tribunal: "TJMG", justice: "Estadual", decisionType: "Acórdão", sourceStatus: "attachment_reviewed", metadata: { observacao: "Contato: pessoa@exemplo.com" } },
    ]);
    expect(preview.items[0]?.reasons).toEqual(expect.arrayContaining([
      "Metadados contêm campo incompatível com a camada pública.",
      "Número CNJ deve conter 20 dígitos quando informado.",
    ]));
  });
});
