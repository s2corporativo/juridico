import { describe, expect, it } from "vitest";
import { getServerListenOptions } from "./_core/network";

describe("network binding policy", () => {
  it("honors the loopback binding configured by the VPS service", () => {
    expect(getServerListenOptions(3010, "127.0.0.1")).toEqual({
      port: 3010,
      host: "127.0.0.1",
    });
  });

  it("preserves the default listener behavior for managed hosting", () => {
    expect(getServerListenOptions(3000, undefined)).toEqual({ port: 3000 });
  });
});
