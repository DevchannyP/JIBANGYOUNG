"use client";

import styles from "../../admin/AdminPage.module.css";
import MentorSidebar from "../components/MentorSidebar";

export default function LocalMentorsPage() {
  return (
    <div className={styles.adminContent}>
      <MentorSidebar />

      <div className={styles.mainContent}>
        <h1 className={styles.title}>내 지역 멘토 목록</h1>
      </div>
    </div>
  );
}
