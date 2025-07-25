import styles from "../MainSection.module.css";

export default function RightThumbCard() {
  return (
    <section className={styles.thumbCard}>
      <div className={styles.thumbImage} />
      <div className={styles.thumbTitle}>
        1. 서울 날씨 맞추면 100만원 지급...
      </div>
    </section>
  );
}
