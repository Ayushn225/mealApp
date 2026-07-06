import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new meal for the current user
export const createMeal = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    calories: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be logged in to create a meal");
    }

    // Find the user from db
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User profile not found in database");
    }

    return await ctx.db.insert("meals", {
      userId: user._id,
      name: args.name,
      description: args.description,
      calories: args.calories,
      createdAt: Date.now(),
    });
  },
});

// List meals for the current user
export const listMeals = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("meals")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});
