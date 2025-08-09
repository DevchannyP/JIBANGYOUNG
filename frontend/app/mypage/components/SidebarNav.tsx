"use client";

import type { SidebarMenuItem, Tab, UserRole } from "@/types/api/mypage.types";
import { useRouter } from "next/navigation";
import styles from "../MyPageLayout.module.css";


// key는 Tab값만 (alerts 없음)
const SIDEBAR_MENU: SidebarMenuItem[] = [
  { key: "edit", label: "프로필 수정" },
  { key: "score", label: "지역별 점수" },
  { key: "posts", label: "내 게시글" },
  { key: "comments", label: "내 댓글보기" },
  { key: "surveys", label: "설문 응답" },
  { key: "reports", label: "내 신고이력" },
];

// 외부 대시보드 등은 string 허용
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
    label: "추천정책 바로가기",
    external: true,
    path: "/policy/recommendedList",
  },
  {
    key: "favoritePolicy",
    label: "찜정책",
    external: true,
    path: "/policy/rec_Policies",
  },
  // ✅ [추가] 멘토 신청 버튼 (모두에게 노출, 외부 URL)
  {
    key: "mentorApply",
    label: "멘토 신청",
    external: true,
    path: "/mentor/info",
  },
];


interface SidebarNavProps {
  tab: Tab;
  setTab: (t: Tab) => void;
  userRole?: UserRole;
}

export default function SidebarNav({
  tab,
  setTab,
  userRole = "USER",
}: SidebarNavProps) {
  const router = useRouter();
  const isAllowed = (item: SidebarMenuItem) =>
    !item.roles || item.roles.includes(userRole);

  return (
    <nav className={styles.mypageSidebar} aria-label="마이페이지 메뉴">
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
      <ul className={styles.mypageSidebarMenu}>
        {SIDEBAR_MENU.filter(isAllowed).map((m) => (
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
        ))}
      </ul>
    </nav>
  );
}