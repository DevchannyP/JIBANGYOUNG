"use client";

import { SidebarMenuItem, Tab, UserRole } from "@/types/mypage";
import { useRouter } from "next/navigation";
import styles from "../MyPageLayout.module.css";

// 메뉴 구조 일원화(내부/외부/권한 분기/확장)
const SIDEBAR_MENU: SidebarMenuItem[] = [
  { key: "edit", label: "프로필 수정" },
  { key: "score", label: "지역별 점수" },
  { key: "posts", label: "내 게시글" },
  { key: "comments", label: "내 댓글보기" },
  { key: "surveys", label: "내 설문 이력" },
  { key: "favorites", label: "관심지역 알림" },
  { key: "alerts", label: "내 신고이력" },
  {
    key: "mentorApply",
    label: "멘토신청/멘토 공지사항",
    external: true,
    path: "/mentor/apply",
    roles: ["MENTOR_A", "MENTOR_B", "MENTOR_C", "ADMIN"],
  },
  {
    key: "policyFavorite",
    label: "찜 정책",
    external: true,
    path: "/policy/rec_Policies",
  },
];

// 상단 빠른 라우팅
const QUICKLINKS: SidebarMenuItem[] = [
  {
    key: "mentorDashboard",
    label: "멘토 대시보드",
    external: true,
    path: "/mentor",
    roles: ["MENTOR_A", "MENTOR_B", "MENTOR_C", "ADMIN"],
  },
  {
    key: "adminDashboard",
    label: "관리자 대시보드",
    external: true,
    path: "/admin",
    roles: ["ADMIN"],
  },
  {
    key: "regionRecommend",
    label: "추천지역 바로가기",
    external: true,
    path: "/region/recommend",
  },
];

interface SidebarNavProps {
  tab: Tab;
  setTab: (t: Tab) => void;
  userRole?: UserRole; // 로그인 유저의 권한 (확장용)
}

export default function SidebarNav({
  tab,
  setTab,
  userRole = "USER",
}: SidebarNavProps) {
  const router = useRouter();

  // 권한별 메뉴 노출 분기
  const isAllowed = (item: SidebarMenuItem) =>
    !item.roles || item.roles.includes(userRole);

  return (
    <nav className={styles.mypageSidebar} aria-label="마이페이지 메뉴">
      {/* 상단: 빠른 라우팅 */}
      <div className={styles.sidebarQuicklinks}>
        {QUICKLINKS.filter(isAllowed).map((q) => (
          <button
            key={q.key}
            className={styles.sidebarQuickBtn}
            onClick={() => router.push(q.path!)}
            type="button"
            tabIndex={0}
            aria-label={q.label}
          >
            {q.label}
          </button>
        ))}
      </div>
      {/* 하단: 내부 탭 + 외부 메뉴 */}
      <ul className={styles.mypageSidebarMenu}>
        {SIDEBAR_MENU.filter(isAllowed).map((m) =>
          m.external && m.path ? (
            <li key={m.key}>
              <button
                className={styles.mypageSidebarLink}
                onClick={() => router.push(m.path!)}
                type="button"
                tabIndex={0}
              >
                {m.label}
              </button>
            </li>
          ) : (
            <li key={m.key}>
              <button
                className={`${styles.mypageSidebarLink} ${tab === m.key ? styles.active : ""}`}
                onClick={() => setTab(m.key as Tab)}
                aria-current={tab === m.key ? "page" : undefined}
                type="button"
                tabIndex={0}
              >
                {m.label}
              </button>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}

export type { Tab };

