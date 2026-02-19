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

export async function createListingResolver(
  _: unknown,
  args: {
    input: {
      title: string;
      description: string;
      category: string;
      subcategory?: string;
      conditionGrade: string;
      saleType: string;
      price: number;
      reservePrice?: number;
      partOutEnabled?: boolean;
      photoUrls: string[];
    };
  },
  context: { req?: { headers?: { authorization?: string } } }
) {
  const userId = getUserId(context);
  if (!userId) throw new Error("Unauthorized");
  if (!args.input.photoUrls?.length) throw new Error("At least one photo is required");

  const listing = await prisma.listing.create({
    data: {
      sellerId: userId,
      title: args.input.title,
      description: args.input.description,
      category: args.input.category,
      subcategory: args.input.subcategory ?? null,
      conditionGrade: args.input.conditionGrade,
      saleType: args.input.saleType,
      price: args.input.price,
      reservePrice: args.input.reservePrice ?? null,
      partOutEnabled: args.input.partOutEnabled ?? false,
      status: "active",
      photos: {
        create: args.input.photoUrls.map((url, i) => ({
          url,
          position: i,
          isHero: i === 0,
        })),
      },
    },
    include: { photos: true, seller: true },
  });
  return listing;
}
