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

export async function placeBidResolver(
  _: unknown,
  args: { listingId: string; amount: number; maxBid?: number },
  context: { req?: { headers?: { authorization?: string } } }
) {
  const userId = getUserId(context);
  if (!userId) throw new Error("Unauthorized");

  const listing = await prisma.listing.findUnique({ where: { id: args.listingId } });
  if (!listing || listing.status !== "active") throw new Error("Listing not found or not available");
  if (listing.saleType !== "auction" && listing.saleType !== "both") throw new Error("Listing is not an auction");
  if (listing.sellerId === userId) throw new Error("Cannot bid on your own listing");
  if (listing.auctionEndTime && new Date() > listing.auctionEndTime) throw new Error("Auction has ended");

  const bid = await prisma.bid.create({
    data: {
      listingId: args.listingId,
      bidderId: userId,
      amount: args.amount,
      maxBid: args.maxBid ?? null,
      isProxy: args.maxBid != null,
    },
  });
  return {
    id: bid.id,
    amount: bid.amount.toString(),
    createdAt: bid.createdAt.toISOString(),
  };
}
