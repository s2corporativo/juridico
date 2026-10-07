import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
  host: "127.0.0.1",
  port: 33061,
  user: "root",
  password: "",
  database: "atlas_juridico",
});

const [tables] = await conn.query("SHOW TABLES");
console.log("TABLES:", tables.length);
for (const t of tables) {
  const name = Object.values(t)[0];
  try {
    const [[{ c }]] = await conn.query(`SELECT COUNT(*) as c FROM \`${name}\``);
    console.log(`  ${name}: ${c} rows`);
  } catch (e) {
    console.log(`  ${name}: ERROR ${e.message}`);
  }
}

const [migs] = await conn.query("SELECT * FROM `__drizzle_migrations` ORDER BY id");
console.log("\nDRIZZLE MIGRATIONS:", migs.length);

await conn.end();
