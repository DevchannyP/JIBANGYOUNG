// app/(auth)/login/components/LoginForm.tsx
"use client";

import { loginWithEmail } from "@/libs/api/auth/auth.api";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import styles from "../LoginPage.module.css";

function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [isLoggingInNow, setIsLoggingInNow] = useState(false); // ⭐️ 로그인 성공시 true
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (showPw) {
      const timer = setTimeout(() => setShowPw(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPw]);

  useEffect(() => {
    inputRef.current?.focus();
    return () => setError("");
  }, []);

  // 특수문자 방지
  const sanitize = (val: string) => val.replace(/[<>'"`;]/g, "");
  const isIdValid = username.trim().length >= 4 && !username.match(/[<>'"`;]/g);
  const isPwValid = password.length >= 4 && !password.match(/[<>'"`;]/g);
  const isFormValid = isIdValid && isPwValid;

  const loginMutation = useMutation({
    mutationFn: () => loginWithEmail(username.trim(), password),
    retry: 0,
    onSuccess: (res) => {
      const {
        user,
        accessToken,
        refreshToken,
        tokenType,
        expiresIn,
        issuedAt,
        expiresAt,
      } = res || {};
      if (!user || !accessToken || !refreshToken) {
        setError("로그인 응답이 올바르지 않습니다.");
        return;
      }

      setAuth(user, {
        accessToken,
        refreshToken,
        tokenType,
        expiresIn,
        issuedAt,
        expiresAt,
      });

      // ✅ 여기 추가!
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", user.id.toString());
      }

      setIsLoggingInNow(true);
      router.push("/dashboard");
    },

    onError: (err: any) => {
      setError(
        err?.message ||
          "로그인에 실패하였습니다. 입력 정보를 다시 확인해주세요."
      );
      if (process.env.NODE_ENV === "development") {
        console.error("로그인 실패:", err);
      }
    },
  });

  const isPending = loginMutation.status === "pending";

  const handleLogin = () => {
    if (!isPending && isFormValid) {
      setError("");
      loginMutation.mutate();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  // ⭐️ 로그인 성공시 아무것도 렌더하지 않음 (페이지 전환 대기)
  if (isLoggingInNow) return null;

  // ⭐️ accessToken만 있는 경우(=로그인된 상태, but 직접 로그인한게 아님)
  if (accessToken) {
    return (
      <div
        className={styles.formContainer}
        style={{
          textAlign: "center",
          padding: "48px 28px",
          borderRadius: 16,
          background: "#fffef7",
          boxShadow: "0 2px 12px 0 #ffe14022",
          fontWeight: 600,
          fontSize: "1.08rem",
        }}
        aria-live="polite"
        tabIndex={0}
      >
        <div
          style={{
            color: "#388e3c",
            marginBottom: 18,
            fontSize: "1.18rem",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          이미 로그인 중입니다.
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className={styles.loginButton}
          tabIndex={0}
          aria-label="대시보드로 이동"
        >
          대시보드로 이동
        </button>
      </div>
    );
  }

  // 👇 로그인 폼
  return (
    <form
      className={styles.formContainer}
      autoComplete="off"
      aria-label="로그인 입력 폼"
      aria-busy={isPending}
      onSubmit={handleSubmit}
      style={{ gap: 0 }}
    >
      <input
        ref={inputRef}
        type="text"
        value={username}
        onChange={(e) => setUsername(sanitize(e.target.value))}
        placeholder="아이디를 입력하세요"
        autoComplete="username"
        autoCapitalize="off"
        aria-label="아이디"
        required
        className={styles.inputField}
        minLength={4}
        maxLength={50}
        disabled={isPending}
        style={{ marginBottom: "14px" }}
        spellCheck={false}
      />
      <div style={{ position: "relative", marginBottom: "18px" }}>
        <input
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(sanitize(e.target.value))}
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          aria-label="비밀번호"
          autoCapitalize="off"
          required
          className={styles.inputField}
          minLength={4}
          maxLength={50}
          disabled={isPending}
          style={{ marginBottom: 0, paddingRight: "64px" }}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPw((prev) => !prev)}
          aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보이기"}
          className={styles.showPwBtn}
          disabled={isPending}
          style={{
            position: "absolute",
            right: 4,
            top: 0,
            height: "100%",
            fontWeight: 500,
          }}
        >
          {showPw ? "숨김" : "보기"}
        </button>
      </div>
      {error && (
        <div className={styles.errorMsg} role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending || !isFormValid}
        aria-disabled={isPending || !isFormValid}
        className={styles.loginButton}
        tabIndex={0}
      >
        {isPending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}

export default React.memo(LoginForm);
