import type { DetailProps } from "@/app/community/types";
import { PostListDto } from "@/app/community/types";
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

// 날짜순 인기글 리스트
// /api/community/popular?page=${page}
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

// 인기순 리스트 (날짜 : "today" | "week" | "month")
// /api/community/top-liked?period=${period}
export async function fetchPopularPostsByPeriod(
  period: "today" | "week" | "month"
): Promise<PostListDto[]> {
  const res = await fetch(`${BASE}/api/community/top-liked?period=${period}`, {
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

// 게시글 상세 정보(디테일)
// /api/community/post/${postId}
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

// 게시판 작성 데이터 타입
export interface CreatePostRequest {
  title: string;
  category: "FREE" | "QUESTION" | "SETTLEMENT_REVIEW";
  content: string;
  regionId: number;
  userId: number;
}

// 게시판 작성
// /api/community/write
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

// 지역 게시판 인기
// /api/community/regionPopular/{regionCode}/?page=${page}
export async function getPostsByRegionPopular(
  regionCode: string,
  page: number
): Promise<{ posts: PostListDto[]; totalPages: number }> {
  const res = await fetch(
    `${BASE}/api/community/regionPopular/${regionCode}?page=${page}`,
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
