// components/Pagination.tsx (클라이언트 컴포넌트)
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import styles from "./BoardList.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `/board?${params.toString()}`;
  };
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 4);
    const endPage = Math.min(totalPages, startPage + 9);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <nav className={styles.pagination} aria-label="페이지 네비게이션">
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className={styles.navButton}
        >
          &lt;
        </Link>
      )}

      {getPageNumbers().map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`${styles.pageButton} ${
            page === currentPage ? styles.active : ""
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className={styles.navButton}
        >
          &gt;
        </Link>
      )}
    </nav>
  );
};

export default Pagination;
