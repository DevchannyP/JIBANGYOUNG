// mypage.types.ts

// ---------- [1] ENUM/공통 타입 ----------
export type UserRole = "USER" | "ADMIN" | "MENTOR_A" | "MENTOR_B" | "MENTOR_C";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED" | "PENDING";
export type PostCategory = "FREE" | "QUESTION" | "SETTLEMENT_REVIEW";

// 좌측 메뉴 - "alerts" 완전 제거
export type Tab =
  | "edit"
  | "score"
  | "posts"
  | "comments"
  | "surveys"
  | "reports"; // "alerts" 없음!

export interface SidebarMenuItem {
  key: Tab | string;
  label: string;
  external?: boolean;
  path?: string;
  roles?: UserRole[];
}

// ---------- [2] DTO 타입 ----------
export interface UserDto {
  id: number;
  username: string;
  email: string;
  nickname: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  profileImageUrl: string | null;
  birthDate: string | null;
  gender: "M" | "F" | null;
  region: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}
export type UserProfileDto = UserDto;

export interface PostPreviewDto {
  id: number;
  title: string;
  tag: string | null;
  category: PostCategory;
  isNotice: boolean;
  isMentorOnly: boolean;
  likes: number;
  views: number;
  createdAt: string;
}

export interface CommentPreviewDto {
  id: number;
  content: string;
  targetPostTitle: string;
  targetPostId: number;
  createdAt: string;
}

export interface SurveyAnswerDto {
  answerId: number;
  responseId: number;
  userId: number;
  questionId: string;
  optionCode: string;
  answerText: string;
  answerWeight: number;
  submittedAt: string;
}

export interface SurveyResponseGroupDto {
  responseId: number;
  userId: number;
  answerCount: number;
  submittedAt: string;
}
export interface SurveyResponseGroupsResponse {
  responses: SurveyResponseGroupDto[];
  totalCount: number;
}

export interface RecommendRegionResultDto {
  regionName: string;
  score: number;
  reason: string;
}

export interface RegionScoreDto {
  regionId: number;
  regionName: string;
  postCount: number;
  commentCount: number;
  mentoringCount: number;
  score: number;
  promotionProgress: number;
  daysToMentor: number;
  scoreHistory: {
    date: string;
    delta: number;
    reason: string;
  }[];
}

export interface MyReportDto {
  id: number;
  targetType: string; // POST | COMMENT | USER | POLICY
  targetId: number;
  reasonCode: string;
  reasonDetail: string | null;
  createdAt: string;
  reviewResultCode: string; // PENDING | APPROVED 등
}

// ----------------- [API 응답 타입] -----------------
export interface GetMyPostsResponse {
  posts: PostPreviewDto[];
  totalCount: number;
}

export interface GetMyCommentsResponse {
  comments: CommentPreviewDto[]; // ← page.content
  totalCount: number;            // ← page.totalElements
}


// ---------- [AlertInfoDto 타입 추가] ----------
export interface AlertInfoDto {
  id: number;
  region: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}