// libs/api/dashboard/monthlyHot.api.ts

export interface MonthlyHotPostDto {
  id: number;
  no: string;
  title: string;
  author: string;
  views: number;
  likes: number;
  regionId: number;
  regionName: string;
}

export async function getMonthlyHotTop10(): Promise<MonthlyHotPostDto[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const res = await fetch(`${baseUrl}/api/dashboard/monthly-hot/top10`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("월간 인기글 데이터를 불러올 수 없습니다.");
  return res.json();
}

// libs/api/dashboard/monthlyHot.api.ts

// 1. ReviewPostDto 타입 (백엔드와 정확히 일치)
export interface ReviewPostDto {
  id: number;
  regionId: number;
  title: string;
  content: string;
  author: string;
  regionName: string;
  thumbnailUrl?: string | null;
}

// 2. Top3 조회 API
export async function getReviewTop3(): Promise<ReviewPostDto[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const res = await fetch(`${baseUrl}/api/dashboard/monthly-hot/review-top3`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("인기 후기 데이터를 불러올 수 없습니다.");
  // ✅ 아래처럼, 반드시 "배열" 자체만 리턴해야 함
  return await res.json();
}



// ✅ 범용 타입!
export function getPostUrl(row: { regionId: number; id: number }) {
  if (!row.regionId || !row.id) return "";
  return `/community/${row.regionId}/${row.id}`;
}