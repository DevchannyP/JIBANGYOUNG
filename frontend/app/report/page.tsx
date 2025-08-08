// app/admin/report-detail/page.tsx

const DUMMY_REPORT = {
  id: 123,
  reporterName: "예록",
  userId: "yerok67",
  reasonDescription: "부적절한 게시글",
  createdAt: "2025-08-08T10:10:00",
  reviewResultCode: "PENDING",
  reasonDetail: "욕설 및 비방 내용 포함",
  reasonCode: "SWEAR",
  url: "https://example.com/community/123",
};

export default async function AdminReportDetailPopup({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  // 실제에선 id로 fetch, 지금은 더미 데이터만 사용
  const report = DUMMY_REPORT;

  return (
    <html>
      <head>
        <title>신고 상세</title>
        <meta name="viewport" content="width=480" />
        <style>{`
          body { font-family: 'Malgun Gothic', Arial, sans-serif; background: #f9fafb; margin: 0; }
          .modal-header { background: #0d8cf0; color: #fff; font-weight: bold; font-size: 18px; padding: 16px; }
          .modal-content { background: #fff; border-radius: 8px; margin: 18px; padding: 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.09); }
          .modal-content label { font-weight: bold; display: inline-block; width: 96px; color: #222; }
        `}</style>
      </head>
      <body>
        <div className="modal-header">신고 상세</div>
        <div className="modal-content">
          <div style={{ marginBottom: 10 }}>
            <label>신고 ID</label>
            <span>{report.id}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>신고자</label>
            <span>{report.reporterName ?? report.userId}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>유형</label>
            <span>{report.reasonDescription}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>신고일</label>
            <span>{formatDate(report.createdAt)}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>상태</label>
            <span>{report.reviewResultCode}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>사유</label>
            <textarea
              readOnly
              value={report.reasonDetail ?? report.reasonCode ?? ""}
              style={{
                width: "100%",
                minHeight: 80,
                fontSize: 14,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #eee",
              }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>URL</label>
            {report.url ? (
              <a href={report.url} target="_blank" rel="noopener noreferrer">
                {report.url}
              </a>
            ) : (
              <span>-</span>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

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
