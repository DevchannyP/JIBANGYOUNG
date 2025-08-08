"use client";

import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "../MainSection.module.css";
import { useRegionRankQuery } from "./useRegionRankQuery";

// 구군2 → 구군1 → 시도
function getRegionLabel(item: { sido: string; guGun1: string | null; guGun2: string | null }) {
  if (item.guGun2 && item.guGun2.trim() !== "") return item.guGun2;
  if (item.guGun1 && item.guGun1.trim() !== "") return item.guGun1;
  return item.sido;
}

export default function RegionRankCard() {
  const { data, isLoading, isError } = useRegionRankQuery();
  const router = useRouter();
  const liveRef = useRef<HTMLDivElement>(null);

  // 1~3위 중 강조할 순위 (자동순환)
  const [activeIdx, setActiveIdx] = useState(0);

  // 자동 강조 순환 타이머 (3초마다 변경)
  useEffect(() => {
    if (!data || data.length === 0) return;
    const timer = setInterval(() => {
      setActiveIdx((idx) => (idx + 1) % 3); // 0→1→2→0
    }, 3000);
    return () => clearInterval(timer);
  }, [data]);

  // 사용자가 hover/포커스 시 해당 순위 강조
  const handleManualFocus = (idx: number) => setActiveIdx(idx);

  // 버튼 접근성 및 클릭 핸들러
  const buttonKeyDown = (handler: () => void, isDisabled = false) => (e: React.KeyboardEvent) => {
    if (isDisabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  };

  function RegionRankButton({
    rank,
    idx,
    item,
    isActive,
  }: {
    rank: number;
    idx: number;
    item?: { regionCode?: number; sido: string; guGun1: string | null; guGun2: string | null };
    isActive: boolean;
  }) {
    const label = item ? getRegionLabel(item) : "";
    const isDisabled = !item || item.regionCode === undefined || item.regionCode === null || item.regionCode < 0;

    return (
      <motion.span
        className={isActive ? styles.rankTabActive : styles.rankTab}
        tabIndex={isDisabled ? -1 : 0}
        role="button"
        aria-label={
          isDisabled
            ? `${rank}위 순위 없음`
            : `${rank}위 ${label} 커뮤니티로 이동`
        }
        aria-disabled={isDisabled}
        onClick={isDisabled ? undefined : () => regionClickHandler(item?.regionCode, label)}
        onKeyDown={buttonKeyDown(() => regionClickHandler(item?.regionCode, label), isDisabled)}
        onMouseEnter={() => handleManualFocus(idx)}
        onFocus={() => handleManualFocus(idx)}
        style={{
          cursor: isDisabled ? "not-allowed" : "pointer",
          outline: "none",
          opacity: isDisabled ? 0.4 : 1,
        }}
        // 강조순위에만 애니메이션 효과
        animate={isActive ? { scale: 1.13, boxShadow: "0 0 0 4px rgba(255,224,77,0.27)" } : { scale: 1, boxShadow: "none" }}
        transition={{ duration: 0.35, type: "spring", stiffness: 180 }}
        layout
      >
        {isDisabled ? `${rank}위 -` : `${rank}위 ${label}`}
      </motion.span>
    );
  }

  function regionClickHandler(regionCode?: number, label?: string) {
    if (regionCode === undefined || regionCode === null || regionCode < 0) return;
    router.push(`/community/${regionCode}`);
    if (liveRef.current && label)
      liveRef.current.textContent = `"${label}" 지역 커뮤니티로 이동합니다.`;
  }

  // 로딩/에러/빈값
  if (isLoading) {
    return (
      <div className={styles.rankCard}>
        <div className={styles.rankCardHeader}>
          <MapPinned className={styles.rankIcon} />
          전국 살기<br />좋은 지역 순위
        </div>
        <div className={styles.rankTabRow} style={{ minHeight: 36, display: "flex", alignItems: "center" }}>
          <span className={styles.rankTabActive}>로딩중...</span>
        </div>
      </div>
    );
  }
  if (isError || !data || data.length === 0) {
    return (
      <div className={styles.rankCard}>
        <div className={styles.rankCardHeader}>
          <MapPinned className={styles.rankIcon} />
          전국 살기<br />좋은 지역 순위
        </div>
        <div className={styles.rankTabRow} style={{ minHeight: 36, display: "flex", alignItems: "center" }}>
          <span className={styles.rankTabActive}>{isError ? "데이터 조회 오류" : "데이터 없음"}</span>
        </div>
      </div>
    );
  }

  // ------- 전국(sido === "전국") 제외하고 TOP3만 추출 -------
  const regionOnly = data.filter(item => item.sido !== "전국");
  const top3 = [regionOnly[0], regionOnly[1], regionOnly[2]];

  return (
    <div className={styles.rankCard}>
      <div className={styles.rankCardHeader}>
        <MapPinned className={styles.rankIcon} />
        전국 살기<br />좋은 지역 순위
      </div>
      <div
        className={styles.rankTabRow}
        aria-live="polite"
        aria-atomic="true"
        ref={liveRef}
        style={{ minHeight: 36, display: "flex", alignItems: "center" }}
      >
        <RegionRankButton rank={1} idx={0} item={top3[0]} isActive={activeIdx === 0} />
        <RegionRankButton rank={2} idx={1} item={top3[1]} isActive={activeIdx === 1} />
        <RegionRankButton rank={3} idx={2} item={top3[2]} isActive={activeIdx === 2} />
      </div>
    </div>
  );
}
