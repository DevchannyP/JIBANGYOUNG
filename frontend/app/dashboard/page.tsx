import { Suspense } from "react";
import DashboardClientWrapper from "./DashboardClientWrapper"; // ✅ CSR Wrapper

// ✅ App Router SEO 최적화 방식 (metadata)
export const metadata = {
  title: "지방청년 – 내게 맞는 청년 정책, 웃긴 커뮤니티, 정착 정보까지",
  description:
    "지방청년은 청년을 위한 정책 추천, 커뮤니티, 지역 랭킹, 정착 지원 정보까지 한 번에 제공합니다. 내게 맞는 정책을 찾고 웃긴 커뮤니티에서 소통해보세요.",
  openGraph: {
    title: "지방청년 – 청년 정책/커뮤니티/정착 정보 대시보드",
    description:
      "청년 정책, 지역 정착, 웃긴 커뮤니티까지 한 번에! 대한민국 청년을 위한 종합 정보 서비스, 지방청년.",
    images: [
      {
        url: "/social/dashboard/JibangYoung.webp",
        width: 1200,
        height: 630,
        alt: "지방청년 대시보드 대표 이미지",
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "지방청년 – 내게 맞는 청년 정책, 정착 정보, 커뮤니티 대시보드",
    description:
      "청년을 위한 정책 추천, 정착 지원, 커뮤니티까지 모두 담은 지방청년 대시보드.",
    images: ["/social/dashboard/JibangYoung.webp"],
  },
  metadataBase: new URL("https://jibangyoung.kr"), // 실제 도메인 사용
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardClientWrapper />
    </Suspense>
  );
}
