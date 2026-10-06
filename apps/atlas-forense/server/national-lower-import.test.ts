import { execFile } from "node:child_process";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const temporaryDirectories: string[] = [];
const importer = await import("../scripts/import-national-jec-lower-pilot.mjs");

const manifest = {
  mode: "pilot",
  state: "completed",
  expectedTribunals: 1,
  respondedTribunals: 1,
  queryFingerprint: "a".repeat(64),
  scope: { judgingBodyCodes: ["40011", "8161"] },
};

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })));
});

describe("territorial lower import", () => {
  it("accepts only aggregate TJMG rows for the two approved bodies", () => {
    const result = importer.parseTerritorialLowerPilot({
      manifestText: JSON.stringify(manifest),
      metricsText: JSON.stringify([
        { alias: "tjmg", uf: "MG", month: "2026-06", amount: 38, judgingBodyCode: "40011" },
        { alias: "tjmg", uf: "MG", month: "2026-06", amount: 20, judgingBodyCode: "8161" },
      ]),
    });
    expect(result.metrics).toHaveLength(2);
  });

  it("rejects unapproved bodies and artifacts with individual-data markers", () => {
    expect(() => importer.parseTerritorialLowerPilot({
      manifestText: JSON.stringify(manifest),
      metricsText: JSON.stringify([{ alias: "tjmg", uf: "MG", month: "2026-06", amount: 38, judgingBodyCode: "99999" }]),
    })).toThrow("recorte territorial");
    expect(() => importer.parseTerritorialLowerPilot({
      manifestText: JSON.stringify({ ...manifest, rawRecord: { numeroProcesso: "identificador-proibido" } }),
      metricsText: JSON.stringify([{ alias: "tjmg", uf: "MG", month: "2026-06", amount: 38, judgingBodyCode: "40011" }]),
    })).toThrow("dado individual");
  });

  it("permits a privacy-policy description without treating it as persisted individual data", () => {
    expect(() => importer.parseTerritorialLowerPilot({
      manifestText: JSON.stringify({ ...manifest, dataPolicy: "numeroProcesso é transitório e não persistido" }),
      metricsText: JSON.stringify([{ alias: "tjmg", uf: "MG", month: "2026-06", amount: 38, judgingBodyCode: "40011" }]),
    })).not.toThrow();
  });

  it("executes the importer when the release path is a symlink", async () => {
    const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "atlas-release-link-"));
    temporaryDirectories.push(temporaryDirectory);
    const sourcePath = path.resolve(import.meta.dirname, "../scripts/import-national-jec-lower-pilot.mjs");
    const linkedPath = path.join(temporaryDirectory, "import-national-jec-lower-pilot.mjs");
    await symlink(sourcePath, linkedPath);
    await writeFile(path.join(temporaryDirectory, "manifesto_baixas_nacionais_piloto.json"), JSON.stringify(manifest));
    await writeFile(path.join(temporaryDirectory, "baixas_nacionais_jec_agregadas_piloto.json"), JSON.stringify([
      { alias: "tjmg", uf: "MG", month: "2026-06", amount: 38, judgingBodyCode: "40011" },
      { alias: "tjmg", uf: "MG", month: "2026-06", amount: 20, judgingBodyCode: "8161" },
    ]));

    await expect(execFileAsync(process.execPath, [linkedPath], {
      env: { ...process.env, DATABASE_URL: "", NATIONAL_LOWER_IMPORT_AUTHORIZATION: "approved", NATIONAL_LOWER_OUTPUT_DIR: temporaryDirectory },
    })).rejects.toMatchObject({
      stderr: expect.stringContaining("DATABASE_URL indisponível"),
    });
  });
});
