import { getRegionScore } from "@/libs/api/mypage.api";
import type { RegionScoreDto } from "@/types/api/mypage.types";
import { useQuery } from "@tanstack/react-query";

// 커스텀 훅: 지역 점수 조회
export function useRegionScore(regionId?: number) {
  return useQuery<RegionScoreDto>({
    queryKey: ["region-score", regionId],
    queryFn: () => getRegionScore(regionId!),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 5,
  });
}
