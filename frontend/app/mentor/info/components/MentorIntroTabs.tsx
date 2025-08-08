"use client";

import { useMentorApplicationStatus } from "@/libs/hooks/useMentor";
import styles from "../MentorInfo.module.css";

export default function MentorIntroTabs() {
  const { data: applicationStatus } = useMentorApplicationStatus();

  // 현재 멘토 상태에 따라 표시할 탭 결정
  const getVisibleTab = () => {
    if (!applicationStatus) return null;

    switch (applicationStatus.status) {
      case "FINAL_APPROVED":
        return {
          id: "final_approved",
          label: "최종 승인",
          status: "approvedFinal",
        };
      case "SECOND_APPROVED":
        return {
          id: "second_approved",
          label: "2차 승인",
          status: "approved2nd",
        };
      case "FIRST_APPROVED":
        return {
          id: "first_approved",
          label: "1차 승인",
          status: "approved1st",
        };
      case "REQUESTED":
        return { id: "requested", label: "승인 요청", status: "requested" };
      case "PENDING":
        return { id: "pending", label: "승인 대기", status: "pending" };
      case "REJECTED":
        return { id: "rejected", label: "반려", status: "rejected" };
      default:
        return null;
    }
  };

  const visibleTab = getVisibleTab();

  return (
    <div className={styles.tabContainer}>
      {visibleTab && (
        <button
          className={`${styles.tabButton} ${styles[`tabButton${visibleTab.status.charAt(0).toUpperCase() + visibleTab.status.slice(1)}`]}`}
        >
          <span className={styles.tabLabel}>멘토신청</span>
          {visibleTab.label}
        </button>
      )}
    </div>
  );
}
