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
  { label: "회원가입", path: "/auth/register" },
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
  // { label: "마이페이지", path: "/mypage" }, // 드롭다운에서 제외
  { label: "신고 내역", path: "/mypage/reports" },
  { label: "관리자 페이지", path: "/admin" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, accessToken, refreshToken, logout } = useAuthStore();
  const router = useRouter();

  const isLoggedIn = !!accessToken && !!user;

  const handleLogout = async () => {
    try {
      if (refreshToken) await logoutApi(refreshToken);
    } catch {
      // 에러 무시하고 강제 로그아웃 진행
    } finally {
      if (typeof window !== "undefined") {
        // ⭐️ 모든 인증 관련 로컬 키 제거
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
      }
      logout(); // Zustand 상태 초기화
      router.push("/auth/login");
    }
  };

  // 👱‍♂️ 이모지 버튼 클릭시 마이페이지(로그인 분기)
  const handleMypage = () => {
    if (!isLoggedIn) {
      router.push("/auth/login?redirect=/mypage");
    } else {
      router.push("/mypage");
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
      if (e.key === "Escape") setIsOpen(false);
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
    <header className="header-root">
      <div className="header-inner">
        {/* "지방청년" 클릭시 대시보드로 이동 */}
        <Link href="/dashboard" className="header-logo" draggable={false}>
          지방청년
        </Link>
        <nav className="header-nav" aria-label="주요 메뉴">
          <Link href="/community/main" className="header-nav-link">
            커뮤니티
          </Link>
          <Link href="/recommendation" className="header-nav-link">
            추천정책
          </Link>
          <div className="dropdown" ref={dropdownRef}>
            <button
              type="button"
              className="dropdown-btn"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              전체정책 ▼
            </button>
            {isOpen && (
              <div className="dropdown-menu" role="menu">
                {dropdownItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="header-nav-link"
                    role="menuitem"
                    tabIndex={0}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div
          className="header-actions"
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          {/* 👱‍♂️ 노란색 마이페이지 이모지 버튼 */}
          <button
            type="button"
            className="btn-mypage"
            aria-label="마이페이지"
            onClick={handleMypage}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              padding: 0,
              cursor: "pointer",
              marginRight: 4,
              transition: "opacity 0.18s",
            }}
            title="마이페이지"
          >
            <span role="img" aria-label="마이페이지">
              👱‍♂️
            </span>
          </button>
          {/* 로그인/로그아웃 버튼 */}
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
      </div>
    </header>
  );
}