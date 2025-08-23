// src/lib/db.ts
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

function makeClient() {
  const url = process.env.ACCELERATE_URL || process.env.DATABASE_URL;

  const base = new PrismaClient({
    datasources: { db: { url } },
    log: ["warn", "error"],
  });

  // Only extend when using Accelerate
  return process.env.ACCELERATE_URL ? base.$extends(withAccelerate()) : base;
}

// Infer the actual client type (plain PrismaClient or Accelerate-extended)
type DbClient = ReturnType<typeof makeClient>;

declare global {
  // eslint-disable-next-line no-var
  var __db__: DbClient | undefined;
}

// Reuse across HMR in dev
export const db: DbClient = globalThis.__db__ ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__db__ = db;
}
