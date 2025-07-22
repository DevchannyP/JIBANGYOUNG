"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, RefObject, useCallback } from "react";
import styles from "./styles/DashboardClientShell.module.css";

// 동적 import + 섹션별 스켈레톤(UX/서버비용↓)
const MainSection = dynamic(() => import("./MainSection/MainSection"), {
  ssr: false,
  loading: () => <div className={styles.sectionSkeleton} style={{ background: "#FFE140" }} />,
});
const CommunitySection = dynamic(
  () => import("./CommunitySection/CommunitySection"),
  { ssr: false, loading: () => <div className={styles.sectionSkeleton} style={{ background: "#fff" }} /> }
);
const RegionRankingMainSection = dynamic(
  () => import("./RegionRankingMainSection/RegionRankingMainSection"),
  { ssr: false, loading: () => <div className={styles.sectionSkeleton} style={{ background: "#ffe140" }} /> }
);

const SECTIONS = [
  { name: "메인", label: "메인" },
  { name: "커뮤니티", label: "HOT 커뮤니티" },
  { name: "랭킹", label: "지역 랭킹" },
];

function useSectionInView(refs: RefObject<HTMLElement>[], hydrated: boolean) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!hydrated) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        const visibleIdx = entries
          .filter((e) => e.isIntersecting)
          .map((e) => refs.findIndex((ref) => ref.current === e.target));
        if (visibleIdx.length) setCurrent(Math.min(...visibleIdx));
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.3,
      }
    );
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, [hydrated, refs.map((r) => r.current).join()]);

  return [current, setCurrent] as const;
}

export default function DashboardClientShell() {
  const [hydrated, setHydrated] = useState(false);
  const sectionRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ];
  const [current, setCurrent] = useSectionInView(sectionRefs, hydrated);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => { setHydrated(true); }, []);

  const scrollToSection = useCallback((idx: number) => {
    setCurrent(idx);
    sectionRefs[idx].current?.scrollIntoView({ behavior: "smooth" });
    sectionRefs[idx].current?.focus({ preventScroll: true });
  }, [sectionRefs]);

  useEffect(() => {
    if (!hydrated) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) {
        e.preventDefault();
        scrollToSection(Math.min(SECTIONS.length - 1, current + 1));
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        scrollToSection(Math.max(0, current - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, hydrated, scrollToSection]);

  useEffect(() => {
    const timer = setTimeout(() => setShowGuide(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!hydrated) {
    return (
      <div className={styles.fullpageScrollContainer}>
        <div className={styles.skeletonLoader}>메인 페이지로 진입중...</div>
      </div>
    );
  }

  return (
    <div className={styles.fullpageScrollContainer} aria-live="polite">
      {/* dot nav */}
      <nav className={styles.dotNav} aria-label="페이지 네비게이션">
        {SECTIONS.map((section, idx) => (
          <button
            key={section.name}
            className={`${styles.dot} ${idx === current ? styles.dotActive : ""}`}
            aria-label={`${section.label}로 이동`}
            onClick={() => scrollToSection(idx)}
            tabIndex={0}
            type="button"
            aria-current={idx === current}
          />
        ))}
      </nav>
      {/* 안내문구 */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            className={styles.scrollGuide}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.5 }}
          >
            <span>아래로 스크롤/좌우키/PageUp,Down으로 넘겨보세요!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. 메인 */}
      <section
        ref={sectionRefs[0]}
        className={`${styles.fullpageSection} ${styles.mainSection}`}
        tabIndex={-1}
        aria-label="메인"
        role="region"
      >
        <MainSection />
      </section>
      {/* 2. 커뮤니티 */}
      <section
        ref={sectionRefs[1]}
        className={styles.fullpageSection}
        tabIndex={-1}
        aria-label="HOT 커뮤니티"
        role="region"
      >
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
        >
          <CommunitySection />
        </motion.div>
      </section>
      {/* 3. 지역랭킹 (마지막, snap scroll 유지, footer 없음) */}
      <section
        ref={sectionRefs[2]}
        className={`${styles.fullpageSection} ${styles.lastSectionWithFooter}`}
        tabIndex={-1}
        aria-label="지역 랭킹"
        role="region"
      >
        <motion.div
          initial={{ opacity: 0, y: 38 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
        >
          <RegionRankingMainSection />
        </motion.div>
      </section>
    </div>
  );
}
