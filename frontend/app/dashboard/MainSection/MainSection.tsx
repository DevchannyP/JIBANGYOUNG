'use client'; // ✅ 무조건 첫 줄에!

// components/MainSection/MainSection.tsx
import styles from "./MainSection.module.css";

import MainLogoHeader from "./components/MainLogoHeader";
import PolicyCard from "./components/PolicyCard";
import RegionRankCard from "./components/RegionRankCard";
import ReviewCard from "./components/ReviewCard";
import TodayPopularCard from "./components/TodayPopularCard";
import RightThumbCard from "./components/RightThumbCard";
import Top10Card from "./components/Top10Card";

export default function MainSection() {
  return (
    <section className={styles.sectionRoot}>
      <div className={styles.bgTop} />

      <div className={styles.innerWrap}>
        <MainLogoHeader />

        <div className={styles.cardRowWrap}>
          <div className={styles.leftCol}>
            <PolicyCard />
          </div>
          <div className={styles.centerCol}>
            <div className={styles.rankCardWrapper}>
              <RegionRankCard />
              <div className={styles.subRow}>
                <ReviewCard />
                <TodayPopularCard />
              </div>
            </div>
          </div>
          <div className={styles.rightCol}>
            <RightThumbCard />
            <Top10Card />
          </div>
        </div>

        <div className={styles.scrollMark}>
          SCROLL <span className={styles.arrow}>⌄</span>
        </div>
      </div>
    </section>
  );
}
