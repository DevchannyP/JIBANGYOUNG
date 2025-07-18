// app/(auth)/login/ClientLoginShell.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import LoginForm from "./components/LoginForm"; // ⭐️ static import (즉시 노출)
import SocialLoginButtons from "./components/SocialLoginButtons"; // ⭐️ static import (즉시 노출)
import styles from "./LoginPage.module.css";
import Link from "next/link";

// 마스코트만 dynamic import + Suspense
const AuthMascots = dynamic(() => import("./components/AuthMascots"), {
  ssr: false,
});

export default function ClientLoginShell() {
  return (
    <div className={styles.bgWrap}>
      <div className={styles.mascotFixed}>
        <Suspense
          fallback={
            <div
              style={{
                height: 180,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 32,
                  background: "#ffe14022",
                  borderRadius: 8,
                }}
              />
            </div>
          }
        >
          <AuthMascots />
        </Suspense>
      </div>
      <main className={styles.main}>
        <section className={styles.whiteSection}>
          <div className={styles.curveSection}></div>
          <div className={styles.loginSection}>
            <div className={styles.formContainer}>
              {/* 로그인 폼 즉시 노출 */}
              <LoginForm />
              <div className={styles.linkRow}>
                <Link href="/auth/find-id" className={styles.linkSm}>
                  아이디 찾기
                </Link>
                <Link href="/auth/find-password" className={styles.linkSm}>
                  비밀번호 재설정 하기
                </Link>
              </div>
              <div className={styles.dividerOr}>OR</div>
              {/* 소셜 버튼 즉시 노출 */}
              <SocialLoginButtons />
              <div className={styles.bottomText}>
                계정이 없으신가요?{" "}
                <Link href="/auth/register" className={styles.linkSm}>
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
