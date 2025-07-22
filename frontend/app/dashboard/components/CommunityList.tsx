// app/dashboard/components/CommunityList.tsx
import styles from "../styles/CommunityList.module.css";

export default function CommunityList() {
  const posts = [
    "1. 8월 10대명 랭킹소식 1위...",
    "2. 8월 인기후기 경상북도 2024년",
    "3. 청년 복지 신청 가이드",
    "4. 두번째 게시글 입니다...",
    "5. 두번째 게시글 입니다...",
  ];

  return (
    <div className={styles.section}>
      <div className={styles.listCard}>
        <h4 className={styles.listTitle}>오늘의 인기</h4>
        <ol className={styles.ol}>
          {posts.map((t, i) => (
            <li key={i} className={styles.listItem}>
              {t}
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.listCard}>
        <h4 className={styles.listTitle}>
          주간 인기글 TOP10 <span className={styles.thumb}>👍</span>
        </h4>
        <ol className={styles.ol}>
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <li key={i} className={styles.listItem}>
                {i + 1}. 두번째 게시글 입니다...
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
}
