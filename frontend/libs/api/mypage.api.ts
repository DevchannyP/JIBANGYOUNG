import { api } from "../utils/api";

// ---------- [1] ENUM/공통 타입 ----------
export type UserRole = "USER" | "ADMIN" | "MENTOR_A" | "MENTOR_B" | "MENTOR_C";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED" | "PENDING";
export type PostCategory = "FREE" | "QUESTION" | "SETTLEMENT_REVIEW";

// 마이페이지 탭 키
export type Tab =
  | "edit"
  | "score"
  | "posts"
  | "comments"
  | "surveys"
  | "favorites"
  | "alerts"
  | "reports";

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

export interface SurveyHistoryDto {
  id: number;
  title: string;
  participatedAt: string;
  resultUrl?: string;
  isFavorite: boolean;
}

export interface SurveyFavoriteDto {
  id: number;
  title: string;
  isFavorite: boolean;
  participatedAt?: string;
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

// [설문 이력]
export interface GetMySurveyHistoryParams {
  userId: number;
  page?: number;
  size?: number;
  sort?: "recent" | "favorite";
}
export interface GetMySurveyHistoryResponse {
  surveys: SurveyHistoryDto[];
  totalCount: number;
}
export async function getMySurveyHistory(
  params: GetMySurveyHistoryParams
): Promise<GetMySurveyHistoryResponse> {
  const { userId, page = 1, size = 10, sort = "recent" } = params;
  const res = await api.get(
    `/mypage/users/${userId}/surveys`, {
      params: { page, size, sort }
    }
  );
  return res.data.data as GetMySurveyHistoryResponse;
}

// [설문 즐겨찾기]
export interface GetSurveyFavoritesParams {
  userId: number;
  page?: number;
  size?: number;
  sort?: "recent" | "title";
}
export interface GetSurveyFavoritesResponse {
  favorites: SurveyFavoriteDto[];
  totalCount: number;
}
export async function getSurveyFavorites(
  params: GetSurveyFavoritesParams
): Promise<GetSurveyFavoritesResponse> {
  const { userId, page = 1, size = 10, sort = "recent" } = params;
  const res = await api.get(
    `/mypage/surveys/favorites`, {
      params: { page, size, sort },
      headers: { "X-User-Id": userId },
    }
  );
  return res.data.data as GetSurveyFavoritesResponse;
}

export async function toggleSurveyFavorite(
  userId: number,
  favoriteId: number
): Promise<void> {
  await api.post(`/mypage/surveys/favorites/${favoriteId}/toggle`, null, {
    headers: { "X-User-Id": userId },
  });
}

// [지역 점수]
export async function getRegionScore(regionId: number): Promise<RegionScoreDto> {
  const res = await api.get(`/api/mypage/region-score/${regionId}`);
  return res.data as RegionScoreDto;
}
