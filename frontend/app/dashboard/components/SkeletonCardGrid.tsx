import Skeleton from "react-loading-skeleton";
export default function SkeletonCardGrid({ count = 3 }: { count?: number }) {
  return (
    <div aria-live="polite" aria-busy="true">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} height={112} style={{ marginBottom: 8 }} />
        ))}
    </div>
  );
}
