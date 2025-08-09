// ---------- [1] ENUM/공통 타입 ----------
export type UserRole = "USER" | "ADMIN" | "MENTOR_A" | "MENTOR_B" | "MENTOR_C";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED" | "PENDING";
export type PostCategory = "FREE" | "QUESTION" | "NOTICE" | "REVIEW";

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
  targetPostId: number;
  targetPostTitle: string;
  createdAt: string;
  regionId: number; // 이 필드 추가
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

// ---------- [3] 지역 점수/랭킹/이벤트 DTO (추가) ----------
// /types/api/mypage.types.ts
export interface RegionScoreDto {
  regionId: number;
  regionName: string;
  postCount: number;
  commentCount: number;
  mentoringCount: number;
  score: number;
  promotionProgress: number; // 0~1
  daysToMentor: number;
  scoreHistory: {
    date: string;
    delta: number;
    reason: string;
  }[];
}


// 내 모든 지역별 점수 (MyRegionScoreDto)
export interface MyRegionScoreDto {
  regionId: number;
  score: number;
}

// TOP-N 랭킹 DTO
export interface RegionScoreRankingDto {
  userId: number;
  nickname?: string;
  regionId: number;
  regionName: string;
  score: number;
}

// 활동 이벤트 기록 DTO
export interface ActivityEventDto {
  userId: number;
  regionId: number;
  actionType: string;
  refId?: number;
  scoreDelta?: number;
  ipAddr?: string;
  userAgent?: string;
  createdAt?: string;
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
