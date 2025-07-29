// components/PopularPosts.tsx
import Link from "next/link";
import { PostListDto } from "../../types";
import styles from "./BoardList.module.css";

interface Props {
  posts: PostListDto[];
}

export default function PopularPosts({ posts }: Props) {
  return (
    <div className={styles["popular-card"]}>
      <div className={styles["popular-card-header"]}>
        <h3>주간 인기순</h3>
        <span className={styles["icon"]}>👍</span>
      </div>

      <ul className={styles["popular-list"]}>
        {posts.map((post, index) => (
          <li key={post.id}>
            <div className={styles["rank"]}>{index + 1}</div>
            <div className={styles["title"]}>
              <Link href={`/community/${post.regionId}/${post.id}`}>
                {post.title}
              </Link>
            </div>
            <div className={styles["like-count"]}>
              <span>👍 {post.likes}</span> <span>👁️ {post.views}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
