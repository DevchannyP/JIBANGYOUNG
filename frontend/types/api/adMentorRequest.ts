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
  nickname: string | null;
  userEmail: string;
  regionId: number;
  reason: string;
  governmentAgency: boolean;
  documentUrl: string;
  status: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: number;
  rejectionReason?: string; // Optional (반려사유)
}
