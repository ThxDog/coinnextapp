"use server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export const updateMiner = async (tgUserId: string) => {
  await fetchMutation(api.queries.updateMiner, {
    tgUserId,
  });
};
