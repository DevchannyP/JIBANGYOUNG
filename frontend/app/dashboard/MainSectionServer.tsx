// 📁 app/dashboard/MainSectionServer.tsx
'use client';

import { cubicBezier, motion } from 'framer-motion';
import styles from "./MainSection/MainSection.module.css";
import MainLogoHeader from "./MainSection/components/MainLogoHeader";
import PolicyCard from "./MainSection/components/PolicyCard";
import MainSectionWrapper from "./MainSectionWrapper";

// ✅ 강한 집중용 애니메이션
const initialVariant = {
  scale: 2.4,
  y: 0,
  opacity: 1,
  position: 'absolute',
  top: '40%',
  left: '50%',
  x: '-50%', // translateX
  zIndex: 50,
};

const animateVariant = {
  scale: 1,
  y: 0,
  opacity: 1,
  x: '0%',
  position: 'static',
  zIndex: 'auto',
  transition: {
    duration: 0.8,
    ease: cubicBezier(0.23, 1, 0.32, 1),
  },
};

export default function MainSectionServer() {
  return (
    <section className={styles.sectionRoot} aria-label="지방청년 메인 대시보드">
      <div className={styles.bgTop} aria-hidden />
      <div className={styles.innerWrap}>
        <MainLogoHeader />

        <div className={styles.cardRowWrap}>
          {/* 좌측 SSR 카드 (motion으로 감싸고, 중앙 강조 애니메이션) */}
          <div className={styles.leftCol}>
            <motion.div
              initial={initialVariant}
              animate={animateVariant}
              tabIndex={0}
              aria-label="내게 맞는 정책 보러가기"
            >
              <PolicyCard />
            </motion.div>
          </div>

          {/* 나머지 카드들 */}
          <MainSectionWrapper />
        </div>
      </div>
    </section>
  );
}
