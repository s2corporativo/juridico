import { describe, expect, it } from "vitest";
import { getServerListenOptions } from "./_core/network";

describe("network binding policy", () => {
  it("binds the production upstream exclusively to loopback", () => {
    expect(getServerListenOptions(3010, "production")).toEqual({
      port: 3010,
      host: "127.0.0.1",
    });
  });

  it("preserves the development listener behavior", () => {
    expect(getServerListenOptions(3000, "development")).toEqual({ port: 3000 });
  });
});
