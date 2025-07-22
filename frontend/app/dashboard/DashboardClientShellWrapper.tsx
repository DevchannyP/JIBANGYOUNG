// // ✅ app/dashboard/DashboardClientShellWrapper.tsx
// "use client";

// import dynamic from "next/dynamic";

// // 클라이언트 전용 동적 import
// const DashboardClientShell = dynamic(() => import("./DashboardClientShell"), {
//   ssr: false,
//   loading: () => <div>로딩 중입니다...</div>,
// });

// export default function DashboardClientShellWrapper() {
//   return <DashboardClientShell />;
// }
