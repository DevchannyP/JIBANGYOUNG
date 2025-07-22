// app/dashboard/components/BigHighlightCard.tsx

import styles from "../styles/MainSection.module.css";

export default function BigHighlightCard() {
  return (
    <section className={styles.bigHighlightCard}>
      <div className={styles.bigCardImage} />
      <div className={styles.bigCardText}>
        <strong>서울 날씨 맞추면 100만원 지급...</strong>
      </div>
    </section>
  );
}
