import { defineConfig } from "drizzle-kit";

const connectionString = process.env.ATLAS_CAUSAL_DATABASE_URL;
if (!connectionString) {
  throw new Error("ATLAS_CAUSAL_DATABASE_URL is required for the isolated Atlas Causal database");
}

export default defineConfig({
  schema: "./drizzle/causal-schema.ts",
  out: "./drizzle-causal",
  dialect: "mysql",
  dbCredentials: { url: connectionString },
});
