import axios from "axios";

export interface PolicyHotDto {
  no: string;
  name: string;
  region: string;
  value: string;
}

// ✅ 환경변수 활용 (배포/개발 모두 커버)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// API 호출을 항상 절대경로로!
export async function getPolicyHotTop10(): Promise<PolicyHotDto[]> {
  const res = await axios.get(`${API_BASE_URL}/api/dashboard/policyhot/top10`);

  if (Array.isArray(res.data)) {
    return (res.data as unknown[]).filter(
      (row: any): row is PolicyHotDto =>
        !!row &&
        typeof row.no === "string" &&
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
        typeof row.name === "string" &&
        typeof row.region === "string" &&
        typeof row.value === "string"
    );
  }

  throw new Error("예상치 못한 응답 구조: " + JSON.stringify(res.data));
}
