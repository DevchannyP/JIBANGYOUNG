"use client";

import Image from "next/image";
import styles from "../login/LoginPage.module.css";

const SOCIALS = [
  {
    name: "카카오",
    logo: "/social/kakao.webp",
    provider: "kakao",
    aria: "카카오로 로그인",
  },
  {
    name: "구글",
    logo: "/social/google.webp",
    provider: "google",
    aria: "구글로 로그인",
  },
  {
    name: "네이버",
    logo: "/social/naver.webp",
    provider: "naver",
    aria: "네이버로 로그인",
  },
];

export default function SocialLoginButtons() {
  const handleSocial = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className={styles.socialWrapper}>
      {SOCIALS.map((s) => (
        <button
          key={s.provider}
          type="button"
          tabIndex={0} // 💡 키보드 포커스 명확화
          onClick={() => handleSocial(s.provider)}
          aria-label={s.aria}
          className={`${styles.socialButton} ${styles[s.provider] || ""}`}
        >
          <Image
            src={s.logo}
            alt={`${s.name} 로그인`}
            width={43}
            height={43}
            draggable={false}
            loading="lazy" // 💡 lazy load
            decoding="async" // 💡 decode 최적화
          />
        </button>
      ))}
    </div>
  );
}
