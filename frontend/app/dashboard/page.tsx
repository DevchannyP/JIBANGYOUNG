import { Suspense } from "react";
import CommunitySectionServer from "./CommunitySectionServer";
import SkeletonDashboard from "./components/DashboardSectionSkeleton";
import DashboardScrollAnimator from "./DashboardScrollAnimator";
import MainSectionServer from "./MainSectionServer";
import RegionRankingSectionServer from "./RegionRankingSectionServer";

// ✅ 메타데이터 (SEO)
export const metadata = {
  title: "지방청년 – 내게 맞는 청년 정책, 웃긴 커뮤니티, 정착 정보까지",
  description: "지방청년은 청년을 위한 정책 추천, 커뮤니티, 지역 랭킹, 정착 지원 정보까지 한 번에 제공합니다. 내게 맞는 정책을 찾고 웃긴 커뮤니티에서 소통해보세요.",
  openGraph: {
    title: "지방청년 – 청년 정책/커뮤니티/정착 정보 대시보드",
    description: "청년 정책, 지역 정착, 웃긴 커뮤니티까지 한 번에! 대한민국 청년을 위한 종합 정보 서비스, 지방청년.",
    images: [
      { url: "/social/dashboard/JibangYoung.webp", width: 1200, height: 630, alt: "지방청년 대시보드 대표 이미지" },
    ],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "지방청년 – 내게 맞는 청년 정책, 정착 정보, 커뮤니티 대시보드",
    description: "청년을 위한 정책 추천, 정착 지원, 커뮤니티까지 모두 담은 지방청년 대시보드.",
    images: ["/social/dashboard/JibangYoung.webp"],
  },
  metadataBase: new URL("https://jibangyoung.kr"),
};

export default async function DashboardPage() {
  // ⬇️ 각 Section을 SSR로 렌더하되, 클라 Wrapper로 Intersection/LazyMount/dot-nav 구현
  return (
    <DashboardScrollAnimator>
      <Suspense fallback={<SkeletonDashboard section="main" />}>
        <MainSectionServer />
      </Suspense>
      <Suspense fallback={<SkeletonDashboard section="community" />}>
        <CommunitySectionServer />
      </Suspense>
      <Suspense fallback={<SkeletonDashboard section="region" />}>
        <RegionRankingSectionServer />
      </Suspense>
    </DashboardScrollAnimator>
  );
}
