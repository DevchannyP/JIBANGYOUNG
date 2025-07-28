"use client";

import { getMyReports, MyReportDto } from "@/libs/api/mypage.api";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Ban, CheckCircle2, Clock10, XCircle } from "lucide-react";
import styles from "../MyPageLayout.module.css";

// [상태별 라벨/색상/아이콘]
const REVIEW_RESULT_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: "검토중", color: "#fbbf24", icon: <Clock10 size={17} /> },
  APPROVED: { label: "승인", color: "#36b37e", icon: <CheckCircle2 size={17} /> },
  REJECTED: { label: "반려", color: "#ef4444", icon: <XCircle size={17} /> },
  IGNORED: { label: "무시", color: "#999", icon: <Ban size={17} /> },
  INVALID: { label: "무효", color: "#b8b8b8", icon: <AlertCircle size={17} /> },
};

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr.replace("T", " ").slice(0, 10);
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" });
}

function ReportListSkeleton() {
  return (
    <ul className={styles.mypageList} aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className={`${styles.mypageListItem} ${styles.skeletonCard}`}>
          <div className={styles.mypageListRow} style={{ minHeight: 38 }}>
            <span className={styles.mypageListLabel + " " + styles.skeletonBar} />
            <span className={styles.mypageListTitle + " " + styles.skeletonBar} />
            <span className={styles.mypageListStatus + " " + styles.skeletonBar} />
            <span className={styles.mypageListDate + " " + styles.skeletonBar} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function ReportListItem({ report }: { report: MyReportDto }) {
  const { label, color, icon } =
    REVIEW_RESULT_MAP[report.reviewResultCode] ?? { label: report.reviewResultCode, color: "#bbb", icon: null };

  let typeLabel: string;
  switch (report.targetType) {
    case "POST": typeLabel = "게시글"; break;
    case "COMMENT": typeLabel = "댓글"; break;
    case "USER": typeLabel = "사용자"; break;
    case "POLICY": typeLabel = "정책"; break;
    default: typeLabel = report.targetType;
  }

  return (
    <li
      className={styles.mypageListItem + " " + styles.reportCard}
      tabIndex={0}
      aria-label={`신고대상: ${typeLabel}, 상태: ${label}`}
    >
      <div className={styles.mypageListRow}>
        <span className={styles.mypageListLabel}>{typeLabel}</span>
        <span className={styles.mypageListTitle} title={report.reasonDetail || ""}>
          {report.reasonCode}
        </span>
        <span
          className={styles.mypageListStatus}
          aria-label={`상태: ${label}`}
          style={{
            background: color + "15",
            color,
            fontWeight: 700,
            borderRadius: 7,
            padding: "2.5px 13px 2.5px 8px",
            marginLeft: 7,
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            minWidth: 56,
            boxShadow: `0 0 0 1.5px ${color}22`,
            transition: "box-shadow 0.17s",
          }}
        >
          <span style={{ marginRight: 2, display: "inline-flex" }}>{icon}</span>
          {label}
        </span>
        <span className={styles.mypageListDate} style={{ marginLeft: 9 }}>
          {formatDate(report.createdAt)}
        </span>
      </div>
      {report.reasonDetail && (
        <div className={styles.mypageListDesc}>
          <span>사유: {report.reasonDetail}</span>
        </div>
      )}
    </li>
  );
}

// ✅ userId를 props로 받도록 변경
export default function MyReportList({ userId }: { userId: number }) {
  const { data, isLoading, isError, refetch } = useQuery<MyReportDto[]>({
    queryKey: ["mypage", "reports", userId],
    queryFn: () => getMyReports(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  });

  if (!userId)
    return (
      <div className={styles.mypageLoading}>로그인 후 이용해주세요.</div>
    );
  if (isLoading) return <ReportListSkeleton />;
  if (isError)
    return (
      <div className={styles.mypageLoading} role="alert" tabIndex={0}>
        <AlertCircle size={22} style={{ marginRight: 9, color: "#e75a4a", verticalAlign: "middle" }} />
        <span style={{ color: "#e75a4a", fontWeight: 600 }}>신고 목록을 불러오지 못했습니다.</span>
        <div style={{ fontSize: "0.96em", color: "#a19e9e", marginTop: 6 }}>
          <button onClick={() => refetch()}>다시 시도</button>
        </div>
      </div>
    );
  if (!data || !Array.isArray(data) || data.length === 0)
    return (
      <div className={styles.mypageLoading} tabIndex={0}>
        <CheckCircle2 size={22} style={{ marginRight: 9, color: "#b8b8b8", verticalAlign: "middle" }} />
        <span style={{ color: "#b1b1b1" }}>신고 내역이 없습니다.</span>
      </div>
    );

  return (
    <section className={styles.mypageSection} aria-labelledby="my-report-title">
      <h2 id="my-report-title" className={styles.mypageSectionTitle}>
        내 신고 이력
      </h2>
      <ul className={styles.mypageList} aria-live="polite">
        {data.map((report) => (
          <ReportListItem key={report.id} report={report} />
        ))}
      </ul>
    </section>
  );
}
