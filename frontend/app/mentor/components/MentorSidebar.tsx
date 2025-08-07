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
            href="/mentor/notices/write"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.noticeMenu}
          >
            멘토 공지사항
          </a>
        </li>
        <li
          className={selectedMenu === "mentorRequestList" ? styles.active : ""}
          onClick={() => setSelectedMenu("mentorRequestList")}
        >
          멘토 신청목록
        </li>
        <li
          className={selectedMenu === "mentorReportList" ? styles.active : ""}
          onClick={() => setSelectedMenu("mentorReportList")}
        >
          신고목록
        </li>
        <li
          className={selectedMenu === "mentorLocal" ? styles.active : ""}
          onClick={() => setSelectedMenu("mentorLocal")}
        >
          내 지역 멘토목록
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
