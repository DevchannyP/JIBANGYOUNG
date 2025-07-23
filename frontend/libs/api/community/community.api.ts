import { PostListDto } from "@/app/community/types";

export async function fetchPopularPosts(
  page: number,
  size: number = 10
): Promise<{ posts: PostListDto[]; totalPages: number }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/community/popular?page=${page}&size=${size}`,
    {
      next: { revalidate: 60 }, // SSG 캐싱 (선택)
    }
  );

  if (!res.ok) {
    throw new Error("인기글 데이터를 불러오지 못했습니다");
  }

  const data = await res.json();

  return {
    posts: data.content,
    totalPages: data.totalPages,
  };
}
export async function fetchCommunityPostsByRegion(
  regionCode: string,
  page: number = 1
): Promise<{ posts: PostListDto[]; totalPages: number }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/community/${regionCode}?page=${page}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("지역 게시판 데이터를 불러오지 못했습니다");
  }

  const data = await res.json();

  return {
    posts: data.content,
    totalPages: data.totalPages,
  };
}