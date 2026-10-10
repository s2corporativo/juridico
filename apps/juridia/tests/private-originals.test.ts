import { test, expect } from "bun:test";
import { createHash, randomBytes } from "node:crypto";
import { mkdtemp, rm, mkdir, symlink, readFile, writeFile, cp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { archivePrivateOriginal, readPrivateOriginal } from "../src/lib/private-originals";

const caseA = "audit_case_one";
const caseB = "audit_case_two";

const originalKey = process.env.JURIDIA_PRIVATE_UPLOAD_KEY;
const testKey = randomBytes(32).toString("hex");
function resetKey() {
  if (originalKey === undefined) delete process.env.JURIDIA_PRIVATE_UPLOAD_KEY;
  else process.env.JURIDIA_PRIVATE_UPLOAD_KEY = originalKey;
}

test("private original storage disabled by default", async () => {
  const old = process.env.JURIDIA_PRIVATE_UPLOAD_ROOT;
  delete process.env.JURIDIA_PRIVATE_UPLOAD_ROOT;
  try {
    await expect(archivePrivateOriginal(caseA, Buffer.from("Document for test only"))).rejects.toThrow("PRIVATE_ORIGINAL_STORAGE_DISABLED");
  } finally {
    if (old === undefined) delete process.env.JURIDIA_PRIVATE_UPLOAD_ROOT;
    else process.env.JURIDIA_PRIVATE_UPLOAD_ROOT = old;
  }
});

test("content-addressed immutable original can be retrieved only by matching case/hash", async () => {
  const root = await mkdtemp(join(tmpdir(), "juridia-private-"));
  const old = process.env.JURIDIA_PRIVATE_UPLOAD_ROOT;
  process.env.JURIDIA_PRIVATE_UPLOAD_ROOT = root;
  process.env.JURIDIA_PRIVATE_UPLOAD_KEY = testKey;
  try {
    const bytes = Buffer.from("PDF bytes used for a synthetic test, not a real file.");
    const expected = createHash("sha256").update(bytes).digest("hex");
    const created = await archivePrivateOriginal(caseA, bytes);
    expect(created.hash).toBe(expected);
    expect(created.newlyStored).toBe(true);
    const duplicate = await archivePrivateOriginal(caseA, bytes);
    expect(duplicate.newlyStored).toBe(false);
    expect((await readPrivateOriginal(caseA, expected)).equals(bytes)).toBe(true);
    await expect(readPrivateOriginal(caseB, expected)).rejects.toThrow();
    await expect(readPrivateOriginal(caseA, "random")).rejects.toThrow("INVALID_PRIVATE_ORIGINAL_ID");
    const other = await archivePrivateOriginal(caseB, bytes);
    expect(other.newlyStored).toBe(true);
    expect((await readPrivateOriginal(caseB, expected)).equals(bytes)).toBe(true);
    // The directory name is a hash of the case ID, not the client name.
    const bucket = createHash("sha256").update(caseA).digest("hex");
    const path = join(root, bucket.slice(0, 2), bucket, expected);
    const storedCiphertext = await readFile(path);
    expect(storedCiphertext.toString("utf8")).not.toContain(bytes.toString("utf8"));
    // Authentic encrypted envelope can be restored from an independent backup.
    const restored = await mkdtemp(join(tmpdir(), "juridia-restore-"));
    try {
      await cp(root, restored, { recursive: true });
      process.env.JURIDIA_PRIVATE_UPLOAD_ROOT = restored;
      expect((await readPrivateOriginal(caseA, expected)).equals(bytes)).toBe(true);
      process.env.JURIDIA_PRIVATE_UPLOAD_KEY = randomBytes(32).toString("hex");
      await expect(readPrivateOriginal(caseA, expected)).rejects.toThrow("PRIVATE_ORIGINAL_DECRYPTION_FAILED");
      process.env.JURIDIA_PRIVATE_UPLOAD_KEY = testKey;
    } finally {
      process.env.JURIDIA_PRIVATE_UPLOAD_ROOT = root;
      await rm(restored, { recursive: true, force: true });
    }
    await writeFile(path, Buffer.from("tampered"));
    await expect(readPrivateOriginal(caseA, expected)).rejects.toThrow("INVALID_PRIVATE_ORIGINAL_FILE");
  } finally {
    if (old === undefined) delete process.env.JURIDIA_PRIVATE_UPLOAD_ROOT;
    else process.env.JURIDIA_PRIVATE_UPLOAD_ROOT = old;
    resetKey();
    await rm(root, { recursive: true, force: true });
  }
});

test("private original rejects traversal and symlink root", async () => {
  const base = await mkdtemp(join(tmpdir(), "juridia-private-test-"));
  const real = join(base, "real");
  const shortcut = join(base, "link");
  const old = process.env.JURIDIA_PRIVATE_UPLOAD_ROOT;
  process.env.JURIDIA_PRIVATE_UPLOAD_KEY = testKey;
  try {
    await mkdir(real);
    await symlink(real, shortcut);
    process.env.JURIDIA_PRIVATE_UPLOAD_ROOT = shortcut;
    await expect(archivePrivateOriginal(caseA, Buffer.from("bytes"))).rejects.toThrow();
    process.env.JURIDIA_PRIVATE_UPLOAD_ROOT = real;
    await expect(archivePrivateOriginal("../../etc", Buffer.from("bytes"))).rejects.toThrow("INVALID_PRIVATE_ORIGINAL_ID");
  } finally {
    if (old === undefined) delete process.env.JURIDIA_PRIVATE_UPLOAD_ROOT;
    else process.env.JURIDIA_PRIVATE_UPLOAD_ROOT = old;
    resetKey();
    await rm(base, { recursive: true, force: true });
  }
});
