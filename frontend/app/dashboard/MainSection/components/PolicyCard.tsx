import { Heart } from "lucide-react";
import styles from "../MainSection.module.css";

export default function PolicyCard() {
  return (
    <div className={styles.policyCard}>
      <div className={styles.policyCardHeader}>
        내게 맞는<br />
        정책 보러가기
        <Heart className={styles.heartIcon} fill="#ffe140" />
      </div>
      <div className={styles.policyCardDesc}>
         <br />
        청년을 위한 다양한 지원 정책,
        <br />
        내게 딱 맞는 혜택을 쉽고 빠르게 찾아보세요.
      </div>
    </div>
  );
}
