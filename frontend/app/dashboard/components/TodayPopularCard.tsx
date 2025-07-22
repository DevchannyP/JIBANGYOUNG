import styles from "../styles/MainSection.module.css";

export default function TodayPopularCard() {
  return (
    <section className={styles.subCard}>
      <span className={styles.subCardTitle}>오늘의 인기</span>
      <span className={styles.heartIconSub}>💛</span>
    </section>
  );
}
