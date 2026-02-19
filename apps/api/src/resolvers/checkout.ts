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

export async function createCheckoutResolver(
  _: unknown,
  args: { listingId: string },
  context: { req?: { headers?: { authorization?: string } } }
) {
  const userId = getUserId(context);
  if (!userId) throw new Error("Unauthorized");

  const listing = await prisma.listing.findUnique({
    where: { id: args.listingId },
  });
  if (!listing || listing.status !== "active") throw new Error("Listing not found or not available");
  if (listing.saleType !== "BIN" && listing.saleType !== "both") throw new Error("Listing is not available for Buy It Now");
  if (listing.sellerId === userId) throw new Error("Cannot buy your own listing");

  const platformFeeRate = 0.03;
  const amount = Number(listing.price);
  const platformFee = Math.round(amount * platformFeeRate * 100) / 100;

  const transaction = await prisma.transaction.create({
    data: {
      listingId: listing.id,
      buyerId: userId,
      sellerId: listing.sellerId,
      amount: listing.price,
      platformFee,
      status: "pending",
    },
  });

  return {
    clientSecret: `pi_placeholder_${transaction.id}`,
    transactionId: transaction.id,
  };
}
