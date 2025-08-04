import { REPORT_TAB_OPTIONS, ReportTabType } from "@/types/api/adMentorReport";

interface AdminReportTabProps {
  selectedType: ReportTabType;
  onSelectType: (type: ReportTabType) => void;
  tabOptions: ReportTabType[];
}

export function AdminReportTab({
  selectedType,
  onSelectType,
  tabOptions,
}: AdminReportTabProps) {
  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
      {REPORT_TAB_OPTIONS.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelectType(tab)}
          style={{
            padding: "8px 22px",
            borderRadius: "6px",
            border: "none",
            outline: "none",
            background: selectedType === tab ? "#2563eb" : "#e5e7eb",
            color: selectedType === tab ? "#fff" : "#222",
            fontWeight: selectedType === tab ? "bold" : "normal",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: selectedType === tab ? "0 2px 8px #2267ff22" : "none",
            transition: "background 0.15s",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
