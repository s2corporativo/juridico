import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })));
});

describe("national lower collector controls", () => {
  it("writes a controlled dry-run without contacting DataJud", async () => {
    const outputDirectory = await mkdtemp(path.join(os.tmpdir(), "atlas-lowers-"));
    temporaryDirectories.push(outputDirectory);

    await execFileAsync(process.execPath, ["scripts/collect-national-jec-lowers.mjs", "--alias=tjmg", "--max-pages=3", "--page-delay-ms=750"], {
      cwd: path.resolve(import.meta.dirname, ".."),
      env: { ...process.env, NATIONAL_LOWER_OUTPUT_DIR: outputDirectory },
    });

    const manifest = JSON.parse(await readFile(path.join(outputDirectory, "manifesto_baixas_nacionais_dry_run.json"), "utf8"));
    expect(manifest).toMatchObject({
      mode: "dry_run",
      expectedTribunals: 1,
      pageDelayMs: 750,
      authorization: "required_for_execution",
    });
  });
});
