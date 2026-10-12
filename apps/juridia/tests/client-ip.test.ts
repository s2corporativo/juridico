/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import { NextRequest } from "next/server";
import { clientIp } from "../src/lib/api-helpers";

function request(headers: Record<string, string>): NextRequest {
  return new NextRequest("http://localhost:3005/api/check", { headers });
}

describe("IP confiável no JuridIA", () => {
  it("não confia em X-Forwarded-For injetado", () => {
    expect(clientIp(request({ "x-forwarded-for": "203.0.113.1" }))).toBeNull();
  });
  it("usa apenas X-Real-IP válido enviado pelo proxy", () => {
    expect(clientIp(request({ "x-forwarded-for": "203.0.113.1", "x-real-ip": "192.0.2.42" }))).toBe("192.0.2.42");
  });
  it("rejeita listas e valores falsos", () => {
    expect(clientIp(request({ "x-real-ip": "192.0.2.42, 198.51.100.1" }))).toBeNull();
    expect(clientIp(request({ "x-real-ip": "invalido" }))).toBeNull();
  });
  it("suporta IPv6", () => {
    expect(clientIp(request({ "x-real-ip": "2001:db8::1" }))).toBe("2001:db8::1");
  });
});
