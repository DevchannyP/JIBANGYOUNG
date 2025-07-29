import { memo, useMemo } from "react";
import styles from "../../total_policy.module.css";

interface PolicyCounterProps {
  total: number;
  filtered: number;
  isLoading?: boolean;
  lastUpdated?: string;
  searchQuery?: string;
  region?: number;
}

// 지역 코드 매핑 (필터바와 동일)
const REGION_MAP: Record<number, string> = {
  99999: "전국",
  11000: "서울",
  26000: "부산",
  27000: "대구",
  28000: "인천",
  29000: "광주",
  30000: "대전",
  31000: "울산",
  36110: "세종",
  41000: "경기",
  43000: "충북",
  44000: "충남",
  45000: "전북",
  46000: "전남",
  47000: "경북",
  48000: "경남",
  51000: "강원",
  50000: "제주",
};

const PolicyCounter = memo<PolicyCounterProps>(
  ({
    total,
    filtered,
    isLoading = false,
    lastUpdated,
    searchQuery,
    region = 99999,
  }) => {
    // 카운터 상태 계산
    const counterInfo = useMemo(() => {
      const percentage = total > 0 ? Math.round((filtered / total) * 100) : 0;
      const isFiltered = filtered !== total;
      const regionName = REGION_MAP[region] || "알 수 없음";

      return {
        percentage,
        isFiltered,
        regionName,
        hasSearchQuery: Boolean(searchQuery?.trim()),
      };
    }, [total, filtered, region, searchQuery]);

    // 로딩 상태 렌더링
    if (isLoading) {
      return (
        <div className={styles.counterContainer}>
          <div className={styles.counter}>
            <div className={styles.counterSkeleton}>
              <div className={styles.skeletonText}></div>
            </div>
          </div>
        </div>
      );
    }

    const { percentage, isFiltered, regionName, hasSearchQuery } = counterInfo;

    return (
      <div className={styles.counterContainer}>
        <div className={styles.counter}>
          <div className={styles.counterMain}>
            <span className={styles.counterNumbers}>
              전체 <strong>{total.toLocaleString()}</strong>건 중{" "}
              <strong
                className={
                  isFiltered ? styles.filteredCount : styles.totalCount
                }
              >
                {filtered.toLocaleString()}
              </strong>
              건 노출
            </span>

            {isFiltered && (
              <span className={styles.counterPercentage}>({percentage}%)</span>
            )}
          </div>

          {/* 활성 필터 정보 */}
          {(hasSearchQuery || region !== 99999) && (
            <div className={styles.filterInfo}>
              <span className={styles.filterLabel}>적용된 필터:</span>
              {region !== 99999 && (
                <span className={styles.filterTag}>📍 {regionName}</span>
              )}
              {hasSearchQuery && (
                <span className={styles.filterTag}>
                  🔍 &quot;{searchQuery}&quot;
                </span>
              )}
            </div>
          )}

          {/* 마지막 업데이트 시간 */}
          {lastUpdated && (
            <div className={styles.lastUpdated}>
              <span className={styles.updateLabel}>마지막 업데이트:</span>
              <time dateTime={lastUpdated} className={styles.updateTime}>
                {new Date(lastUpdated).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          )}
        </div>

        {/* 통계 바 (시각적 표현) */}
        {isFiltered && (
          <div className={styles.statsBar}>
            <div className={styles.statsBarTrack}>
              <div
                className={styles.statsBarFill}
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`전체 정책 중 ${percentage}% 표시 중`}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

PolicyCounter.displayName = "PolicyCounter";

export default PolicyCounter;
