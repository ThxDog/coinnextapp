"use server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export const boostAccount = async (tgUserId: string) => {
  await fetchMutation(api.queries.boostAccount, {
    tgUserId,
  });
};
