import styles from "../MainSection.module.css";

export default function TodayPopularCard() {
  return (
    <section className={styles.subCard}>
      <div className={styles.todayPopularRow}>
        <span className={styles.subCardTitle}>오늘의 인기</span>
        <span className={styles.heartIconSub}>💛</span>
      </div>
      {/* (다른 내용이 있다면 여기 추가) */}
    </section>
  );
}
