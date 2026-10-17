/**
 * Keyset pagination for user-scoped legal records.
 * The cursor is untrusted positioning data, never an authorization token.
 */
export type LegalListCursor = { updatedAt: Date; id: string };

export function encodeLegalCursor(record: { updatedAt: Date; id: string }): string {
  return Buffer.from(JSON.stringify({ t: record.updatedAt.toISOString(), i: record.id }), "utf8").toString("base64url");
}

export function decodeLegalCursor(value: string | null): LegalListCursor | null {
  if (!value || value.length > 512 || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const obj: unknown = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (!obj || typeof obj !== "object") return null;
    const cursor = obj as { t?: unknown; i?: unknown };
    if (typeof cursor.t !== "string" || typeof cursor.i !== "string" ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(cursor.t) ||
        cursor.i.length < 1 || cursor.i.length > 128 ||
        !/^[A-Za-z0-9_-]+$/.test(cursor.i)) return null;
    const updatedAt = new Date(cursor.t);
    if (Number.isNaN(updatedAt.getTime()) || updatedAt.toISOString() !== cursor.t) return null;
    return { updatedAt, id: cursor.i };
  } catch { return null; }
}

export function parseLegalPageParams(params: URLSearchParams):
  | { ok: true; limit: number; cursor: LegalListCursor | null }
  | { ok: false; error: string } {
  const rawLimit = params.get("limit");
  if (rawLimit !== null && !/^\d{1,3}$/.test(rawLimit)) return { ok: false, error: "invalid_limit" };
  const limit = rawLimit === null ? 100 : Number(rawLimit);
  if (limit < 1 || limit > 100) return { ok: false, error: "invalid_limit" };
  const rawCursor = params.get("cursor");
  const cursor = rawCursor === null ? null : decodeLegalCursor(rawCursor);
  if (rawCursor !== null && cursor === null) return { ok: false, error: "invalid_cursor" };
  return { ok: true, limit, cursor };
}

export function beforeLegalCursor(cursor: LegalListCursor) {
  return { OR: [
    { updatedAt: { lt: cursor.updatedAt } },
    { updatedAt: cursor.updatedAt, id: { lt: cursor.id } },
  ] };
}
