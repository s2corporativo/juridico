import { drizzle } from "drizzle-orm/mysql2";
import * as causalSchema from "../drizzle/causal-schema";

type CausalDb = ReturnType<typeof drizzle<typeof causalSchema>>;
let causalDb: CausalDb | null = null;

export function isCausalDatabaseConfigured(): boolean {
  return Boolean(process.env.ATLAS_CAUSAL_DATABASE_URL);
}

export function getCausalDb() {
  const connectionString = process.env.ATLAS_CAUSAL_DATABASE_URL;
  if (!connectionString) {
    throw new Error("Atlas Causal disabled: ATLAS_CAUSAL_DATABASE_URL is not configured");
  }
  if (!causalDb) {
    causalDb = drizzle(connectionString, { schema: causalSchema, mode: "default" });
  }
  return causalDb;
}
