"use client";

import styles from "../login/LoginPage.module.css";

export default function AuthMascots() {
  return (
    <img
      src="/social/mascots/auth-mascots.webp"
      alt="지방청년 플랫폼 마스코트 일러스트"
      width={900}
      height={300}
      loading="eager" // ✅ 최우선 로딩
      decoding="sync" // ✅ 바로 렌더
      draggable={false}
      className={styles.mascotImg}
      aria-hidden="true"
    />
  );
}
