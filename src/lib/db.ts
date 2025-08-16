import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
declare global {
  var prisma: PrismaClient | undefined;
}
export const db =
  global.prisma ||
  new PrismaClient({
    log: ["info", "warn", "error"],
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") global.prisma = db;
