import { fetchPopularPosts } from "@/libs/api/community/community.api";
import { useQuery } from "@tanstack/react-query";

export function usePopularPostsList(page: number) {
  return useQuery({
    queryKey: ["popular-posts", page],
    queryFn: () => fetchPopularPosts(page),
    staleTime: 1000 * 60, // 1분
  });
}
