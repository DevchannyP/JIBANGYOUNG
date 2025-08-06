"use client";

import { useMentorApplicationStatus } from "@/libs/hooks/useMentor";

export default function MentorActions() {
  const { data: applicationStatus } = useMentorApplicationStatus();

  if (applicationStatus) {
    return (
      <div style={{ 
        padding: "1rem", 
        backgroundColor: "#f3f4f6", 
        borderRadius: "4px",
        textAlign: "center" 
      }}>
        <h3>신청 상태: 
          <span style={{ 
            color: applicationStatus.status === "APPROVED" ? "green" : 
                   applicationStatus.status === "REJECTED" ? "red" : "orange"
          }}>
            {applicationStatus.status === "APPROVED" && " 승인됨"}
            {applicationStatus.status === "REJECTED" && " 거절됨"}
            {applicationStatus.status === "PENDING" && " 검토 중"}
          </span>
        </h3>
        <p>신청일: {new Date(applicationStatus.createdAt).toLocaleDateString()}</p>
        {applicationStatus.rejectionReason && (
          <p style={{ color: "red" }}>거절 사유: {applicationStatus.rejectionReason}</p>
        )}
      </div>
    );
  }

  return null;
}