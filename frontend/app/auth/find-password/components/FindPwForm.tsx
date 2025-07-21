"use client";
import { sendResetPwEmail } from "@/libs/api/auth/auth.api"; // 실제 파일 구조 맞게 수정!
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../FindPasswordPage.module.css";

interface Props {
  onSuccess: (email: string) => void;
  onError: (msg: string) => void;
  error?: string;
}

export default function FindPwForm({ onSuccess, onError, error }: Props) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (error) inputRef.current?.focus();
  }, [error]);

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 100;

  const sendEmailMutation = useMutation({
    mutationFn: async (email: string) => sendResetPwEmail(email.trim()),
    onSuccess: () => {
      setMsg(
        "입력하신 이메일로 비밀번호 재설정 링크가 발송되었습니다. 메일함 또는 스팸함을 꼭 확인하세요."
      );
      onSuccess(email);
      submitBtnRef.current?.focus();
    },
    onError: (err: any) => {
      setMsg("");
      onError(
        err?.message || "메일 발송에 실패했습니다. 이메일을 다시 확인해 주세요."
      );
    },
  });

  const isLoading = sendEmailMutation.isPending;

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!emailValid || isLoading) return;
      setMsg("");
      onError(""); // UX: 에러 메시지 초기화
      sendEmailMutation.mutate(email);
    },
    [email, emailValid, isLoading, sendEmailMutation, onError]
  );

  return (
    <form
      className={styles.formContainer}
      autoComplete="off"
      aria-label="비밀번호 찾기 폼"
      aria-busy={isLoading}
      aria-live="assertive"
      onSubmit={handleSend}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (!emailValid || isLoading)) {
          e.preventDefault();
        }
      }}
    >
      <input
        ref={inputRef}
        id="reset-pw-email"
        type="email"
        value={email}
        inputMode="email"
        onChange={(e) => {
          setEmail(e.target.value.replace(/[<>'"`;]/g, "")); // XSS 방지
          setMsg("");
          if (error) onError("");
        }}
        placeholder="이메일을 입력하세요"
        autoComplete="email"
        aria-label="이메일"
        required
        className={styles.inputField}
        disabled={isLoading}
        spellCheck={false}
        maxLength={100}
        aria-invalid={!emailValid}
        style={{ marginBottom: "6px" }}
      />
      <button
        type="submit"
        ref={submitBtnRef}
        disabled={!emailValid || isLoading}
        aria-disabled={!emailValid || isLoading}
        className={styles.findIdButton}
        aria-busy={isLoading}
      >
        {isLoading ? "발송중..." : "비밀번호 재설정 메일 받기"}
      </button>
      <div style={{ marginBottom: 24 }} aria-hidden="true" />
      {!error && msg && (
        <div
          style={{
            color: "#147833",
            fontWeight: 500,
            fontSize: "0.98rem",
            marginBottom: 20,
            textAlign: "center",
          }}
          role="status"
          aria-live="polite"
        >
          {msg}
        </div>
      )}
      {error && (
        <div
          className={styles.errorMsg}
          role="alert"
          tabIndex={-1}
          aria-live="assertive"
          style={{ marginBottom: 20 }}
        >
          {error}
        </div>
      )}
    </form>
  );
}
