"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./styles/DashboardClientShell.module.css";

const MainSection = dynamic(() => import("./MainSection/MainSection"), {
  ssr: false,
});
const CommunitySection = dynamic(
  () => import("./CommunitySection/CommunitySection"),
  { ssr: false }
);
const RegionRankingMainSection = dynamic(
  () => import("./RegionRankingMainSection/RegionRankingMainSection"),
  { ssr: false }
);

const SECTIONS = [
  { name: "메인", label: "메인" },
  { name: "커뮤니티", label: "HOT 커뮤니티" },
  { name: "랭킹", label: "지역 랭킹" },
];

// section inView 감지 - ref 배열 객체/함수는 의존성에서 제외(불변)
function useSectionInView(refs: RefObject<HTMLElement>[], hydrated: boolean) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        const visibleIdx = entries
          .filter((e) => e.isIntersecting)
          .map((e) => refs.findIndex((ref) => ref.current === e.target));
        if (visibleIdx.length) setCurrent((prev) => Math.min(...visibleIdx));
      },
      {
        root: null,
        rootMargin: "-44% 0px -44% 0px",
        threshold: 0.27,
      }
    );
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, [hydrated, refs]);

  return [current, setCurrent] as const;
}

function useSectionLazyMount(
  ref: RefObject<HTMLElement>,
  hydrated: boolean,
  eager?: boolean
) {
  const [mounted, setMounted] = useState(!!eager);
  useEffect(() => {
    if (!hydrated || mounted) return;
    const target = ref.current;
    if (!target) return;
    let disconnected = false;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (disconnected) return;
        if (entries[0]?.isIntersecting) {
          setMounted(true);
          observer.disconnect();
          disconnected = true;
        }
      },
      { root: null, threshold: 0.15 }
    );
    observer.observe(target);
    return () => {
      disconnected = true;
      observer.disconnect();
    };
  }, [hydrated, mounted, ref]);
  return mounted;
}

export default function DashboardClientShell() {
  const [hydrated, setHydrated] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);

  // 각 section의 ref를 개별로 선언
  const sectionRef0 = useRef<HTMLElement>(null);
  const sectionRef1 = useRef<HTMLElement>(null);
  const sectionRef2 = useRef<HTMLElement>(null);

  // useMemo로 배열 고정 (불변)
  const sectionRefs = useMemo(
    () => [sectionRef0, sectionRef1, sectionRef2],
    []
  );

  const [current, setCurrent] = useSectionInView(sectionRefs, hydrated);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    function getFooterHeight() {
      const footer = document.querySelector("footer");
      return footer ? footer.getBoundingClientRect().height || 0 : 0;
    }
    function updateFooterHeight() {
      setFooterHeight(getFooterHeight());
    }
    updateFooterHeight();
    window.addEventListener("resize", updateFooterHeight);
    return () => window.removeEventListener("resize", updateFooterHeight);
  }, [hydrated]);

  // Lazy mount
  const mountMain = true;
  const mountCommunity = useSectionLazyMount(sectionRef1, hydrated);
  const mountRanking = useSectionLazyMount(sectionRef2, hydrated);

  // setCurrent는 함수형 업데이트만 사용하면 의존성에서 제외 가능
  const scrollToSection = useCallback(
    (idx: number) => {
      setCurrent(idx);
      sectionRefs[idx].current?.scrollIntoView({ behavior: "smooth" });
      sectionRefs[idx].current?.focus({ preventScroll: true });
      setShowGuide(false);
    },
    [setCurrent, sectionRefs]
  );

  const dotNavRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nav = dotNavRef.current;
    if (!nav) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        (nav as HTMLDivElement).blur?.();
      }
    };
    nav.addEventListener("keydown", onKeyDown);
    return () => nav.removeEventListener("keydown", onKeyDown);
  }, []);

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

    let wheelTimeout: NodeJS.Timeout | null = null;
    let wheelBlocked = false;
    const onWheel = (e: WheelEvent) => {
      if (wheelBlocked) return;
      if (Math.abs(e.deltaY) < 110) return;
      wheelBlocked = true;
      if (e.deltaY > 0) {
        scrollToSection(Math.min(SECTIONS.length - 1, current + 1));
      } else if (e.deltaY < 0) {
        scrollToSection(Math.max(0, current - 1));
      }
      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        wheelBlocked = false;
      }, 1100);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      if (Math.abs(endY - touchStartY) > 80) {
        if (endY < touchStartY)
          scrollToSection(Math.min(SECTIONS.length - 1, current + 1));
        else scrollToSection(Math.max(0, current - 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [current, hydrated, scrollToSection]);

  useEffect(() => {
    if (!showGuide) return;
    const timer = setTimeout(() => setShowGuide(false), 2000);
    return () => clearTimeout(timer);
  }, [showGuide]);

  const lastSectionStyle: React.CSSProperties = footerHeight
    ? {
        height: `calc(100vh - ${footerHeight}px)`,
        minHeight: `calc(100vh - ${footerHeight}px)`,
        maxHeight: `calc(100vh - ${footerHeight}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
      }
    : {};

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
      <nav
        className={styles.dotNav}
        aria-label="페이지 네비게이션"
        tabIndex={0}
        ref={dotNavRef}
      >
        {SECTIONS.map((section, idx) => (
          <motion.button
            key={section.name}
            className={`${styles.dot} ${idx === current ? styles.dotActive : ""}`}
            aria-label={`${section.label}로 이동`}
            onClick={() => scrollToSection(idx)}
            tabIndex={0}
            type="button"
            aria-current={idx === current}
            animate={idx === current ? { scale: 1.16 } : { scale: 1.0 }}
            transition={{ type: "spring", stiffness: 340, damping: 23 }}
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
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
            aria-live="polite"
          >
            <span className={styles.scrollGuideContent}>
              <span role="img" aria-label="scroll">
                👇
              </span>
              <span className={styles.scrollGuideText}>
                스크롤·터치·dot·키로 탐색하세요
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. 메인 */}
      <section
        ref={sectionRef0}
        className={`${styles.fullpageSection} ${styles.mainSection}`}
        tabIndex={-1}
        aria-label="메인"
        role="region"
      >
        {mountMain ? (
          <MainSection />
        ) : (
          <div
            className={styles.sectionSkeleton}
            style={{ background: "#FFE140" }}
          />
        )}
      </section>
      {/* 2. 커뮤니티 */}
      <section
        ref={sectionRef1}
        className={styles.fullpageSection}
        tabIndex={-1}
        aria-label="HOT 커뮤니티"
        role="region"
      >
        {mountCommunity ? (
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
          >
            <CommunitySection />
          </motion.div>
        ) : (
          <div
            className={styles.sectionSkeleton}
            style={{ background: "#fff" }}
          />
        )}
      </section>
      {/* 3. 지역랭킹 */}
      <section
        ref={sectionRef2}
        className={`${styles.fullpageSection} ${styles.lastSectionWithFooter}`}
        style={lastSectionStyle}
        tabIndex={-1}
        aria-label="지역 랭킹"
        role="region"
      >
        {mountRanking ? (
          <motion.div
            initial={{ opacity: 0, y: 38 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
          >
            <RegionRankingMainSection />
          </motion.div>
        ) : (
          <div
            className={styles.sectionSkeleton}
            style={{ background: "#ffe140" }}
          />
        )}
      </section>
    </div>
  );
}
