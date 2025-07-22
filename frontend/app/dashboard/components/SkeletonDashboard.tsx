// SkeletonDashboard.tsx
export default function SkeletonDashboard() {
  return (
    <div className="p-8 text-center animate-pulse text-gray-500 space-y-4">
      <div className="h-6 w-2/3 bg-gray-300 rounded mx-auto" />
      <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto" />
      <div className="h-48 w-full max-w-2xl mx-auto bg-gray-100 rounded-xl" />
      <p className="text-sm text-gray-400">대시보드를 불러오는 중입니다...</p>
    </div>
  );
}
