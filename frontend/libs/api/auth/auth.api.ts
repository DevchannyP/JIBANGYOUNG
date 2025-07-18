import axios from "axios";

// --- ENUMS/DTO ---
export type UserRole = "USER" | "ADMIN" | "MENTOR_A" | "MENTOR_B" | "MENTOR_C";
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
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  issuedAt: string;
  expiresAt: string;
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
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const res = error.response;
    const apiError: ApiError = res?.data ?? { message: "요청 실패" };
    switch (apiError.code) {
      case "USER_NOT_FOUND":
        throw new Error("존재하지 않는 계정입니다.");
      case "INVALID_PASSWORD":
        throw new Error("비밀번호가 올바르지 않습니다.");
      case "ACCOUNT_LOCKED":
        throw new Error("계정이 잠겨있습니다. 관리자에게 문의하세요.");
      case "USERNAME_ALREADY_EXISTS":
        throw new Error("이미 사용 중인 아이디입니다.");
      case "EMAIL_ALREADY_EXISTS":
        throw new Error("이미 등록된 이메일입니다.");
      default:
        throw new Error(apiError.message || "요청에 실패했습니다.");
    }
  }
  throw new Error("네트워크 연결 실패 (서버 응답 없음)");
}

// --------------------
// ⭐️ API 함수들
// --------------------

// ✅ 아이디 중복확인 (boolean + message 구조로 반환)
export async function checkUsername(
  username: string
): Promise<{ available: boolean; message: string }> {
  try {
    const res = await api.get<ApiEnvelope<{ data: boolean; message: string }>>(
      `/api/auth/check-username`,
      { params: { username } }
    );
    // 백엔드: { success, data: { data: boolean, message: string }, message }
    return {
      available: res.data.data?.data ?? false,
      message: res.data.data?.message || res.data.message || "",
    };
  } catch (error) {
    handleApiError(error);
  }
}

// ✅ 이메일 중복확인
export async function checkEmail(
  email: string
): Promise<{ available: boolean; message: string }> {
  try {
    const res = await api.get<ApiEnvelope<{ data: boolean; message: string }>>(
      `/api/auth/check-email`,
      { params: { email } }
    );
    return {
      available: res.data.data?.data ?? false,
      message: res.data.data?.message || res.data.message || "",
    };
  } catch (error) {
    handleApiError(error);
  }
}

// ✅ 이메일 인증코드 발송
export async function sendCode(email: string): Promise<{ message: string }> {
  try {
    const res = await api.post<ApiEnvelope<void>>(`/api/auth/send-code`, {
      email,
    });
    return { message: res.data.message || "인증코드가 발송되었습니다." };
  } catch (error) {
    handleApiError(error);
  }
}

// ✅ 이메일 인증코드 검증
export async function verifyCode(
  email: string,
  code: string
): Promise<{ valid: boolean; message: string }> {
  try {
    const res = await api.post<ApiEnvelope<boolean>>(`/api/auth/verify-code`, {
      email,
      code,
    });
    return {
      valid: res.data.data ?? false,
      message:
        res.data.message ||
        (res.data.data ? "인증 성공!" : "인증코드가 올바르지 않습니다."),
    };
  } catch (error) {
    handleApiError(error);
  }
}

// ✅ 회원가입
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  nickname?: string;
  phone?: string;
  profileImageUrl?: string;
  birthDate?: string;
  gender?: string;
  region?: string;
}

export async function signup(payload: SignupRequest): Promise<UserDto> {
  try {
    const res = await api.post<ApiEnvelope<UserDto>>(
      `/api/auth/signup`,
      payload
    );
    if (!res.data.success || !res.data.data?.id) {
      throw new Error(res.data.message || "회원가입 응답이 올바르지 않습니다.");
    }
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

// ✅ 로그인 (기존 코드 유지)
export async function loginWithEmail(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await api.post<ApiEnvelope<LoginResponse>>(
      "/api/auth/login",
      {
        username,
        password,
      }
    );
    const envelope = response.data;

    if (!envelope.success) {
      throw new Error(envelope.message || "로그인에 실패했습니다.");
    }
    if (
      !envelope.data?.user?.id ||
      !envelope.data?.accessToken ||
      !envelope.data?.refreshToken ||
      !envelope.data?.tokenType ||
      !envelope.data?.expiresIn ||
      !envelope.data?.issuedAt ||
      !envelope.data?.expiresAt
    ) {
      throw new Error("로그인 응답이 올바르지 않습니다.");
    }
    return envelope.data;
  } catch (error) {
    handleApiError(error);
  }
}
