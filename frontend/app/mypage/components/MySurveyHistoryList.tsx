import { useQuery } from "@tanstack/react-query";
import { api } from "../../../libs/utils/api";
import styles from "./MyPageLayout.module.css";

interface SurveyHistory {
  id: number;
  title: string;
  participatedAt: string;
  resultUrl: string;
  isFavorite: boolean;
}

export default function MySurveyHistoryList() {
  const { data, isLoading } = useQuery<{ surveys: SurveyHistory[] }>({
    queryKey: ["user", "surveys"],
    queryFn: async () => (await api.get("/users/me/surveys")).data,
    staleTime: 1000 * 60 * 3,
  });

  if (isLoading) return <div>불러오는 중...</div>;
  if (!data?.surveys?.length) return <div>설문 이력이 없습니다.</div>;

  return (
    <section>
      <div className={styles.mypageSectionTitle}>
        설문 응답 이력
        <hr />
      </div>
      <ul className={styles.mypageList}>
        {data.surveys.map((s) => (
          <li key={s.id} className={styles.mypageListItem}>
            <a
              href={s.resultUrl}
              style={{ color: "#306bff", textDecoration: "underline" }}
            >
              {s.title}
            </a>
            <span className={styles.mypageListTime}>{s.participatedAt}</span>
            {s.isFavorite && <span style={{ color: "#ffe140" }}>★</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
