"use client";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export const useTelegram = () => {
  const { initData } = retrieveLaunchParams();
  return initData?.user;
};
