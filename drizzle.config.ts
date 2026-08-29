import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect:"mysql",
  schema:["./drizzle/schema.ts","./drizzle/thesis-bank.schema.ts","./drizzle/hardening.schema.ts"],
  out:"./drizzle/generated",
  dbCredentials:{url:process.env.DATABASE_URL??"mysql://root@127.0.0.1:3306/atlas_forense"},
  strict:true,
  verbose:true
});
