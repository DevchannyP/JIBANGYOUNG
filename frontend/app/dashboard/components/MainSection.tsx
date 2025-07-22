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
      {/* 상단 노란 배경 (absolute, 아래로 370px 정도) */}
      <div className={styles.bgTop} />

      {/* 중앙 콘텐츠: margin-top: -100px 등으로 노란 영역과 걸쳐지게 */}
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
