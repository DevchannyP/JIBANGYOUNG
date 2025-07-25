"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  getRegionScore,
  RegionScoreDto,
  UserProfileDto,
} from "../../../libs/api/mypage.api";
import styles from "../MyPageLayout.module.css";

function RegionScoreSkeleton() {
  return (
    <section className={styles.mypageRegionScoreSkeleton} aria-busy="true">
      <div
        className={styles.mypageSectionTitle}
        style={{ width: 120, background: "#ececec", borderRadius: 6 }}
      >
        &nbsp;
      </div>
      <div
        className={styles.mypageRegionScoreRow}
        style={{
          height: 38,
          background: "#eee",
          borderRadius: 7,
          margin: "15px 0",
        }}
      />
      <ul className={styles.mypageScoreList}>
        {[...Array(3)].map((_, i) => (
          <li
            key={i}
            style={{
              width: 220,
              background: "#eee",
              height: 21,
              borderRadius: 6,
              marginBottom: 8,
            }}
          >
            &nbsp;
          </li>
        ))}
      </ul>
      <div
        className={styles.mypageProgressBox}
        style={{
          height: 50,
          background: "#eee",
          borderRadius: 10,
          margin: "14px 0",
        }}
      />
    </section>
  );
}

function ScoreHistoryTable({
  history,
}: {
  history?: RegionScoreDto["scoreHistory"];
}) {
  if (!history?.length) return null;
  return (
    <table className={styles.mypageScoreHistoryTable} aria-label="점수 내역">
      <caption className={styles.mypageScoreHistoryCaption}>점수 내역</caption>
      <thead>
        <tr>
          <th>날짜</th>
          <th>변동</th>
          <th>사유</th>
        </tr>
      </thead>
      <tbody>
        {history.map((h, i) => (
          <tr key={i}>
            <td>{h.date}</td>
            <td style={{ color: h.delta > 0 ? "#306bff" : "#ed5c33" }}>
              {h.delta > 0 ? "+" : ""}
              {h.delta}
            </td>
            <td>{h.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function RegionScorePanel({ user }: { user: UserProfileDto }) {
  // 관심지역 다중 선택
  const regionList: string[] = useMemo(() => {
    if (!user.region) return [];
    return Array.isArray(user.region) ? user.region : [user.region];
  }, [user.region]);
  const [region, setRegion] = useState(regionList[0] ?? "");

  // 실시간 지역 점수 fetch
  const { data, isLoading, isError, refetch } = useQuery<RegionScoreDto>({
    queryKey: ["user", "region-score", region],
    queryFn: () => getRegionScore(region),
    enabled: !!region,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  if (!region) {
    return (
      <section>
        <div className={styles.mypageSectionTitle}>지역별 점수</div>
        <div className={styles.mypageRegionScoreRow}>
          <label>내 지역선택</label>
          <select className={styles.mypageSelect} disabled>
            <option value="">관심지역 없음</option>
          </select>
        </div>
        <div className={styles.mypageNoRegion}>등록된 관심지역이 없습니다.</div>
      </section>
    );
  }
  if (isLoading) return <RegionScoreSkeleton />;
  if (isError)
    return (
      <div className={styles.mypageRegionScoreError}>
        점수 정보를 불러오지 못했습니다.{" "}
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  // ⭐⭐⭐ data undefined 방지(불가피한 네트워크 예외 등)
  if (!data)
    return (
      <div className={styles.mypageRegionScoreError}>
        점수 정보를 찾을 수 없습니다.
      </div>
    );

  return (
    <section aria-labelledby="region-score-title">
      <div className={styles.mypageSectionTitle} id="region-score-title">
        지역별 점수
      </div>
      <div className={styles.mypageRegionScoreRow}>
        <label htmlFor="regionSelect" style={{ fontWeight: 500 }}>
          내 지역선택
        </label>
        <select
          id="regionSelect"
          className={styles.mypageSelect}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {regionList.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <ul className={styles.mypageScoreList}>
        <li>
          <span>게시글 작성 수</span>
          <span className={styles.scoreValue}>{data.postCount}건 × 10점</span>
        </li>
        <li>
          <span>댓글 작성 수</span>
          <span className={styles.scoreValue}>{data.commentCount}건 × 5점</span>
        </li>
        <li>
          <span>멘토링 활동 수</span>
          <span className={styles.scoreValue}>
            {data.mentoringCount}회 × 20점
          </span>
        </li>
      </ul>
      <div className={styles.mypageProgressBox}>
        <strong>조력자 승급 진행률</strong>
        <div className={styles.mypageProgressBarWrap}>
          <div className={styles.mypageProgressBar}>
            <div
              className={styles.mypageProgressFill}
              style={{
                width: `${Math.round((data.promotionProgress ?? 0) * 100)}%`,
              }}
              aria-label={`승급 진행률: ${Math.round(
                (data.promotionProgress ?? 0) * 100
              )}%`}
            />
          </div>
          <span className={styles.mypageProgressPercent}>
            {Math.round((data.promotionProgress ?? 0) * 100)}%
          </span>
        </div>
        <div className={styles.mypageProgressInfo}>
          누적 {data.score}점 / 멘토 인증:{" "}
          <span style={{ color: "#fc3535" }}>{data.daysToMentor}일</span>
        </div>
      </div>
      <ScoreHistoryTable history={data.scoreHistory} />
    </section>
  );
}
