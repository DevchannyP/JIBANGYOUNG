import styles from "../AdminPage.module.css";

type ReportType = "게시글" | "댓글" | "전체";

interface Props {
  selectedType: ReportType;
  onSelectType: (type: ReportType) => void;
}

const types: ReportType[] = ["전체", "게시글", "댓글"];

export function AdminReportTab({ selectedType, onSelectType }: Props) {
  return (
    <div className={styles.tabWrapper}>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onSelectType(type)}
          className={`${styles.tabButton} ${selectedType === type ? styles.active : ""}`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
