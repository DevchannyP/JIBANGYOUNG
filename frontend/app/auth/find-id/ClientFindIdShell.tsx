// app/auth/find-id/ClientFindIdShell.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import styles from "../login/LoginPage.module.css";
import FindIdSection from "./components/FindIdSection";
import Link from "next/link";
import SocialLoginButtons from "../common/SocialLoginButtons";

// CSR 컴포넌트만 dynamic
const AuthMascots = dynamic(() => import("../common/AuthMascots"), { ssr: false });

export default function ClientFindIdShell() {
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
              <FindIdSection />
              <div className={styles.linkRow}>
                <Link href="/auth/login" className={styles.linkSm}>
                  로그인 하기
                </Link>
                <Link href="/auth/find-password" className={styles.linkSm}>
                  비밀번호 찾기
                </Link>
              </div>
              <div className={styles.dividerOr}>OR</div>
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
