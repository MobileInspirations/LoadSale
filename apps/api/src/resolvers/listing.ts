import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listingResolvers = {
  async listing(_: unknown, args: { id: string }) {
    const listing = await prisma.listing.findUnique({
      where: { id: args.id },
      include: { photos: true, seller: true },
    });
    return listing;
  },

  async listings(
    _: unknown,
    args: { limit?: number; offset?: number; category?: string; saleType?: string }
  ) {
    const limit = Math.min(args.limit ?? 20, 50);
    const offset = args.offset ?? 0;
    const where: { status?: string; category?: string; saleType?: string } = { status: "active" };
    if (args.category) where.category = args.category;
    if (args.saleType) where.saleType = args.saleType;
    const listings = await prisma.listing.findMany({
      where,
      take: limit,
      skip: offset,
      include: { photos: true, seller: true },
      orderBy: { createdAt: "desc" },
    });
    return listings;
  },

  Listing: {
    id: (l: { id: string }) => l.id,
    sellerId: (l: { sellerId: string }) => l.sellerId,
    seller: (l: { seller: object }) => l.seller,
    title: (l: { title: string }) => l.title,
    description: (l: { description: string }) => l.description,
    category: (l: { category: string }) => l.category,
    subcategory: (l: { subcategory: string | null }) => l.subcategory,
    conditionGrade: (l: { conditionGrade: string }) => l.conditionGrade,
    saleType: (l: { saleType: string }) => l.saleType,
    price: (l: { price: { toString: () => string } }) => l.price.toString(),
    reservePrice: (l: { reservePrice: { toString: () => string } | null }) =>
      l.reservePrice?.toString() ?? null,
    qualityScore: (l: { qualityScore: number | null }) => l.qualityScore,
    status: (l: { status: string }) => l.status,
    visibilityStart: (l: { visibilityStart: Date | null }) =>
      l.visibilityStart?.toISOString() ?? null,
    auctionEndTime: (l: { auctionEndTime: Date | null }) =>
      l.auctionEndTime?.toISOString() ?? null,
    partOutEnabled: (l: { partOutEnabled: boolean }) => l.partOutEnabled,
    createdAt: (l: { createdAt: Date }) => l.createdAt.toISOString(),
    photos: (l: { photos: object[] }) => l.photos,
  },
};
