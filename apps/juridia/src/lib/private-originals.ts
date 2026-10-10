/**
 * Private, content-addressed original files. No public/ or Next.js static storage.
 * Explicit opt-in: JURIDIA_PRIVATE_UPLOAD_ROOT=/absolute/private/path
 * Authorization MUST be checked at the caller before storing or loading.
 */
import { createHash, randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import { constants } from "node:fs";
import { lstat, mkdir, open, readFile, realpath, link, unlink } from "node:fs/promises";
import { isAbsolute, join, resolve, sep } from "node:path";

const MAX_ORIGINAL_BYTES = 8 * 1024 * 1024;
const HASH = /^[a-f0-9]{64}$/;
const CASE_ID = /^[a-zA-Z0-9_-]{8,128}$/;

const MAGIC = Buffer.from("JIO1");
const NONCE_BYTES = 12;
const TAG_BYTES = 16;
const ENVELOPE_BYTES = MAGIC.length + NONCE_BYTES + TAG_BYTES;

function privateEncryptionKey(): Buffer {
  const value = process.env.JURIDIA_PRIVATE_UPLOAD_KEY ?? "";
  if (!/^[a-fA-F0-9]{64}$/.test(value)) {
    throw new PrivateOriginalError("PRIVATE_ORIGINAL_ENCRYPTION_KEY_MISSING");
  }
  return Buffer.from(value, "hex");
}
function encryptOriginal(plaintext: Buffer): Buffer {
  const nonce = randomBytes(NONCE_BYTES);
  const cipher = createCipheriv("aes-256-gcm", privateEncryptionKey(), nonce);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return Buffer.concat([MAGIC, nonce, cipher.getAuthTag(), ciphertext]);
}
function decryptOriginal(envelope: Buffer): Buffer {
  if (envelope.length <= ENVELOPE_BYTES ||
      !envelope.subarray(0, MAGIC.length).equals(MAGIC)) {
    throw new PrivateOriginalError("INVALID_ENCRYPTED_ORIGINAL_FORMAT");
  }
  const nonce = envelope.subarray(MAGIC.length, MAGIC.length + NONCE_BYTES);
  const tag = envelope.subarray(MAGIC.length + NONCE_BYTES, ENVELOPE_BYTES);
  try {
    const decipher = createDecipheriv("aes-256-gcm", privateEncryptionKey(), nonce);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(envelope.subarray(ENVELOPE_BYTES)), decipher.final()]);
  } catch {
    throw new PrivateOriginalError("PRIVATE_ORIGINAL_DECRYPTION_FAILED");
  }
}

export class PrivateOriginalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PrivateOriginalError";
  }
}

function validateStorageRoot(): string {
  const raw = process.env.JURIDIA_PRIVATE_UPLOAD_ROOT;
  if (!raw || !isAbsolute(raw)) throw new PrivateOriginalError("PRIVATE_ORIGINAL_STORAGE_DISABLED");
  const root = resolve(raw);
  const cwd = resolve(process.cwd());
  if (root === "/" || root === cwd || root.startsWith(cwd + sep) ||
      /(?:^|\/)(?:public|\.next)(?:\/|$)/.test(root)) {
    throw new PrivateOriginalError("UNSAFE_PRIVATE_ORIGINAL_ROOT");
  }
  return root;
}

async function safeDirectory(dir: string) {
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const stat = await lstat(dir);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new PrivateOriginalError("UNSAFE_PRIVATE_DIRECTORY");
  const actual = await realpath(dir);
  if (actual !== resolve(dir)) throw new PrivateOriginalError("SYMLINK_PRIVATE_DIRECTORY");
}

function objectLocation(root: string, caseId: string, hash: string) {
  if (!CASE_ID.test(caseId) || !HASH.test(hash)) throw new PrivateOriginalError("INVALID_PRIVATE_ORIGINAL_ID");
  const bucket = createHash("sha256").update(caseId).digest("hex");
  const directory = join(root, bucket.slice(0, 2), bucket);
  return { directory, location: join(directory, hash) };
}

export interface OriginalRef {
  hash: string;
  bytes: number;
  newlyStored: boolean;
}

/** Must be called only after ownership is confirmed and extraction has succeeded. */
export async function archivePrivateOriginal(caseId: string, bytes: Buffer): Promise<OriginalRef> {
  if (!bytes.length || bytes.length > MAX_ORIGINAL_BYTES) throw new PrivateOriginalError("INVALID_PRIVATE_ORIGINAL_SIZE");
  const root = validateStorageRoot();
  const hash = createHash("sha256").update(bytes).digest("hex");
  const { directory, location } = objectLocation(root, caseId, hash);
  await safeDirectory(root);
  await safeDirectory(join(root, createHash("sha256").update(caseId).digest("hex").slice(0, 2)));
  await safeDirectory(directory);

  let newlyStored = false;
  // Publish only a fully flushed object. Crash before hard-link leaves no partial
  // file visible under the content hash; hard link never overwrites existing data.
  const temporary = join(directory, ".incoming-" + randomBytes(16).toString("hex"));
  let handle;
  try {
    handle = await open(temporary, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | constants.O_NOFOLLOW, 0o600);
    await handle.writeFile(encryptOriginal(bytes));
    await handle.sync();
    await handle.close();
    handle = undefined;
    try {
      await link(temporary, location);
      newlyStored = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    }
  } finally {
    await handle?.close();
    await unlink(temporary).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
  // Re-read and verify both new and pre-existing bytes. No blindly trusted dedup.
  const stored = await readPrivateOriginal(caseId, hash);
  if (!stored.equals(bytes)) throw new PrivateOriginalError("PRIVATE_ORIGINAL_CONTENT_CONFLICT");
  return { hash, bytes: bytes.length, newlyStored };
}

/** Caller must independently check case ownership AND matching EvidenceRef metadata. */
export async function readPrivateOriginal(caseId: string, hash: string): Promise<Buffer> {
  const root = validateStorageRoot();
  const { directory, location } = objectLocation(root, caseId, hash);
  await safeDirectory(root);
  await safeDirectory(join(root, createHash("sha256").update(caseId).digest("hex").slice(0, 2)));
  await safeDirectory(directory);
  const handle = await open(location, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_ORIGINAL_BYTES + ENVELOPE_BYTES || stat.size <= ENVELOPE_BYTES) {
      throw new PrivateOriginalError("INVALID_PRIVATE_ORIGINAL_FILE");
    }
    const envelope = await readFile(handle);
    const data = decryptOriginal(envelope);
    if (createHash("sha256").update(data).digest("hex") !== hash) {
      throw new PrivateOriginalError("PRIVATE_ORIGINAL_INTEGRITY_FAILED");
    }
    return data;
  } finally {
    await handle.close();
  }
}
