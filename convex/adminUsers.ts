import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Get current user's admin role — lightweight, returns only the role string.
 *  Uses .first() on indexed fields — cheapest possible read (1 document). */
export const getMyRole = query({
  args: { userId: v.string(), email: v.optional(v.string()) },
  handler: async (ctx, { userId, email }) => {
    const byId = await ctx.db
      .query("adminUsers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (byId) return byId.role;

    // Fallback by email — only runs if userId didn't match
    if (email) {
      const byEmail = await ctx.db
        .query("adminUsers")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();
      if (byEmail) return byEmail.role;
    }

    return null;
  },
});

/** List admin users — only returns fields needed by the UI.
 *  Avoids sending full documents to reduce bandwidth costs. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("adminUsers").order("desc").collect();
    return all.map(({ _id, userId, email, name, role, createdAt }) => ({
      _id,
      userId,
      email,
      name,
      role,
      createdAt,
    }));
  },
});

/** Add admin user — resolves userId server-side so client sends minimal data */
export const add = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("manager")),
    addedBy: v.string(),
  },
  handler: async (ctx, { email, name, role, addedBy }) => {
    // Index lookup — 1 read max
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existing) throw new Error("This user already has admin access.");

    // Index lookup — 1 read max
    const user = await ctx.db
      .query("user")
      .withIndex("email_name", (q) => q.eq("email", email))
      .first();
    if (!user) {
      throw new Error(
        "No account found with this email. They must sign up first.",
      );
    }

    // 1 write
    return await ctx.db.insert("adminUsers", {
      userId: user._id,
      email,
      name,
      role,
      addedBy,
      createdAt: Date.now(),
    });
  },
});

/** Remove admin user — 1 read + 1 delete */
export const remove = mutation({
  args: { id: v.id("adminUsers") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (!doc) throw new Error("Admin user not found.");
    if (doc.role === "owner") throw new Error("Cannot remove the Owner.");
    await ctx.db.delete(id);
  },
});

/** Update role — 1 read + 1 patch */
export const updateRole = mutation({
  args: {
    id: v.id("adminUsers"),
    role: v.union(v.literal("admin"), v.literal("manager")),
  },
  handler: async (ctx, { id, role }) => {
    const doc = await ctx.db.get(id);
    if (!doc) throw new Error("Admin user not found.");
    if (doc.role === "owner") throw new Error("Cannot change the Owner's role.");
    await ctx.db.patch(id, { role });
  },
});
