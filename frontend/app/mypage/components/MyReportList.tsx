import { useQuery } from "@tanstack/react-query";
import { api } from "../../../libs/utils/api";
import styles from "./MyPageLayout.module.css";

interface ReportInfo {
  id: number;
  type: "post" | "comment";
  targetTitle: string;
  reason: string;
  reportedAt: string;
  status: "접수됨" | "처리중" | "처리완료";
}

export default function MyReportList({ userId }: { userId: number }) {
  const { data, isLoading } = useQuery<{ reports: ReportInfo[] }>({
    queryKey: ["user", "reports"],
    queryFn: async () =>
      (await api.get(`/users/${userId}/reports?page=1`)).data,
    staleTime: 1000 * 60 * 3,
  });

  if (isLoading) return <div>불러오는 중...</div>;
  if (!data?.reports?.length) return <div>신고 내역이 없습니다.</div>;

  return (
    <section>
      <div className={styles.mypageSectionTitle}>
        신고 이력
        <hr />
      </div>
      <ul className={styles.mypageList}>
        {data.reports.map((r) => (
          <li key={r.id} className={styles.mypageListItem}>
            <div>
              <span style={{ fontWeight: 700 }}>
                {r.type === "post" ? "게시글" : "댓글"}
              </span>
              <span style={{ marginLeft: 6 }}>{r.targetTitle}</span>
              <span className={styles.mypageListTime}>{r.reportedAt}</span>
              <span style={{ marginLeft: 8 }}>{r.status}</span>
            </div>
            <div style={{ fontSize: 13, color: "#888" }}>사유: {r.reason}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
