"use client";

import { useState } from "react";
import styles from "../admin/AdminPage.module.css";
import { AdminMentorList } from "./components/AdminMentorList";
import { AdminPostList } from "./components/AdminPostList";
import { AdminReportList } from "./components/AdminReportList";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminUserList } from "./components/AdminUserList";

export default function AdminShellPage() {
  const [selectedMenu, setSelectedMenu] = useState("user"); // 기본 메뉴

  const renderContent = () => {
    switch (selectedMenu) {
      case "user":
        return <AdminUserList />;
      case "mentor":
        return <AdminMentorList />;
      case "report":
        return <AdminReportList />;
      case "post":
        return <AdminPostList />;
      default:
        return <div>잘못된 메뉴입니다.</div>;
    }
  };

  return (
    <div className={styles.adminContent}>
      <AdminSidebar setSelectedMenu={setSelectedMenu} selectedMenu={selectedMenu} />
      <div className={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
}
