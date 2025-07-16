//app/policy/totalPolicies/components/Pagination.tsx ([1][2][3] ... [다음])
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
  return (
    <div className={styles.pagination}>
      <button className={styles.pageButton} onClick={onPrev} disabled={currentPage === 1}>
        ◄
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button className={styles.pageButton} onClick={onNext} disabled={currentPage === totalPages}>
        ►
      </button>
    </div>
  );
}