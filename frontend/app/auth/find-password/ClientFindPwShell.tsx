"use client";

import SocialLoginButtons from "@/app/auth/common/SocialLoginButtons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import FindPwSection from "./components/FindPwSection";
import styles from "./FindPasswordPage.module.css";

// 마스코트 이미지는 CSR lazy-load, 초기 렌더/유지비 최적화
const AuthMascots = dynamic(() => import("@/app/auth/common/AuthMascots"), {
  ssr: false,
});

export default function ClientFindPwShell() {
  return (
    <div className={styles.bgWrap}>
      <div className={styles.mascotFixed} aria-hidden>
        <Suspense
          fallback={
            <div
              style={{ height: 180, background: "#ffe14022", borderRadius: 8 }}
            />
          }
        >
          <AuthMascots />
        </Suspense>
      </div>
      <main className={styles.main}>
        <section className={styles.whiteSection}>
          <div className={styles.curveSection} />
          <div className={styles.loginSection}>
            <div className={styles.formContainer}>
              <FindPwSection />
              <nav
                className={styles.linkRow}
                aria-label="비밀번호/계정 복구 바로가기"
              >
                <Link href="/auth/login" className={styles.linkSm}>
                  로그인 하기
                </Link>
                <Link href="/auth/find-id" className={styles.linkSm}>
                  아이디 찾기
                </Link>
              </nav>
              <div className={styles.dividerOr} aria-hidden>
                OR
              </div>
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
