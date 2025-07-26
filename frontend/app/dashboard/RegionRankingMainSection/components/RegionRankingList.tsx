import { useEffect, useState } from "react";
import styles from "../RegionTabSlider.module.css";
// import { fetchRegionRanking } from "@/libs/api/dashboard/region.api";

export default function RegionRankingList() {
  const [data, setData] = useState<{ rank: number; name: string; value: number }[]>([]);

  useEffect(() => {
    // fetchRegionRanking().then(setData);
    setData([
      { rank: 1, name: "서울", value: 1305 },
      { rank: 2, name: "경기도", value: 1298 },
      { rank: 3, name: "부산", value: 1260 },
      { rank: 4, name: "대전", value: 1245 },
      { rank: 5, name: "광주", value: 1228 },
      { rank: 6, name: "울산", value: 1205 },
      { rank: 7, name: "강원도", value: 1199 },
      { rank: 8, name: "제주도", value: 1153 }
    ]);
  }, []);

  return (
    <div className={styles.rankingTableWrap}>
      <table className={styles.rankingTable}>
        <thead>
          <tr>
            <th>순위</th>
            <th>지역</th>
            <th>지표</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.rank}</td>
              <td>{row.name}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
