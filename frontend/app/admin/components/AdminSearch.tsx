"use client";

import { useState } from "react";
import styles from "../AdminPage.module.css";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "검색어를 입력하세요",
}: SearchBarProps) {
  const [keyword, setKeyword] = useState("");

  const handleClick = () => onSearch(keyword);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch(keyword);
  };

  return (
    <div className={styles.searchArea}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={styles.searchInput}
      />
      <button onClick={handleClick} className={styles.searchButton}>
        검색
      </button>
    </div>
  );
}
