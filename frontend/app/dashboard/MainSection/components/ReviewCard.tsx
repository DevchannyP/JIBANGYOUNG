import styles from "../MainSection.module.css";

export default function ReviewCard() {
  return (
    <section className={`${styles.subCard} ${styles.reviewCardCustom}`}>
      <span className={styles.subCardTitle}>인기 정착 후기</span>
    </section>
  );
}
