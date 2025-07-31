// 📁 libs/api/dashboard/region.api.ts
import axios from "axios";

export interface RegionDashCardDto {
  regionCode: number;
  guGun1: string;
  guGun2: string;
}

export interface RegionDashTabDto {
  sido: string;
  regions: RegionDashCardDto[];
}

// 모든 API 공통 Envelope 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  // message, code 등 필요한 경우 추가
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:8080";

/** 모든 시도(탭/슬라이더)명 배열 반환 */
export async function fetchRegionDashSidoTabs(): Promise<string[]> {
  const res = await axios.get<ApiResponse<string[]>>(
    `${API_BASE_URL}/api/dashboard/region/tabs`
  );
  // ⭐️ Envelope 구조에서 data 추출
  return Array.isArray(res.data.data) ? res.data.data : [];
}

/** 특정 시도 하위 구/군 카드 리스트 반환 */
export async function fetchRegionDashTab(sido: string): Promise<RegionDashTabDto> {
  const res = await axios.get<ApiResponse<RegionDashTabDto>>(
    `${API_BASE_URL}/api/dashboard/region/tab/${encodeURIComponent(sido)}`
  );
  // ⭐️ Envelope 구조에서 data 추출
  return res.data.data;
}
