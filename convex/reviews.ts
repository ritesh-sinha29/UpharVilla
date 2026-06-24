import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const submitReview = mutation({
  args: {
    productId: v.id("products"),
    orderId: v.id("orders"),
    itemId: v.string(),
    rating: v.number(),
    reviewText: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to submit a review");
    }

    let userId = identity.subject as Id<"user">;
    let userName = identity.name || "Anonymous User";
    if (identity.email) {
      const dbUser = await ctx.db
        .query("user")
        .withIndex("email_name", (q) => q.eq("email", identity.email!))
        .first();
      if (dbUser) {
        userId = dbUser._id;
        userName = dbUser.name;
      }
    }

    // Verify order exists and belongs to the user
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.userId !== userId) {
      throw new Error("You do not have permission to review this order");
    }

    // Prevent double reviews
    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_user_and_item", (q) =>
        q.eq("userId", userId).eq("itemId", args.itemId),
      )
      .first();
    if (existing) {
      throw new Error("You have already reviewed this product.");
    }

    // Helper for initials
    const parts = userName.trim().split(/\s+/);
    let userInitials = "U";
    if (parts.length === 1 && parts[0]) {
      userInitials = parts[0].substring(0, 2).toUpperCase();
    } else if (parts.length > 1) {
      userInitials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    const reviewId = await ctx.db.insert("reviews", {
      userId,
      userName,
      userInitials,
      productId: args.productId,
      orderId: args.orderId,
      itemId: args.itemId,
      rating: args.rating,
      reviewText: args.reviewText,
      createdAt: Date.now(),
    });

    return { success: true, reviewId };
  },
});

export const listProductReviews = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .collect();
  },
});
