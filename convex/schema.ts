import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tgUserId: v.string(),
    firstName: v.string(),
    refId: v.string(),
    lvl: v.float64(),
    points: v.number(),
    invitePoints: v.optional(v.number()),
    miner: v.number(),
    minerCost: v.float64(),
    hourlyReward: v.number(),
    lastStakedTime: v.number(),
    goldenPass: v.optional(v.number()),
    completeTasks: v.optional(v.array(v.object({ tasksId: v.id("tasks") }))),
  }),
  tasks: defineTable({
    name: v.string(),
    description: v.string(),
    image: v.string(),
    url: v.optional(v.string()),
    frens: v.optional(v.number()),
    points: v.number(),
    category: v.string(),
  }),
});
