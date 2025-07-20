// app/auth/find-password/ClientFindPwShell.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import styles from "./FindPasswordPage.module.css";
import FindPwSection from "./components/FindPwSection";
import Link from "next/link";

// ✅ AuthMascots는 dynamic import 유지 (CSR + lazy load)
const AuthMascots = dynamic(() => import("../common/AuthMascots"), {
  ssr: false,
});

// ✅ SocialLoginButtons는 static import로 즉시 렌더링 (같은 방식으로 통일)
import SocialLoginButtons from "../common/SocialLoginButtons";

export default function ClientFindPwShell() {
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
              <FindPwSection />
              <div className={styles.linkRow}>
                <Link href="/auth/login" className={styles.linkSm}>
                  로그인 하기
                </Link>
                <Link href="/auth/find-id" className={styles.linkSm}>
                  아이디 찾기
                </Link>
              </div>
              <div className={styles.dividerOr}>OR</div>
              {/* ✅ 즉시 노출: static import */}
              <SocialLoginButtons />
              <div className={styles.bottomText}>
                계정이 필요하신가요?{" "}
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
