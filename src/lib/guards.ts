import { auth } from "./auth";
import { db } from "./db";

export const requireMembershipBySlug = async (slug: string) => {
  const session = await auth();
  const userId = session?.user?.id;
  console.log("userId", userId);
  if (!userId) return null;
  const tenant = await db.tenant.findUnique({
    where: {
      slug,
    },
  });
  console.log("tenant", tenant);
  if (!tenant) return null;
  const member = await db.membership.findFirst({
    where: {
      tenantId: tenant.id,
      userId,
    },
  });
  console.log("member", member);
  if (!member) return null;
  return { tenant, member };
};
