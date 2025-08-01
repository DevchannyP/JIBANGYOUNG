"use client";

import styles from "../../AdminPage.module.css";

interface AdminReportTabProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const types = ["전체", "게시글", "댓글"];

export function AdminReportTab({
  selectedType,
  onSelectType,
}: AdminReportTabProps) {
  return (
    <div className={styles.regionTabs}>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onSelectType(type)}
          className={selectedType === type ? styles.activeRegion : ""}
          style={{ marginRight: "8px" }}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
