import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";

function getUserId(context: { req?: { headers?: { authorization?: string } } }): string | null {
  const auth = context.req?.headers?.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET) as { userId?: string };
    return decoded.userId ?? null;
  } catch {
    return null;
  }
}

export async function myTransactionsResolver(
  _: unknown,
  __: unknown,
  context: { req?: { headers?: { authorization?: string } } }
) {
  const userId = getUserId(context);
  if (!userId) return [];

  const transactions = await prisma.transaction.findMany({
    where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    orderBy: { createdAt: "desc" },
    include: { listing: { select: { id: true, title: true } } },
  });

  return transactions.map((t) => ({
    ...t,
    amount: t.amount.toString(),
    platformFee: t.platformFee.toString(),
    createdAt: t.createdAt.toISOString(),
  }));
}
