// app/dashboard/MainSection/components/useMonthlyHotTop10Query.ts

import { getMonthlyHotTop10, MonthlyHotPostDto } from "@/libs/api/dashboard/monthlyHot.api";
import { useQuery } from "@tanstack/react-query";

export function useMonthlyHotTop10Query() {
  return useQuery<MonthlyHotPostDto[], Error>({
    queryKey: ["monthlyHotTop10"],
    queryFn: getMonthlyHotTop10,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
}
