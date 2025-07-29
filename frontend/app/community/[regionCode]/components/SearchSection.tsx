import React from "react";
import styles from "./BoardList.module.css";

interface SearchSectionProps {
  searchType: string;
  searchQuery: string;
  onSearchTypeChange: (type: string) => void;
  onSearchQueryChange: (query: string) => void;
  onSearch: (type: string, query: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchType,
  searchQuery,
  onSearchTypeChange,
  onSearchQueryChange,
  onSearch,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchType, searchQuery);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <label htmlFor="searchTypeSelect" className={styles.searchLabel}>
        검색 조건
      </label>
      <select
        id="searchTypeSelect"
        className={styles.searchSelect}
        value={searchType}
        onChange={(e) => onSearchTypeChange(e.target.value)}
      >
        <option value="전체">전체</option>
        <option value="제목">제목</option>
        <option value="내용">내용</option>
        <option value="작성자">작성자</option>
      </select>

      <input
        type="text"
        className={styles.searchInput}
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        placeholder="검색어를 입력하세요"
      />

      <button type="submit" className={styles.searchButton}>
        검색
      </button>
    </form>
  );
};

export default SearchSection;
