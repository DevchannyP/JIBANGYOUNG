// store/authStore.ts
import type { LoginTokenResponse } from "@/types/api/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. 유저 타입
// store/authStore.ts 또는 관련 타입 선언부
export interface User {
  id: number;
  username: string; // 👈 이 라인 추가!
  email: string;
  nickname?: string;
  phone?: string;
  profileImageUrl?: string;
  birthDate?: string;
  gender?: string;
  region?: string;
  role: "USER" | "ADMIN" | "MENTOR";
  status: "ACTIVE" | "DEACTIVATED" | "LOCKED" | "PENDING";
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 2. 상태 구조
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void; // 🟢 user만 바꾸는 setUser 추가
  setAuth: (user: User, tokens: LoginTokenResponse) => void;
  logout: () => void;
}

// 3. Zustand + persist
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }), // 🟢 user만 갱신
      setAuth: (user, tokens) => {
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
        }
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      },
    }),
    {
      name: "auth-store", // localStorage 키
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

/*
  [사용 예시]
  const { user, setUser, setAuth, logout } = useAuthStore();
  setUser({ id: 1, email: "test@a.com", nickname: "홍길동" });
  setAuth(user, tokens);
  logout();
*/
