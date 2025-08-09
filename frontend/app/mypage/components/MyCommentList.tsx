"use client";

import { deleteMyComment, getMyComments } from "@/libs/api/mypage.api";
import type { CommentPreviewDto } from "@/types/api/mypage.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styles from "../MyPageLayout.module.css";

// 날짜 포맷 (YY.MM.DD)
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

// Skeleton UI
function CommentListSkeleton() {
  return (
    <ul className={styles.mypageList} aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className={styles.mypageListItem + " animate-pulse"}>
          <div
            className={styles.mypageListTitle}
            style={{
              width: "62%",
              background: "#eee",
              height: 18,
              borderRadius: 6,
              marginBottom: 8,
            }}
          />
          <div
            className={styles.mypageListTime}
            style={{
              width: 100,
              background: "#ececec",
              height: 14,
              borderRadius: 6,
            }}
          />
        </li>
      ))}
    </ul>
  );
}

// Pagination: Spring Page 기반 페이징
function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (n: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pageList = (() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [page - 2, page - 1, page, page + 1, page + 2];
  })();

  return (
    <nav className={styles.paginationNav} aria-label="댓글 페이지네이션">
      <button
        className={styles.pageBtn}
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        aria-label="이전 페이지"
      >
        &lt;
      </button>
      {pageList[0] > 1 && <span className={styles.pageEllipsis}>...</span>}
      {pageList.map((num) => (
        <button
          key={num}
          className={`${styles.pageBtn} ${page === num ? styles.pageBtnActive : ""}`}
          onClick={() => setPage(num)}
          aria-current={page === num ? "page" : undefined}
        >
          {num}
        </button>
      ))}
      {pageList[pageList.length - 1] < totalPages && (
        <span className={styles.pageEllipsis}>...</span>
      )}
      <button
        className={styles.pageBtn}
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        aria-label="다음 페이지"
      >
        &gt;
      </button>
    </nav>
  );
}

// ----- Main Component -----
interface MyCommentListProps {
  userId: number;
}

export default function MyCommentList({ userId }: MyCommentListProps) {
  const [page, setPage] = useState(1);
  const size = 10;
  const queryClient = useQueryClient();

  // Spring Page<CommentPreviewDto> 사용!
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["user", userId, "comments", { page, size }],
    queryFn: () => getMyComments({ userId, page, size }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: (commentId: number) => deleteMyComment(userId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId, "comments"] });
    },
  });

  // Spring Page: 0-base 반환, 프론트는 1-base 유지
  const content: CommentPreviewDto[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = (data?.number ?? 0) + 1;

  if (isLoading || isFetching) return <CommentListSkeleton />;
  if (isError)
    return (
      <div className={styles.mypageLoading}>
        댓글을 불러오지 못했습니다.{" "}
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  if (!content.length) return <div>댓글이 없습니다.</div>;

  return (
    <section aria-labelledby="my-comments-title">
      <div id="my-comments-title" className={styles.sectionTitle}>
        내 댓글
      </div>
      <ul className={styles.mypageList}>
        {content.map((c: CommentPreviewDto) => (
          <li
            key={c.id}
            className={styles.mypageListItem}
            tabIndex={0}
            aria-label={`${c.targetPostTitle}에 단 댓글: ${c.content} (${formatDate(c.createdAt)})`}
          >
            <div className={styles.mypageListTitle}>{c.content}</div>
            <div className={styles.mypageListTime}>
              <a
                className={styles.mypageCommentTarget}
                href={c.regionId ? `/community/${c.regionId}/${c.targetPostId}` : `/community/post/${c.targetPostId}`}
                tabIndex={-1}
                aria-label="해당 게시글로 이동"
                target="_blank"
                rel="noopener noreferrer"
              >
                {c.targetPostTitle}
              </a>
              <span> / {formatDate(c.createdAt)}</span>
            </div>
            <button
              className={styles.commentDeleteBtn}
              onClick={() => handleDelete(c.id)}
              aria-label="댓글 삭제"
              disabled={isPending}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      <Pagination page={currentPage} totalPages={totalPages} setPage={setPage} />
    </section>
  );
}