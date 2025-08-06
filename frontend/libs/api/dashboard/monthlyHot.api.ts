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



// ✅ 범용 타입!
export function getPostUrl(row: { regionId: number; id: number }) {
  if (!row.regionId || !row.id) return "";
  return `/community/${row.regionId}/${row.id}`;
}