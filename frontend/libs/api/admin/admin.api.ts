import api from "@/libs/api/axios";
import { Report } from "@/types/api/adMentorReport";
import { AdMentorRequest } from "@/types/api/adMentorRequest";
import { AdminPost } from "@/types/api/adminPost";
import { AdminRegion } from "@/types/api/adminRegion";
import { AdminUser, ChangeUserStatusPayload } from "@/types/api/adminUser";
import { AdminUserRole } from "@/types/api/adminUserRole";

// 관리자 데시보드_지역 탭
export async function fetchAdminRegion(): Promise<AdminRegion[]> {
  try {
    const response = await api.get("/api/admin/region");
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "지역 목록 조회 실패";
    throw new Error(msg);
  }
}

// 관리자 데시보드_신고 목록(승인요청/승인)
export async function fetchAdminReports(type?: string): Promise<Report[]> {
  const res = await api.get("/api/admin/report", {
    params: type ? { type } : {},
  });
  return res.data;
}

// 관리자 데시보드_신고자 상태관리
export async function changeUserStatus(
  userId: number,
  status: ChangeUserStatusPayload["status"]
): Promise<void> {
  try {
    await api.patch(`/api/admin/users/${userId}/status`, { status });
  } catch (error: any) {
    const msg = error.response?.data?.message || "유저 상태 변경 실패";
    throw new Error(msg);
  }
}

// 관리자 데시보드_신고목록_처리상태(승인/반려)
export async function adminApproveOrRejectReport(
  id: number,
  status:
    | "APPROVED"
    | "IGNORED"
    | "INVALID"
    | "PENDING"
    | "REJECTED"
    | "REQUESTED"
): Promise<void> {
  await api.patch(`/api/admin/report/${id}/status`, { status });
}

// 관리자 데시보드_사용자 관리
export async function fetchAllUsers(): Promise<AdminUser[]> {
  try {
    const response = await api.get("/api/admin/users");
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "유저 목록 조회 실패";
    throw new Error(msg);
  }
}

// 관리자 데시보드_사용자 관리_권한변경
export async function updateUserRoles(payload: AdminUserRole[]): Promise<void> {
  try {
    await api.put("/api/admin/users/roles", payload);
  } catch (error: any) {
    const msg = error.response?.data?.message || "유저 권한 변경 실패";
    throw new Error(msg);
  }
}

// 관리자 데시보드_게시글 관리_리스트
export async function featchAllPost(): Promise<AdminPost[]> {
  try {
    const response = await api.get("/api/admin/posts");
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "게시글 목록 조회 실패";
    throw new Error(msg);
  }
}

// 관리자 데시보드_게시글 관리_논리삭제
export async function deleteAdminPost(id: number): Promise<void> {
  try {
    await api.patch(`/api/admin/posts/${id}/delete`);
  } catch (error: any) {
    const msg = error.response?.data?.message || "게시글 삭제 실패";
    throw new Error(msg);
  }
}
// 관리자 데시보드_게시글 복구
export async function restoreAdminPost(id: number): Promise<void> {
  try {
    await api.patch(`/api/admin/posts/${id}/restore`);
  } catch (error: any) {
    const msg = error.response?.data?.message || "게시글 복구 실패";
    throw new Error(msg);
  }
}

// 관리자 데시보드_멘토 신청 전체 리스트
export async function fetchAdminAllMentorRequestList(): Promise<
  AdMentorRequest[]
> {
  try {
    const response = await api.get("/api/admin/mentor/request/list");
    return response.data.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "멘토 신청 전체 목록 조회 실패";
    throw new Error(msg);
  }
}

// 관리자 데시보드_멘토 신청 최종 승인(FINAL_APPROVED)
export async function approveMentorRequestFinal(id: number): Promise<void> {
  try {
    await api.patch(`/api/admin/mentor/request/${id}/approve/final`);
  } catch (error: any) {
    const msg = error.response?.data?.message || "최종 승인 처리 실패";
    throw new Error(msg);
  }
}
