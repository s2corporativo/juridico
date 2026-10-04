import mysql from "mysql2/promise";

const c = await mysql.createConnection({ host: "127.0.0.1", port: 33061, user: "root", password: "", database: "atlas_ejc" });
const [rows] = await c.query("SELECT sourceKey, label, integrationStatus, priority FROM public_data_sources");
for (const r of rows) console.log(r.sourceKey, "|", r.label, "|", r.integrationStatus, "|", r.priority ?? "-");
const [migs] = await c.query("SELECT COUNT(*) n FROM __drizzle_migrations");
console.log("migrations:", migs[0].n);
await c.end();
