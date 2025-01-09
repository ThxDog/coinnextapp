"use server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export const claimPoints = async (
  points: number,
  tgUserId: string,
  lastStakedTime: number
) => {
  if (!points || points === 0) return;

  await fetchMutation(api.queries.claimPoints, {
    tgUserId,
    points,
    lastStakedTime,
  });
};
