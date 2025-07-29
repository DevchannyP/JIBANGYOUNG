"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getRegionScore } from "@/libs/api/mypage.api";
import type { RegionScoreDto, UserProfileDto } from "@/types/api/mypage.types";
import styles from "../MyPageLayout.module.css";


// region이 string or object or undefined 모두 지원하도록 안전화
function normalizeRegionList(region: UserProfileDto["region"]): { id: number; name: string }[] {
  if (!region) return [];
  // 이미 객체 배열(서버 리팩토링 후) 케이스
  if (Array.isArray(region) && typeof region[0] === "object") return region as any;
  // 문자열 배열 케이스 (구 서버)
  if (Array.isArray(region)) return region.map((name, i) => ({ id: i + 1, name }));
  // 단일 문자열 케이스
  return [{ id: 1, name: region as string }];
}

function RegionScoreSkeleton() {
  return (
    <section className={styles.mypageRegionScoreSkeleton} aria-busy="true">
      <div className={styles.mypageSectionTitle} style={{ width: 120 }} />
      <div className={styles.mypageRegionScoreRow} style={{ height: 38 }} />
      <ul className={styles.mypageScoreList}>
        {[...Array(3)].map((_, i) => (
          <li key={i} style={{ width: 220, height: 21, marginBottom: 8 }} />
        ))}
      </ul>
      <div className={styles.mypageProgressBox} style={{ height: 50 }} />
    </section>
  );
}

function ScoreHistoryTable({ history }: { history?: RegionScoreDto["scoreHistory"] }) {
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
  // regionList는 항상 [{id, name}, ...] 형식 보장
  const regionList = useMemo(() => normalizeRegionList(user.region), [user.region]);
  const [regionId, setRegionId] = useState(regionList[0]?.id ?? null);

  const { data, isLoading, isError, refetch } = useQuery<RegionScoreDto>({
    queryKey: ["region-score", regionId],
    queryFn: () => getRegionScore(regionId!),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 5,
  });

  if (!regionList.length || !regionId) {
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
  if (isError || !data)
    return (
      <div className={styles.mypageRegionScoreError}>
        점수 정보를 불러오지 못했습니다.{" "}
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );

  return (
    <section aria-labelledby="region-score-title">
      <div className={styles.mypageSectionTitle} id="region-score-title">
        {data.regionName} 점수 요약
      </div>
      <div className={styles.mypageRegionScoreRow}>
        <label htmlFor="regionSelect">내 지역선택</label>
        <select
          id="regionSelect"
          className={styles.mypageSelect}
          value={regionId ?? ""}
          onChange={(e) => setRegionId(Number(e.target.value))}
        >
          {regionList.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
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
          <span className={styles.scoreValue}>{data.mentoringCount}회 × 20점</span>
        </li>
      </ul>
      <div className={styles.mypageProgressBox}>
        <strong>조력자 승급 진행률</strong>
        <div className={styles.mypageProgressBarWrap}>
          <div className={styles.mypageProgressBar}>
            <div
              className={styles.mypageProgressFill}
              style={{ width: `${Math.round(data.promotionProgress * 100)}%` }}
              aria-label={`승급 진행률: ${Math.round(data.promotionProgress * 100)}%`}
            />
          </div>
          <span className={styles.mypageProgressPercent}>
            {Math.round(data.promotionProgress * 100)}%
          </span>
        </div>
        <div className={styles.mypageProgressInfo}>
          누적 {data.score}점 / 멘토 인증까지{" "}
          <span style={{ color: "#fc3535" }}>{data.daysToMentor}일</span>
        </div>
      </div>
      <ScoreHistoryTable history={data.scoreHistory} />
    </section>
  );
}
