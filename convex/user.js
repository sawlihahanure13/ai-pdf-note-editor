import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create user if not already exists
export const createUser = mutation({
  args: {
    userEmail: v.string(),
    userName: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userEmail"), args.userEmail))
      .collect();

    // If no user found, insert new entry
    if (user?.length === 0) {
      await ctx.db.insert("users", {
        userEmail: args.userEmail,
        userName: args.userName,
        imageUrl: args.imageUrl,
        upgrade: false,
      });

      return "Inserted New User...";
    }

    return "User Already Exists...";
  },
});

// Upgrade user plan
export const userUpgradePlan = mutation({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, { userEmail }) => {
    const result = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userEmail"), userEmail))
      .collect();

    if (result?.length > 0) {
      await ctx.db.patch(result[0]._id, { upgrade: true });
      return "Success";
    }

    return "Error: User not found";
  },
});

// Get user info
export const getUserInfo = query({
  args: {
    userEmail: v.optional(v.string()),
  },
  handler: async (ctx, { userEmail }) => {
    if (!userEmail) {
      return null;
    }

    const result = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userEmail"), userEmail))
      .collect();

    return result[0] ?? null;
  },
});

// Get user files (adjusted to use userEmail consistently)
export const getUserFiles = query({
  args: {
    userEmail: v.optional(v.string()),
  },
  handler: async (ctx, { userEmail }) => {
    if (!userEmail) return [];

    return await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("userEmail"), userEmail))
      .collect();
  },
});
