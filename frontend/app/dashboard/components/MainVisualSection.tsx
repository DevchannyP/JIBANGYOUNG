import { Heart, MapPinned, ThumbsUp } from "lucide-react";
import styles from "./MainVisualSection.module.css";

export default function MainVisualSection() {
  return (
    <section className={styles.mainSection}>
      {/* 상단 배경 */}
      <div className={styles.bgTop} />
      {/* 타이틀/캐릭터 */}
      <div className={styles.logoRow}>
        <span className={styles.logoText}>지방청년</span>
        <img
          src="/character.png"
          alt="캐릭터"
          className={styles.logoCharacter}
        />
      </div>

      <div className={styles.cardsGrid}>
        {/* 왼쪽 정책 카드 */}
        <div className={styles.policyCard}>
          <div className={styles.cardTitleRow}>
            <Heart size={21} color="#F6C92B" style={{ marginRight: 8 }} />
            <span>내게 맞는 정책 보러가기</span>
          </div>
          <div className={styles.cardDesc}>
            청년을 위한 다양한 지방 정책,
            <br />
            <b>내게 맞는 혜택</b>을 쉽고 빠르게
            <br />
            한눈에 찾아보세요.
          </div>
        </div>

        {/* 중앙 전국 랭킹 + 탭 */}
        <div className={styles.rankingCard}>
          <div className={styles.cardTitleRow}>
            <MapPinned size={21} color="#4F46E5" style={{ marginRight: 8 }} />
            <span>전국 살기 좋은 지역 순위</span>
          </div>
          <div className={styles.rankingTabs}>
            <span className={styles.tabActive}>1위 서울</span>
            <span>2위 대구</span>
            <span>3위 부산</span>
          </div>
        </div>

        {/* 중앙 인기/후기/오늘 탭 (ex: 3개 버튼, 오늘 선택 상태) */}
        <div className={styles.popularCard}>
          <div className={styles.cardTabs}>
            <span className={styles.tab}>인기 정착 후기</span>
            <span className={styles.tabActive}>
              오늘의 인기 <Heart size={16} color="#F6C92B" />
            </span>
          </div>
          <ol className={styles.todayList}>
            <li>1. 서울 날씨 맞추면 100만원 지급...</li>
            <li>2. ...</li>
            <li>3. ...</li>
            <li>4. ...</li>
          </ol>
        </div>

        {/* 우측 상단 빅카드 (썸네일/제목) */}
        <div className={styles.bigCard}>
          <div className={styles.bigCardImage}></div>
          <div className={styles.bigCardTitle}>
            1. 서울 날씨 맞추면 100만원 지급...
          </div>
        </div>

        {/* 우측 하단 TOP10 카드 */}
        <div className={styles.top10Card}>
          <div className={styles.cardTitleRow}>
            <ThumbsUp size={21} color="#4F46E5" style={{ marginRight: 8 }} />
            <span>주간 인기글 TOP10</span>
          </div>
          <ol className={styles.top10List}>
            <li>
              <b>2.</b> 두번째 게시글 입니다...
            </li>
            <li>
              <b>3.</b> 요즘 10대 블랭소스 1위
            </li>
            {/* ... */}
          </ol>
        </div>
      </div>

      {/* 하단 스크롤 마크 */}
      <div className={styles.scrollMark}>
        SCROLL <span className={styles.arrow}>⌄</span>
      </div>
    </section>
  );
}
