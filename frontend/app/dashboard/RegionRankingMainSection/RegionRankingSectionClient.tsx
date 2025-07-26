// 📁 app/dashboard/RegionRankingMainSection/RegionRankingSectionClient.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import styles from "./RegionTabSlider.module.css";

// CSR 컴포넌트 지연 로딩 및 skeleton fallback 적용
const RegionTabSlider = dynamic(() => import("./components/RegionTabSlider"), {
  ssr: false,
  loading: () => (
    <div className={styles.cardsRow}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className={styles.regionCard}
          style={{ opacity: 0.33, background: "#f9f9f9" }}
          aria-busy="true"
        />
      ))}
    </div>
  ),
});

export default function RegionRankingSectionClient({ regions }: { regions?: string[] }) {
  return (
    <Suspense fallback={
      <div className={styles.cardsRow}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={styles.regionCard}
            style={{ opacity: 0.33, background: "#f9f9f9" }}
            aria-busy="true"
          />
        ))}
      </div>
    }>
      <RegionTabSlider regions={regions} />
    </Suspense>
  );
}
