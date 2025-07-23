import { useQuery } from "@tanstack/react-query";
import { api } from "../../../libs/utils/api";
import styles from "./MyPageLayout.module.css";

interface AlertInfo {
  id: number;
  region: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function MyAlertList({ userId }: { userId: number }) {
  const { data, isLoading } = useQuery<{ alerts: AlertInfo[] }>({
    queryKey: ["user", "alerts"],
    queryFn: async () => (await api.get(`/users/${userId}/alerts?page=1`)).data,
    staleTime: 1000 * 60 * 3,
  });

  if (isLoading) return <div>불러오는 중...</div>;
  if (!data?.alerts?.length) return <div>알림이 없습니다.</div>;

  return (
    <section>
      <div className={styles.mypageSectionTitle}>
        관심지역 알림
        <hr />
      </div>
      <ul className={styles.mypageList}>
        {data.alerts.map((a) => (
          <li key={a.id} className={styles.mypageListItem}>
            <span>
              [{a.region}] {a.message}
            </span>
            <span className={styles.mypageListTime}>{a.createdAt}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
