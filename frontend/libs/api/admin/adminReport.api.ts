import { Report } from "@/types/api/adMentorReport";
import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// 인스턴스 생성
const adminApi = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// accessToken 자동 부착 인터셉터 등록
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 관리자 - 신고 목록(REQUESTED만)
export async function fetchAdminReports(type?: string): Promise<Report[]> {
  const res = await adminApi.get("/api/admin/report", {
    params: type ? { type } : {},
  });
  return res.data;
}

// 관리자 - 신고 승인/반려 처리
export async function adminApproveOrRejectReport(
  id: number,
  status: "APPROVED" | "REJECTED"
): Promise<void> {
  await adminApi.patch(`/api/admin/report/${id}/status`, { status });
}
