import { create } from "zustand";

type IsBoolean = {
  userId: string;
};

export const isUserId = create<IsBoolean>((set) => ({
  userId: "",
  updateStatusUser: (userId: string) => set({ userId: userId }),
}));
