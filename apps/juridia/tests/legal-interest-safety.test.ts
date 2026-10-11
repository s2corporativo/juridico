import { test, expect } from "bun:test";
import { calculateInterest, calculateDeadline } from "../src/lib/legal_calculator";

test("civil and employment default interest rates cannot be silently inferred", () => {
  expect(() => calculateInterest(1000, 12, undefined as unknown as number)).toThrow("INTEREST_PARAMETERS_REQUIRE_EXPLICIT_RATE");
  expect(() => calculateInterest(1000, 12, 0.01, "cc_art_406" as "informada_pelo_usuario")).toThrow();
  expect(() => calculateInterest(1000, 12, 0.005, "clt" as "informada_pelo_usuario")).toThrow();
});

test("explicit numeric monthly simple-interest simulation is labelled as mathematical only", () => {
  const result = calculateInterest(1000, 5, 0.01);
  expect(result.valorJuros).toBe(50);
  expect(result.valorTotal).toBe(1050);
  expect(result.base).toContain("fornecida pelo usuário");
  expect(result.observacoes.some(x => x.includes("Lei 14.905/2024"))).toBe(true);
});

test("invalid interest parameters fail closed", () => {
  expect(() => calculateInterest(0, 5, 0.01)).toThrow();
  expect(() => calculateInterest(1000, -5, 0.01)).toThrow();
  expect(() => calculateInterest(1000, 5, -0.01)).toThrow();
  expect(() => calculateInterest(1000, 5, Infinity)).toThrow();
  expect(() => calculateInterest(1000, 5, NaN)).toThrow();
});

test("deadline estimate explicitly warns that judicial holidays and suspensions are unverified", () => {
  const result = calculateDeadline(new Date("2026-10-10T12:00:00Z"), 5, "uteis");
  expect(result.observacoes.some(x => x.includes("feriados locais"))).toBe(true);
  expect(result.observacoes.some(x => x.includes("confira manualmente"))).toBe(true);
});
