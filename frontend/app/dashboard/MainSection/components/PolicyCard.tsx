"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "../MainSection.module.css";

export default function PolicyCard() {
  const router = useRouter();

  const handleClick = () => {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!accessToken) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      router.push("/auth/login");
    } else {
      router.push("/survey");
    }
  };

  return (
    <div
      className={styles.policyCard}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      aria-label="내게 맞는 정책 보러가기"
    >
      <div className={styles.policyCardHeader}>
        내게 맞는<br />
        정책 보러가기
        <Heart className={styles.heartIcon} fill="#ffe140" />
      </div>
      <div className={styles.policyCardDesc}>
        <br />
        청년을 위한 다양한 지원 정책,
        <br />
        내게 딱 맞는 혜택을 쉽고 빠르게 찾아보세요.
      </div>
    </div>
  );
}
