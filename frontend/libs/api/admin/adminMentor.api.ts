import api from "@/libs/api/axios";
import { Report } from "@/types/api/adMentorReport";
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

// 1. 멘토/관리자 신고내역 리스트 조회
export async function fetchMentorReports(type?: string): Promise<Report[]> {
  const res = await api.get("http://localhost:8080/api/mentor/report", {
    params: type ? { type } : {},
  });
  return res.data;
}

// 2. 신고 상태 변경 (승인요청/무시/무효 등)
export async function requestReportApproval(
  id: number,
  status: "REQUESTED" | "IGNORED" | "INVALID"
): Promise<void> {
  await api.patch(`${BASE}/api/mentor/report/${id}/status`, {
    status,
  });
}

// (관리자 전용 블라인드 처리 등도 여기에 추가하면 됨)
