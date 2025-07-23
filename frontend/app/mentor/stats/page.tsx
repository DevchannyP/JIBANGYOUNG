"use client";

import styles from "../../admin/AdminPage.module.css";
import MentorSidebar from "../components/MentorSidebar";

export default function StatsPage() {
  return (
    <div className={styles.adminContent}>
      <MentorSidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.title}>멘토 활동 통계</h1>
      </div>
    </div>
  );
}
