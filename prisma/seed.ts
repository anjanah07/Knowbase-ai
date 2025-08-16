import { db } from "@/lib/db";

const main = async () => {
  const tenant = await db.tenant.upsert({
    where: { slug: "acme" },
    update: {},
    create: { name: "Acme Corp", slug: "acme" },
  });
  const user = await db.user.upsert({
    where: { email: "owner@acme.com" },
    update: {},
    create: { email: "owner@acme.com", name: "Acme Owner" },
  });
  await db.membership.upsert({
    where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } },
    update: {},
    create: { userId: user.id, tenantId: tenant.id, role: "OWNER" },
  });

  console.log("Seeded:", { tenant: tenant.slug, user: user.email });
};
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
