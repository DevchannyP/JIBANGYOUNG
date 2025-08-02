"use client";

import { getMyRegionScores, getRegionScore } from "@/libs/api/mypage.api";
import type { MyRegionScoreDto, RegionScoreDto, UserProfileDto } from "@/types/api/mypage.types";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "../MyPageLayout.module.css";

// 점수 프로그레스 바 컴포넌트
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

// 지역별 상세 fetch (기존 그대로)
function useDetailRegionScore(regionId?: number) {
  return useQuery<RegionScoreDto>({
    queryKey: ["region-score", regionId],
    queryFn: () => getRegionScore(regionId!),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 5,
  });
}

export default function RegionScorePanel({ user }: { user: UserProfileDto }) {
  const { data: regionList = [], isLoading, isError, refetch } = useQuery<MyRegionScoreDto[]>({
    queryKey: ["my-region-scores"],
    queryFn: getMyRegionScores,
    staleTime: 1000 * 60 * 10,
  });

  const [regionId, setRegionId] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (regionList.length && regionId === undefined) setRegionId(regionList[0].regionId);
  }, [regionList, regionId]);

  const { data: detail, isLoading: detailLoading } = useDetailRegionScore(regionId);

  if (isLoading)
    return (
      <section className={styles.panelWrap} aria-busy="true">
        <div className={styles.scoreSkeleton} />
      </section>
    );

  if (isError || !regionList.length)
    return (
      <section className={styles.panelWrap} role="alert">
        <div className={styles.errorMsg}>
          ⚠️ 지역 점수 정보를 불러올 수 없습니다.
        </div>
        <button className={styles.retryBtn} onClick={() => refetch()}>
          🔄 다시 시도
        </button>
      </section>
    );

  return (
    <section className={styles.panelWrap} aria-labelledby="regionScorePanelTitle">
      <h2 id="regionScorePanelTitle" className={styles.title}>
        내 지역별 점수 <span className={styles.titleEmoji} aria-hidden>🏅</span>
      </h2>
      <div className={styles.regionSelectRow}>
        <label htmlFor="regionSelect" className={styles.regionSelectLabel}>
          지역 선택
        </label>
        {/* <select
          id="regionSelect"
          className={styles.regionSelect}
          value={regionId ?? ""}
          onChange={e => setRegionId(Number(e.target.value))}
          aria-label="내 점수 지역 선택"
        >
          {regionList.map(r => (
            <option key={r.regionId} value={r.regionId}>
              {`🌍 ${r.regionName} (${r.score}점)`}
            </option>
          ))}
        </select> */}
        <select
  id="regionSelect"
  className={styles.regionSelect}
  value={regionId ?? ""}
  onChange={e => setRegionId(Number(e.target.value))}
  aria-label="내 점수 지역 선택"
>
  {regionList.map(r => (
    <option key={r.regionId} value={r.regionId}>
      {/* regionName이 없으므로 임시로 regionId로 표기 */}
      {`🌍 지역ID ${r.regionId} (${r.score}점)`}
    </option>
  ))}
</select>
      </div>

      {/* 상세 영역: Fade+Slide 트랜지션 */}
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
            key={detail.regionId}
            className={styles.scoreSummary}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, type: "spring" }}
            tabIndex={0}
            aria-label={`${detail.regionName} 지역 점수 상세`}
          >
            <div className={styles.regionTitle}>
              <span className={styles.regionBadge}>#{detail.regionId}</span>
              <span className={styles.regionName}>{detail.regionName}</span>
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
