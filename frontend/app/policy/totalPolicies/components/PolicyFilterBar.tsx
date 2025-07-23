"use client";

import { useState, useEffect } from "react";
import styles from '../../total_policy.module.css';

interface PolicyFilterBarProps {
  searchType: string;
  setSearchType: (type: string) => void;
  region: number;               
  setRegion: (region: number) => void;  
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
  const [tempRegion, setTempRegion] = useState(region);

  useEffect(() => {
    setTempQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setTempRegion(region);
  }, [region]);

  const handleSearchSubmit = () => {
    setRegion(tempRegion);  
    onSearch(tempQuery);    
  };

  const handleClearClick = () => {
    setTempQuery('');
    setTempRegion(99999);  // 전국 초기화
    setRegion(99999);      // 부모 상태(region)도 전국으로 변경
    onClearSearch();       // 검색어 초기화 -> 전체 정책 다시 로드
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
          value={tempRegion} 
          onChange={(e) => setTempRegion(Number(e.target.value))} 
          className={styles.select}
        >
          <option value={99999}>전국</option>
          <option value={11000}>서울</option>
          <option value={26000}>부산</option>
          <option value={27000}>대구</option>
          <option value={28000}>인천</option>
          <option value={29000}>광주</option>
          <option value={30000}>대전</option>
          <option value={31000}>울산</option>
          <option value={36110}>세종</option>
          <option value={41000}>경기</option>
          <option value={43000}>충북</option>
          <option value={44000}>충남</option>
          <option value={46000}>전남</option>
          <option value={47000}>경북</option>
          <option value={48000}>경남</option>
          <option value={51000}>강원</option>
          <option value={52000}>부산</option>
          <option value={50000}>제주</option>
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
          <option value="d_day_desc">마감빠른순</option>
          <option value="favorite_asc">인기순</option>
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
          <option value="keyword">키워드</option>
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
        {(searchQuery || tempQuery) && (
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
