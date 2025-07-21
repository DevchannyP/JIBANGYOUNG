"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../FindPasswordPage.module.css";

interface Props {
  email: string;
  onRetry: () => void;
}

export default function FindPwResult({ email, onRetry }: Props) {
  const [copied, setCopied] = useState(false);
  const retryBtnRef = useRef<HTMLButtonElement>(null);

  // 버튼 자동 포커스 및 엔터키 UX
  useEffect(() => {
    retryBtnRef.current?.focus();
  }, []);

  // 이메일 복사
  const handleCopy = async () => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div
      className={styles.resultContainer}
      tabIndex={0}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        outline: "none",
        maxWidth: 420,
        margin: "0 auto",
        background: "#fffef7",
        borderRadius: 18,
        boxShadow: "0 2px 18px 0 #ffe1403a",
        padding: "32px 18px 28px",
      }}
    >
      <h2
        className={styles.title}
        tabIndex={-1}
        style={{
          color: "#147833",
          marginBottom: 12,
          letterSpacing: "-1px",
        }}
      >
        메일 발송 완료
      </h2>
      <p className={styles.resultText} style={{ marginBottom: 18 }}>
        <strong
          tabIndex={0}
          aria-label={`입력한 이메일: ${email}`}
          style={{
            background: "#ffe14088",
            borderRadius: 7,
            padding: "1px 7px",
            cursor: "pointer",
            transition: "background 0.16s",
            outline: copied ? "2.5px solid #3884e3" : undefined,
          }}
          onClick={handleCopy}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleCopy();
          }}
          role="button"
          aria-pressed="false"
        >
          {email}
        </strong>{" "}
        주소로 <b>비밀번호 재설정 링크</b>를 발송했습니다.
        <span
          aria-live="assertive"
          role="alert"
          style={{
            fontSize: "0.92em",
            color: copied ? "#147833" : "#999",
            marginLeft: 6,
            fontWeight: copied ? 700 : 400,
            transition: "color 0.12s",
          }}
        >
          {copied ? "복사됨!" : "클릭시 복사"}
        </span>
      </p>
      <div
        style={{
          color: "#3a3c3f",
          fontSize: "1rem",
          marginBottom: 8,
          textAlign: "center",
        }}
        className={styles.resultSubText}
      >
        메일함 또는 <b style={{ color: "#d32f2f" }}>스팸함</b>을 꼭 확인하세요.
      </div>
      <div
        style={{
          color: "#8e8e8e",
          fontSize: "0.97rem",
          marginBottom: 18,
          textAlign: "center",
        }}
      >
        링크는 <b>일정 시간 내</b>에만 사용할 수 있습니다.
        <br />
        메일이 없다면 이메일이 올바른지 또는 스팸함을 꼭 확인해 주세요.
      </div>
      <button
        type="button"
        className={styles.findIdButton} // ⭐️ 동일하게 적용!
        ref={retryBtnRef}
        onClick={onRetry}
        aria-label="다른 이메일로 재전송"
        tabIndex={0}
        style={{ marginTop: 8, fontWeight: 700 }} // 필요시 개별 스타일 추가
      >
        다른 이메일로 받기
      </button>
    </div>
  );
}
