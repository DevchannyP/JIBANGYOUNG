import api from "@/libs/api/axios";
import { Report } from "@/types/api/adMentorReport";

// 1. 멘토/관리자 신고내역 리스트 조회
export async function fetchMentorReports(type?: string): Promise<Report[]> {
  const res = await api.get("http://localhost:8080/api/mentor/report", {
    params: type ? { type } : {},
  });
  return res.data;
}

// 2. 멘토 승인 요청(PATCH)
export async function requestReportApproval(id: number): Promise<void> {
  await api.patch(`mentor/report/${id}/status`, { status: "REQUESTED" });
}

// (관리자 전용 블라인드 처리 등도 여기에 추가하면 됨)
