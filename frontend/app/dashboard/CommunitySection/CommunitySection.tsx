'use client'; // ✅ 무조건 첫 줄에!

import styles from "./CommunitySection.module.css"; // ✅ 주석 해제 필수!
import SectionTitle from "./components/SectionTitle";
import MonthlyHotTable from "./components/MonthlyHotTable";
import PolicyHotTable from "./components/PolicyHotTable";

export default function CommunitySection() {
  return (
    <div className={styles.sectionRoot}>
      <div className={styles.bgYellow} />
      <div className={styles.innerWrap}>
        <div className={styles.tablesBoxCustom}>
          <div className={styles.tableBoxLeft}><MonthlyHotTable /></div>
          <div className={styles.tableBoxRight}><PolicyHotTable /></div>
        </div>
        <div className={styles.titleBoxCustom}>
          <SectionTitle align="right" />
        </div>
      </div>
    </div>
  );
}
