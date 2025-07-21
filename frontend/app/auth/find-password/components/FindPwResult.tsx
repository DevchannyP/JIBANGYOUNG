"use client";
import styles from "../FindPasswordPage.module.css";

interface Props {
  email: string;
  onRetry: () => void;
}

export default function FindPwResult({ email, onRetry }: Props) {
  return (
    <div className={styles.resultContainer}>
      <h2 className={styles.title}>메일 발송 완료</h2>
      <p className={styles.resultText}>
        <strong>{email}</strong> 주소로 비밀번호 재설정 링크를 발송했습니다.
      </p>
      <p className={styles.resultSubText}>
        메일함 또는 스팸함을 확인해주세요. <br />
        일정 시간 내에 링크를 클릭하여 비밀번호를 재설정하셔야 합니다.
      </p>
      <button onClick={onRetry} className={styles.retryButton}>
        다른 이메일로 받기
      </button>
    </div>
  );
}
