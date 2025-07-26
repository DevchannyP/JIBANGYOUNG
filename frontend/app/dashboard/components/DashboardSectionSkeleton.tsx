// /app/(dashboard)/components/DashboardSectionSkeleton.tsx

export default function DashboardSectionSkeleton({ section }: { section: string }) {
  return (
    <div
      style={{
        height: section === "main" ? 480 : 320,
        background: section === "main" ? "#FFE140" : "#f5f5f5",
        width: "100%",
        borderRadius: 14,
        margin: "20px 0",
      }}
      aria-busy="true"
    />
  );
}
