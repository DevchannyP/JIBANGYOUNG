"use client";

import { getSido, regionFullPath, regionLabel, toSigungu5 } from "@/components/constants/region-map";
import { getMyRegionScores, getRegionScore } from "@/libs/api/mypage.api";
import type { MyRegionScoreDto, RegionScoreDto, UserProfileDto } from "@/types/api/mypage.types";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import styles from "../MyPageLayout.module.css";

// 점수 프로그레스 바
function ScoreProgress({ score, max = 300 }: { score: number; max?: number }) {
  const pct = Math.min(Math.round((score / max) * 100), 100);
  return (
    <div className={styles.scoreProgressWrap} aria-label={`점수 달성률: ${pct}%`}>
      <div className={styles.scoreBarBg}>
        <motion.div
          className={styles.scoreBarFill}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.85, type: "spring" }}
        />
      </div>
      <span className={styles.scorePercent}>{pct}%</span>
    </div>
  );
}

// 상세 fetch
function useDetailRegionScore(regionId?: number | string) {
  return useQuery<RegionScoreDto>({
    queryKey: ["region-score", regionId],
    // 백엔드 시그니처가 number라면 캐스팅, 아니면 API 타입에 맞춰 조정
    queryFn: () => getRegionScore(regionId as number),
    enabled: regionId !== undefined && regionId !== null && regionId !== "",
    staleTime: 1000 * 60 * 5,
  });
}

// 시도 → 항목 리스트로 그룹화(UX: optgroup)
function groupBySido(items: MyRegionScoreDto[]) {
  const map = new Map<string, MyRegionScoreDto[]>();
  for (const it of items) {
    const sd = getSido(it.regionId) || "기타";
    if (!map.has(sd)) map.set(sd, []);
    map.get(sd)!.push(it);
  }
  // 각 그룹 정렬: 라벨 기준
  for (const [k, arr] of map) {
    arr.sort((a, b) => {
      const la = regionLabel(a.regionId);
      const lb = regionLabel(b.regionId);
      return la.localeCompare(lb, "ko");
    });
    map.set(k, arr);
  }
  // 시도명 정렬
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], "ko"));
}

export default function RegionScorePanel({ user }: { user: UserProfileDto }) {
  const { data: regionList = [], isLoading, isError, refetch } = useQuery<MyRegionScoreDto[]>({
    queryKey: ["my-region-scores"],
    queryFn: getMyRegionScores,
    staleTime: 1000 * 60 * 10,
  });

  const [regionId, setRegionId] = useState<number | string | undefined>(undefined);

  useEffect(() => {
    if (regionList.length && regionId === undefined) {
      setRegionId(regionList[0].regionId);
    }
  }, [regionList, regionId]);

  const groups = useMemo(() => groupBySido(regionList), [regionList]);

  const { data: detail, isLoading: detailLoading } = useDetailRegionScore(regionId);

  if (isLoading) {
    return (
      <section className={styles.panelWrap} aria-busy="true">
        <div className={styles.scoreSkeleton} />
      </section>
    );
  }

  if (isError || !regionList.length) {
    return (
      <section className={styles.panelWrap} role="alert">
        <div className={styles.errorMsg}>⚠️ 지역 점수 정보를 불러올 수 없습니다.</div>
        <button className={styles.retryBtn} onClick={() => refetch()}>
          🔄 다시 시도
        </button>
      </section>
    );
  }

  return (
    <section className={styles.panelWrap} aria-labelledby="regionScorePanelTitle">
      <h2 id="regionScorePanelTitle" className={styles.title}>
        내 지역별 점수 <span className={styles.titleEmoji} aria-hidden>🏅</span>
      </h2>

      {/* UX 향상: 시도(optgroup)별 그룹 + 라벨/툴팁 */}
      <div className={styles.regionSelectRow}>
        <label htmlFor="regionSelect" className={styles.regionSelectLabel}>
          지역 선택
        </label>

        <select
          id="regionSelect"
          className={styles.regionSelect}
          value={String(regionId ?? "")}
          onChange={(e) => {
            const picked = e.target.value;
            const found = regionList.find((r) => String(r.regionId) === picked);
            setRegionId(found ? found.regionId : picked);
          }}
          aria-label="내 점수 지역 선택 (시도별 그룹)"
        >
          {groups.map(([sido, items]) => (
            <optgroup key={sido} label={sido}>
              {items.map((r) => {
                const label = regionLabel(r.regionId);
                const full = regionFullPath(r.regionId, " · ");
                return (
                  <option
                    key={String(r.regionId)}
                    value={String(r.regionId)}
                    title={full} // hover 시 전체경로 노출
                  >
                    {`🌍 ${label} (${r.score}점)`}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>
      </div>

      {/* 상세 영역 */}
      <AnimatePresence mode="wait">
        {detailLoading ? (
          <motion.div
            key="loading"
            className={styles.scoreDetailSkeleton}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-busy="true"
          />
        ) : detail ? (
          <motion.div
            key={String(detail.regionId)}
            className={styles.scoreSummary}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, type: "spring" }}
            tabIndex={0}
            aria-label={`${regionLabel(detail?.regionId, detail?.regionName)} 지역 점수 상세`}
          >
            <div className={styles.regionTitle}>
              <span className={styles.regionBadge}>
                #{toSigungu5(detail.regionId) || String(detail.regionId)}
              </span>
              <span className={styles.regionName}>
                {regionLabel(detail?.regionId, detail?.regionName)}
              </span>
            </div>

            <ScoreProgress score={detail.score} />

            <ul className={styles.scoreList} aria-live="polite">
              <li>
                <span>📄 게시글</span>
                <span>
                  <b>{detail.postCount}</b>건 × 10점
                </span>
              </li>
              <li>
                <span>💬 댓글</span>
                <span>
                  <b>{detail.commentCount}</b>건 × 5점
                </span>
              </li>
              <li>
                <span>🎓 멘토링</span>
                <span>
                  <b>{detail.mentoringCount}</b>회 × 20점
                </span>
              </li>
              <li className={styles.totalScoreRow}>
                <span>총점</span>
                <span className={styles.totalScore}>{detail.score}점</span>
              </li>
            </ul>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className={styles.emptyInfo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-live="polite"
          >
            <span>이 지역에 기록된 점수가 없습니다.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
