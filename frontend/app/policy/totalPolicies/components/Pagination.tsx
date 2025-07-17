"use client";

import styles from '../../total_policy.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onPageChange
}: PaginationProps) {
  const pagesPerGroup = 10;
  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  
  const handlePrevGroup = () => {
    const newPage = Math.max(1, startPage - pagesPerGroup);
    onPageChange(newPage);
  };

  const handleNextGroup = () => {
    const newPage = Math.min(endPage + 1, totalPages);
    onPageChange(newPage);
  };

  return (
    <div className={styles.pagination}>
      <button 
        className={styles.pageButton} 
        onClick={handlePrevGroup} 
        disabled={currentPage <= 1}
      >
        ◄
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button 
        className={styles.pageButton} 
        onClick={handleNextGroup} 
        disabled={currentPage >= totalPages}
      >
        ►
      </button>
    </div>
  );
}