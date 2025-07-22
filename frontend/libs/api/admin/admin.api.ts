// libs/api/admin.api.ts

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

// 유저 리스트 조회 API
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

// 유저 권한 변경 API
export async function updateUserRoles(payload: AdminUserRole[]): Promise<void> {
  const response = await safeFetch("http://localhost:8080/api/admin/users/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

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
