import Link from "next/link";
import styles from "../Community.module.css";
import { PostListDto } from "../types";

interface Props {
  title: string;
  posts: PostListDto[];
}

export default function PopularCard({ title, posts }: Props) {
  return (
    <div className={styles["popular-card"]}>
      <div className={styles["popular-card-header"]}>
        <h3>{title}</h3>
        <span className={styles["icon"]}>👍</span>
      </div>

      <ul className={styles["popular-list"]}>
        {posts.map((p, idx) => (
          <li key={p.id}>
            <div className={styles["rank"]}>{idx + 1}</div>
            <div className={styles["title"]}>
              <Link href={`/community/${p.regionId}/${p.id}`}>{p.title}</Link>
            </div>
            <div className={styles["like-count"]}>
              <span>👍 {p.likes}</span> <span>👁️ {p.views}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
