"use client";

import { getRegionFavoriteTop10 } from "@/libs/api/dashboard/dashboard.api";
import { useQuery } from "@tanstack/react-query";

/**
 * [커스텀 훅] 정책 찜 인기 지역 TOP10 쿼리
 * - 항상 빈배열 보장
 */
export function useRegionRankQuery() {
  return useQuery({
    queryKey: ["region", "favorite", "top10"],
    queryFn: getRegionFavoriteTop10,
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 15,    // 15분
    select: (data) => (Array.isArray(data) ? data : []),
  });
}
