"use client";

import { useState } from "react";

export default function MentorTabs() {
  const [activeTab, setActiveTab] = useState("apply");
  
  const tabs = [
    { id: "apply", label: "멘토 신청", active: true },
    { id: "approved", label: "멘토 승인", active: false },
    { id: "pending", label: "승인 대기", active: false },
    { id: "rejected", label: "미 승인", active: false },
  ];

  return (
    <div style={{ borderBottom: "1px solid #ddd", marginBottom: "2rem" }}>
      <span style={{ fontWeight: "bold", marginRight: "1rem" }}>멘토신청</span>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            padding: "0.5rem 1rem",
            margin: "0 0.25rem",
            border: "none",
            backgroundColor: activeTab === tab.id ? "#6366f1" : "transparent",
            color: activeTab === tab.id ? "white" : "#666",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
