import { useQuery } from "@tanstack/react-query";
import { PostListDto } from "@/app/community/types";

export function usePopularPostsDate(period: "today" | "week" | "month") {
  return useQuery<PostListDto[]>({
    queryKey: ["popularPosts", period],
    queryFn: async () => {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
      const res = await fetch(`${BASE}/api/community/top-liked?period=${period}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`);
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
