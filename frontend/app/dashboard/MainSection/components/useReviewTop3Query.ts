// app/dashboard/MainSection/components/useReviewTop3Query.ts
import { getReviewTop3 } from "@/libs/api/dashboard/monthlyHot.api";
import { useQuery } from "@tanstack/react-query";

export function useReviewTop3Query() {
  return useQuery({
    queryKey: ["reviewTop3"],
    queryFn: getReviewTop3,
    staleTime: 1000 * 60 * 10, // 10분
  });
}
