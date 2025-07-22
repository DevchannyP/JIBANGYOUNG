import { useState } from "react";
import styles from "../styles/RegionTabSlider.module.css";
const REGIONS = [
  "서울",
  "경기도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "강원도",
  "제주도",
];

export default function RegionTabSlider() {
  const [idx, setIdx] = useState(0);
  return (
    <div className={styles.sliderWrap}>
      <button
        className={styles.arrowBtn}
        aria-label="이전 지역"
        onClick={() => setIdx(Math.max(idx - 1, 0))}
      >
        &lt;
      </button>
      <div className={styles.tabs}>
        {REGIONS.map((r, i) => (
          <div
            key={r}
            className={i === idx ? styles.activeTab : styles.tab}
            tabIndex={0}
            role="tab"
            aria-selected={i === idx}
          >
            {r}
            <div className={styles.regionList}>
              {Array(7)
                .fill(r)
                .map((v, j) => (
                  <div key={j}>{v}</div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <button
        className={styles.arrowBtn}
        aria-label="다음 지역"
        onClick={() => setIdx(Math.min(idx + 1, REGIONS.length - 1))}
      >
        &gt;
      </button>
    </div>
  );
}
