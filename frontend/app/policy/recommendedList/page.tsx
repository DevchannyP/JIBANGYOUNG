import styles from '../total_policy.module.css';
import RecommendedListWrapper from './recommendedListWrapper';

export const metadata = {
  title: "추천 정책 리스트",
  description: "설문조사 기반 추천 청년 정책을 볼 수 있습니다",
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
        <h1 className={styles.headerTitle}>추천 정책</h1>
        <RecommendedListWrapper serverState={serverState} />
      </div>
    </div>
  );
}
