"use client";

import { syncBookmarkedPolicies } from "@/libs/api/policy/sync";
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
  { label: "정책 리스트", path: "/policy/totalPolicies" },
  { label: "찜한 정책", path: "/policy/rec_Policies" },
  { label: "통합 검색", path: "/search" },
  { label: "커뮤니티 홈", path: "/community" },
  { label: "멘토 신청", path: "/mentor/info" },
  { label: "공지 대시보드", path: "/notice" },
  { label: "공지 상세", path: "/notice/detail" },
  { label: "신고 내역", path: "/mypage/reports" },
  { label: "관리자 페이지", path: "/admin" },
  { label: "멘토 관리자 페이지", path: "/mentor" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, accessToken, refreshToken, logout } = useAuthStore();
  const router = useRouter();

  const isLoggedIn = !!accessToken && !!user;

  const handleLogout = async () => {
    try {
      // 1. localStorage에서 필요한 값 직접 꺼냄
      const userIdStr = localStorage.getItem("userId");
      const bookmarkedStr = localStorage.getItem("bookmarkedPolicyIds");

      const userId = userIdStr ? parseInt(userIdStr, 10) : null;
      const bookmarkedPolicyIds: number[] = bookmarkedStr
        ? JSON.parse(bookmarkedStr)
        : [];

      if (userId && bookmarkedPolicyIds.length > 0) {
        // 로그아웃 전에 찜한 정책 서버에 동기화
        await syncBookmarkedPolicies(userId, bookmarkedPolicyIds);
        console.log("✅ 찜한 정책 동기화 완료");
      }
      if (refreshToken) await logoutApi(refreshToken);
    } catch {
      // 에러 무시하고 강제 로그아웃 진행
    } finally {
      if (typeof window !== "undefined") {
        // ⭐️ 인증 관련 모든 로컬/세션 키와 임시 플래그 완전 정리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("sessionExpired");
        localStorage.removeItem("bookmarkedPolicyIds");
        // 필요시 sessionStorage.clear(); react-query 캐시도 클리어 가능
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
          <Link href="/policy/recommendedList" className="header-nav-link">
            추천정책
          </Link>
          <Link href="/policy/totalPolicies" className="header-nav-link">
            전체정책
          </Link>
          {/* 개발용 URL 버튼 */}
          {/* <div className="dropdown" ref={dropdownRef}>
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
          </div> */}
        </nav>
        <div
          className="header-actions"
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
{/* 마이페이지 아이콘 버튼 */}
{/* 헤더 배경색과 일치하는 마이페이지 버튼 - 경계선 제거 */}
<button
  type="button"
  className="btn-mypage"
  aria-label="마이페이지"
  onClick={handleMypage}
  style={{
    background: "transparent", // 완전히 투명하게
    border: "none",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px", // 점 간격 넓히기
    boxShadow: "none", // 그림자도 제거해서 더 자연스럽게
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.08)"; // 호버시 살짝 어둡게
    e.currentTarget.style.transform = "translateY(-1px) scale(1.03)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "transparent"; // 원래대로
    e.currentTarget.style.transform = "translateY(0) scale(1)";
  }}
  title="마이페이지"
>
  <div style={{ width: "4px", height: "4px", backgroundColor: "#333", borderRadius: "50%" }}></div>
  <div style={{ width: "4px", height: "4px", backgroundColor: "#333", borderRadius: "50%" }}></div>
  <div style={{ width: "4px", height: "4px", backgroundColor: "#333", borderRadius: "50%" }}></div>
</button>
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
