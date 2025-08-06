"use client";

import { useRouter } from "next/navigation";
import { useCheckMentorApplication } from "@/libs/hooks/useMentor";
import styles from "../MentorInfo.module.css";

export default function MentorApplyButton() {
  const router = useRouter();
  const { data: hasApplied, isLoading } = useCheckMentorApplication();

  const handleApplyClick = () => {
    if (hasApplied) {
      alert("이미 멘토 신청을 하셨습니다.");
      return;
    }
    router.push("/mentor/apply");
  };

  return (
    <div className={styles.buttonContainer}>
      <button 
        onClick={handleApplyClick} 
        className={styles.applyButton}
        disabled={isLoading || hasApplied}
      >
        {hasApplied ? "신청 완료" : "멘토 신청"}
      </button>
    </div>
  );
}