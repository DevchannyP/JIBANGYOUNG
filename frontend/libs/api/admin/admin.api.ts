// libs/api/admin.api.ts

import { AdMentorLogList } from "@/types/api/adMentorLogList";
import { AdMentorUser } from "@/types/api/adMentorUser";
import { AdminPost } from "@/types/api/adminPost";
import { AdminRegion } from "@/types/api/adminRegion";
import { AdminUser } from "@/types/api/adminUser";
import { AdminUserRole } from "@/types/api/adminUserRole";

export interface ApiError {
  code?: string;
  message: string;
}

// 공통 fetch + 에러 처리
async function safeFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (e: any) {
    throw new Error("네트워크 연결 실패 (서버 미응답)");
  }
}

// 관리자 데시보드_사용자 리스트 조회 API
export async function fetchAllUsers(): Promise<AdminUser[]> {
  const response = await safeFetch("http://localhost:8080/api/admin/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠기전달
  });

  if (!response.ok) {
    let apiError: ApiError = { message: "유저 목록 조회 실패" };

    try {
      apiError = await response.json();
    } catch {
      // JSON 파싱 불가 (502, CORS 등)
    }

    throw new Error(apiError.message || "유저 목록 조회 실패");
  }

  return response.json();
}

// 관리자 데시보드_사용자 권한 변경 API
export async function updateUserRoles(payload: AdminUserRole[]): Promise<void> {
  const response = await safeFetch(
    "http://localhost:8080/api/admin/users/roles",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    let apiError: ApiError = { message: "유저 권한 변경 실패" };

    try {
      apiError = await response.json();
    } catch {
      // JSON 파싱 불가
    }

    throw new Error(apiError.message || "유저 권한 변경 실패");
  }
}

// 관리자 데시보드_게시글 리스트 조회 API
export async function featchAllPost(): Promise<AdminPost[]> {
  const response = await safeFetch("http://localhost:8080/api/admin/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    let apiError: ApiError = { message: "게시글 목록 조회 실패" };

    try {
      apiError = await response.json();
    } catch {
      // JSON 파싱 불가
    }

    throw new Error(apiError.message || "게시글 목록 조회 실패");
  }
  return response.json();
}

// 관리자 데시보드_게시글 삭제 API
export async function deletePostById(id: number): Promise<void> {
  const response = await safeFetch(
    "http://localhost:8080/api/admin/posts/${id}",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    let apiError: ApiError = { message: "게시글 삭제 실패" };

    try {
      apiError = await response.json();
    } catch {
      // JSON 파싱 불가
    }

    throw new Error(apiError.message || "게시글 삭제 실패");
  }
}

// 관리자 데시보드_시/도 리스트 조회 API
export async function fetchAdminRegion(): Promise<AdminRegion[]> {
  const response = await safeFetch("http://localhost:8080/api/admin/region", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    let apiError: ApiError = { message: "지역 목록 조회 실패" };
    try {
      apiError = await response.json();
    } catch {
      // JSON 파싱 불가
    }
    throw new Error(apiError.message || "지역 목록 조회 실패");
  }
  return response.json();
}

// 멘토 데시보드_내 지역멘토 리스트 API
export async function fetchMentorRegionUsers(): Promise<AdMentorUser[]> {
  const token = localStorage.getItem("accessToken"); // JWT 토큰 가져오기

  const response = await safeFetch("http://localhost:8080/api/mentor/local", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    let apiError: ApiError = { message: "멘토 지역 유저 목록 조회 실패" };
    try {
      apiError = await response.json();
    } catch {}
    throw new Error(apiError.message || "멘토 지역 유저 목록 조회 실패");
  }

  return response.json();
}

// 멘토 데시보드_멘토 활동로그 리스트 API
export async function fetchAdMentorLogList(): Promise<AdMentorLogList[]> {
  const token = localStorage.getItem("accessToken");

  const response = await safeFetch("http://localhost:8080/api/mentor/logList", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    let apiError: ApiError = { message: "멘토 활동로그 리스트 조회 실패" };
    try {
      apiError = await response.json();
    } catch {}
    throw new Error(apiError.message || "멘토 활동로그 리스트 조회 실패");
  }

  return response.json();
}
