"use client";
import styles from "../RegisterPage.module.css";

export default function LoadingCenter({
  text = "로딩 중...",
}: {
  text?: string;
}) {
  return (
    <div className={styles.loadingCenter} role="status" aria-live="polite">
      <div className={styles.loadingSpinner} aria-hidden />
      <span className={styles.loadingText}>{text}</span>
    </div>
  );
}
