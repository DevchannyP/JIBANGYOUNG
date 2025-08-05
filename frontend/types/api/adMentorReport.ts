// 1. 타입 선언 (최상단에)
export type ReportTabType = "게시글" | "댓글" | "유저";
export type ReportType = "POST" | "COMMENT" | "USER";
export type StatusType =
  | "PENDING"
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "IGNORED"
  | "INVALID";

// 2. 인터페이스 선언
export interface Report {
  id: number;
  userId: number;
  reporterName?: string;
  targetType: ReportType;
  targetId: number;
  targetTitle?: string;
  reasonCode: string;
  reasonDescription: string;
  reasonDetail?: string | null;
  createdAt: string;
  reviewResultCode: StatusType;
  reviewedAt?: string | null;
  reviewedBy?: number | null;
  reviewerName?: string;
  regionId: number;
  url?: string;
  targetUserStatus: string;
}

// 3. 옵션/상수 선언 (하단에)
export const reportTypeLabel: Record<ReportType, string> = {
  POST: "게시글",
  COMMENT: "댓글",
  USER: "유저",
};

export const REPORT_TAB_OPTIONS: ReportTabType[] = ["게시글", "댓글", "유저"];
export const reportTabToType: Record<ReportTabType, ReportType> = {
  게시글: "POST",
  댓글: "COMMENT",
  유저: "USER",
};
