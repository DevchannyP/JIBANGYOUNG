"use client";

import { getMyPosts, PostPreviewDto } from "@/libs/api/mypage.api";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import styles from "../MyPageLayout.module.css";

// 카테고리 문자열 → 숫자 매핑 (필요시 수정)
const CATEGORY_MAP: Record<string, number> = {
  FREE: 30,
  QUESTION: 40,
  SETTLEMENT_REVIEW: 50,
  // ... 실제 프로젝트에 맞게 추가
};

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr.replace("T", " ").slice(0, 10);
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" });
}

function PostListSkeleton() {
  return (
    <ul className={styles.mypageList} aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className={`${styles.mypageListItem} animate-pulse`}>
          <div className={styles.mypageListRow}>
            <span className={styles.mypageListLabel} style={{ width: 60, background: "#eee", borderRadius: 6 }} />
            <span
              className={styles.mypageListTitle}
              style={{ width: 120, background: "#eee", borderRadius: 6, marginLeft: 8 }}
            />
          </div>
          <span className={styles.mypageListTime} style={{ width: 80, background: "#eee", borderRadius: 6 }} />
        </li>
      ))}
    </ul>
  );
}

export default function MyPostList() {
  const user = useUserStore((s) => s.user);
  const userId = user?.id ?? 0;
  const page = 1, size = 10;

  const query = useQuery({
    queryKey: ["mypage", "posts", userId, { page, size }],
    queryFn: async () => {
      if (!userId) return { posts: [], totalCount: 0 };
      return getMyPosts({ userId, page, size });
    },
    select: (data) => ({
      posts: Array.isArray(data.posts) ? data.posts : [],
      totalCount: Number(data.totalCount ?? 0),
    }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    placeholderData: (prev) => prev,
  });

  const { data, isLoading, isFetching, isError, refetch } = query;

  if (!userId) return <div className={styles.mypageLoading}>로그인 후 이용해주세요.</div>;
  if (isLoading || isFetching) return <PostListSkeleton />;
  if (isError)
    return (
      <div className={styles.mypageLoading} role="alert">
        게시글을 불러오지 못했습니다. <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  if (!data || data.posts.length === 0)
    return <div className={styles.mypageLoading}>게시글이 없습니다.</div>;

  return (
    <section aria-labelledby="my-posts-title">
      <div id="my-posts-title" className={styles.sectionTitle}>
        내 게시글
      </div>
      <ul className={styles.mypageList}>
        {data.posts.map((p: PostPreviewDto) => {
          // category가 숫자면 그대로, 아니면 매핑
          const categoryId =
            typeof p.category === "number"
              ? p.category
              : CATEGORY_MAP[p.category] ?? p.category;

          return (
            <li key={`${p.id}-${p.createdAt}`} className={styles.mypageListItem}>
              <Link
                href={`/community/${categoryId}/${p.id}`}
                tabIndex={0}
                aria-label={`게시글 ${p.title}`}
                className={styles.mypageListLink}
              >
                <div className={styles.mypageListRow}>
                  <span className={styles.mypageListLabel}>
                    [{p.category}]
                    {p.isNotice && <span className={styles.noticeBadge}>공지</span>}
                    {p.isMentorOnly && <span className={styles.mentorBadge}>멘토전용</span>}
                  </span>
                  <span className={styles.mypageListTitle}>{p.title}</span>
                  {p.tag && <span className={styles.mypageListTag}>#{p.tag}</span>}
                </div>
                <div className={styles.mypageListMeta}>
                  <span className={styles.mypageListMetaItem}>👍 {p.likes}</span>
                  <span className={styles.mypageListMetaItem}>조회 {p.views}</span>
                  <span className={styles.mypageListTime}>{formatDate(p.createdAt)}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
