"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import styles from "./MainSection.module.css";
import MainLogoHeader from "./components/MainLogoHeader";
import SkeletonCard from "./components/SkeletonCard";
import { mergeRefs } from "./components/mergeRefs";
import { useLazyCards } from "./components/useLazyCards";

// 카드 분할 import
const PolicyCard = dynamic(() => import("./components/PolicyCard"), {
  ssr: false,
});
const RegionRankCard = dynamic(() => import("./components/RegionRankCard"), {
  ssr: false,
});
const ReviewCard = dynamic(() => import("./components/ReviewCard"), {
  ssr: false,
});
const TodayPopularCard = dynamic(
  () => import("./components/TodayPopularCard"),
  { ssr: false }
);
const RightThumbCard = dynamic(() => import("./components/RightThumbCard"), {
  ssr: false,
});
const Top10Card = dynamic(() => import("./components/Top10Card"), {
  ssr: false,
});

// 파도 효과: 등장 animation variants (left→center→right)
const waveVariants: Variants = {
  hidden: (delayIdx: number) => ({
    opacity: 0,
    x: -44,
    scale: 0.96,
    transition: {
      duration: 0.25,
      delay: delayIdx * 0.11,
    },
  }),
  visible: (delayIdx: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.37,
      delay: delayIdx * 0.11,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    x: -44,
    scale: 0.95,
    transition: { duration: 0.19, ease: "easeIn" },
  },
};

// 각 카드 컬럼별 delay 인덱스
const COL_DELAY = [0, 1, 2]; // 왼0, 중1, 오2

export default function MainSection() {
  const { refs, visible } = useLazyCards(6);

  return (
    <section className={styles.sectionRoot} aria-label="지방청년 메인 대시보드">
      <div className={styles.bgTop} aria-hidden />
      <div className={styles.innerWrap}>
        <MainLogoHeader />

        <div className={styles.cardRowWrap}>
          {/* === 좌측 컬럼 === */}
          <div className={styles.leftCol} ref={refs[0]}>
            <Suspense fallback={<SkeletonCard type="policy" />}>
              <AnimatePresence mode="wait">
                {visible[0] && (
                  <motion.div
                    key="policy"
                    custom={COL_DELAY[0]}
                    variants={waveVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    tabIndex={0}
                    aria-label="정책 카드"
                  >
                    <PolicyCard />
                  </motion.div>
                )}
                {!visible[0] && <SkeletonCard type="policy" />}
              </AnimatePresence>
            </Suspense>
          </div>

          {/* === 중앙 컬럼 === */}
          <div className={styles.centerCol}>
            <div
              className={styles.rankCardWrapper}
              ref={mergeRefs(refs[1])}
              tabIndex={0}
              aria-label="지역 랭킹 카드"
            >
              <Suspense fallback={<SkeletonCard type="rank" />}>
                <AnimatePresence mode="wait">
                  {visible[1] && (
                    <motion.div
                      key="rank"
                      custom={COL_DELAY[1]}
                      variants={waveVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <RegionRankCard />
                    </motion.div>
                  )}
                  {!visible[1] && <SkeletonCard type="rank" />}
                </AnimatePresence>
              </Suspense>
              <div className={styles.subRow}>
                <div ref={refs[2]} tabIndex={0} aria-label="커뮤니티 후기 카드">
                  <Suspense fallback={<SkeletonCard type="sub" />}>
                    <AnimatePresence mode="wait">
                      {visible[2] && (
                        <motion.div
                          key="review"
                          custom={COL_DELAY[1] + 0.5}
                          variants={waveVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <ReviewCard />
                        </motion.div>
                      )}
                      {!visible[2] && <SkeletonCard type="sub" />}
                    </AnimatePresence>
                  </Suspense>
                </div>
                <div ref={refs[3]} tabIndex={0} aria-label="오늘 인기 카드">
                  <Suspense fallback={<SkeletonCard type="sub" />}>
                    <AnimatePresence mode="wait">
                      {visible[3] && (
                        <motion.div
                          key="today"
                          custom={COL_DELAY[1] + 0.6}
                          variants={waveVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <TodayPopularCard />
                        </motion.div>
                      )}
                      {!visible[3] && <SkeletonCard type="sub" />}
                    </AnimatePresence>
                  </Suspense>
                </div>
              </div>
            </div>
          </div>

          {/* === 우측 컬럼 === */}
          <div className={styles.rightCol}>
            <div ref={refs[4]} tabIndex={0} aria-label="썸네일 카드">
              <Suspense fallback={<SkeletonCard type="thumb" />}>
                <AnimatePresence mode="wait">
                  {visible[4] && (
                    <motion.div
                      key="thumb"
                      custom={COL_DELAY[2]}
                      variants={waveVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <RightThumbCard />
                    </motion.div>
                  )}
                  {!visible[4] && <SkeletonCard type="thumb" />}
                </AnimatePresence>
              </Suspense>
            </div>
            <div ref={refs[5]} tabIndex={0} aria-label="Top10 카드">
              <Suspense fallback={<SkeletonCard type="top10" />}>
                <AnimatePresence mode="wait">
                  {visible[5] && (
                    <motion.div
                      key="top10"
                      custom={COL_DELAY[2] + 0.4}
                      variants={waveVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Top10Card />
                    </motion.div>
                  )}
                  {!visible[5] && <SkeletonCard type="top10" />}
                </AnimatePresence>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
