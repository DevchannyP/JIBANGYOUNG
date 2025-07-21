"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../AdminPage.module.css";

const menu = [
  { name: "사용자 관리", href: "/admin/users" },
  { name: "멘토 신청 목록", href: "/admin/mentors" },
  { name: "신고 목록", href: "/admin/reports" },
  { name: "게시글 관리", href: "/admin/posts" },
];

export default function AdminSidebar() {
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
