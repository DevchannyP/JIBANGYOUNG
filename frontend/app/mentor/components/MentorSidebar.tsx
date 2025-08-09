import { useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";

interface MentorSidebarProps {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}

export function MentorSidebar({
  selectedMenu,
  setSelectedMenu,
}: MentorSidebarProps) {
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  // admin 체크
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("auth-store-v2");
        if (raw) {
          const user = JSON.parse(raw)?.state?.user;
          setUserRole(user?.role);
        }
      } catch (e) {
        setUserRole(undefined);
      }
    }
  }, []);

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

        {userRole !== "ADMIN" && (
          <>
            <li
              className={
                selectedMenu === "mentorRequestList" ? styles.active : ""
              }
              onClick={() => setSelectedMenu("mentorRequestList")}
            >
              멘토 신청목록
            </li>
            <li
              className={
                selectedMenu === "mentorReportList" ? styles.active : ""
              }
              onClick={() => setSelectedMenu("mentorReportList")}
            >
              신고목록
            </li>
          </>
        )}

        <li
          className={selectedMenu === "mentorLocal" ? styles.active : ""}
          onClick={() => setSelectedMenu("mentorLocal")}
        >
          멘토목록
        </li>

        {userRole !== "MENTOR_C" && (
          <>
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
          </>
        )}
      </ul>
    </div>
  );
}
