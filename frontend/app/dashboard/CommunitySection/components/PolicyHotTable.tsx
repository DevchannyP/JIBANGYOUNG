import styles from "../CommunitySection.module.css";

export default function PolicyHotTable() {
  const rows = [
    {
      no: "01",
      name: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: "서울",
      value: "56",
    },
    {
      no: "02",
      name: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: "부산",
      value: "56",
    },
    {
      no: "03",
      name: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: "광주",
      value: "56",
    },
    {
      no: "04",
      name: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: "광주",
      value: "56",
    },
    {
      no: "05",
      name: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: "광주",
      value: "56",
    },
    {
      no: "06",
      name: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: "광주",
      value: "56",
    },
    {
      no: "07",
      name: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: "광주",
      value: "56",
    },
    {
      no: "08",
      name: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: "광주",
      value: "56",
    },
    {
      no: "09",
      name: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: "광주",
      value: "56",
    },
    {
      no: "10",
      name: "쏘애플 청년정책에 뛰어들어 많은 관심...",
      region: "광주",
      value: "56",
    },
  ];

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableCardLabel}>
        <span className={styles.tableCardLabelIcon}>📅</span>
        정책 인기
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th style={{ width: 40 }}>NO</th>
              <th>정책</th>
              <th>지역</th>
              <th>찜</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.no}>
                <td>{row.no}</td>
                <td>{row.name}</td>
                <td>{row.region}</td>
                <td className={styles.hot}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
