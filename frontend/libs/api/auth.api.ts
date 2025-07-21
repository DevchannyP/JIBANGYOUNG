import axios from "axios";

// Enum Types
export type UserRole = "USER" | "ADMIN" | "MENTOR";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED" | "PENDING";

export interface UserDto {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  profileImageUrl?: string;
  birthDate?: string;
  gender?: string;
  region?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  code?: string;
  message: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const res = error.response;
    const apiError: ApiError = res?.data ?? { message: "로그인 실패" };

    switch (apiError.code) {
      case "USER_NOT_FOUND":
        throw new Error("존재하지 않는 계정입니다.");
      case "INVALID_PASSWORD":
        throw new Error("비밀번호가 올바르지 않습니다.");
      case "ACCOUNT_LOCKED":
        throw new Error("계정이 잠겨있습니다. 관리자에게 문의하세요.");
      default:
        throw new Error(apiError.message || "로그인 실패");
    }
  }
  throw new Error("네트워크 연결 실패 (서버 응답 없음)");
}

export async function loginWithEmail(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    // ApiEnvelope<LoginResponse> 구조로 받는다!
    const response = await api.post<ApiEnvelope<LoginResponse>>(
      "/api/auth/login",
      {
        username,
        password,
      }
    );

    // ⭐⭐⭐ 이 줄이 중요! 반드시 data.data에서 꺼내라!
    const envelope = response.data;

    if (!envelope.success || !envelope.data?.user?.id) {
      throw new Error(envelope.message || "로그인 응답이 올바르지 않습니다.");
    }

    return envelope.data;
  } catch (error) {
    handleApiError(error);
  }
}
