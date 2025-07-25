"use client";

import Image from "next/image";
import styles from "../login/LoginPage.module.css";

export default function AuthMascots() {
  return (
    <Image
      src="/social/mascots/auth-mascots.webp"
      alt="지방청년 플랫폼 마스코트 일러스트"
      width={900}
      height={300}
      priority // ✅ loading="eager"와 동일
      loading="eager" // 명시적 선언도 OK
      draggable={false}
      className={styles.mascotImg}
      aria-hidden="true"
    />
  );
}
