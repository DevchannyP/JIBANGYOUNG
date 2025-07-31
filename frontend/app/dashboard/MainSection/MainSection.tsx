// app/dashboard/MainSection/MainSection.tsx
'use client';

import { AnimatePresence, cubicBezier, motion, Variants } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState } from "react";
import styles from './MainSection.module.css';
import SkeletonCard from './components/SkeletonCard';
import { mergeRefs } from './components/mergeRefs';
import { useLazyCards } from './components/useLazyCards';
import { usePopularPostsQuery } from './components/usePopularPostsQuery';

// 동적 import
const RegionRankCard = dynamic(() => import('./components/RegionRankCard'), { ssr: false });
const ReviewCard = dynamic(() => import('./components/ReviewCard'), { ssr: false });
const TodayPopularCard = dynamic(() => import('./components/TodayPopularCard'), { ssr: false });
const RightThumbCard = dynamic(() => import('./components/RightThumbCard'), { ssr: false });
const Top10Card = dynamic(() => import('./components/Top10Card'), { ssr: false });

const waveVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: -44,
    scale: 0.96,
    transition: { duration: 0.25, delay: i * 0.11 },
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.37, delay: i * 0.11, ease: cubicBezier(0.23, 1, 0.32, 1) },
  }),
  exit: {
    opacity: 0,
    x: -44,
    scale: 0.95,
    transition: { duration: 0.19, ease: 'easeIn' },
  },
};

export default function MainSection() {
  const { refs, visible } = useLazyCards(5);
  const { data, isLoading, isError, error } = usePopularPostsQuery();
  const posts = data?.posts ?? [];

  // idx 중앙관리(리스트/썸네일 동기화)
  const [currIdx, setCurrIdx] = useState(0);

  return (
    <>
      <div className={styles.centerCol}>
        <div className={styles.rankCardWrapper} ref={mergeRefs(refs[0])} tabIndex={0} aria-label="지역 랭킹 카드">
          {visible[0] === null && <SkeletonCard type="rank" />}
          {visible[0] && (
            <AnimatePresence mode="wait">
              <motion.div key="rank" custom={1} variants={waveVariants} initial="hidden" animate="visible" exit="exit">
                <RegionRankCard />
              </motion.div>
            </AnimatePresence>
          )}
          <div className={styles.subRow}>
            <div ref={refs[1]} tabIndex={0} aria-label="커뮤니티 후기 카드">
              {visible[1] === null && <SkeletonCard type="sub" />}
              {visible[1] && (
                <AnimatePresence mode="wait">
                  <motion.div key="review" custom={1.5} variants={waveVariants} initial="hidden" animate="visible" exit="exit">
                    <ReviewCard />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
            <div ref={refs[2]} tabIndex={0} aria-label="오늘 인기 카드">
              {visible[2] === null && <SkeletonCard type="sub" />}
              {visible[2] && (
                <AnimatePresence mode="wait">
                  <motion.div key="today" custom={1.6} variants={waveVariants} initial="hidden" animate="visible" exit="exit">
                    <TodayPopularCard />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rightCol}>
        <div ref={refs[3]} tabIndex={0} aria-label="썸네일 카드">
          {visible[3] === null && <SkeletonCard type="thumb" />}
          {visible[3] && (
            <AnimatePresence mode="wait">
              <motion.div key="thumb" custom={2}>
                <RightThumbCard
                  posts={posts}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  currIdx={currIdx}
                  setCurrIdx={setCurrIdx}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        <div ref={refs[4]} tabIndex={0} aria-label="Top10 카드">
          {visible[4] === null && <SkeletonCard type="top10" />}
          {visible[4] && (
            <AnimatePresence mode="wait">
              <motion.div key="top10" custom={2.4}>
                <Top10Card
                  posts={posts}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  currIdx={currIdx}
                  onListHover={setCurrIdx}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
}