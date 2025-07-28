import type {
  LoginResponse,
  UserDto,
  UserRole,
  UserStatus,
} from "@/libs/api/auth/auth.api";
import type { Tokens } from "@/libs/api/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type { LoginResponse, UserDto, UserRole, UserStatus };

export interface AuthState {
  user: UserDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  issuedAt: string | null;
  expiresAt: string | null;
  setUser: (user: UserDto | null) => void;
  setAuth: (user: UserDto, tokens: Tokens) => void; // 타입 통일!
  setAuthObj: (data: { user: UserDto; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

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
          tokenType: tokens.tokenType ?? null,
          expiresIn: tokens.expiresIn ?? null,
          issuedAt: tokens.issuedAt ?? null,
          expiresAt: tokens.expiresAt ?? null,
        });
        if (storage) {
          storage.setItem("accessToken", tokens.accessToken);
          storage.setItem("refreshToken", tokens.refreshToken);
        }
      },
      setAuthObj: ({ user, accessToken, refreshToken }) => {
        set({
          user,
          accessToken,
          refreshToken,
        });
        if (storage) {
          storage.setItem("accessToken", accessToken);
          storage.setItem("refreshToken", refreshToken);
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
