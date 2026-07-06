import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to save a meal with deduplication check
export const saveMeal = mutation({
  args: {
    userId: v.string(),
    mealId: v.string(),
    name: v.string(),
    category: v.string(),
    area: v.string(),
    imageUrl: v.string(),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Deduplication query using the by_userMeal index
    const existingMeal = await ctx.db
      .query("savedMeals")
      .withIndex("by_userMeal", (q) =>
        q.eq("userId", args.userId).eq("mealId", args.mealId)
      )
      .unique();

    // 2. Short-Circuit if duplicate exists
    if (existingMeal !== null) {
      return { saved: true, existing: true, id: existingMeal._id };
    }

    // 3. Insertion of the new meal record
    const id = await ctx.db.insert("savedMeals", {
      ...args,
      createdAt: Date.now(),
    });

    return { saved: true, existing: false, id };
  },
});

// Query to retrieve all saved meals for a user in descending order
export const getSavedMeals = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("savedMeals")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Query to check if a specific meal is already saved by a user
export const isMealSaved = query({
  args: {
    userId: v.string(),
    mealId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingMeal = await ctx.db
      .query("savedMeals")
      .withIndex("by_userMeal", (q) =>
        q.eq("userId", args.userId).eq("mealId", args.mealId)
      )
      .unique();

    return existingMeal !== null;
  },
});

// Mutation to delete a saved meal by ID
export const deleteMeal = mutation({
  args: {
    id: v.id("savedMeals"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
