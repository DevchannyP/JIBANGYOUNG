"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import styles from "../FindPasswordPage.module.css";

// 비밀번호 재설정 이메일 발송 API
async function sendResetPwEmail(email: string): Promise<void> {
  const res = await fetch("/api/auth/send-reset-pw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await res.text());
}

interface Props {
  onSuccess: (email: string) => void;
  onError: (msg: string) => void;
  error?: string;
}

export default function FindPwForm({ onSuccess, onError, error }: Props) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 100;

  const sendEmailMutation = useMutation({
    mutationFn: async (email: string) => sendResetPwEmail(email.trim()),
    onSuccess: () => {
      setMsg("입력하신 이메일로 비밀번호 재설정 링크가 발송되었습니다.");
      onSuccess(email);
    },
    onError: (err: any) => {
      setMsg(err?.message || "메일 발송에 실패했습니다. 이메일을 다시 확인해 주세요.");
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isLoading = sendEmailMutation.isPending;

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!emailValid || isLoading) return;
      setMsg("");
      sendEmailMutation.mutate(email);
    },
    [email, emailValid, isLoading, sendEmailMutation]
  );

  return (
    <form
      className={styles.formContainer}
      autoComplete="off"
      aria-label="비밀번호 찾기 폼"
      aria-busy={isLoading}
      onSubmit={handleSend}
    >
      <input
        ref={inputRef}
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value.replace(/[<>'"`;]/g, ""));
          setMsg("");
        }}
        placeholder="이메일을 입력하세요"
        autoComplete="email"
        aria-label="이메일"
        required
        className={styles.inputField}
        disabled={isLoading}
        spellCheck={false}
      />
      <button
        type="submit"
        disabled={!emailValid || isLoading}
        aria-disabled={!emailValid || isLoading}
        className={styles.findIdButton} // ✅ 스타일 완전 일치
      >
        {isLoading ? "발송중..." : "비밀번호 재설정 메일 받기"}
      </button>

      {msg && (
        <div
          style={{
            color: "#147833",
            fontWeight: 500,
            fontSize: "0.98rem",
            marginBottom: 6,
            textAlign: "center",
          }}
        >
          {msg}
        </div>
      )}

      {error && (
        <div className={styles.errorMsg} role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
