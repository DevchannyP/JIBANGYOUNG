import { ReviewPostDto } from "@/types/ReviewPostDto";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewTop3 } from "./reviewTop.api";

// React Query 방식 (SWR 대체)
export function useReviewTop3Query() {
  const {
    data,
    error,
    isLoading,
    isError,
  } = useQuery<ReviewPostDto[]>({
    queryKey: ["dashboard", "reviewTop3"],
    queryFn: fetchReviewTop3,
    staleTime: 1000 * 60 * 10, // 10분
    retry: 1,
    // suspense: false // suspense 필요시 추가
  });

  return { data, error, isLoading, isError };
}
