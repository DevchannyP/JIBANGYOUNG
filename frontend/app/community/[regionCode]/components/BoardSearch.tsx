"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "./BoardList.module.css";

export default function BoardSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchType, setSearchType] = useState(
    searchParams.get("searchType") || "title"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("searchType", searchType);
    params.set("search", searchQuery);
    params.set("page", "1"); // 검색 시 1페이지로 초기화
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.bottomSection}>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <select
          title="키워드"
          className={styles.searchSelect}
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="author">작성자</option>
        </select>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchSubmitButton}>
          검색
        </button>
      </form>
    </div>
  );
}
