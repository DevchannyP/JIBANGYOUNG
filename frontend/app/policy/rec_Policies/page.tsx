import styles from '../total_policy.module.css';
import PolicyFavoritesWrapper from './PolicyFavoritesWrapper';

export const metadata = {
  title: "찜 정책 리스트",
  description: "찜한 청년 정책을 볼 수 있습니다",
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
        <h1 className={styles.headerTitle}>찜 정책</h1>
        {/* 나머지는 CSR */}
        <PolicyFavoritesWrapper serverState={serverState} />
      </div>
    </div>
  );
}
