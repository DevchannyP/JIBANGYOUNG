"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles/DashboardClientShell.module.css";

interface Props {
  children: React.ReactNode[];
}
const SECTION_LABELS = ["메인", "HOT 커뮤니티", "지역 랭킹"];
const SECTION_COUNT = 3; // 사용할 섹션 개수

export default function DashboardScrollAnimator({ children }: Props) {
  // 고정 개수로 useRef 선언 (hook 규칙 엄격 준수)
  const sectionRef0 = useRef<HTMLElement>(null);
  const sectionRef1 = useRef<HTMLElement>(null);
  const sectionRef2 = useRef<HTMLElement>(null);
  const sectionRefs = [sectionRef0, sectionRef1, sectionRef2];

  // 사용할 섹션 개수만큼만 active
  const activeRefs = sectionRefs.slice(0, SECTION_COUNT);

  // 최초 등장 여부 관리 (처음만 애니메이션)
  const [shown, setShown] = useState(Array(SECTION_COUNT).fill(false).map((_, i) => i === 0));
  const [current, setCurrent] = useState(0);

  // IntersectionObserver로 현재 섹션·최초 등장 동시 관리
  useEffect(() => {
    if (!window?.IntersectionObserver) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const idx = activeRefs.findIndex((ref) => ref.current === e.target);
          if (idx !== -1) {
            if (e.isIntersecting && !shown[idx]) {
              setShown((prev) => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }
            if (e.isIntersecting) setCurrent(idx);
          }
        });
      },
      { root: null, rootMargin: "-44% 0px -44% 0px", threshold: 0.27 }
    );
    activeRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line
  }, [shown]);

  // dotNav/키보드/휠/터치 scroll handler
  const scrollToSection = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= SECTION_COUNT) return;
      setCurrent(idx);
      activeRefs[idx].current?.scrollIntoView({ behavior: "smooth" });
      activeRefs[idx].current?.focus({ preventScroll: true });
    },
    [activeRefs]
  );

  // 안내문구 pop
  const [showGuide, setShowGuide] = useState(true);
  useEffect(() => {
    if (!showGuide) return;
    const timer = setTimeout(() => setShowGuide(false), 2100);
    return () => clearTimeout(timer);
  }, [showGuide]);

  // 키보드/휠/터치 scroll UX
  useEffect(() => {
    let wheelBlocked = false;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
    let touchStartY = 0;
    let touchLocked = false;
    const isEditable = (el: Element | null) =>
      !!el &&
      (
        (el as HTMLElement).isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)
      );
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(document.activeElement)) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      let handled = false;
      if (["PageDown", "ArrowDown", " "].includes(e.key)) {
        if (current < SECTION_COUNT - 1) {
          scrollToSection(current + 1);
          handled = true;
        }
      } else if (
        ["PageUp", "ArrowUp"].includes(e.key) ||
        (e.key === " " && e.shiftKey)
      ) {
        if (current > 0) {
          scrollToSection(current - 1);
          handled = true;
        }
      } else if (e.key === "Home") {
        scrollToSection(0);
        handled = true;
      } else if (e.key === "End") {
        scrollToSection(SECTION_COUNT - 1);
        handled = true;
      }
      if (handled) e.preventDefault();
    };
    const onWheel = (e: WheelEvent) => {
      if (wheelBlocked) return;
      if (isEditable(document.activeElement)) return;
      if (Math.abs(e.deltaY) < 80) return;
      wheelBlocked = true;
      if (e.deltaY > 0 && current < SECTION_COUNT - 1) {
        scrollToSection(current + 1);
      } else if (e.deltaY < 0 && current > 0) {
        scrollToSection(current - 1);
      }
      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        wheelBlocked = false;
      }, 900);
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchLocked = false;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchLocked) return;
      const endY = e.changedTouches[0].clientY;
      if (Math.abs(endY - touchStartY) > 80) {
        if (endY < touchStartY && current < SECTION_COUNT - 1) {
          scrollToSection(current + 1);
          touchLocked = true;
        } else if (endY > touchStartY && current > 0) {
          scrollToSection(current - 1);
          touchLocked = true;
        }
      }
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [current, scrollToSection]);

  return (
    <div className={styles.fullpageScrollContainer} aria-live="polite">
      {/* dot nav */}
      <nav className={styles.dotNav} aria-label="페이지 네비게이션" tabIndex={0}>
        {Array(SECTION_COUNT)
          .fill(0)
          .map((_, idx) => (
            <motion.button
              key={idx}
              className={`${styles.dot} ${idx === current ? styles.dotActive : ""}`}
              aria-label={`${SECTION_LABELS[idx] || `섹션${idx + 1}`}로 이동`}
              onClick={() => scrollToSection(idx)}
              tabIndex={0}
              type="button"
              aria-current={idx === current}
              animate={idx === current ? { scale: 1.16 } : { scale: 1.0 }}
              whileTap={{ scale: 1.25 }}
              whileHover={idx !== current ? { scale: 1.08 } : {}}
              transition={{ type: "spring", stiffness: 360, damping: 25 }}
            />
          ))}
      </nav>
      {/* 안내문구 */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            className={styles.scrollGuide}
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ duration: 0.44, ease: [0.43, 1.28, 0.41, 0.92] }}
            aria-live="polite"
          >
            <span className={styles.scrollGuideContent}>
              <span role="img" aria-label="scroll">👇</span>
              <span className={styles.scrollGuideText}>스크롤·터치·dot·키로 탐색하세요</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 섹션들 (최초 진입시만 모션, 그 이후 일반 렌더) */}
      {Array(SECTION_COUNT).fill(0).map((_, idx) =>
        !shown[idx] ? (
          <motion.section
            key={idx}
            ref={activeRefs[idx]}
            className={`${styles.fullpageSection}${idx === 0 ? " " + styles.mainSection : ""}`}
            tabIndex={-1}
            aria-label={SECTION_LABELS[idx] || `섹션${idx + 1}`}
            role="region"
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.68,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {children[idx]}
          </motion.section>
        ) : (
          <section
            key={idx}
            ref={activeRefs[idx]}
            className={`${styles.fullpageSection}${idx === 0 ? " " + styles.mainSection : ""}`}
            tabIndex={-1}
            aria-label={SECTION_LABELS[idx] || `섹션${idx + 1}`}
            role="region"
          >
            {children[idx]}
          </section>
        )
      )}
    </div>
  );
}
