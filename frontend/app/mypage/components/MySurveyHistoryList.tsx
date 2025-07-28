"use client";

import { getMySurveyHistory, SurveyHistoryDto } from "@/libs/api/mypage.api";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import styles from "../MyPageLayout.module.css";

// 날짜 포맷 함수
function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr.replace("T", " ").slice(0, 10);
  return date.toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

// 로딩 스켈레톤
function SurveyListSkeleton() {
  return (
    <ul className={styles.mypageList} aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className={`${styles.mypageListItem} animate-pulse`}>
          <div
            className={styles.mypageListTitle}
            style={{
              width: "70%",
              background: "#eee",
              height: 18,
              borderRadius: 6,
              marginBottom: 6,
            }}
          />
          <div
            className={styles.mypageListTime}
            style={{
              width: 90,
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

// 정렬 옵션
const SORT_OPTIONS = [
  { key: "recent", label: "최신순" },
  { key: "favorite", label: "즐겨찾기" },
];

export default function MySurveyHistoryList() {
  const user = useUserStore((s) => s.user);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"recent" | "favorite">("recent");
  const size = 10;

  const { data, isLoading, isError, isFetching, refetch } = useQuery<{
    surveys: SurveyHistoryDto[];
    totalCount: number;
  }>({
    queryKey: ["mypage", "surveys", user?.id, { page, size, sort }],
    queryFn: () =>
      user?.id
        ? getMySurveyHistory({ userId: user.id, page, size, sort })
        : Promise.resolve({ surveys: [], totalCount: 0 }),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: (prev) => prev,
  });

  // 총 페이지 계산
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));

  // 페이지네이션 컴포넌트
  function Pagination() {
    if (totalPages <= 1) return null;
    const pageList = (() => {
      if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (page <= 3) return [1, 2, 3, 4, 5];
      if (page >= totalPages - 2) return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
      return [page - 2, page - 1, page, page + 1, page + 2];
    })();
    return (
      <nav className={styles.paginationNav} aria-label="설문 이력 페이지네이션">
        <button
          className={styles.pageBtn}
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="이전 페이지"
        >&lt;</button>
        {pageList[0] > 1 && <span className={styles.pageEllipsis}>...</span>}
        {pageList.map((num) => (
          <button
            key={num}
            className={`${styles.pageBtn} ${page === num ? styles.pageBtnActive : ""}`}
            onClick={() => setPage(num)}
            aria-current={page === num ? "page" : undefined}
          >{num}</button>
        ))}
        {pageList[pageList.length - 1] < totalPages && (
          <span className={styles.pageEllipsis}>...</span>
        )}
        <button
          className={styles.pageBtn}
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          aria-label="다음 페이지"
        >&gt;</button>
      </nav>
    );
  }

  if (!user?.id)
    return <div className={styles.mypageLoading}>로그인 후 이용해주세요.</div>;
  if (isLoading || isFetching) return <SurveyListSkeleton />;
  if (isError)
    return (
      <div className={styles.mypageLoading}>
        설문 이력을 불러오지 못했습니다.{" "}
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  if (!data?.surveys?.length) return <div className={styles.mypageLoading}>설문 이력이 없습니다.</div>;

  return (
    <section aria-labelledby="my-survey-history-title">
      <div className={styles.sectionTitle} id="my-survey-history-title">
        설문 응답 이력
        <select
          className={styles.surveySortSelect}
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as "recent" | "favorite");
            setPage(1);
          }}
          aria-label="정렬 기준 선택"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>
      <ul className={styles.mypageList}>
        {data.surveys.map((s) => (
          <li
            key={s.id}
            className={styles.mypageListItem}
            tabIndex={0}
            aria-label={`설문: ${s.title} (${formatDate(s.participatedAt)})${s.isFavorite ? " 즐겨찾기" : ""}`}
          >
            {s.resultUrl ? (
              <a
                href={s.resultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mypageListTitle}
                aria-label={`${s.title} 결과 페이지로 이동`}
              >
                {s.title}
              </a>
            ) : (
              <span className={styles.mypageListTitle}>{s.title}</span>
            )}
            <span className={styles.mypageListTime}>{formatDate(s.participatedAt)}</span>
            {s.isFavorite && (
              <span className={styles.surveyStar} title="즐겨찾기">★</span>
            )}
          </li>
        ))}
      </ul>
      <Pagination />
    </section>
  );
}
