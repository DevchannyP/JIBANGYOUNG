// app/dashboard/components/PopularTodayCard.tsx

import { ThumbsUp } from "lucide-react";
import styles from "../styles/MainSection.module.css";

export default function PopularTodayCard() {
  return (
    <section className={styles.popularTodayCard}>
      <div className={styles.cardTitleRow}>
        <ThumbsUp size={18} />
        <span>오늘의 인기</span>
      </div>
      <ol className={styles.popularList}>
        <li>서울 날씨 맞추면 100만원 지급...</li>
        <li>전국 청년 주택 혜택 총정리!</li>
        <li>강원 특화 청년정책 신청법</li>
        <li>경기 무료 건강검진 이벤트</li>
        <li>부산 창업 지원금 안내</li>
      </ol>
    </section>
  );
}
