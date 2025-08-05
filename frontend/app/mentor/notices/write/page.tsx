import { Suspense } from "react";
import MentorNoticeWrite from "./components/MentorNoticeWrite";
import styles from "./MentorNoticeWrite.module.css";

export default function MentorNoticeWritePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>멘토 공지</h1>
        <hr className={styles.divider} />
      </div>
      
      <div className={styles.writeHeader}>
        <h2 className={styles.writeTitle}>공지글 작성</h2>
      </div>
      
      <Suspense fallback={<div>로딩 중...</div>}>
        <MentorNoticeWrite />
      </Suspense>
    </div>
  );
}