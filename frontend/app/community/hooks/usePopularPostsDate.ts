// libs/api/community/fetchPopularPostsByPeriod.ts
import { PostListDto } from "@/app/community/types";

export async function fetchPopularPostsByPeriod(period: "today" | "week" | "month"): Promise<PostListDto[]> {
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${BASE}/api/community/top-liked?period=${period}`, {
    // 서버 컴포넌트에서 최신 데이터 가져오기 위해 사용
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
