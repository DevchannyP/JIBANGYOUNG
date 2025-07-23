// libs/api/mypage.api.ts
import axios from "axios";

// --- [1] DTO 타입 선언 (백엔드 DTO와 네이밍/필드 1:1 매칭) --- //
export type UserRole = "USER" | "ADMIN" | "MENTOR_A" | "MENTOR_B" | "MENTOR_C";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED" | "PENDING";

export interface UserProfileDto {
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

export interface UserSurveyDto {
  id: number;
  title: string;
  isFavorite: boolean;
  participatedAt?: string;
  resultUrl?: string;
}

export interface PostPreviewDto {
  id: number;
  title: string;
  region: string;
  createdAt: string;
}

export interface CommentPreviewDto {
  id: number;
  content: string;
  targetPostTitle: string;
  createdAt: string;
}

export interface ReportDto {
  id: number;
  type: "post" | "comment";
  targetTitle: string;
  reason: string;
  reportedAt: string;
  status: "접수됨" | "처리중" | "처리완료";
}

export interface AlertDto {
  id: number;
  region: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

// --- [2] ApiResponse 래퍼 (백엔드 표준 응답 구조 1:1) --- //
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
  errorCode?: string | null;
}

export interface ApiError {
  code?: string;
  message: string;
}

// --- [3] axios 인스턴스 및 인터셉터 (JWT 자동 부착) --- //
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// JWT accessToken 자동 부착 (로컬스토리지 기준)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const res = error.response;
    const apiError: ApiError = res?.data ?? { message: "요청 실패" };
    throw new Error(apiError.message || "요청에 실패했습니다.");
  }
  throw new Error("네트워크 연결 실패 (서버 응답 없음)");
}

// --- [4] 실제 API 함수 (백엔드 컨트롤러와 100% URI/DTO 일치) --- //

// 1) 내 프로필 조회
export async function fetchMyProfile(): Promise<UserProfileDto> {
  try {
    const res = await api.get<ApiResponse<UserProfileDto>>("/api/mypage/me");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "사용자 정보 불러오기 실패");
    }
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

// 2) 내 프로필 수정
export async function updateMyProfile(
  payload: Partial<UserProfileDto>
): Promise<void> {
  try {
    const res = await api.patch<ApiResponse<void>>("/api/mypage/me", payload);
    if (!res.data.success) throw new Error(res.data.message || "저장 실패");
  } catch (error) {
    handleApiError(error);
  }
}

// 3) 내 설문 전체 이력
export async function fetchMySurveys(): Promise<UserSurveyDto[]> {
  try {
    const res = await api.get<ApiResponse<UserSurveyDto[]>>(
      "/api/mypage/surveys"
    );
    if (!res.data.success) throw new Error(res.data.message || "조회 실패");
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

// 4) 즐겨찾기 설문 목록
export async function fetchFavoriteSurveys(): Promise<UserSurveyDto[]> {
  try {
    const res = await api.get<ApiResponse<UserSurveyDto[]>>(
      "/api/mypage/surveys/favorites"
    );
    if (!res.data.success) throw new Error(res.data.message || "조회 실패");
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

// 5) 즐겨찾기 설문 삭제
export async function removeFavoriteSurvey(surveyId: number): Promise<void> {
  try {
    const res = await api.delete<ApiResponse<void>>(
      `/api/mypage/surveys/favorites/${surveyId}`
    );
    if (!res.data.success) throw new Error(res.data.message || "삭제 실패");
  } catch (error) {
    handleApiError(error);
  }
}

// 6) 내 게시글 목록
export async function fetchMyPosts(): Promise<PostPreviewDto[]> {
  try {
    const res =
      await api.get<ApiResponse<PostPreviewDto[]>>("/api/mypage/posts");
    if (!res.data.success) throw new Error(res.data.message || "조회 실패");
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

// 7) 내 댓글 목록
export async function fetchMyComments(): Promise<CommentPreviewDto[]> {
  try {
    const res = await api.get<ApiResponse<CommentPreviewDto[]>>(
      "/api/mypage/comments"
    );
    if (!res.data.success) throw new Error(res.data.message || "조회 실패");
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

// 8) 내 알림 목록
export async function fetchMyAlerts(): Promise<AlertDto[]> {
  try {
    const res = await api.get<ApiResponse<AlertDto[]>>("/api/mypage/alerts");
    if (!res.data.success) throw new Error(res.data.message || "조회 실패");
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

// 9) 내 신고 목록
export async function fetchMyReports(): Promise<ReportDto[]> {
  try {
    const res = await api.get<ApiResponse<ReportDto[]>>("/api/mypage/reports");
    if (!res.data.success) throw new Error(res.data.message || "조회 실패");
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
