"use client";

import { useMentorApplicationStatus } from "@/libs/hooks/useMentor";
import styles from "../MentorInfo.module.css";

export default function MentorIntroTabs() {
  const { data: applicationStatus } = useMentorApplicationStatus();
  
  // 현재 멘토 상태에 따라 표시할 탭 결정
  const getVisibleTab = () => {
    if (!applicationStatus) return null;
    
    switch (applicationStatus.status) {
      case "APPROVED":
        return { id: "approved", label: "멘토 승인", status: "approved" };
      case "PENDING":
        return { id: "pending", label: "승인 대기", status: "pending" };
      case "REJECTED":
        return { id: "rejected", label: "멘토 미승인", status: "rejected" };
      default:
        return null;
    }
  };

  const visibleTab = getVisibleTab();

  return (
    <div className={styles.tabContainer}>
      <span className={styles.tabLabel}>멘토신청</span>
      {visibleTab && (
        <button
          className={`${styles.tabButton} ${styles[`tabButton${visibleTab.status.charAt(0).toUpperCase() + visibleTab.status.slice(1)}`]}`}
        >
          {visibleTab.label}
        </button>
      )}
    </div>
  );
}