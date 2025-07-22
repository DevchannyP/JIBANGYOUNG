import styles from "../styles/MainSection.module.css";

export default function Top10Card() {
  return (
    <section className={styles.top10Card}>
      <div className={styles.top10Header}>
        주간 인기글 TOP10
        <span className={styles.top10Icon}>👍</span>
      </div>
      <ol className={styles.top10List}>
        <li>
          <span className={styles.rank2}>2. 두번째 게시글 입니다...</span>{" "}
          <span className={styles.emoji}>😊</span>
        </li>
        <li>
          <span className={styles.rank3}>3. 요즘 10대들 행복요소 1위</span>{" "}
          <span className={styles.emoji}>😊</span>
        </li>
        <li>4. 두번째 게시글 입니다...</li>
        <li>5. 두번째 게시글 입니다...</li>
        <li>6. 요즘 10대들 행복요소 1위</li>
        <li>7. 두번째 게시글 입니다...</li>
        <li>8. 두번째 게시글 입니다...</li>
        <li>9. 두번째 게시글 입니다...</li>
        <li>10. 두번째 게시글 입니다...</li>
      </ol>
    </section>
  );
}
