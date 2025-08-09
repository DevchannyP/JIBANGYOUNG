"use client";

import { useEffect, useState } from "react";
import styles from "../admin/AdminPage.module.css";

import { MentorLocalList } from "./components/MentorLocalList";
import { MentorLogList } from "./components/MentorLogList";

import { MentorReportList } from "./components/MentorReportList";
import { MentorRequestList } from "./components/MentorRequestList";
import { MentorSidebar } from "./components/MentorSidebar";
import { MentorStatsList } from "./components/MentorStatsList";

export default function MentorShellPage() {
  const [selectedMenu, setSelectedMenu] = useState("mentorRequestList"); // 기본 메뉴

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("auth-store-v2");
        if (raw) {
          const user = JSON.parse(raw)?.state?.user;
          if (user?.role === "ADMIN") {
            setSelectedMenu("mentorLocal"); // ADMIN이면 기본 진입점 변경
          }
        }
      } catch (e) {
        console.error("Failed to parse auth-store-v2", e);
      }
    }
  }, []);

  const renderContent = () => {
    switch (selectedMenu) {
      case "mentorRequestList":
        return <MentorRequestList />;
      case "mentorReportList":
        return <MentorReportList />;
      case "mentorLocal":
        return <MentorLocalList />;
      case "mentorStats":
        return <MentorStatsList />;
      case "mentorLog":
        return <MentorLogList />;
      default:
        return <div>잘못된 메뉴입니다.</div>;
    }
  };

  return (
    <div className={styles.adminContent}>
      <MentorSidebar
        setSelectedMenu={setSelectedMenu}
        selectedMenu={selectedMenu}
      />
      <div className={styles.mainContent}>{renderContent()}</div>
    </div>
  );
}
