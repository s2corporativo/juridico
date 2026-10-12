/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import { sanitizeLegacyProfile } from "../src/lib/store";

describe("perfil jurídico não fictício", () => {
  it("remove os valores demonstrativos legados", () => {
    const profile = sanitizeLegacyProfile({
      name: "Advogado Demo", oab: "123456", oabUf: "SP",
      office: "Escritório JuridIA Advocacia", email: "demo@juridia.com.br",
      phone: "(11) 99999-0000", address: "Av. Paulista, 1000 — São Paulo/SP",
    });
    expect(Object.values(profile).every(value => value === "")).toBe(true);
  });

  it("preserva informações profissionais reais", () => {
    const profile = sanitizeLegacyProfile({
      name: "Profissional Teste", oab: "654321", oabUf: "MG",
      office: "Escritório exemplo", email: "advogado@example.test",
      phone: "(31) 00000-0000", address: "Rua de teste",
    });
    expect(profile.name).toBe("Profissional Teste");
    expect(profile.oabUf).toBe("MG");
    expect(profile.email).toBe("advogado@example.test");
  });

  it("usa perfil vazio quando o armazenamento não tem valor válido", () => {
    expect(sanitizeLegacyProfile(null).oab).toBe("");
    expect(sanitizeLegacyProfile("unknown").name).toBe("");
  });
});
