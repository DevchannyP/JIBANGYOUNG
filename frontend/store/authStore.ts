import type {
  UserDto,
  UserRole,
  UserStatus,
  LoginResponse,
} from "@/libs/api/auth/auth.api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type { LoginResponse, UserDto, UserRole, UserStatus };

type Tokens = Omit<LoginResponse, "user">; // user 제외 나머지 모두

export interface AuthState {
  user: UserDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  issuedAt: string | null;
  expiresAt: string | null;
  setUser: (user: UserDto | null) => void;
  setAuth: (user: UserDto, tokens: Tokens) => void;
  logout: () => void;
}

// SSR/CSR-safe localStorage 핸들러
const storage = typeof window !== "undefined" ? window.localStorage : undefined;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresIn: null,
      issuedAt: null,
      expiresAt: null,
      setUser: (user) => set({ user }),
      setAuth: (user, tokens) => {
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenType: tokens.tokenType,
          expiresIn: tokens.expiresIn,
          issuedAt: tokens.issuedAt,
          expiresAt: tokens.expiresAt,
        });
        if (storage) {
          storage.setItem("accessToken", tokens.accessToken);
          storage.setItem("refreshToken", tokens.refreshToken);
        }
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          tokenType: null,
          expiresIn: null,
          issuedAt: null,
          expiresAt: null,
        });
        if (storage) {
          storage.removeItem("accessToken");
          storage.removeItem("refreshToken");
        }
      },
    }),
    {
      name: "auth-store-v2",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenType: state.tokenType,
        expiresIn: state.expiresIn,
        issuedAt: state.issuedAt,
        expiresAt: state.expiresAt,
      }),
      version: 2,
    }
  )
);
