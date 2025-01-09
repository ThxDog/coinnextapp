import { isUserId } from "@/context";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useInitData, useLaunchParams } from "@telegram-apps/sdk-react";
import { useMemo } from "react";

export const useTgUser = () => {
  const data = useInitData(true);
  const { user } = data || {};

  const currentTgUserId = user?.id.toString() || "";

  const newUser = useMemo(
    () => ({
      ...user,
      id: currentTgUserId,
    }),
    [user, currentTgUserId]
  );

  return newUser;
};
