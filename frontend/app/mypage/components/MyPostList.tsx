"use client";

import { getMyPosts, PostPreviewDto } from "@/libs/api/mypage.api";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import styles from "../MyPageLayout.module.css";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR");
}

function PostListSkeleton() {
  return (
    <ul className={styles.mypageList} aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className={`${styles.mypageListItem} animate-pulse`}>
          <div className={styles.mypageListRow}>
            <span
              className={styles.mypageListLabel}
              style={{ width: 60, background: "#eee", borderRadius: 6 }}
            />
            <span
              className={styles.mypageListTitle}
              style={{
                width: 120,
                background: "#eee",
                borderRadius: 6,
                marginLeft: 8,
              }}
            />
          </div>
          <span
            className={styles.mypageListTime}
            style={{ width: 80, background: "#eee", borderRadius: 6 }}
          />
        </li>
      ))}
    </ul>
  );
}

export default function MyPostList() {
  const user = useUserStore((state) => state.user);
  const page = 1,
    size = 10;

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["user", user?.id, "posts", { page, size }],
    // 반드시 userId 포함해서 전달
    queryFn: () =>
      user?.id
        ? getMyPosts({ userId: user.id, page, size })
        : Promise.resolve({ posts: [], totalCount: 0 }),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  if (isLoading || isFetching) return <PostListSkeleton />;
  if (isError)
    return (
      <div className={styles.mypageLoading} role="alert">
        게시글을 불러오지 못했습니다.{" "}
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  if (!data?.posts?.length) return <div>게시글이 없습니다.</div>;

  return (
    <section aria-labelledby="my-posts-title">
      <div id="my-posts-title" className={styles.sectionTitle}>
        내 게시글
      </div>
      <ul className={styles.mypageList}>
        {data.posts.map((p: PostPreviewDto) => (
          <li
            key={`${p.id}-${p.createdAt}`}
            className={styles.mypageListItem}
            tabIndex={0}
          >
            <div className={styles.mypageListRow}>
              <span className={styles.mypageListLabel}>[{p.region}]</span>
              <span className={styles.mypageListTitle}>{p.title}</span>
            </div>
            <span className={styles.mypageListTime}>
              {formatDate(p.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
