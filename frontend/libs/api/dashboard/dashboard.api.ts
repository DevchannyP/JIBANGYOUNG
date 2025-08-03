import axios from "axios";

// 실제 백엔드 DTO 구조 100% 반영
export interface RegionFavoriteRankDto {
  regionCode: number;
  sido: string;
  guGun1: string | null;
  guGun2: string | null;
  favoriteCount: number;
}

/**
 * [API] 정책 찜 인기 지역 TOP 10
 * - 항상 배열 반환 (에러, undefined → [])
 */
export async function getRegionFavoriteTop10(): Promise<RegionFavoriteRankDto[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
      "http://localhost:8080";
    const res = await axios.get(`${apiUrl}/api/dashboard/region/top10`);

    // 1. Envelope(data) → [{}, {}]
    if (Array.isArray(res.data?.data)) return res.data.data;
    // 2. 직접 배열
    if (Array.isArray(res.data)) return res.data;
    // 3. 잘못된 구조 → 빈 배열
    return [];
  } catch {
    // 네트워크 오류 등 → 빈 배열
    return [];
  }
}
