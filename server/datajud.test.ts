import { afterEach, describe, expect, it } from "vitest";
import { getDataJudConnectionStatus, lookupDataJudByProcess } from "./datajud";

const originalKey = process.env.DATAJUD_API_KEY;

afterEach(() => {
  if (originalKey === undefined) delete process.env.DATAJUD_API_KEY;
  else process.env.DATAJUD_API_KEY = originalKey;
});

describe("DataJud transient connector", () => {
  it("reports only configuration state and never returns the key", () => {
    delete process.env.DATAJUD_API_KEY;
    expect(getDataJudConnectionStatus()).toMatchObject({ configured: false });

    process.env.DATAJUD_API_KEY = "temporary-test-key";
    const status = getDataJudConnectionStatus();
    expect(status).toMatchObject({ configured: true });
    expect(JSON.stringify(status)).not.toContain("temporary-test-key");
  });

  it("rejects an invalid process number before any external request", async () => {
    await expect(lookupDataJudByProcess("tjmg", "123")).rejects.toThrow("número CNJ válido");
  });
});
