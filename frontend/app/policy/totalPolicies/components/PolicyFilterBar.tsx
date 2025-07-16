// app/policy/totalPolicies/components/PolicyFilterBar.tsx (개선된 필터 바)
"use client";

import { useState, useEffect } from "react";
import styles from '../../total_policy.module.css';

interface PolicyFilterBarProps {
  searchType: string;
  setSearchType: (type: string) => void;
  region: string;
  setRegion: (region: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export default function PolicyFilterBar({
  searchType,
  setSearchType,
  region,
  setRegion,
  sortBy,
  setSortBy,
  onSearch,
  searchQuery,
  onClearSearch
}: PolicyFilterBarProps) {
  const [tempQuery, setTempQuery] = useState('');

  // 외부에서 searchQuery가 변경될 때 tempQuery도 동기화
  useEffect(() => {
    setTempQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = () => {
    onSearch(tempQuery);
  };

  const handleClearClick = () => {
    setTempQuery('');
    onClearSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <div className={styles.filterBar}>
      <div>
        <label htmlFor="region">지역:</label>
        <select 
          id="region" 
          value={region} 
          onChange={(e) => setRegion(e.target.value)} 
          className={styles.select}
        >
          <option value="전국">전국</option>
          <option value="서울">서울</option>
          <option value="부산">부산</option>
          <option value="제주">제주</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="sortBy">정렬:</label>
        <select 
          id="sortBy" 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)} 
          className={styles.select}
        >
          <option value="date_desc">최신순</option>
          <option value="date_asc">오래된순</option>
          <option value="support_desc">지원금 높은순</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="searchType">검색 조건:</label>
        <select 
          id="searchType" 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value)} 
          className={styles.select}
        >
          <option value="title">제목</option>
          <option value="summary">요약</option>
        </select>
      </div>
      
      <div className={styles.searchInputContainer}>
        <input
          type="text"
          value={tempQuery}
          onChange={(e) => setTempQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어 입력"
          className={styles.searchInput}
        />
        <button 
          className={styles.searchButton} 
          onClick={handleSearchSubmit}
        >
          검색
        </button>
        {searchQuery && (
          <button 
            className={styles.clearButton} 
            onClick={handleClearClick}
          >
            초기화
          </button>
        )}
      </div>
    </div>
  );
}