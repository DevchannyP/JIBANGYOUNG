// components/BoardNavigation.tsx (클라이언트 컴포넌트)
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import styles from "./BoardList.module.css";

const BoardNavigation: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentCategory = searchParams.get("category") || "all";
  const regionCode = pathname.split("/")[2];

  const categories = [
    { id: "all", label: "전체글" },
    { id: "notice", label: "공지" },
    { id: "popular", label: "인기글" },
    { id: "question", label: "질문" },
    { id: "review", label: "후기" },
  ];

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    const baseRegionPath = `/community/${regionCode}`;

    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`${baseRegionPath}?${params.toString()}`);
  };

  const handleWrite = () => {
    router.push(`/community/write?regionCode=${regionCode}`);
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
        onClick={handleWrite}
      >
        글작성
      </button>
    </nav>
  );
};

export default BoardNavigation;
