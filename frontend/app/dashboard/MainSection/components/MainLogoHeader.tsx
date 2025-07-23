import Image from "next/image";
import styles from "../MainSection.module.css";

export default function MainLogoHeader() {
  return (
    <header className={styles.heroSection} aria-label="지방청년 로고">
      <div className={styles.logoRow}>
        <span>
          <Image
            src="/social/dashboard/JibangYoung.webp"
            alt="지방청년 로고"
            width={550} // ✅ 최대값 기준
            height={152}
            className={styles.logoTextImg}
            draggable={false}
            priority
          />
        </span>
        <Image
          src="/social/dashboard/BearBadge.webp"
          alt="베어 배지"
          width={116} // ✅ 최대값 기준
          height={116}
          className={styles.logoBear}
          draggable={false}
          priority
        />
      </div>
    </header>
  );
}
