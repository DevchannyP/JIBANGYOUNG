import { api } from "../utils/api";

// ---------- [1] ENUM/공통 타입 ----------
export type UserRole = "USER" | "ADMIN" | "MENTOR_A" | "MENTOR_B" | "MENTOR_C";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED" | "PENDING";
export type PostCategory = "FREE" | "QUESTION" | "SETTLEMENT_REVIEW";

// ✅ "alerts" 탭 완전히 제거!
export type Tab =
  | "edit"
  | "score"
  | "posts"
  | "comments"
  | "surveys"
  | "reports"; // "alerts" 없음!

// Sidebar 메뉴 구조
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

export interface AlertInfoDto {
  id: number;
  region: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

// ✅ [설문 응답: 응답 묶음/상세]
export interface SurveyAnswerDto {
  answerId: number;       // PK
  responseId: number;     // 설문 1회 제출 묶음
  userId: number;
  questionId: string;
  optionCode: string;
  answerText: string;
  answerWeight: number;
  submittedAt: string;
}

// 묶음 그룹(1회 설문 제출)
export interface SurveyResponseGroupDto {
  responseId: number;
  userId: number;
  answerCount: number; // 해당 묶음의 답변 갯수
  submittedAt: string;
}

// 설문 응답 묶음 리스트(페이지네이션)
export interface SurveyResponseGroupsResponse {
  responses: SurveyResponseGroupDto[];
  totalCount: number;
}

// 추천 결과 DTO
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
  targetType: string;         // POST | COMMENT | USER | POLICY
  targetId: number;
  reasonCode: string;
  reasonDetail: string | null;
  createdAt: string;
  reviewResultCode: string;   // PENDING | APPROVED 등
}

// ---------- [3] API 함수 ----------

// [프로필]
export async function getMyProfile(userId: number): Promise<UserProfileDto> {
  const res = await api.get(`/mypage/users/${userId}/profile`);
  return res.data.data;
}

export async function patchMyProfile(
  userId: number,
  input: Partial<UserProfileDto>
): Promise<void> {
  await api.patch(`/mypage/users/${userId}/profile`, input);
}

// [게시글]
export interface GetMyPostsParams {
  userId: number;
  page?: number;
  size?: number;
}
export interface GetMyPostsResponse {
  posts: PostPreviewDto[];
  totalCount: number;
}
export async function getMyPosts(
  params: GetMyPostsParams
): Promise<GetMyPostsResponse> {
  const { userId, page = 1, size = 10 } = params;
  const res = await api.get(`/mypage/users/${userId}/posts`, {
    params: { page, size },
  });
  return res.data.data as GetMyPostsResponse;
}

// [댓글]
export interface GetMyCommentsParams {
  userId: number;
  page?: number;
  size?: number;
}
export interface GetMyCommentsResponse {
  comments: CommentPreviewDto[];
  totalCount: number;
}
export async function getMyComments(
  params: GetMyCommentsParams
): Promise<GetMyCommentsResponse> {
  const { userId, page = 1, size = 10 } = params;
  const res = await api.get(
    `/mypage/users/${userId}/comments`, {
      params: { page, size }
    }
  );
  return res.data.data as GetMyCommentsResponse;
}

export async function deleteMyComment(
  userId: number,
  commentId: number
): Promise<void> {
  await api.delete(`/mypage/users/${userId}/comments/${commentId}`);
}

// [알림]
export interface GetMyAlertsParams {
  userId: number;
  page?: number;
  size?: number;
}
export interface GetMyAlertsResponse {
  alerts: AlertInfoDto[];
  totalCount: number;
}
export async function getMyAlerts(
  params: GetMyAlertsParams
): Promise<GetMyAlertsResponse> {
  const { userId, page = 1, size = 10 } = params;
  const res = await api.get(
    `/mypage/users/${userId}/alerts`, {
      params: { page, size }
    }
  );
  return res.data.data as GetMyAlertsResponse;
}

// ✅ [설문 응답 묶음/상세/추천]
export interface GetSurveyResponseGroupsParams {
  userId: number;
  page?: number;
  size?: number;
}
// 설문 응답 "묶음" 리스트
export async function getSurveyResponseGroups({
  userId,
  page = 1,
  size = 10,
}: GetSurveyResponseGroupsParams): Promise<SurveyResponseGroupsResponse> {
  const { data } = await api.get("/mypage/survey-response-groups", {
    params: { userId, page, size }
  });
  return data.data;
}

// 응답 묶음(responseId)별 문항 상세
export async function getSurveyAnswersByResponseId(
  responseId: number
): Promise<SurveyAnswerDto[]> {
  const { data } = await api.get(`/mypage/survey-responses/${responseId}/answers`);
  return data.data; // SurveyAnswerDto[]
}

// 추천 결과 (responseId 기준)
export async function getSurveyResultRecommendRegion(
  responseId: number
): Promise<RecommendRegionResultDto> {
  const { data } = await api.get(`/mypage/survey-responses/${responseId}/recommend-region`);
  return data.data;
}

// [지역 점수]
export async function getRegionScore(regionId: number): Promise<RegionScoreDto> {
  const res = await api.get(`/api/mypage/region-score/${regionId}`);
  return res.data as RegionScoreDto;
}

// [신고 이력]
export async function getMyReports(userId: number): Promise<MyReportDto[]> {
  if (!userId) throw new Error("로그인 정보가 필요합니다");
  const res = await api.get("/mypage/reports", { params: { userId } });
  const reports = Array.isArray(res.data) ? res.data : res.data.data;
  if (!Array.isArray(reports)) throw new Error("신고내역 데이터 오류");
  return reports as MyReportDto[];
}
