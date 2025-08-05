import { Suspense } from "react";
import MentorNoticesDashboard from "./components/MentorNoticesDashboard";
import styles from "./MentorNotices.module.css";

export default function MentorNoticesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>멘토 공지</h1>
      </div>
      
      <Suspense fallback={<div>로딩 중...</div>}>
        <MentorNoticesDashboard />
      </Suspense>
    </div>
  );
}