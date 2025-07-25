// ✅ 클라이언트 전용 컴포넌트 선언
"use client";

import dynamic from "next/dynamic";
import SkeletonDashboard from "./components/SkeletonDashboard"; // ✅ 로딩 시 보여줄 Skeleton UI

/**
 * DashboardClientWrapper
 *
 * - Server Component에서는 dynamic(ssr: false)를 직접 사용할 수 없기 때문에
 *   이 Wrapper를 별도 client component로 분리함
 * - 대시보드 초기 렌더링 부하를 줄이기 위해 lazy loading + fallback 적용
 * - Suspense는 상위 Server Component에서 처리
 */

// ✅ DashboardClientShell은 CSR 전용 컴포넌트
const DashboardClientShell = dynamic(() => import("./DashboardClientShell"), {
  ssr: false,
  loading: () => <SkeletonDashboard />,
});

export default function DashboardClientWrapper() {
  return <DashboardClientShell />;
}
