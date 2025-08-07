export type MentorRequestStatus =
  | "FINAL_APPROVED"
  | "SECOND_APPROVED"
  | "FIRST_APPROVED"
  | "REQUESTED"
  | "PENDING"
  | "REJECTED";

export interface AdMentorRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  regionId: number;
  reason: string;
  governmentAgency: boolean;
  documentUrl: string;
  status: string; // "APPROVED" | "PENDING" | "REJECTED"
  createdAt: string; // ISO 날짜 문자열, ex) "2025-08-07T14:23:00"
  reviewedAt?: string; // Optional (검토일시가 없을 수 있음)
  reviewedBy?: number; // Optional (검토자가 없을 수 있음)
  rejectionReason?: string; // Optional (반려사유)
}
