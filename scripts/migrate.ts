import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { statementsOf } from "./lib/migration-statements";

/**
 * Runner de migrations com controle de estado.
 *
 * A versão anterior reexecutava a lista inteira a cada chamada e dependia de
 * `CREATE TABLE IF NOT EXISTS` para não quebrar — o que só funciona enquanto
 * toda migration for de criação. Qualquer `ALTER TABLE` (índice, chave
 * estrangeira, coluna nova) falharia na segunda execução, e não havia como
 * saber o que já tinha rodado.
 *
 * Agora cada arquivo aplicado é registrado em `schema_migrations` com o hash do
 * conteúdo. Bancos que já rodaram o runner antigo são reconhecidos e semeados
 * como "já aplicados", para que a mudança não exija intervenção manual na VPS.
 */

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL não configurada.");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = [
  "0001_atlas_rebuild.sql",
  "0002_thesis_bank_hardening.sql",
  "0003_integrity_and_indexes.sql",
  "0004_knowledge_base.sql",
];
/** Migrations aplicadas pelo runner antigo, que não registrava estado. */
const LEGACY_APPLIED = new Set(["0001_atlas_rebuild.sql", "0002_thesis_bank_hardening.sql"]);

const conn = await mysql.createConnection({ uri: url, multipleStatements: false });

try {
  await conn.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (filename VARCHAR(191) NOT NULL PRIMARY KEY, checksum VARCHAR(64) NOT NULL, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
  );

  const [appliedRows] = await conn.query<mysql.RowDataPacket[]>("SELECT filename, checksum FROM schema_migrations");
  const applied = new Map(appliedRows.map((row) => [String(row.filename), String(row.checksum)]));

  // Banco preexistente sem registro: as migrations do runner antigo já rodaram.
  if (applied.size === 0) {
    const [legacyTables] = await conn.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'",
    );
    if (Number(legacyTables[0]?.total ?? 0) > 0) {
      for (const filename of LEGACY_APPLIED) {
        const raw = await fs.readFile(path.join(root, "drizzle", filename), "utf8");
        const checksum = createHash("sha256").update(raw).digest("hex");
        await conn.query("INSERT INTO schema_migrations (filename, checksum) VALUES (?, ?)", [filename, checksum]);
        applied.set(filename, checksum);
        console.log(`[migration] ${filename}: marcada como já aplicada (banco preexistente)`);
      }
    }
  }

  let executed = 0;
  for (const filename of MIGRATIONS) {
    const raw = await fs.readFile(path.join(root, "drizzle", filename), "utf8");
    const checksum = createHash("sha256").update(raw).digest("hex");
    const previous = applied.get(filename);

    if (previous) {
      if (previous !== checksum) {
        console.warn(
          `[migration] ${filename}: conteúdo mudou depois de aplicado. Migrations aplicadas são imutáveis — crie um arquivo novo em vez de editar este.`,
        );
      }
      continue;
    }

    const statements = statementsOf(raw);
    console.log(`[migration] ${filename}: aplicando ${statements.length} comandos`);
    for (const statement of statements) await conn.query(statement);
    await conn.query("INSERT INTO schema_migrations (filename, checksum) VALUES (?, ?)", [filename, checksum]);
    executed += 1;
  }

  console.log(executed ? `Migrations concluídas: ${executed} aplicada(s).` : "Nenhuma migration pendente.");
} finally {
  await conn.end();
}
