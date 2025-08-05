import { Suspense } from "react";
import MentorIntroContent from "./components/MentorIntroContent";
import MentorIntroTabs from "./components/MentorIntroTabs";
import MentorApplyButton from "./components/MentorApplyButton";
import styles from "./MentorInfo.module.css";

export default function MentorInfoPage() {
  return (
    <div className={styles.pageContainer}>
      <div>
        <h1>멘토</h1>
        <hr />
      </div>
      <MentorIntroTabs />
      <Suspense fallback={<div>멘토 정보를 불러오는 중...</div>}>
        <MentorIntroContent />
      </Suspense>
      <MentorApplyButton />
    </div>
  );
}