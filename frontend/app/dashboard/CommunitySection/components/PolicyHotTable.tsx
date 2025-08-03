"use client";

import styles from "../CommunitySection.module.css";
import { usePolicyHotTop10Query } from "./usePolicyHotTop10Query";

export default function PolicyHotTable() {
  const { data, isLoading, isError } = usePolicyHotTop10Query();

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
            {isLoading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={4}>
                    <div className={styles.skeletonRow} />
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                  데이터를 불러올 수 없습니다.
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row) => (
                <tr key={row.no}>
                  <td>{row.no}</td>
                  <td>{row.name}</td>
                  <td>{row.region}</td>
                  <td className={styles.hot}>{row.value}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#aaa" }}>
                  인기 정책 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
