import type { DetailProps } from "@/app/community/types";
import { PostListDto } from "@/app/community/types";

// 최신 인기글 리스트 /api/community/popular?page=${page}&size=${size}
export async function fetchPopularPosts(
  page: number,
  size: number = 10
): Promise<{ posts: PostListDto[]; totalPages: number }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/community/popular?page=${page}&size=${size}`,
    {
      next: { revalidate: 300 },
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
//
export async function fetchCommunityPostsByRegion(
  regionCode: string,
  page: number = 1
): Promise<{ posts: PostListDto[]; totalPages: number }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/community/region/${regionCode}?page=${page}`,
    {
      next: { revalidate: 3 },
    }
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

export async function fetchPostDetail(postId: string): Promise<DetailProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/community/post/${postId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("게시글 상세 정보를 불러오지 못했습니다");
  }

  const data = await res.json();

  return {
    title: data.title,
    author: data.author,
    createdAt: data.createdAt,
    views: data.views,
    likes: data.likes,
    content: data.content,
  };
}

export interface CreatePostRequest {
  title: string;
  category: "FREE" | "QUESTION" | "SETTLEMENT_REVIEW";
  content: string;
  regionId: number;
  userId: number;
}

export async function createCommunityPost(
  payload: CreatePostRequest
): Promise<void> {
  console.log(payload);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/community/write`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`게시글 등록 실패: ${error}`);
  }
}
