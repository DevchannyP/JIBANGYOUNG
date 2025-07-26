import { memo, useMemo, useCallback } from 'react';
import styles from '../../total_policy.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination = memo<PaginationProps>(({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 12
}) => {
  const pagesPerGroup = 10;

  // 페이지 그룹 계산을 메모이제이션
  const pageGroupInfo = useMemo(() => {
    const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
    const startPage = currentGroup * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
    
    return { currentGroup, startPage, endPage };
  }, [currentPage, totalPages, pagesPerGroup]);

  // 페이지 번호 배열 생성
  const pageNumbers = useMemo(() => {
    const { startPage, endPage } = pageGroupInfo;
    return Array.from(
      { length: endPage - startPage + 1 }, 
      (_, i) => startPage + i
    );
  }, [pageGroupInfo]);

  // 이전 그룹으로 이동
  const handlePrevGroup = useCallback(() => {
    const { startPage } = pageGroupInfo;
    const newPage = Math.max(1, startPage - pagesPerGroup);
    onPageChange(newPage);
  }, [pageGroupInfo, pagesPerGroup, onPageChange]);

  // 다음 그룹으로 이동
  const handleNextGroup = useCallback(() => {
    const { endPage } = pageGroupInfo;
    const newPage = Math.min(endPage + 1, totalPages);
    onPageChange(newPage);
  }, [pageGroupInfo, totalPages, onPageChange]);

  // 페이지 변경 핸들러
  const handlePageClick = useCallback((page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  }, [currentPage, onPageChange]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((e: React.KeyboardEvent, page: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePageClick(page);
    }
  }, [handlePageClick]);

  // 페이지가 없으면 렌더링하지 않음
  if (totalPages <= 1) {
    return null;
  }

  const { startPage, endPage } = pageGroupInfo;
  const showPrevGroup = startPage > 1;
  const showNextGroup = endPage < totalPages;

  return (
    <nav className={styles.paginationContainer} aria-label="페이지 네비게이션">
      <div className={styles.paginationInfo}>
        {totalItems > 0 && (
          <span className={styles.pageInfo}>
            {((currentPage - 1) * itemsPerPage) + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}건
          </span>
        )}
      </div>
      
      <div className={styles.pagination}>
        {/* 이전 그룹 버튼 */}
        <button 
          className={`${styles.pageButton} ${styles.navButton}`}
          onClick={handlePrevGroup} 
          disabled={!showPrevGroup}
          aria-label="이전 페이지 그룹"
          title="이전 10페이지"
        >
          ◄◄
        </button>

        {/* 이전 페이지 버튼 */}
        <button 
          className={`${styles.pageButton} ${styles.navButton}`}
          onClick={onPrev} 
          disabled={currentPage <= 1}
          aria-label="이전 페이지"
          title="이전 페이지"
        >
          ◄
        </button>

        {/* 페이지 번호들 */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
            onClick={() => handlePageClick(page)}
            onKeyDown={(e) => handleKeyDown(e, page)}
            disabled={currentPage === page}
            aria-label={`${page}페이지로 이동`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* 다음 페이지 버튼 */}
        <button 
          className={`${styles.pageButton} ${styles.navButton}`}
          onClick={onNext} 
          disabled={currentPage >= totalPages}
          aria-label="다음 페이지"
          title="다음 페이지"
        >
          ►
        </button>

        {/* 다음 그룹 버튼 */}
        <button 
          className={`${styles.pageButton} ${styles.navButton}`}
          onClick={handleNextGroup} 
          disabled={!showNextGroup}
          aria-label="다음 페이지 그룹"
          title="다음 10페이지"
        >
          ►►
        </button>
      </div>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;