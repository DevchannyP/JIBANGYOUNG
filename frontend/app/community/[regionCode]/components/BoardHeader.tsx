// components/BoardNavigation.tsx (클라이언트 컴포넌트)
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import styles from "./BoardList.module.css";

const BoardNavigation: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const categories = [
    { id: "all", label: "전체글" },
    { id: "notice", label: "공지" },
    { id: "popular", label: "인기글" },
    { id: "question", label: "질문" },
    { id: "review", label: "후기" },
  ];

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`/board?${params.toString()}`);
  };

  const handleSearch = () => {
    // 검색 모달이나 페이지로 이동
    router.push("/board/search");
  };

  return (
    <nav
      className={styles.navigation}
      role="navigation"
      aria-label="게시판 카테고리"
    >
      {categories.map((category) => (
        <button
          key={category.id}
          className={`${styles.navButton} ${
            category.id === currentCategory ? styles.active : ""
          }`}
          type="button"
          onClick={() => handleCategoryChange(category.id)}
          aria-pressed={category.id === currentCategory}
        >
          {category.label}
        </button>
      ))}
      <button
        className={styles.searchButton}
        type="button"
        onClick={handleSearch}
        aria-label="검색"
      >
        검색기
      </button>
    </nav>
  );
};

export default BoardNavigation;
