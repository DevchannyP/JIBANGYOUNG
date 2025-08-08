// app/(어디)/components/SocialLoginButtons.tsx 등 위치 그대로
"use client";

import Image from "next/image";
import styles from "../login/LoginPage.module.css";

const SOCIALS = [
  { name: "카카오", logo: "/social/kakao.webp", provider: "kakao", aria: "카카오로 로그인" },
  { name: "구글",  logo: "/social/google.webp", provider: "google", aria: "구글로 로그인" },
  { name: "네이버", logo: "/social/naver.webp", provider: "naver", aria: "네이버로 로그인" },
];

export default function SocialLoginButtons() {
  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  const handleSocial = (provider: string) => {
    // ✅ Next 내부 /api 가 아니라, 백엔드 절대경로로 바로 보냄
    window.location.href = `${backendBase}/api/auth/${provider}`;
  };

  return (
    <div className={styles.socialWrapper}>
      {SOCIALS.map((s) => (
        <button
          key={s.provider}
          type="button"
          tabIndex={0}
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
            loading="lazy"
            decoding="async"
          />
        </button>
      ))}
    </div>
  );
}
