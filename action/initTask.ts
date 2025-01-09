"use server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";

export const initTask = async (tgUserId: string, taskId: Id<"tasks">) => {
  await fetchMutation(api.queries.initTasks, {
    tgUserId,
    taskId,
  });
};
