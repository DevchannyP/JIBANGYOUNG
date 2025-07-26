import { useState, useEffect, useCallback } from "react";
import styles from '../../total_policy.module.css';

interface PolicyFilterBarProps {
  searchType: 'title' | 'keyword';
  setSearchType: (type: 'title' | 'keyword') => void;
  region: number;               
  setRegion: (region: number) => void;  
  sortBy: 'd_day_desc' | 'favorite_asc';
  setSortBy: (sort: 'd_day_desc' | 'favorite_asc') => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

// 지역 코드 매핑
const REGION_OPTIONS = [
  { value: 99999, label: '전국' },
  { value: 11000, label: '서울' },
  { value: 26000, label: '부산' },
  { value: 27000, label: '대구' },
  { value: 28000, label: '인천' },
  { value: 29000, label: '광주' },
  { value: 30000, label: '대전' },
  { value: 31000, label: '울산' },
  { value: 36110, label: '세종' },
  { value: 41000, label: '경기' },
  { value: 43000, label: '충북' },
  { value: 44000, label: '충남' },
  { value: 45000, label: '전북' },
  { value: 46000, label: '전남' },
  { value: 47000, label: '경북' },
  { value: 48000, label: '경남' },
  { value: 51000, label: '강원' },
  { value: 50000, label: '제주' },
] as const;

const SEARCH_TYPE_OPTIONS = [
  { value: 'title' as const, label: '제목' },
  { value: 'keyword' as const, label: '키워드' },
] as const;

const SORT_OPTIONS = [
  { value: 'd_day_desc' as const, label: '마감빠른순' },
  { value: 'favorite_asc' as const, label: '인기순' },
] as const;

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
  // 로컬 상태로 임시 값들 관리
  const [tempQuery, setTempQuery] = useState(searchQuery);
  const [tempRegion, setTempRegion] = useState(region);

  // 외부 상태 변경 시 로컬 상태 동기화
  useEffect(() => {
    setTempQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setTempRegion(region);
  }, [region]);

  // 검색 실행
  const handleSearchSubmit = useCallback(() => {
    setRegion(tempRegion);  
    onSearch(tempQuery.trim());    
  }, [tempRegion, tempQuery, setRegion, onSearch]);

  // 필터 초기화
  const handleClearClick = useCallback(() => {
    setTempQuery('');
    setTempRegion(99999);
    setSearchType('title');
    setSortBy('d_day_desc');
    onClearSearch();
  }, [setSearchType, setSortBy, onClearSearch]);

  // 엔터키 검색
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  // 검색 타입 변경 시 즉시 적용
  const handleSearchTypeChange = useCallback((newType: 'title' | 'keyword') => {
    setSearchType(newType);
    // 검색어가 있으면 새 타입으로 즉시 검색
    if (tempQuery.trim()) {
      onSearch(tempQuery.trim());
    }
  }, [setSearchType, tempQuery, onSearch]);

  // 정렬 변경 시 즉시 적용
  const handleSortChange = useCallback((newSort: 'd_day_desc' | 'favorite_asc') => {
    setSortBy(newSort);
  }, [setSortBy]);

  const hasActiveFilters = searchQuery || region !== 99999 || searchType !== 'title' || sortBy !== 'd_day_desc';

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label htmlFor="region" className={styles.filterLabel}>
          지역:
        </label>
        <select 
          id="region" 
          value={tempRegion} 
          onChange={(e) => setTempRegion(Number(e.target.value))} 
          className={styles.select}
          aria-label="지역 선택"
        >
          {REGION_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterGroup}>
        <label htmlFor="sortBy" className={styles.filterLabel}>
          정렬:
        </label>
        <select 
          id="sortBy" 
          value={sortBy} 
          onChange={(e) => handleSortChange(e.target.value as 'd_day_desc' | 'favorite_asc')} 
          className={styles.select}
          aria-label="정렬 방식 선택"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterGroup}>
        <label htmlFor="searchType" className={styles.filterLabel}>
          검색 조건:
        </label>
        <select 
          id="searchType" 
          value={searchType} 
          onChange={(e) => handleSearchTypeChange(e.target.value as 'title' | 'keyword')} 
          className={styles.select}
          aria-label="검색 조건 선택"
        >
          {SEARCH_TYPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            value={tempQuery}
            onChange={(e) => setTempQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${searchType === 'title' ? '제목' : '키워드'}으로 검색`}
            className={styles.searchInput}
            aria-label="검색어 입력"
          />
          <button 
            className={styles.searchButton} 
            onClick={handleSearchSubmit}
            type="button"
            aria-label="검색 실행"
          >
            검색
          </button>
          <button 
            className={styles.clearButton} 
            onClick={handleClearClick}
            type="button"
            aria-label="필터 초기화"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}