import { describe, expect, test } from "bun:test";
import { safeGatewayErrorCode } from "@/lib/ai_gateway";

describe("AI Gateway sanitização de erros de provedores", () => {
  test("preserva somente códigos HTTP de provedores autorizados", () => {
    expect(safeGatewayErrorCode(new Error("ollama_HTTP_503"))).toBe("ollama_HTTP_503");
    expect(safeGatewayErrorCode(new Error("groq_HTTP_429"))).toBe("groq_HTTP_429");
    expect(safeGatewayErrorCode(new Error("maritaca_HTTP_401"))).toBe("maritaca_HTTP_401");
  });

  test("não propaga texto arbitrário do upstream, URL, dados nem segredos", () => {
    expect(safeGatewayErrorCode(new Error("provider: 401 token=EXEMPLO_NAO_REAL"))).toBe("PROVIDER_REQUEST_FAILED");
    expect(safeGatewayErrorCode(new Error("fetch failed https://example.invalid/?key=EXEMPLO_NAO_REAL"))).toBe("PROVIDER_REQUEST_FAILED");
    expect(safeGatewayErrorCode("unauthorized")).toBe("PROVIDER_REQUEST_FAILED");
  });

  test("classifica configuração incompleta sem expor parâmetros", () => {
    expect(safeGatewayErrorCode(new Error("groq: BASE_URL, API_KEY e MODEL são obrigatórios"))).toBe("PROVIDER_NOT_CONFIGURED");
  });
});
