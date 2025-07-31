import type { DetailProps } from "@/app/community/types";
import { PostListDto } from "@/app/community/types";
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

// 최신 인기글 리스트 /api/community/popular?page=${page}&size=${size}
export async function fetchPopularPosts(
  page: number
): Promise<{ posts: PostListDto[]; totalPages: number }> {
  const res = await fetch(`${BASE}/api/community/popular?page=${page}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("인기글 데이터를 불러오지 못했습니다");
  }

  const data = await res.json();

  return {
    posts: data.content,
    totalPages: data.totalPages,
  };
}

export async function fetchPopularPostsByPeriod(
  period: "today" | "week" | "month"
): Promise<PostListDto[]> {
  const res = await fetch(`${BASE}/api/community/top-liked?period=${period}`, {
    // 서버 컴포넌트에서 최신 데이터 가져오기 위해 사용
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
export async function fetchPostsByRegion(
  regionCode: string,
  page: number
): Promise<{ posts: PostListDto[]; totalPages: number }> {
  const res = await fetch(
    `${BASE}/api/community/region/${regionCode}?page=${page}`,
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
  const res = await fetch(`${BASE}/api/community/post/${postId}`, {
    cache: "no-store",
  });

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
  const res = await fetch(`${BASE}/api/community/write`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    alert(errorData[0].defaultMessage);
    throw new Error(errorData[0].defaultMessage);
  }
}
