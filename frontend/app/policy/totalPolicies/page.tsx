import PolicyClientWrapper from "./PolicyClientWrapper";
import styles from '../total_policy.module.css';

export const metadata = {
  title: "전체 정책 리스트",
  description: "청년 정책 전체 목록을 확인하고 검색할 수 있습니다.",
};

export default function TotalPolicyPage() {
  const serverState = {
    currentPage: 1,
    searchType: "title" as const,
    region: 99999,
    sortBy: "d_day_desc" as const,
    searchQuery: "",
    itemsPerPage: 12,
  };

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        {/* 이 부분은 SSR로 렌더링 */}
        <h1 className={styles.headerTitle}>전체 정책</h1>
        {/* 나머지는 CSR */}
        <PolicyClientWrapper serverState={serverState} />
      </div>
    </div>
  );
}
