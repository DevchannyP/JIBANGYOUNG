"use client";

import { getSurveyResponseGroups } from "@/libs/api/mypage.api";
import type { SurveyResponseGroupDto } from "@/types/api/mypage.types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import styles from "../MyPageLayout.module.css";

interface MySurveyResponseGroupListProps {
  userId?: number;
}

function formatDate(str: string) {
  if (!str) return "-";
  const d = new Date(str);
  if (isNaN(d.getTime())) return str.replace("T", " ").slice(0, 16);
  return d.toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Skeleton = () => (
  <ul className={styles.mypageList} aria-busy="true">
    {Array.from({ length: 7 }).map((_, i) => (
      <li key={i} className={`${styles.mypageListItem} animate-pulse`}>
        <div className={styles.mypageListTitle} style={{ width: "48%", background: "#eee", height: 18, borderRadius: 6, marginBottom: 7 }} />
        <div className={styles.mypageListTime} style={{ width: 100, background: "#ececec", height: 13, borderRadius: 6 }} />
      </li>
    ))}
  </ul>
);

export default function MySurveyResponseGroupList({ userId }: MySurveyResponseGroupListProps) {
  const [page, setPage] = useState(1);
  const size = 10;
  const router = useRouter();

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["mypage", "survey-response-groups", userId, page, size],
    queryFn: () =>
      userId
        ? getSurveyResponseGroups({ userId, page, size })
        : Promise.resolve({ responses: [], totalCount: 0 }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: (prev) => prev,
  });

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));

  const Pagination = useCallback(() => {
    if (totalPages <= 1) return null;
    const pageList =
      totalPages <= 5
        ? Array.from({ length: totalPages }, (_, i) => i + 1)
        : page <= 3
        ? [1, 2, 3, 4, 5]
        : page >= totalPages - 2
        ? [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        : [page - 2, page - 1, page, page + 1, page + 2];
    return (
      <nav className={styles.paginationNav} aria-label="설문 응답 페이지네이션">
        <button className={styles.pageBtn} onClick={() => setPage(page - 1)} disabled={page === 1} aria-label="이전 페이지">&lt;</button>
        {pageList[0] > 1 && <span className={styles.pageEllipsis}>...</span>}
        {pageList.map((num) => (
          <button key={num} className={`${styles.pageBtn} ${page === num ? styles.pageBtnActive : ""}`} onClick={() => setPage(num)} aria-current={page === num ? "page" : undefined}>{num}</button>
        ))}
        {pageList[pageList.length - 1] < totalPages && <span className={styles.pageEllipsis}>...</span>}
        <button className={styles.pageBtn} onClick={() => setPage(page + 1)} disabled={page === totalPages} aria-label="다음 페이지">&gt;</button>
      </nav>
    );
  }, [page, totalPages]);

  if (!userId) return <div className={styles.mypageLoading}>로그인 후 이용해주세요.</div>;
  if (isLoading || isFetching) return <Skeleton />;
  if (isError)
    return (
      <div className={styles.mypageLoading}>
        설문 응답 묶음을 불러오지 못했습니다. <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  if (!data?.responses?.length)
    return <div className={styles.mypageLoading}>설문 참여 내역이 없습니다.</div>;

  return (
    <section aria-labelledby="my-survey-responses-title">
      <header className={styles.sectionTitle} id="my-survey-responses-title">
        <span>설문 참여 내역</span>
      </header>
      <ul className={styles.mypageList} role="list" aria-live="polite">
        {data.responses.map((g: SurveyResponseGroupDto) => (
<li
  key={g.responseId}
  className={styles.mypageListItem}
  tabIndex={0}
  aria-label={`설문응답번호: ${g.responseId}, 문항수: ${g.answerCount}, 작성일: ${formatDate(g.submittedAt)}`}
  onClick={() => router.push("/policy/recommendedList")} // ✅ 변경
  style={{ cursor: "pointer" }}
>
  <div className={styles.mypageListTitle}>
    <span>설문응답번호: {g.responseId}</span>
    <span className={styles.answerText}>문항 {g.answerCount}개</span>
  </div>
  <span className={styles.mypageListTime}>{formatDate(g.submittedAt)}</span>
</li>
        ))}
      </ul>
      <Pagination />
    </section>
  );
}