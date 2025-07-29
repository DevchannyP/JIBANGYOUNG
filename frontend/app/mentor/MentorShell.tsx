"use client";

import { useState } from "react";
import styles from "../admin/AdminPage.module.css";
import { MentorLocalList } from "./components/MentorLocalList";
import { MentorLogList } from "./components/MentorLogList";
import { MentorReportList } from "./components/MentorReportList";
import { MentorSidebar } from "./components/MentorSidebar";
import { MentorStatsList } from "./components/MentorStatsList";
import { MentorStatusList } from "./components/MentorStatusList";

export default function MentorShellPage() {
  const [selectedMenu, setSelectedMenu] = useState("mentorReport"); // 기본 메뉴

  const renderContent = () => {
    switch (selectedMenu) {
      case "mentorReport":
        return <MentorReportList />;
      case "mentorStatus":
        return <MentorStatusList />;
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
