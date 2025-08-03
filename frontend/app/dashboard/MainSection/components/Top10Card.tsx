// app/dashboard/CommunitySection/components/Top10Card.tsx
"use client";

import type { PostListDto } from "@/app/community/types";
import { useRouter } from "next/navigation";
import styles from "../MainSection.module.css";

const rankEmoji = ["🥇", "🥈", "🥉", "", "", "", "", "", "", ""];

interface Props {
  posts: PostListDto[];
  isLoading: boolean;
  isError: boolean;
  error?: any;
  currIdx: number;
  onListHover?: (idx: number) => void;
}

export default function Top10Card({
  posts,
  isLoading,
  isError,
  currIdx,
  onListHover,
}: Props) {
  const router = useRouter();

  if (isLoading)
    return (
      <section className={styles.top10Box} aria-busy="true">
        <ul className={styles.top10ListBox}>
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className={styles.top10ListItem}>
              <span className={styles.top10ListRank}>{i + 1}</span>
              <span className={styles.top10ListTitle}>로딩 중...</span>
              <span className={styles.top10ListEmoji}>⏳</span>
            </li>
          ))}
        </ul>
      </section>
    );

  if (isError)
    return (
      <section className={styles.top10Box}>
        <ul className={styles.top10ListBox}>
          <li className={styles.top10ListItem}>
            <span className={styles.top10ListTitle}>인기글을 불러오지 못했습니다 😢</span>
          </li>
        </ul>
      </section>
    );

  if (!posts.length)
    return (
      <section className={styles.top10Box}>
        <ul className={styles.top10ListBox}>
          <li className={styles.top10ListItem}>
            <span className={styles.top10ListTitle}>등록된 인기글이 없습니다</span>
          </li>
        </ul>
      </section>
    );

  return (
    <section className={styles.top10Box} aria-label="주간 인기글 TOP10">
      <ul className={styles.top10ListBox}>
        {posts.slice(0, 10).map((post, idx) => (
          <li
            key={post.id || idx}
            tabIndex={0}
            className={
              styles.top10ListItem +
              (idx === currIdx ? ` ${styles.top10ListItemActive}` : "")
            }
            aria-label={`${idx + 1}위 ${post.title}`}
            title={post.title}
            // ✅ regionId와 id로 이동 경로 변경!
            onClick={() => router.push(`/community/${post.regionId}/${post.id}`)}
            onKeyDown={e =>
              ["Enter", " "].includes(e.key) &&
              router.push(`/community/${post.regionId}/${post.id}`)
            }
            onMouseEnter={() => onListHover?.(idx)}
            onFocus={() => onListHover?.(idx)}
          >
            <span className={styles.top10ListRank}>{idx + 1}</span>
            <span className={styles.top10ListTitle}>
              {post.title?.length > 36 ? post.title.slice(0, 36) + "..." : post.title}
            </span>
            <span className={styles.top10ListEmoji}>{rankEmoji[idx] ?? "⭐"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
