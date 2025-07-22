import { Heart } from "lucide-react";
import styles from "../styles/MainSection.module.css";

export default function PolicyCard() {
  return (
    <section className={styles.policyCard}>
      <div className={styles.policyHeader}>
        내게 맞는
        <br />
        정책 보러가기
        <Heart className={styles.heartIcon} size={22} />
      </div>
      <div className={styles.policyDesc}>
        관심에 맞는 다양한 지원 정책,
        <br />
        복지, 이벤트 정보를 빠르게 추천해드립니다.
      </div>
    </section>
  );
}
