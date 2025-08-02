// app/auth/find-id/components/FindIdResult.tsx
"use client";
import styles from "../../login/LoginPage.module.css";

interface Props {
  username: string;
  onRetry: () => void;
}
// 아이디 찾기 결과 컴포넌트
export default function FindIdResult({ username, onRetry }: Props) {
  return (
    <div className={styles.resultContainer}>
      <div className={styles.successIcon} aria-hidden>✔️</div>
      <div className={styles.resultTitle}>아이디 찾기 완료</div>
      <div className={styles.resultCard}>
        <div className={styles.resultRow}>
          <span className={styles.resultLabel}>아이디</span>
          <span className={styles.resultValue}>{username}</span>
        </div>
      </div>
      <div className={styles.actionButtons}>
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          다시 찾기
        </button>
        <a href="/auth/login" className={styles.loginButton}>
          로그인 하기
        </a>
      </div>
    </div>
  );
}
