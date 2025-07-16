// app/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const dropdownItems = [
  { label: "로그인", path: "/auth/login" },
  { label: "아이디 찾기", path: "/auth/find-id" },
  { label: "비밀번호 찾기", path: "/auth/find-password" },
  { label: "회원가입", path: "/signup" },
  { label: "대시보드", path: "/dashboard" },
  { label: "설문 응답", path: "/survey" },
  { label: "추천 결과", path: "/recommendation" },
  { label: "정책 리스트", path: "/policy" },
  { label: "찜한 정책", path: "/policy/favorites" },
  { label: "통합 검색", path: "/search" },
  { label: "커뮤니티 홈", path: "/community" },
  { label: "멘토 신청", path: "/mentor" },
  { label: "공지 대시보드", path: "/notice" },
  { label: "공지 상세", path: "/notice/detail" },
  { label: "마이페이지", path: "/mypage" },
  { label: "신고 내역", path: "/mypage/reports" },
  { label: "관리자 페이지", path: "/admin" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  return (
    <header>
      <div className="container header-container">
        <Link href="/" className="logo">
          지방청년
        </Link>

        <nav>
          <Link href="/community">커뮤니티</Link>
          <Link href="/recommendation">추천정책</Link>

          <div className="dropdown" ref={dropdownRef}>
            <button
              type="button"
              className="dropdown-button"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              전체정책 ▼
            </button>
            {isOpen && (
              <div className="dropdown-menu">
                {dropdownItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <Link href="/auth/login" className="btn-primary">
          로그인
        </Link>
      </div>
    </header>
  );
}
