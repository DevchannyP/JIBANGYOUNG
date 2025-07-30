"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../Community.module.css";

interface PaginationClientProps {
  totalPages: number;
}

const PaginationClient: React.FC<PaginationClientProps> = ({ totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

const getPageNumbers = () => {
  const maxPagesToShow = 5;
  const pages = [];

  let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let end = Math.min(totalPages, start + maxPagesToShow - 1);

  if (end - start < maxPagesToShow - 1) {
    start = Math.max(1, end - maxPagesToShow + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};


  return (
    <div className={styles.pagination}>
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        &lt;
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={page === currentPage ? styles.active : ""}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default PaginationClient;
