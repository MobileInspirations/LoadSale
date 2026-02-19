export type UserRole = "buyer" | "seller" | "admin";
export type VerificationLevel = "basic" | "verified" | "trusted" | "enterprise";
export type SaleType = "BIN" | "auction" | "both";
export type ListingStatus = "draft" | "active" | "sold" | "expired";
export type ConditionGrade = "A" | "B" | "C" | "D" | "F";
export type TransactionStatus =
  | "pending"
  | "paid"
  | "escrow"
  | "shipped"
  | "delivered"
  | "released"
  | "disputed";
export type SubscriptionPlan = "pro_seller" | "pro_buyer" | "dual_pro";
export type SyndicationChannel = "loaddrop" | "facebook_groups" | "facebook_marketplace" | "email" | "ebay" | "bstock";

export interface CategoryOption {
  primary: string;
  subcategories?: string[];
}

export interface GeoLocation {
  type: "Point";
  coordinates: [number, number];
}
