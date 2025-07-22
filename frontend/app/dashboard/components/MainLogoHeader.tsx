import Image from "next/image";
import styles from "../styles/MainSection.module.css";

export default function MainLogoHeader() {
  return (
    <header className={styles.heroSection} aria-label="지방청년 로고">
      <div className={styles.logoRow}>
        {/* 실제 텍스트 → 이미지로 export/최적화 권장 */}
        <span>
          <Image
            src="/social/dashboard/JibangYoung.webp"
            alt="지방청년 로고"
            width={470}
            height={132}
            className={styles.logoTextImg}
            draggable={false}
            priority
          />
        </span>
        <Image
          src="/social/dashboard/BearBadge.webp"
          alt="베어 배지"
          width={90}
          height={90}
          className={styles.logoBear}
          draggable={false}
          priority
        />
      </div>
    </header>
  );
}
