"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "./styles/DashboardClientShell.module.css";

// ===== 메인 페이지 첫 섹션 컴포넌트화 =====
const MainSection = dynamic(() => import("./components/MainSection"), {
  ssr: false,
  loading: () => <div style={{ height: 480, background: "#FFE140" }} />,
});
const CommunitySection = dynamic(
  () => import("./components/CommunitySection"),
  { ssr: false, loading: () => <div style={{ height: 120 }} /> }
);
const RegionRankingSection = dynamic(
  () => import("./components/RegionRankingSection"),
  { ssr: false, loading: () => <div style={{ height: 120 }} /> }
);
const RegionTabSlider = dynamic(() => import("./components/RegionTabSlider"), {
  ssr: false,
  loading: () => <div style={{ height: 120 }} />,
});

const SECTIONS = [
  { name: "메인", label: "메인" },
  { name: "커뮤니티", label: "HOT 커뮤니티" },
  { name: "랭킹", label: "지역 랭킹" },
];

export default function DashboardClientShell() {
  const sectionRefs = [useRef(null), useRef(null), useRef(null)];
  const [current, setCurrent] = useState(0);

  // 인덱스 추적(스크롤 감지)
  useEffect(() => {
    const handleScroll = () => {
      const midY = window.innerHeight / 2;
      let newIndex = 0;
      sectionRefs.forEach((ref, idx) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top < midY) newIndex = idx;
        }
      });
      setCurrent(newIndex);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 키보드 네비 지원
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight"].includes(e.key)) {
        setCurrent((prev) => Math.min(SECTIONS.length - 1, prev + 1));
      } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
        setCurrent((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  useEffect(() => {
    sectionRefs[current].current?.scrollIntoView({ behavior: "smooth" });
  }, [current]);

  // 안내문구 애니메이션
  const [showGuide, setShowGuide] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowGuide(false), 2100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.fullpageScrollContainer}>
      {/* dot navigation */}
      <nav className={styles.dotNav} aria-label="페이지 네비게이션">
        {SECTIONS.map((section, idx) => (
          <button
            key={section.name}
            className={`${styles.dot} ${idx === current ? styles.dotActive : ""}`}
            aria-label={`${section.label}로 이동`}
            onClick={() => setCurrent(idx)}
            tabIndex={0}
          />
        ))}
      </nav>
      {showGuide && (
        <div className={styles.scrollGuide}>
          <span>아래로 스크롤하거나 좌우키로 넘겨보세요!</span>
        </div>
      )}

      {/* ====== [SECTION 1] 메인 ====== */}
      <section
        ref={sectionRefs[0]}
        className={`${styles.fullpageSection} ${styles.mainSection}`}
        tabIndex={-1}
        aria-label="메인"
      >
        <MainSection />
      </section>

      {/* ====== [SECTION 2] 커뮤니티 ====== */}
      <section
        ref={sectionRefs[1]}
        className={styles.fullpageSection}
        tabIndex={-1}
        aria-label="HOT 커뮤니티"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <CommunitySection />
        </motion.div>
      </section>

      {/* ====== [SECTION 3] 지역랭킹 ====== */}
      <section
        ref={sectionRefs[2]}
        className={styles.fullpageSection}
        tabIndex={-1}
        aria-label="지역 랭킹"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <RegionRankingSection />
          <RegionTabSlider />
        </motion.div>
      </section>
    </div>
  );
}
