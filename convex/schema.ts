import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(), // Clerk user tokenIdentifier
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  meals: defineTable({
    userId: v.id("users"), // reference to the user
    name: v.string(),
    description: v.optional(v.string()),
    calories: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  savedMeals: defineTable({
    userId: v.string(),
    mealId: v.string(),
    name: v.string(),
    category: v.string(),
    area: v.string(),
    imageUrl: v.string(),
    sourceUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_userMeal", ["userId", "mealId"]),
});
