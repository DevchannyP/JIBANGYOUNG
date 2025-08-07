import { DownloadButton } from "@/app/admin/components/AdminDownBtn";
import {
  AdMentorRequest,
  MentorRequestStatus,
} from "@/types/api/adMentorRequest";

const STATUS_LABELS: Record<
  MentorRequestStatus,
  { label: string; color: string }
> = {
  APPROVED: { label: "멘토 승인", color: "#36b37e" },
  PENDING: { label: "승인 대기", color: "#fbbf24" },
  REJECTED: { label: "멘토 미승인", color: "#ef4444" },
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

  const region = regionOptions.find((r) => r.code === app.regionId);
  const regionName = region ? region.name : app.regionId;
  const statusInfo = STATUS_LABELS[app.status as MentorRequestStatus] || {
    label: app.status,
    color: "#ccc",
  };

  return (
    <tr onClick={onClick} style={{ cursor: "pointer" }}>
      <td>{total - index}</td>
      <td>{app.userName}</td>
      <td>{app.userEmail}</td>
      <td>{regionName}</td>
      <td>
        {app.createdAt ? app.createdAt.slice(0, 16).replace("T", " ") : ""}
      </td>
      <td>{app.reviewedBy ? app.reviewedBy : "미지정"}</td>
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
        <DownloadButton
          fileUrl={app.documentUrl}
          onClick={handleDownloadClick}
        />
      </td>
    </tr>
  );
}
