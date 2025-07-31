// 📁 app/dashboard/RegionRankingSectionServer.tsx
import RegionRankingSectionClient from "./RegionRankingMainSection/RegionRankingSectionClient";
import styles from "./RegionRankingMainSection/RegionTabSlider.module.css";

// ✅ SSR: regions prop을 fetch해서 CSR에 넘김 (ISR 적용)
export default async function RegionRankingSectionServer() {
  let regions: string[] = [];
  try {
    const API_BASE_URL =
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL || // 환경변수 모두 대응
      "http://localhost:8080";
    const res = await fetch(`${API_BASE_URL}/api/dashboard/region/tabs`, {
      next: { revalidate: 120 }, // ISR 2분 캐싱
    });
    const data = await res.json();
    // ✅ 다양한 백엔드 응답 케이스 대응
    regions = Array.isArray(data) ? data : (data?.regions ?? []);
  } catch (e) {
    regions = []; // fetch 실패시 빈 배열 처리(SSR 안전)
  }

  return (
    <section className={styles.rankingSectionRoot} aria-label="지역 랭킹 섹션">
      <RegionRankingSectionClient regions={regions} />
    </section>
  );
}
