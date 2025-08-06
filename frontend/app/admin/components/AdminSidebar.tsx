import styles from "../AdminPage.module.css";
interface AdminSidebarProps {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}

export function AdminSidebar({
  selectedMenu,
  setSelectedMenu,
}: AdminSidebarProps) {
  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <a
            href="/mentor/notices/write"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.noticeMenu}
          >
            멘토 공지사항
          </a>
        </li>
        <li
          className={selectedMenu === "user" ? styles.active : ""}
          onClick={() => setSelectedMenu("user")}
        >
          사용자 관리
        </li>
        <li
          className={selectedMenu === "mentor" ? styles.active : ""}
          onClick={() => setSelectedMenu("mentor")}
        >
          멘토 신청 목록
        </li>
        <li
          className={selectedMenu === "report" ? styles.active : ""}
          onClick={() => setSelectedMenu("report")}
        >
          신고 목록
        </li>
        <li
          className={selectedMenu === "post" ? styles.active : ""}
          onClick={() => setSelectedMenu("post")}
        >
          게시글 관리
        </li>
      </ul>
    </div>
  );
}
