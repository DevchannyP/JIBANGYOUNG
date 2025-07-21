"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout as logoutApi } from "../../libs/api/auth/auth.api";

const dropdownItems = [
  { label: "로그인", path: "/auth/login" },
  { label: "아이디 찾기", path: "/auth/find-id" },
  { label: "비밀번호 찾기", path: "/auth/find-password" },
  { label: "회원가입", path: "register" },
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

  // ✅ Zustand persist store에서 accessToken/user 가져오기
  const { user, accessToken, refreshToken, logout } = useAuthStore();
  const router = useRouter();

  // ✅ accessToken, user 둘 중 하나만 있어도 로그인으로 간주 (최소 보안 기준은 둘 다)
  const isLoggedIn = !!accessToken && !!user;

  // ✅ 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      if (refreshToken) await logoutApi(refreshToken);
    } catch (err: any) {
      // 서버 실패 무시하고 클라이언트 상태 정리
    } finally {
      logout();
      router.push("/auth/login");
    }
  };

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

        {/* ✅ 로그인 여부에 따라 버튼 분기 */}
        {!isLoggedIn ? (
          <Link href="/auth/login" className="btn-primary">
            로그인
          </Link>
        ) : (
          <button className="btn-primary" onClick={handleLogout}>
            로그아웃
          </button>
        )}
      </div>
    </header>
  );
}
