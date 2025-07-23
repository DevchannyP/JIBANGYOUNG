import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../libs/utils/api";
import styles from "./MyPageLayout.module.css";

interface Survey {
  id: number;
  title: string;
  isFavorite: boolean;
}

export default function SurveyFavoritesPanel() {
  const queryClient = useQueryClient();

  // ✅ API는 { surveys: Survey[] } 형태로 내려옴, 하지만 즐겨찾기만 필터링해서 리턴
  const { data: favorites, isLoading } = useQuery<Survey[]>({
    queryKey: ["user", "surveys", "favorites"],
    queryFn: async () => {
      const res = await api.get<{ surveys: Survey[] }>("/users/me/surveys");
      return res.data.surveys.filter((s) => s.isFavorite);
    },
    staleTime: 1000 * 60 * 3,
  });

  const { mutate: onRemove } = useMutation({
    mutationFn: (surveyId: number) =>
      api.delete(`/users/me/surveys/favorites/${surveyId}`),
    onSuccess: () => {
      // ✅ key가 정확히 일치하도록
      queryClient.invalidateQueries({
        queryKey: ["user", "surveys", "favorites"],
      });
    },
  });

  if (isLoading) return <div>불러오는 중...</div>;
  if (!favorites || favorites.length === 0)
    return <div>즐겨찾기 설문이 없습니다.</div>;

  return (
    <section>
      <div className={styles.mypageSectionTitle}>
        즐겨찾기 설문{" "}
        <span style={{ fontSize: 14, color: "#aaa" }}>(최대 5개)</span>
        <hr />
      </div>
      <ul className={styles.mypageList}>
        {favorites.map((s) => (
          <li key={s.id} className={styles.mypageListItem}>
            <span>{s.title}</span>
            <button
              onClick={() => onRemove(s.id)}
              style={{
                background: "none",
                color: "#ff5555",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
                marginLeft: 12,
              }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
