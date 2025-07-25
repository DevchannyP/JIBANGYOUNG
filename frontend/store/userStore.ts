// /libs/store/userStore.ts
import { UserDto } from "@/libs/api/mypage.api"; // ✅ 타입 일원화된 곳에서 import
import { create } from "zustand";

interface UserStore {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
  clearUser: () => void;
}

// ✅ 전역 사용자 상태 관리 (Zustand)
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
