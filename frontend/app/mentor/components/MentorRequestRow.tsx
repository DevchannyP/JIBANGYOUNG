import { DownloadButton } from "@/app/admin/components/AdminDownBtn";
import {
  AdMentorRequest,
  MentorRequestStatus,
} from "@/types/api/adMentorRequest";

const STATUS_LABELS: Record<
  MentorRequestStatus,
  { label: string; color: string }
> = {
  FINAL_APPROVED: { label: "최종 승인", color: "#36b37e" },
  SECOND_APPROVED: { label: "2차 승인", color: "#28b0ff" },
  FIRST_APPROVED: { label: "1차 승인", color: "#49c7f5" },
  REQUESTED: { label: "승인 요청", color: "#b8b8b8" },
  PENDING: { label: "승인 대기", color: "#fbbf24" },
  REJECTED: { label: "반려", color: "#ef4444" },
};

export interface MentorRequestRowProps {
  app: AdMentorRequest;
  index: number;
  total: number;
  onClick: () => void;
  regionOptions: { code: number; name: string }[];
}

export function MentorRequestRow({
  app,
  index,
  total,
  onClick,
  regionOptions,
}: MentorRequestRowProps) {
  // 다운로드 버튼 클릭 시 row 클릭 이벤트 막기
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 지역명 가져오기
  const region = regionOptions.find((r) => r.code === app.regionId);
  const regionName = region ? region.name : app.regionId;

  // 상태 라벨/색상 정보
  const statusInfo = STATUS_LABELS[app.status as MentorRequestStatus] || {
    label: app.status,
    color: "#ccc",
  };

  // 담당자(없으면 미지정), 날짜 포맷
  const reviewedByLabel = app.reviewedBy ? app.reviewedBy : "미지정";
  const createdAtLabel = app.createdAt
    ? app.createdAt.slice(0, 16).replace("T", " ")
    : "";

  return (
    <tr onClick={onClick} style={{ cursor: "pointer" }}>
      <td>{total - index}</td>
      <td>{app.userName}</td>
      <td>{app.userEmail}</td>
      <td>{regionName}</td>
      <td>{createdAtLabel}</td>
      <td>{reviewedByLabel}</td>
      <td>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "12px",
            fontWeight: 600,
            background: "#f4f4f5",
            color: statusInfo.color,
            border: `1px solid ${statusInfo.color}`,
            fontSize: "0.95em",
            display: "inline-block",
            minWidth: 70,
            textAlign: "center",
          }}
        >
          {statusInfo.label}
        </span>
      </td>
      <td>
        {app.documentUrl ? (
          <DownloadButton
            fileUrl={app.documentUrl}
            onClick={handleDownloadClick}
          />
        ) : (
          <span style={{ color: "#aaa" }}>없음</span>
        )}
      </td>
    </tr>
  );
}
