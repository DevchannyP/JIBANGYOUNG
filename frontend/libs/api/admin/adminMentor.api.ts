import api from "@/libs/api/axios";
import { AdMentorLogList } from "@/types/api/adMentorLogList";
import { Report } from "@/types/api/adMentorReport";
import { AdMentorRequest } from "@/types/api/adMentorRequest";

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
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "IGNORED"
    | "INVALID"
    | "REQUESTED"
): Promise<void> {
  await api.patch(`/api/mentor/report/${id}/status`, { status });
}

// 4. 활동로그 리스트
export async function fetchAdMentorLogList(): Promise<AdMentorLogList[]> {
  const res = await api.get("/api/mentor/logList");
  return res.data;
}

// 5. 멘토 신청목록_리스트 조회
export async function fetchAdMentorRequestList(): Promise<AdMentorRequest[]> {
  const res = await api.get("/api/mentor/request/list");
  return res.data.data;
}

// 6. 멘토 신청목록 처리상태_1차 승인
export async function approveMentorRequestFirst(id: number) {
  await api.patch(`/api/mentor/request/${id}/approve/first`);
}

// 멘토 신청목록 처리상태_2차 승인
export async function approveMentorRequestSecond(id: number) {
  await api.patch(`/api/mentor/request/${id}/approve/second`);
}

// 멘토 신청목록 처리상태_반려(미승인)
export async function rejectMentorRequest(id: number, reason: string) {
  return api.patch(`/api/mentor/request/${id}/reject`, { reason });
}

// 멘토 신청목록 처리상태_승인요청
export async function requestMentorApproval(id: number) {
  await api.patch(`/api/mentor/request/${id}/request-approval`);
}
