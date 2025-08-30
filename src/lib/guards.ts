import { auth } from "./auth";
import { db } from "./db";

export const requireMembershipBySlug = async (slug: string) => {
  const session = await auth();
  const userid = session?.user?.id;
  if (!userid) return null;
  const tenant = await db.tenant.findUnique({
    where: {
      slug,
    },
  });
  if (!tenant) return null;
  const member = await db.membership.findFirst({
    where: {
      tenantId: tenant.id,
      userid,
    },
  });
  if (!member) return null;
  return { tenant, member };
};
