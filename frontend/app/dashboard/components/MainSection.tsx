import styles from "../styles/MainSection.module.css";
import MainLogoHeader from "./MainLogoHeader";
import PolicyCard from "./PolicyCard";
import RegionRankCard from "./RegionRankCard";
import ReviewCard from "./ReviewCard";
import RightThumbCard from "./RightThumbCard";
import TodayPopularCard from "./TodayPopularCard";
import Top10Card from "./Top10Card";

export default function MainSection() {
  return (
    <section className={styles.sectionRoot}>
      {/* 노란 배경을 absolute로 */}
      <div className={styles.bgTop} />
      {/* 내부 컨텐츠만 .innerWrap로 고정폭 중앙 */}
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
