import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";

function getUserIdFromContext(context: { req?: { headers?: { authorization?: string } } }): string | null {
  const auth = context.req?.headers?.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET) as { userId?: string };
    return decoded.userId ?? null;
  } catch {
    return null;
  }
}

export const userResolvers = {
  async me(_: unknown, __: unknown, context: { req?: { headers?: { authorization?: string } } }) {
    const userId = getUserIdFromContext(context);
    if (!userId) return null;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    return {
      ...user,
      passwordHash: undefined,
    };
  },
};
