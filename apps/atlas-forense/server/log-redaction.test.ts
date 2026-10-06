import { describe, expect, it } from "vitest";
import { redactDebugValue } from "@shared/log-redaction";

describe("debug log redaction", () => {
  it("removes direct credential keys and personal identifiers from nested network data", () => {
    const result = redactDebugValue({ authorization: "Bearer secret", response: { body: { email: "pessoa@exemplo.com", cpf: "000.000.000-00", processNumber: "0000000-00.0000.0.00.0000" } } });
    expect(JSON.stringify(result)).not.toContain("pessoa@exemplo.com");
    expect(JSON.stringify(result)).not.toContain("000.000.000-00");
    expect(JSON.stringify(result)).not.toContain("0000000-00.0000.0.00.0000");
  });
});
