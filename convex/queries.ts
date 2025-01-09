import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const invitees = query({
	args: {
		tgUserId: v.string(),
	},
	handler: async (ctx, args) => {
		const invitees = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("refId"), args.tgUserId))
			.collect();
		return invitees;
	},
});

export const allTasks = query({
	handler: async (ctx) => {
		const tasks = await ctx.db.query("tasks").collect();
		return tasks;
	},
});

export const totalUsersCount = query({
	handler: async (ctx) => {
		const users = await ctx.db.query("users").collect();
		return users.length;
	},
});

export const userByTelegramId = query({
	args: {
		tgUserId: v.string(),
	},
	handler: async (ctx, args) => {
		return ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
			.first();
	},
});

export const claimPoints = mutation({
	args: {
		tgUserId: v.string(),
		points: v.number(),
		lastStakedTime: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
			.unique();

		if (user === null) {
			throw new Error("User not found");
		}

		await ctx.db.patch(user._id, {
			points: user.points + args.points,
			lastStakedTime: args.lastStakedTime,
		});

		if (user.refId) {
			const userRef = await ctx.db
				.query("users")
				.filter((q) => q.eq(q.field("tgUserId"), user.refId))
				.unique();

			if (userRef) {
				const reward = Math.floor((args.points * 10) / 100);

				await ctx.db.patch(userRef._id, {
					points: Math.floor(userRef.points + reward),
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					invitePoints: userRef?.invitePoints! + reward,
				});
			}
		}
	},
});

export const initTasks = mutation({
	args: {
		tgUserId: v.string(),
		taskId: v.id("tasks"),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
			.unique();

		if (user === null) {
			throw new Error("User not found");
		}

		const tasks = await ctx.db
			.query("tasks")
			.filter((q) => q.eq(q.field("_id"), args.taskId))
			.unique();

		if (tasks !== null) {
			if (user.completeTasks?.find((item) => item.tasksId === args.taskId))
				return;

			await ctx.db.patch(user._id, {
				points: user.points + tasks.points,
				completeTasks: [
					...(user.completeTasks || []),
					{ tasksId: args.taskId },
				],
			});
		} else {
			throw new Error("Task not found");
		}
	},
});

export const updateMiner = mutation({
	args: {
		tgUserId: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
			.unique();

		if (user === null) {
			throw new Error("User not found");
		}

		if (user.points < user.minerCost) {
			console.log("saldo insuficiente");
			return;
		}
		await ctx.db.patch(user._id, {
			points: Math.floor(user.points - user.minerCost),
			miner: Math.floor(user.miner + 1),
			minerCost: Math.floor(user.minerCost + (user.minerCost * 120) / 100),
			hourlyReward: Math.floor(
				user.hourlyReward + (user.hourlyReward * 30) / 100,
			),
		});
	},
});

export const updateLvl = mutation({
	args: {
		tgUserId: v.string(),
		userLvl: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
			.unique();

		if (user === null) {
			throw new Error("User not found");
		}

		await ctx.db.patch(user._id, {
			lvl: args.userLvl,
		});
	},
});

export const boostAccount = mutation({
	args: {
		tgUserId: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
			.unique();

		if (user === null) {
			throw new Error("User not found");
		}

		const quantity = 5;
		const pass = 3;
		const lvl = 1;
		const maxLvl = 4;
		await ctx.db.patch(user._id, {
			minerCost: Math.floor(
				user.minerCost + (user.minerCost * 120 * quantity) / 100,
			),
			hourlyReward: Math.floor(
				user.hourlyReward + (user.hourlyReward * 30 * quantity) / 100,
			),
			lvl: user.lvl === maxLvl ? user.lvl : maxLvl,
			miner: user.miner + quantity,
			goldenPass:
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				user.goldenPass! > 0 ? Math.floor(user.goldenPass! + pass) : pass,
		});
	},
});

export const newUser = mutation({
	args: {
		tgUserId: v.string(),
		firstName: v.string(),
		refId: v.optional(v.string()),
		lastStakedTime: v.float64(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
			.unique();

		if (user !== null) {
			if (user.firstName !== args.firstName) {
				await ctx.db.patch(user._id, {
					firstName: args.firstName,
				});
			}
			return { id: user._id, existingUser: true };
		}

		const id = await ctx.db.insert("users", {
			tgUserId: args.tgUserId,
			firstName: args.firstName,
			refId: args.refId || "",
			points: 0,
			lvl: 0,
			miner: 1,
			invitePoints: 0,
			minerCost: 10000,
			hourlyReward: 3000,
			lastStakedTime: args.lastStakedTime,
		});

		return { id, existingUser: false };
	},
});
