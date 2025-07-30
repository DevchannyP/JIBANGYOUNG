// /libs/store/userStore.ts
import type { UserDto } from "@/types/api/mypage.types"; // ← 타입 전용 파일에서 import로 수정!
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
