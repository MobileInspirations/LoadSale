import type { CategoryOption } from "../types";

export const CATEGORY_TAXONOMY: CategoryOption[] = [
  { primary: "Apparel and Footwear", subcategories: ["Athletic", "Casual", "Designer", "Children", "Accessories"] },
  { primary: "Electronics", subcategories: ["Consumer", "Computing", "Mobile", "Audio", "Smart Home"] },
  { primary: "Home and Garden", subcategories: ["Furniture", "Decor", "Kitchen", "Outdoor", "Tools"] },
  { primary: "Health and Beauty", subcategories: ["Skincare", "Haircare", "Supplements", "Fragrance"] },
  { primary: "Toys and Games", subcategories: ["Action Figures", "Board Games", "Outdoor", "Educational"] },
  { primary: "Grocery and Consumables", subcategories: ["Pantry", "Beverages", "Snacks", "Pet Food"] },
  { primary: "Automotive", subcategories: ["Parts", "Accessories", "Tools", "Detailing"] },
  { primary: "Mixed or Unsorted", subcategories: ["General Merchandise", "Amazon Returns", "Retail Returns"] },
];

export const AUCTION_DURATIONS = [
  { value: 1, label: "1 day" },
  { value: 3, label: "3 days" },
  { value: 5, label: "5 days" },
  { value: 7, label: "7 days" },
] as const;

export const PLATFORM_FEE_FREE = 0.03;
export const PLATFORM_FEE_PRO = 0.01;
export const ESCROW_RELEASE_HOURS = 72;
