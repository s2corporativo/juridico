import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { statementsOf } from "./lib/migration-statements";

describe("statementsOf", () => {
  it("não perde a primeira instrução quando o arquivo abre com um bloco de comentário", () => {
    const raw = `-- cabeçalho\n-- linha 2\n\nCREATE TABLE a (id INT);\nCREATE TABLE b (id INT);\n`;
    expect(statementsOf(raw)).toEqual(["CREATE TABLE a (id INT)", "CREATE TABLE b (id INT)"]);
  });

  it("ignora comentários intercalados entre instruções", () => {
    const raw = `CREATE TABLE a (id INT);\n-- nota no meio\nCREATE TABLE b (id INT);`;
    expect(statementsOf(raw)).toEqual(["CREATE TABLE a (id INT)", "CREATE TABLE b (id INT)"]);
  });

  it("recupera todas as 10 instruções de 0003_integrity_and_indexes.sql, inclusive a primeira", () => {
    const raw = fs.readFileSync(path.resolve(__dirname, "../drizzle/0003_integrity_and_indexes.sql"), "utf8");
    const statements = statementsOf(raw);
    expect(statements).toHaveLength(10);
    expect(statements[0]).toContain("jurisprudence_decision_date_idx");
  });

  it("recupera as 5 instruções de 0004_knowledge_base.sql", () => {
    const raw = fs.readFileSync(path.resolve(__dirname, "../drizzle/0004_knowledge_base.sql"), "utf8");
    const statements = statementsOf(raw);
    expect(statements).toHaveLength(5);
    expect(statements[0]).toContain("CREATE TABLE IF NOT EXISTS knowledge_documents");
  });
});
