// server/db.ts
import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema.ts";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL // must match your real DB
});

export const db = drizzle(pool, { schema });