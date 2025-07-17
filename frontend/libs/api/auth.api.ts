// frontend/libs/api/auth.api.ts
import axios from "axios";

// -------------------------------
// ✅ Enum Types (서버와 정확히 일치시켜야 함)
// -------------------------------
export type UserRole = "USER" | "ADMIN" | "MENTOR";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED" | "PENDING";

// -------------------------------
// ✅ DTO Interfaces
// -------------------------------
export interface UserDto {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  profileImageUrl?: string;
  birthDate?: string; // yyyy-MM-dd
  gender?: string;
  region?: string;
  lastLoginAt?: string; // yyyy-MM-dd'T'HH:mm:ss
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  user: UserDto;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: any;
}

export interface ApiError {
  code?: string;
  message: string;
}

// -------------------------------
// ✅ Axios Instance
// -------------------------------
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // ex: http://localhost:8080
  withCredentials: true, // CORS 쿠키 전송 필수
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------------------
// ✅ 공통 에러 핸들러
// -------------------------------
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

// -------------------------------
// ✅ 로그인 API 함수
// -------------------------------
export async function loginWithEmail(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/api/auth/login", {
      username,
      password,
    });

    const data = response.data;
    if (!data?.user?.id) {
      throw new Error("유저 정보가 올바르지 않습니다.");
    }

    return data;
  } catch (error) {
    handleApiError(error);
  }
}
