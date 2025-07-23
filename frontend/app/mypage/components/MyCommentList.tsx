import { useQuery } from "@tanstack/react-query";
import { api } from "../../../libs/utils/api";
import styles from "./MyPageLayout.module.css";

interface CommentPreview {
  id: number;
  content: string;
  targetPostTitle: string;
  createdAt: string;
}

export default function MyCommentList() {
  const { data, isLoading } = useQuery<{ comments: CommentPreview[] }>({
    queryKey: ["user", "comments"],
    queryFn: async () => (await api.get("/users/me/comments?page=1")).data,
    staleTime: 1000 * 60 * 3,
  });

  if (isLoading) return <div>불러오는 중...</div>;
  if (!data?.comments?.length) return <div>댓글이 없습니다.</div>;

  return (
    <section>
      <div className={styles.mypageSectionTitle}>
        내 댓글
        <hr />
      </div>
      <ul className={styles.mypageList}>
        {data.comments.map((c) => (
          <li key={c.id} className={styles.mypageListItem}>
            <div>{c.content}</div>
            <div className={styles.mypageListTime}>
              ({c.targetPostTitle} / {c.createdAt})
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
