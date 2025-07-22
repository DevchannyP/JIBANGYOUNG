import styles from "../CommunitySection.module.css";
import { Calendar } from "lucide-react";

export default function PolicyHotTable() {
  const rows = Array(10)
    .fill(null)
    .map((_, idx) => ({
      no: String(idx + 1).padStart(2, "0"),
      policy: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: idx === 0 ? "서울" : idx === 1 ? "부산" : "광주",
      votes: "56",
    }));

  return (
    <section className={`${styles.tableCard} ${styles.policyCard}`}>
      <div className={styles.tableHeaderPolicy}>
        <span className={styles.headerIconPolicy}>
          <Calendar fill="#ffe140" stroke="#232323" size={22} />
        </span>
        <span className={styles.headerTextPolicy}>정책 인기</span>
      </div>
      <div className={styles.tableWrap}>
        <table className={`${styles.dataTable} ${styles.dataTablePolicy}`}>
          <thead>
            <tr>
              <th>NO</th>
              <th>정책</th>
              <th>지역</th>
              <th>찜</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.no}</td>
                <td>{row.policy}</td>
                <td>{row.region}</td>
                <td>{row.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
