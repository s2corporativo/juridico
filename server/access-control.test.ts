import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import type { Request, Response } from "express";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createContext } from "./_core/trpc";
import { SESSION_COOKIE, signSession } from "./_core/session";

/**
 * Os três níveis de acesso do Atlas são a fronteira entre consulta pública e
 * área de governança. Antes destes testes nenhum deles era exercitado.
 */

const testRouter = router({
  aberto: publicProcedure.query(() => "ok"),
  autenticado: protectedProcedure.query(({ ctx }) => ctx.user.role),
  administrativo: adminProcedure.query(({ ctx }) => ctx.user.role),
});

function contextFor(cookie?: string) {
  return createContext({
    req: { headers: cookie ? { cookie } : {} } as Request,
    res: {} as Response,
  });
}

async function callerFor(cookie?: string) {
  return testRouter.createCaller(await contextFor(cookie));
}

async function sessionCookieFor(role: "user" | "admin") {
  const token = await signSession({
    userId: role === "admin" ? 1 : 2,
    openId: `sub-${role}`,
    role,
    email: `${role}@exemplo.br`,
    name: role,
  });
  return `${SESSION_COOKIE}=${token}`;
}

async function codeOf(promise: Promise<unknown>) {
  try {
    await promise;
    return null;
  } catch (error) {
    return error instanceof TRPCError ? error.code : "ERRO_NAO_TRPC";
  }
}

describe("níveis de acesso", () => {
  it("procedure pública responde sem sessão", async () => {
    const caller = await callerFor();
    await expect(caller.aberto()).resolves.toBe("ok");
  });

  it("procedure autenticada recusa visitante anônimo com UNAUTHORIZED", async () => {
    const caller = await callerFor();
    expect(await codeOf(caller.autenticado())).toBe("UNAUTHORIZED");
  });

  it("procedure administrativa recusa usuário comum com FORBIDDEN", async () => {
    const caller = await callerFor(await sessionCookieFor("user"));
    expect(await codeOf(caller.autenticado())).toBeNull();
    expect(await codeOf(caller.administrativo())).toBe("FORBIDDEN");
  });

  it("procedure administrativa aceita perfil admin", async () => {
    const caller = await callerFor(await sessionCookieFor("admin"));
    await expect(caller.administrativo()).resolves.toBe("admin");
  });

  it("sessão forjada não autentica", async () => {
    const caller = await callerFor(`${SESSION_COOKIE}=token.invalido.aqui`);
    expect(await codeOf(caller.autenticado())).toBe("UNAUTHORIZED");
  });

  it("cookie com escape malformado não derruba o contexto", async () => {
    // decodeURIComponent("%E0%A4%A") lança URIError; antes isso virava 500.
    const context = await contextFor(`outro=%E0%A4%A; ${SESSION_COOKIE}=token.invalido`);
    expect(context.user).toBeNull();
  });
});
