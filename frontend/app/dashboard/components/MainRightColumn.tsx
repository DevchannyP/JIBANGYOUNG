import { Flame } from "lucide-react";
import styles from "../styles/MainSection.module.css";

export default function MainRightColumn() {
  return (
    <div className={styles.rightCol}>
      {/* 상단 썸네일/카드 */}
      <div className={styles.bigThumbCard}>
        <div className={styles.bigThumbImage} />
        <div className={styles.bigThumbTitle}>
          1. 서울 날씨 맞추면 100만원 지급...
        </div>
      </div>
      {/* 주간 인기글 TOP10 */}
      <div className={styles.top10Card}>
        <div className={styles.top10Header}>
          <Flame size={18} />
          주간 인기글 TOP10
        </div>
        <ol className={styles.top10List}>
          <li>두달째 게시글 입니다...</li>
          <li>조회 100만 달성했어요 1위</li>
          <li>두달째 게시글 입니다...</li>
          <li>두달째 게시글 입니다...</li>
          <li>두달째 게시글 입니다...</li>
          <li>오늘 조회수 1위</li>
          <li>두달째 게시글 입니다...</li>
          <li>두달째 게시글 입니다...</li>
          <li>두달째 게시글 입니다...</li>
          <li>두달째 게시글 입니다...</li>
        </ol>
      </div>
    </div>
  );
}
