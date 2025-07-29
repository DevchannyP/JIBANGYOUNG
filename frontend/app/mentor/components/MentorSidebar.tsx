import styles from "../../admin/AdminPage.module.css";

interface MentorSidebarProps {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}

export function MentorSidebar({
  selectedMenu,
  setSelectedMenu,
}: MentorSidebarProps) {
  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <a
            href="/mentorNotice"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.noticeMenu}
          >
            멘토 공지사항
          </a>
        </li>
        <li
          className={selectedMenu === "mentorReport" ? styles.active : ""}
          onClick={() => setSelectedMenu("mentorReport")}
        >
          신고목록
        </li>
        <li
          className={selectedMenu === "mentorStatus" ? styles.active : ""}
          onClick={() => setSelectedMenu("mentorStatus")}
        >
          유저 상태 제어
        </li>
        <li
          className={selectedMenu === "mentorLocal" ? styles.active : ""}
          onClick={() => setSelectedMenu("mentorLocal")}
        >
          내 지역 멘토 목록
        </li>
        <li
          className={selectedMenu === "mentorStats" ? styles.active : ""}
          onClick={() => setSelectedMenu("mentorStats")}
        >
          멘토 활동통계
        </li>
        <li
          className={selectedMenu === "mentorLog" ? styles.active : ""}
          onClick={() => setSelectedMenu("mentorLog")}
        >
          멘토 활동로그
        </li>
      </ul>
    </div>
  );
}
