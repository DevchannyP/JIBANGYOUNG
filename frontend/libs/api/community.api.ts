// libs/api/community.api.ts

import { PostListDto } from "@/app/community/types";


const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL이 정의되지 않았습니다.");

export async function fetchPopularPosts(
  period: 'today' | 'week'
): Promise<PostListDto[]> {
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const endpoint =
    period === 'today'
      ? '/api/community/top-liked-today'
      : '/api/community/top-liked-week';

  const res = await fetch(`${BASE}${endpoint}`, { cache: 'no-store' });
  if (!res.ok) {
    console.error(`API 요청 실패 [${res.status}]: ${res.statusText}`, `${BASE}${endpoint}`);
    throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`);
  }
  return res.json();
}