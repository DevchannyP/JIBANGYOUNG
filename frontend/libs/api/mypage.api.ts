// libs/api/mypage.api.ts
import type {
  ActivityEventDto,
  CommentPreviewDto,
  GetMyPostsResponse,
  MyRegionScoreDto,
  MyReportDto,
  RecommendRegionResultDto,
  RegionScoreDto,
  RegionScoreRankingDto,
  SurveyAnswerDto,
  SurveyResponseGroupsResponse,
  UserProfileDto
} from "@/types/api/mypage.types";
import { api } from "../utils/api";

// ----------- [프로필] -----------
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

// ----------- [게시글] -----------
export interface GetMyPostsParams {
  userId: number;
  page?: number;
  size?: number;
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

// ----------- [댓글] -----------
export interface GetMyCommentsParams {
  userId: number;
  page?: number; // 1-base (프론트) → 0-base (백엔드) 변환 필요
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 현재 페이지(0-base)
  size: number;
  // ...기타 Spring Page 필드
}

export async function getMyComments(
  params: GetMyCommentsParams
): Promise<PageResponse<CommentPreviewDto>> {
  const { userId, page = 1, size = 10 } = params;
  // ✅ 이전 방식 복구: /mypage/users/${userId} (comments 아님)
  const res = await api.get(`/mypage/users/${userId}`, {
    params: { page: page - 1, size }, // Spring pageable 0-base!
  });
  return res.data; // { content, totalElements, ... }
}

export async function deleteMyComment(
  userId: number,
  commentId: number
): Promise<void> {
  // ✅ 이전 방식 복구: /mypage/users/${userId}/${commentId}
  await api.delete(`/mypage/users/${userId}/${commentId}`);
}

// ----------- [설문 응답 묶음/상세/추천] -----------
export interface GetSurveyResponseGroupsParams {
  userId: number;
  page?: number;
  size?: number;
}
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

export async function getSurveyAnswersByResponseId(
  responseId: number
): Promise<SurveyAnswerDto[]> {
  const { data } = await api.get(`/mypage/survey-responses/${responseId}/answers`);
  return data.data;
}

export async function getSurveyResultRecommendRegion(
  responseId: number
): Promise<RecommendRegionResultDto> {
  const { data } = await api.get(`/mypage/survey-responses/${responseId}/recommend-region`);
  return data.data;
}

// ----------- [지역 점수/랭킹/내 점수/이벤트] -----------
export async function getMyRegionScores(): Promise<MyRegionScoreDto[]> {
  // userId는 JWT에서 추출(백엔드 @AuthenticationPrincipal 사용)
  const res = await api.get("/mypage/region-score/my");
  return res.data.data as MyRegionScoreDto[];
}

export async function getRegionScore(regionId: number): Promise<RegionScoreDto> {
  const res = await api.get(`/mypage/region-score/${regionId}`);
  return res.data.data as RegionScoreDto;
}

export async function getRegionRanking(
  regionId: number,
  size: number = 10
): Promise<RegionScoreRankingDto[]> {
  const res = await api.get("/mypage/region-score/ranking", { params: { regionId, size } });
  return res.data.data as RegionScoreRankingDto[];
}

export async function postActivityEvent(dto: ActivityEventDto): Promise<void> {
  await api.post("/mypage/region-score/activity", dto);
}

// ----------- [신고 이력] -----------
export async function getMyReports(userId: number): Promise<MyReportDto[]> {
  if (!userId) throw new Error("로그인 정보가 필요합니다");
  const res = await api.get("/mypage/reports", { params: { userId } });
  const reports = Array.isArray(res.data) ? res.data : res.data.data;
  if (!Array.isArray(reports)) throw new Error("신고내역 데이터 오류");
  return reports as MyReportDto[];
}
