"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CommunitySection.module.css";
import MonthlyHotTable from "./components/MonthlyHotTable";
import PolicyHotTable from "./components/PolicyHotTable";
import SectionTitle from "./components/SectionTitle";

export default function CommunitySection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    const ioLeft = new window.IntersectionObserver(
      ([entry]) => entry.isIntersecting && setLeftVisible(true),
      { threshold: 0.22 }
    );
    ioLeft.observe(left);

    const ioRight = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && leftVisible) {
          setTimeout(() => setRightVisible(true), 200);
        }
      },
      { threshold: 0.2 }
    );
    ioRight.observe(right);

    return () => {
      ioLeft.disconnect();
      ioRight.disconnect();
    };
  }, [leftVisible]);

  return (
    <div className={styles.tablesRow}>
      <div
        className={`${styles.tableCol} ${styles.waveCard} ${leftVisible ? styles.visible : ""}`}
        ref={leftRef}
        tabIndex={0}
        aria-label="월간 인기 테이블"
      >
        <MonthlyHotTable />
      </div>
      <div
        className={`${styles.tableCol} ${styles.waveCard} ${rightVisible ? styles.visible : ""}`}
        ref={rightRef}
        tabIndex={0}
        aria-label="정책 인기 테이블"
      >
        <div className={styles.titleOverlay}>
          <SectionTitle align="center" />
        </div>
        <PolicyHotTable />
      </div>
    </div>
  );
}
