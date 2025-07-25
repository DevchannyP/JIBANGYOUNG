import styles from "../styles/MainSection.module.css";

export default function RegionRankCard() {
  return (
    <section className={styles.rankCard}>
      <div className={styles.rankCardHeader}>
        <span className={styles.rankIcon}>🗺️</span>
        전국 살기
        <br />
        좋은 지역 순위
        <span className={styles.heartIcon}>💛</span>
      </div>
      <div className={styles.rankTabRow}>
        <span className={styles.rankTabActive}>1위 서울</span>
        <span className={styles.rankTab}>2위 대구</span>
        <span className={styles.rankTab}>3위 부산</span>
      </div>
    </section>
  );
}
