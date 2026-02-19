import { healthResolver } from "./health";
import { userResolvers } from "./user";
import { listingResolvers } from "./listing";
import { authResolvers } from "./auth";
import { createListingResolver } from "./create-listing";
import { createCheckoutResolver } from "./checkout";
import { myTransactionsResolver } from "./transaction";
import { generateListingDescriptionResolver } from "./ai";
import { placeBidResolver } from "./bid";

export const resolvers = {
  Query: {
    health: healthResolver,
    me: userResolvers.me,
    listing: listingResolvers.listing,
    listings: listingResolvers.listings,
    myTransactions: myTransactionsResolver,
  },
  Mutation: {
    register: authResolvers.register,
    login: authResolvers.login,
    createListing: createListingResolver,
    createCheckout: createCheckoutResolver,
    generateListingDescription: generateListingDescriptionResolver,
    placeBid: placeBidResolver,
  },
  Bid: {
    id: (b: { id: string }) => b.id,
    amount: (b: { amount: string }) => b.amount,
    createdAt: (b: { createdAt: string }) => b.createdAt,
  },
  Transaction: {
    id: (t: { id: string }) => t.id,
    listingId: (t: { listingId: string }) => t.listingId,
    buyerId: (t: { buyerId: string }) => t.buyerId,
    sellerId: (t: { sellerId: string }) => t.sellerId,
    amount: (t: { amount: string }) => t.amount,
    platformFee: (t: { platformFee: string }) => t.platformFee,
    status: (t: { status: string }) => t.status,
    createdAt: (t: { createdAt: string }) => t.createdAt,
  },
  User: {
    id: (u: { id: string }) => u.id,
    email: (u: { email: string }) => u.email,
    name: (u: { name: string | null }) => u.name,
    role: (u: { role: string }) => u.role,
    verificationLevel: (u: { verificationLevel: string }) => u.verificationLevel,
    avatar: (u: { avatar: string | null }) => u.avatar,
    rating: (u: { rating: number | null }) => u.rating,
    createdAt: (u: { createdAt: Date }) => u.createdAt.toISOString(),
  },
  Listing: listingResolvers.Listing,
  ListingPhoto: {
    id: (p: { id: string }) => p.id,
    url: (p: { url: string }) => p.url,
    position: (p: { position: number }) => p.position,
    isHero: (p: { isHero: boolean }) => p.isHero,
  },
  AuthPayload: {
    token: (p: { token: string }) => p.token,
    refreshToken: (p: { refreshToken: string }) => p.refreshToken,
    user: (p: { user: object }) => p.user,
  },
};
