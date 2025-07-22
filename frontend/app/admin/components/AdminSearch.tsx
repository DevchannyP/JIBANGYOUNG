"use client";

import { useState, useEffect } from "react";
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
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    onSearch(debouncedKeyword);
  }, [debouncedKeyword]);

  return (
    <div className={styles.searchArea}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
      />
    </div>
  );
}
