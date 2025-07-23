// store/userStore.ts
import { UserDto } from "@/types/user";
import { create } from "zustand";

interface UserStore {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
