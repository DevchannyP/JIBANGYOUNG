// app/dashboard/MainSection/components/usePopularPostsQuery.ts
import type { PostListDto } from "@/app/community/types";
import { fetchPopularPosts } from "@/libs/api/community/community.api";
import { useQuery } from "@tanstack/react-query";

export function usePopularPostsQuery() {
  return useQuery<{ posts: PostListDto[]; totalPages: number }>({
    queryKey: ["popular-posts", 1, 10],
    queryFn: () => fetchPopularPosts(1),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분 (v5 이상에서 cacheTime 대신)
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
