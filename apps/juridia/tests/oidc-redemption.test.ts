/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import { consumeOidcCodeOnce, type OidcCodeClaim, type OidcCodeStore } from "../src/lib/oidc-code-redemption";

const validClaim: OidcCodeClaim = {
  code: "codigo-unico",
  clientId: "atlas-forense",
  redirectUri: "https://atlas.example.test/callback",
  codeChallenge: "challenge-pkce-s256",
  now: new Date("2026-10-12T12:00:00.000Z"),
};

function fakeStore(expiresAt = new Date("2026-10-12T12:02:00.000Z")) {
  let used = false;
  let updates = 0;

  // Simula a semântica de UPDATE ... WHERE: verificar e alterar
  // o estado é uma operação indivisível, como updateMany no banco.
  const store: OidcCodeStore = {
    async updateMany({ where, data }) {
      updates++;
      const matches =
        !used && where.used === false && data.used === true &&
        where.code === validClaim.code &&
        where.clientId === validClaim.clientId &&
        where.redirectUri === validClaim.redirectUri &&
        where.codeChallengeMethod === "S256" &&
        where.codeChallenge === validClaim.codeChallenge &&
        expiresAt.getTime() > where.expiresAt.gt.getTime();
      if (matches) used = true;
      return { count: matches ? 1 : 0 };
    },
  };
  return { store, isUsed: () => used, updateCount: () => updates };
}

describe("OIDC: consumo atômico de authorization code", () => {
  it("aceita uma única troca mesmo com 32 solicitações concorrentes", async () => {
    const { store, isUsed, updateCount } = fakeStore();
    const results = await Promise.all(
      Array.from({ length: 32 }, () => consumeOidcCodeOnce(store, validClaim)),
    );
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(isUsed()).toBe(true);
    expect(updateCount()).toBe(32);
  });

  it("não consome um código com client_id divergente", async () => {
    const { store, isUsed } = fakeStore();
    expect(await consumeOidcCodeOnce(store, { ...validClaim, clientId: "outro-cliente" })).toBe(false);
    expect(isUsed()).toBe(false);
    expect(await consumeOidcCodeOnce(store, validClaim)).toBe(true);
  });

  it("não consome código com redirect_uri ou challenge divergentes", async () => {
    const { store, isUsed } = fakeStore();
    expect(await consumeOidcCodeOnce(store, { ...validClaim, redirectUri: "https://evil.example.test/" })).toBe(false);
    expect(await consumeOidcCodeOnce(store, { ...validClaim, codeChallenge: "outro-challenge" })).toBe(false);
    expect(isUsed()).toBe(false);
  });

  it("recusa código expirado, inclusive no instante exato da expiração", async () => {
    const { store, isUsed } = fakeStore();
    expect(await consumeOidcCodeOnce(store, { ...validClaim, now: new Date("2026-10-12T12:02:00.000Z") })).toBe(false);
    expect(await consumeOidcCodeOnce(store, { ...validClaim, now: new Date("2026-10-12T12:03:00.000Z") })).toBe(false);
    expect(isUsed()).toBe(false);
  });
});
