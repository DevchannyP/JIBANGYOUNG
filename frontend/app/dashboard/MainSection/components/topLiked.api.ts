// app/dashboard/MainSection/components/topLiked.api.ts
import type { PostListDto } from "@/app/community/types";

// 오늘의 인기글(좋아요순) 최대 10개
export async function fetchTodayLikedPosts(
  page: number = 1,
  size: number = 10
): Promise<{ posts: PostListDto[]; totalPages: number }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/community/top-liked?period=today&page=${page}&size=${size}`,
    {
      next: { revalidate: 120 },
    }
  );
  if (!res.ok) throw new Error("오늘의 인기글을 불러오지 못했습니다");
  const data = await res.json();
  return {
    posts: data.content,
    totalPages: data.totalPages,
  };
}
