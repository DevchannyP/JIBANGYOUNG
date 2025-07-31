"use client";

import { useEffect, useState } from "react";
import styles from "../AdminPage.module.css";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

export function AdminSearch({
  onSearch,
  placeholder = "검색어를 입력하세요",
}: SearchBarProps) {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  // ✅ 300ms 디바운스 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // ✅ onSearch가 useCallback으로 전달된 경우 안전하게 의존성 포함
  useEffect(() => {
    onSearch(debouncedKeyword);
  }, [debouncedKeyword, onSearch]);

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
