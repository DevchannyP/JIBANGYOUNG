import { Suspense } from "react";
import MentorApplicationForm from "./components/MentorApplicationForm";
import styles from "./MentorApply.module.css";

export default function MentorApplyPage() {
  return (
    <div className={styles.pageContainer}>
      <div>
        <h1>멘토</h1>
        <hr />
      </div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>멘토신청</h2>
      </div>
      <Suspense fallback={<div>멘토 신청 폼을 불러오는 중...</div>}>
        <MentorApplicationForm />
      </Suspense>
    </div>
  );
}