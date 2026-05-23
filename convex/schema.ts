import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { tables } from "./betterAuth/schema";

export default defineSchema({
  ...tables,
  products: defineTable({
    name: v.string(),
    slug: v.string(), // auto-generated from name, unique for URL
    createdByUserId: v.id("user"),
    description: v.string(),
    price: v.number(),
    discount: v.optional(v.number()), // e.g. 10 means 10% off

    images: v.optional(v.array(v.string())),
    thumbnail: v.optional(v.string()),

    category: v.union(
      v.literal("mens"),
      v.literal("womens"),
      v.literal("anniversary-birthday"),
      v.literal("festival-corporate"),
      v.literal("frames-bouquet"),
      v.literal("custom-hampers"),
    ),

    tags: v.array(v.string()), // min 2

    launchedAt: v.number(), // Date.now() at time of creation
    markNewArrival: v.optional(v.boolean()), // admin explicit flag
    markTrending: v.optional(v.boolean()), // admin explicit flag

    stock: v.number(),

    variants: v.optional(
      v.object({
        sizes: v.optional(v.array(v.string())), // ["S", "M", "XL", "XXL"] or omitted
        colors: v.optional(v.array(v.string())), // ["Red", "Blue"] or omitted
      }),
    ),

    isActive: v.boolean(), // product is active or owner wants to remove it or discontinue.
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_launched_at", ["launchedAt"])
    .index("by_trending", ["markTrending"])
    .index("by_new_arrival", ["markNewArrival"])
    .searchIndex("search_name", {
      searchField: "name",
    }),

  // -------------------------------
  heroBanners: defineTable({
    imageLink: v.string(),
    altText: v.optional(v.string()),
    visitLink: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),


  // -----------------------------------
  // Wishlist table
  wishlists: defineTable({
    userId: v.id("user"),
    productId: v.id("products"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_product", ["productId"])
    .index("by_user_and_product", ["userId", "productId"]),

  // -----------------------------------
  // Cart table
  carts: defineTable({
    userId: v.id("user"),
    productId: v.id("products"),
    quantity: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),

  // -----------------------------------
  // Addresses table
  addresses: defineTable({
    userId: v.id("user"),
    fullName: v.string(),
    phone: v.string(),
    pincode: v.string(),
    locality: v.string(),
    address: v.string(),      // flat/house no, street
    city: v.string(),
    state: v.string(),
    landmark: v.optional(v.string()),
    addressType: v.union(v.literal("home"), v.literal("work"), v.literal("other")),
    isDefault: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_default", ["userId", "isDefault"]),

  // -----------------------------------
  // Saved For Later table
  savedForLater: defineTable({
    userId: v.id("user"),
    productId: v.id("products"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),
});
