import {
  Report,
  StatusType,
  reportTypeLabel,
} from "@/types/api/adMentorReport";

// 상태별 라벨/컬러 정의
const STATUS_MAP: Record<StatusType, { label: string; color: string }> = {
  PENDING: { label: "검토중", color: "#fbbf24" },
  APPROVED: { label: "승인", color: "#36b37e" },
  REJECTED: { label: "반려", color: "#ef4444" },
  IGNORED: { label: "무시", color: "#999" },
  INVALID: { label: "무효", color: "#b8b8b8" },
  REQUESTED: { label: "승인요청중", color: "#2986ff" },
};

interface MentorReportListRowProps {
  report: Report;
  onClick: () => void;
  onUrlClick: (e: React.MouseEvent, url?: string) => void;
}

// 날짜 포맷 함수 (YYYY.MM.DD)
function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr.replace("T", " ").slice(0, 10);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export const MentorReportListRow: React.FC<MentorReportListRowProps> = ({
  report,
  onClick,
  onUrlClick,
}) => {
  const status = STATUS_MAP[report.reviewResultCode] ?? {
    label: report.reviewResultCode,
    color: "#bbb",
  };

  return (
    <tr onClick={onClick} style={{ cursor: "pointer" }}>
      <td>{report.id}</td>
      <td>{reportTypeLabel[report.targetType]}</td>
      <td>{formatDate(report.createdAt)}</td>
      <td>
        <span style={{ color: status.color, fontWeight: 700 }}>
          • {status.label}
        </span>
      </td>
      <td>{report.reporterName ?? report.userId}</td>
      <td>
        {report.url ? (
          <button
            onClick={(e) => onUrlClick(e, report.url)}
            style={{
              cursor: "pointer",
              border: "none",
              background: "transparent",
              fontSize: "1.1em",
              color: "#2563eb",
            }}
            title="해당 게시물/댓글 바로가기"
            tabIndex={-1}
          >
            🔗
          </button>
        ) : (
          "-"
        )}
      </td>
    </tr>
  );
};
