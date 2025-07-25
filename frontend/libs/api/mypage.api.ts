import { api } from "../utils/api";

// ---------- [1] ENUM/공통 타입 ----------

export type UserRole = "USER" | "ADMIN" | "MENTOR_A" | "MENTOR_B" | "MENTOR_C";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED" | "PENDING";

// 마이페이지 탭 키
type Tab =
  | "edit"
  | "score"
  | "posts"
  | "comments"
  | "surveys"
  | "favorites"
  | "alerts"
  | "reports";

export type { Tab };

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
  region: string;
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
  region: string;
  postCount: number;
  commentCount: number;
  mentoringCount: number;
  score: number;
  promotionProgress: number;
  daysToMentor: number;
  scoreHistory?: Array<{
    date: string;
    delta: number;
    reason: string;
  }>;
}

// ---------- [3] API 함수 ----------

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
  const res = await api.get(
    `/mypage/users/${userId}/posts?page=${page}&size=${size}`
  );
  return res.data.data;
}

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
    `/mypage/users/${userId}/comments?page=${page}&size=${size}`
  );
  return res.data.data;
}

export async function deleteMyComment(
  userId: number,
  commentId: number
): Promise<void> {
  await api.delete(`/mypage/users/${userId}/comments/${commentId}`);
}

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
    `/mypage/users/${userId}/alerts?page=${page}&size=${size}`
  );
  return res.data.data;
}

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
    `/mypage/users/${userId}/surveys?page=${page}&size=${size}&sort=${sort}`
  );
  return res.data.data;
}

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
    `/mypage/surveys/favorites?page=${page}&size=${size}&sort=${sort}`,
    {
      headers: { "X-User-Id": userId },
    }
  );
  return res.data.data;
}

export async function toggleSurveyFavorite(
  userId: number,
  favoriteId: number
): Promise<void> {
  await api.post(`/mypage/surveys/favorites/${favoriteId}/toggle`, null, {
    headers: { "X-User-Id": userId },
  });
}

export async function getRegionScore(region: string): Promise<RegionScoreDto> {
  const res = await api.get(`/mypage/region-scores/${region}`);
  return res.data.data;
}
