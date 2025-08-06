// libs/api/dashboard/reviewTop.api.ts
import api from "@/libs/api/axios";
import { ReviewPostDto, ReviewPostWithRank } from "@/types/dashboard/ReviewPostDto";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const FALLBACK_THUMBNAIL = "/default-review-thumb.webp";

// 인기 정착 후기 Top3 조회 (API 응답: ReviewPostDto[])
export async function fetchReviewTop3(): Promise<ReviewPostWithRank[]> {
  const { data } = await api.get<ReviewPostDto[]>("/api/dashboard/review-top/top3");

  // 썸네일 유효성 보정
  return (data ?? []).map((item) => ({
    ...item,
    thumbnailUrl: item.thumbnailUrl && item.thumbnailUrl.trim().length > 0
      ? item.thumbnailUrl
      : FALLBACK_THUMBNAIL,
    // no와 regionName은 백엔드에서 이미 올바른 형태로 제공되므로 그대로 사용
  }));
}

// React Query 훅
export function useReviewTop3Query(): UseQueryResult<ReviewPostWithRank[], Error> {
  return useQuery<ReviewPostWithRank[], Error>({
    queryKey: ["dashboard", "reviewTop3"],
    queryFn: fetchReviewTop3,
    staleTime: 1000 * 60 * 5,   // 5분
    gcTime: 1000 * 60 * 10,     // 10분
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}
