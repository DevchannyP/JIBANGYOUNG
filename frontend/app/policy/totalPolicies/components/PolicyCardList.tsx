import { PolicyCard as PolicyCardType } from '@/types/api/policy.c';
import { memo, useCallback, useMemo } from 'react';
import styles from '../../total_policy.module.css';
import PolicyCard from './PolicyCard';

interface PolicyCardListProps {
  policies: PolicyCardType[];
  onCardClick: (NO: number) => void;
  bookmarkedPolicyIds?: number[];
  onBookmarkToggle?: (policyId: number) => void;
  isLoading?: boolean;
  error?: string | null;
  currentPage?: number;
  itemsPerPage?: number;
}

const PolicyCardList = memo<PolicyCardListProps>(({ 
  policies, 
  onCardClick, 
  bookmarkedPolicyIds = [], 
  onBookmarkToggle,
  isLoading = false,
  error = null,
  currentPage = 1,
  itemsPerPage = 12
}) => {
  // 북마크 상태를 Set으로 변환하여 조회 성능 향상
  const bookmarkedSet = useMemo(() => 
    new Set(bookmarkedPolicyIds), 
    [bookmarkedPolicyIds]
  );

  // 카드 클릭 핸들러 최적화
  const handleCardClick = useCallback((policyNo: number) => {
    onCardClick(policyNo);
  }, [onCardClick]);

  // 북마크 토글 핸들러 최적화
  const handleBookmarkToggle = useCallback((policyId: number) => {
    onBookmarkToggle?.(policyId);
  }, [onBookmarkToggle]);

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3 className={styles.errorTitle}>데이터를 불러올 수 없습니다</h3>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
        <p className={styles.loadingText}>정책 데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 빈 상태 렌더링
  if (!policies || policies.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>📋</div>
        <h3 className={styles.emptyTitle}>표시할 정책이 없습니다</h3>
        <p className={styles.emptyMessage}>
          다른 검색 조건을 시도해보거나 필터를 초기화해보세요.
        </p>
      </div>
    );
  }

  return (
    <section 
      className={styles.listContainer}
      aria-label={`정책 목록 (${policies.length}개)`}
    >
      <div className={styles.list} role="grid">
        {policies.map((policy, index) => {
          if (!policy || !policy.NO) {
            console.warn(`잘못된 정책 데이터:`, policy);
            return null;
          }

          return (
            <div key={policy.NO} role="gridcell">
              <PolicyCard 
                policy={policy}
                onClick={() => handleCardClick(policy.NO)}
                isBookmarked={bookmarkedSet.has(policy.NO)}
                onBookmarkToggle={onBookmarkToggle ? handleBookmarkToggle : undefined}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
});

PolicyCardList.displayName = 'PolicyCardList';

export default PolicyCardList;