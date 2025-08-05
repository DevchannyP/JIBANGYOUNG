import api from "@/libs/api/axios";
import { AdMentorLogList } from "@/types/api/adMentorLogList";
import { Report } from "@/types/api/adMentorReport";
import { AdMentorUser } from "@/types/api/adMentorUser";

// 1. 내 지역 멘토 목록
export async function fetchMentorRegionUsers(): Promise<AdMentorUser[]> {
  const res = await api.get("/api/mentor/local");
  return res.data;
}

// 2. 멘토 신고 목록
export async function fetchMentorReports(type?: string): Promise<Report[]> {
  const res = await api.get("/api/mentor/report", {
    params: type ? { type } : {},
  });
  return res.data;
}

// 3. 신고 상태 변경
export async function requestReportApproval(
  id: number,
  status: "REQUESTED" | "IGNORED" | "INVALID" | "PENDING"
): Promise<void> {
  await api.patch(`/api/mentor/report/${id}/status`, { status });
}

// 4. 활동로그 리스트
export async function fetchAdMentorLogList(): Promise<AdMentorLogList[]> {
  const res = await api.get("/api/mentor/logList");
  return res.data;
}
