// libs/api/dashboard/policyhot.api.ts
import api from "@/libs/api/axios"; // ✅ 커스텀 axios 인스턴스 사용

export interface PolicyHotDto {
  no: string;       // "01", "02", ...
  id: number;       // 정책 고유번호
  name: string;
  region: string;
  value: string;
}

// API 호출
export async function getPolicyHotTop10(): Promise<PolicyHotDto[]> {
  const res = await api.get("/api/dashboard/policyhot/top10");

  // 1차/2차 구조 대응
  if (Array.isArray(res.data)) {
    return (res.data as unknown[]).filter(
      (row: any): row is PolicyHotDto =>
        !!row &&
        typeof row.no === "string" &&
        typeof row.id === "number" &&
        typeof row.name === "string" &&
        typeof row.region === "string" &&
        typeof row.value === "string"
    );
  }

  if (Array.isArray(res.data?.data)) {
    return (res.data.data as unknown[]).filter(
      (row: any): row is PolicyHotDto =>
        !!row &&
        typeof row.no === "string" &&
        typeof row.id === "number" &&
        typeof row.name === "string" &&
        typeof row.region === "string" &&
        typeof row.value === "string"
    );
  }

  throw new Error("예상치 못한 응답 구조: " + JSON.stringify(res.data));
}
