import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const base = new PrismaClient();

const extended = base.$extends(withAccelerate());

// extended now has Accelerate methods + PrismaClient methods
export type DbClient = typeof extended;

declare global {
  // eslint-disable-next-line no-var
  var __db__: DbClient | undefined;
}

export const db: DbClient = globalThis.__db__ ?? extended;

if (process.env.NODE_ENV !== "production") {
  globalThis.__db__ = db;
}
