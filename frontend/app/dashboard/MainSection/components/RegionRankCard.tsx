import { MapPinned } from "lucide-react";
import styles from "../MainSection.module.css";

export default function RegionRankCard() {
  return (
    <div className={styles.rankCard}>
      <div className={styles.rankCardHeader}>
        <MapPinned className={styles.rankIcon} />
        전국 살기
        <br />
        좋은 지역 순위
      </div>
      <div className={styles.rankTabRow}>
        <span className={styles.rankTabActive}>1위 서울</span>
        <span className={styles.rankTab}>2위 대구</span>
        <span className={styles.rankTab}>3위 부산</span>
      </div>
    </div>
  );
}
