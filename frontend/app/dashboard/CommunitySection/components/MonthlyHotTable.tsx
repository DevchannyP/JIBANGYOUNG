"use client";

import { getPostUrl } from "@/libs/api/dashboard/monthlyHot.api";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "../CommunitySection.module.css";
import { useMonthlyHotTop10Query } from "./useMonthlyHotTop10Query";

// API 타입(백엔드 DTO와 100% 일치)
// import type { MonthlyHotPostDto } from "@/libs/api/dashboard/monthlyHot.api";

export default function MonthlyHotTable() {
  const router = useRouter();
  const { data, isLoading, isError } = useMonthlyHotTop10Query();

  React.useEffect(() => {
    if (data) {
      console.log("✅ 월간 인기글 데이터:", data);
    }
    if (isError) {
      console.error("🔥 월간 인기글 에러:", isError);
    }
  }, [data, isError]);

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableCardLabel}>
        <span className={styles.tableCardLabelIcon}>📅</span>
        월간 인기
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th style={{ width: 40 }}>NO</th>
              <th>제목</th>
              {/* <th>글쓴이</th>  삭제 */}
              <th>지역</th>
              <th>조회</th>
              <th>추천</th>
            </tr>
          </thead>
          <tbody>
            {/* 로딩 */}
            {isLoading &&
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  <td colSpan={5}>
                    <div className={styles.skeletonRow} />
                  </td>
                </tr>
              ))}

            {/* 에러 */}
            {isError && (
              <tr key="error">
                <td colSpan={5} style={{ textAlign: "center", color: "#d00" }}>
                  월간 인기글 데이터를 불러오지 못했습니다.
                </td>
              </tr>
            )}

            {/* 데이터 */}
            {data && data.length > 0 &&
              data.map((row, idx) => {
                const rowKey =
                  typeof row.id !== "undefined" && row.id !== null && row.no
                    ? `row-${row.id}-${row.no}`
                    : `row-fallback-${idx}`;
                const canClick = !!row.regionId && !!row.id;
                const postUrl = getPostUrl(row);

                return (
                  <tr
                    key={rowKey}
                    tabIndex={canClick ? 0 : -1}
                    className={styles.dataTableRow}
                    role={canClick ? "button" : undefined}
                    aria-label={
                      canClick
                        ? `${row.no}위 ${row.title} (${row.regionName}, 클릭 시 상세보기)`
                        : `${row.no}위 ${row.title} (상세 이동 불가)`
                    }
                    title={row.title}
                    style={{
                      cursor: canClick ? "pointer" : "not-allowed",
                      opacity: canClick ? 1 : 0.6,
                    }}
                    onClick={() => canClick && postUrl && router.push(postUrl)}
                    onKeyDown={e =>
                      canClick &&
                      postUrl &&
                      ["Enter", " "].includes(e.key) &&
                      router.push(postUrl)
                    }
                  >
                    {/* NO (순위) */}
                    <td>{row.no ?? String(idx + 1).padStart(2, "0")}</td>
                    {/* 제목 */}
                    <td className={styles.dataTableTitle}>
                      {row.title.length > 36
                        ? row.title.slice(0, 36) + "..."
                        : row.title}
                    </td>
                    {/* 글쓴이 칸 삭제 */}
                    {/* 지역명 */}
                    <td>{row.regionName}</td>
                    {/* 조회 */}
                    <td>{row.views}</td>
                    {/* 추천 */}
                    <td>{row.likes}</td>
                  </tr>
                );
              })}

            {/* 데이터 없음 */}
            {!isLoading && !isError && (!data || data.length === 0) && (
              <tr key="nodata">
                <td colSpan={5} style={{ textAlign: "center" }}>
                  최근 1개월간 인기글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
