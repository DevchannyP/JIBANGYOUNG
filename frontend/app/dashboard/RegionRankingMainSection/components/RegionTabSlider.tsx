// dashboard/components/RegionTabSlider.tsx
import { useState } from "react";
import styles from "../RegionTabSlider.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const regions = [
  "서울", "경기도", "충청북도", "충청남도",
  "전라북도", "전라남도", "경상북도", "경상남도",
  "강원도", "제주도"
];

export default function RegionTabSlider() {
  const [current, setCurrent] = useState(0);

  // 슬라이드 window: 현재 선택 + 양옆 4~5개씩
  const SLIDE_WINDOW = 6;
  const start = Math.max(0, Math.min(current - 1, regions.length - SLIDE_WINDOW));
  const visibleRegions = regions.slice(start, start + SLIDE_WINDOW);

  return (
    <div className={styles.bgWrap}>
      <div className={styles.sliderRoot}>
        <button
          className={styles.arrowBtn}
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          aria-label="이전 지역"
        >
          <ChevronLeft size={28} stroke="#232323" />
        </button>
        <div className={styles.tabsRow}>
          {regions.map((name, idx) => (
            <button
              key={name}
              className={`${styles.tabBtn} ${idx === current ? styles.tabActive : ""}`}
              onClick={() => setCurrent(idx)}
              tabIndex={0}
              aria-selected={idx === current}
            >
              {name}
            </button>
          ))}
        </div>
        <button
          className={styles.arrowBtn}
          onClick={() => setCurrent(Math.min(regions.length - 1, current + 1))}
          disabled={current === regions.length - 1}
          aria-label="다음 지역"
        >
          <ChevronRight size={28} stroke="#232323" />
        </button>
      </div>
      <div className={styles.cardsRow}>
        {regions.map((name, idx) => (
          <div
            key={name}
            className={`${styles.regionCard} ${idx === current ? styles.regionActive : ""} ${idx === current ? styles.regionActiveShadow : ""}`}
            style={{
              borderColor: idx === current
                ? "#232323"
                : idx === current + 1 || idx === current - 1
                  ? "#4dbaf6"
                  : "#ececec"
            }}
          >
            {[...Array(9)].map((_, i) => (
              <div key={i} className={styles.regionItem}>{name}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
