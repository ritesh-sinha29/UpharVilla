import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

// ──────────────────────────────────────────────
// QUERIES
// ──────────────────────────────────────────────

/**
 * Kept for legacy use (e.g. dropdowns, counts). NOT used for the main table.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").order("desc").collect();
    return products;
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Paginated product list — always 10 per page.
 * Use `usePaginatedQuery` on the frontend with `initialNumItems: 10`.
 */
export const getPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/**
 * Full-text search by product name.
 * Returns up to 10 results — search results are never paginated to keep UX fast.
 */
export const search = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const term = args.searchTerm.trim();
    if (!term) return [];

    return await ctx.db
      .query("products")
      .withSearchIndex("search_name", (q) => q.search("name", term))
      .take(10);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getByCategory = query({
  args: {
    category: v.union(
      v.literal("mens"),
      v.literal("womens"),
      v.literal("anniversary-birthday"),
      v.literal("festival-corporate"),
      v.literal("frames-bouquet"),
      v.literal("custom-hampers"),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getNewArrivals = query({
  args: {},
  handler: async (ctx) => {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

    // 1. Fetch products explicitly marked as new arrival
    const markedNewArrivals = await ctx.db
      .query("products")
      .withIndex("by_new_arrival", (q) => q.eq("markNewArrival", true))
      .collect();

    // 2. Fetch products launched in last 24 hours
    const recentArrivals = await ctx.db
      .query("products")
      .withIndex("by_launched_at", (q) => q.gte("launchedAt", twentyFourHoursAgo))
      .collect();

    // Combine and deduplicate
    const combined = [...markedNewArrivals, ...recentArrivals];
    const uniqueMap = new Map();
    combined.forEach((p) => uniqueMap.set(p._id, p));

    // Return only 8
    return Array.from(uniqueMap.values()).slice(0, 8);
  },
});

// ──────────────────────────────────────────────
// MUTATIONS
// ──────────────────────────────────────────────

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    thumbnail: v.optional(v.string()),
    category: v.union(
      v.literal("mens"),
      v.literal("womens"),
      v.literal("anniversary-birthday"),
      v.literal("festival-corporate"),
      v.literal("frames-bouquet"),
      v.literal("custom-hampers"),
    ),
    tags: v.array(v.string()),
    stock: v.number(),
    images: v.optional(v.array(v.string())),
    markNewArrival: v.optional(v.boolean()),
    markTrending: v.optional(v.boolean()),
    discount: v.optional(v.number()),
    variants: v.optional(
      v.object({
        sizes: v.optional(v.array(v.string())),
        colors: v.optional(v.array(v.string())),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to create a product");
    }

    const userId = identity.subject as Id<"user">;

    // Generate slug: lowercase, spaces → hyphens, strip specials, + 3-char random suffix
    const randomSuffix = Math.random().toString(36).substring(2, 5);
    const slug = args.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .concat(`-${randomSuffix}`);

    const productId = await ctx.db.insert("products", {
      name: args.name,
      slug,
      createdByUserId: userId,
      description: args.description,
      price: args.price,
      thumbnail: args.thumbnail,
      images: args.images,
      category: args.category,
      tags: args.tags,
      stock: args.stock,
      launchedAt: Date.now(),
      markNewArrival: args.markNewArrival,
      markTrending: args.markTrending,
      discount: args.discount,
      variants: args.variants,
      isActive: true,
    });

    return productId;
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");
    await ctx.db.patch(args.id, { isActive: !product.isActive });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    thumbnail: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    category: v.optional(
      v.union(
        v.literal("mens"),
        v.literal("womens"),
        v.literal("anniversary-birthday"),
        v.literal("festival-corporate"),
        v.literal("frames-bouquet"),
        v.literal("custom-hampers"),
      ),
    ),
    tags: v.optional(v.array(v.string())),
    stock: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    markNewArrival: v.optional(v.boolean()),
    markTrending: v.optional(v.boolean()),
    discount: v.optional(v.number()),
    variants: v.optional(
      v.object({
        sizes: v.optional(v.array(v.string())),
        colors: v.optional(v.array(v.string())),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    // If it's already a URL (starts with http), return it as is
    if (args.storageId.startsWith("http")) {
      return args.storageId;
    }
    try {
      return await ctx.storage.getUrl(args.storageId);
    } catch {
      return null;
    }
  },
});
