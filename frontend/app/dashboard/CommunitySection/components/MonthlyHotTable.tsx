import styles from "../CommunitySection.module.css";

export default function MonthlyHotTable() {
  const rows = Array(10)
    .fill(null)
    .map((_, idx) => ({
      no: String(idx + 1).padStart(2, "0"),
      title: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      author: "오매록",
      views: "50",
      votes: "56",
    }));

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableCardLabel}>
        <span className={styles.tableCardLabelIcon}>📅</span>
        월간 인기
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th style={{ width: 40 }}>NO</th>
              <th>제목</th>
              <th>글쓴이</th>
              <th>조회</th>
              <th>추천</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.no}</td>
                <td>{row.title}</td>
                <td>{row.author}</td>
                <td>{row.views}</td>
                <td>{row.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
