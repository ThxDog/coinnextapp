"use server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export const updateLvl = async (tgUserId: string, userLvl: number) => {
  console.log(userLvl);
  await fetchMutation(api.queries.updateLvl, {
    tgUserId,
    userLvl,
  });
};

