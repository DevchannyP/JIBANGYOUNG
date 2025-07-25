"use client";

import {
  getSurveyFavorites,
  SurveyFavoriteDto,
  toggleSurveyFavorite,
} from "@/libs/api/mypage.api";
import { useUserStore } from "@/store/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styles from "../MyPageLayout.module.css";

// 날짜 포맷
function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

function FavoritesSkeleton() {
  return (
    <ul className={styles.mypageList} aria-busy="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className={styles.mypageListItem + " animate-pulse"}>
          <div
            className={styles.mypageListTitle}
            style={{
              width: "64%",
              background: "#ececec",
              height: 18,
              borderRadius: 6,
              marginBottom: 8,
            }}
          />
          <div
            className={styles.mypageListTime}
            style={{
              width: 70,
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

const SORT_OPTIONS = [
  { key: "recent", label: "최신순" },
  { key: "title", label: "제목순" },
];

export default function SurveyFavoritesPanel() {
  const user = useUserStore((state) => state.user);
  const userId = user?.id;
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"recent" | "title">("recent");
  const size = 10;

  const queryClient = useQueryClient();

  // ⭐ mutationFn: (favoriteId) => toggleSurveyFavorite(userId, favoriteId)
  const { mutate: toggleFavorite, isPending: isToggling } = useMutation({
    mutationFn: (favoriteId: number) =>
      userId ? toggleSurveyFavorite(userId, favoriteId) : Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", userId, "surveys", "favorites"],
      });
    },
  });

  // ⭐ 반드시 userId 포함해서 getSurveyFavorites 호출
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["user", userId, "surveys", "favorites", { page, size, sort }],
    queryFn: () =>
      userId
        ? getSurveyFavorites({ userId, page, size, sort })
        : Promise.resolve({ favorites: [], totalCount: 0 }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));

  function Pagination() {
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
      <nav
        className={styles.paginationNav}
        aria-label="즐겨찾기 설문 페이지네이션"
      >
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

  if (isLoading || isFetching) return <FavoritesSkeleton />;
  if (isError)
    return (
      <div className={styles.mypageLoading}>
        관심 설문을 불러오지 못했습니다.{" "}
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  if (!data?.favorites?.length) return <div>즐겨찾기 설문이 없습니다.</div>;

  return (
    <section aria-labelledby="favorites-title">
      <div className={styles.sectionTitle} id="favorites-title">
        즐겨찾기 설문
        <select
          className={styles.surveySortSelect}
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as "recent" | "title");
            setPage(1);
          }}
          aria-label="정렬 기준 선택"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <ul className={styles.mypageList}>
        {data.favorites.map((fav: SurveyFavoriteDto) => (
          <li
            key={fav.id}
            className={styles.mypageListItem}
            tabIndex={0}
            aria-label={`${fav.title} (${fav.participatedAt ? formatDate(fav.participatedAt) : ""}) 즐겨찾기`}
          >
            <span className={styles.mypageListTitle}>{fav.title}</span>
            {fav.participatedAt && (
              <span className={styles.mypageListTime}>
                {formatDate(fav.participatedAt)}
              </span>
            )}
            {fav.isFavorite && (
              <button
                className={styles.surveyStarBtn}
                aria-label="즐겨찾기 해제"
                onClick={() => toggleFavorite(fav.id)}
                disabled={isToggling}
                title="즐겨찾기 해제"
                tabIndex={0}
                type="button"
              >
                ★
              </button>
            )}
          </li>
        ))}
      </ul>
      <Pagination />
    </section>
  );
}
