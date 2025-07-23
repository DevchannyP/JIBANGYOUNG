"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../admin/AdminPage.module.css";

const menu = [
  { name: "멘토 공지사항", href: "/mentor/notices" },
  { name: "멘토 신청 목록", href: "/mentor/mentorsApply" },
  { name: "신고 목록", href: "/mentor/reports" },
  { name: "유저 상태 제어", href: "/mentor/status" },
  { name: "내 지역 멘토 목록", href: "/mentor/localMentors" },
  { name: "멘토 활동 통계", href: "/mentor/stats" },
  { name: "멘토 활동 로그", href: "/mentor/logs" },
];

export default function MentorSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.adminSidebar}>
      <nav className={styles.adminNav}>
        {menu.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
