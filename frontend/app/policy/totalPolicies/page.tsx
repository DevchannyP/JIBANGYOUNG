"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import PolicyFilterBar from './components/PolicyFilterBar';
import PolicyCardList from './components/PolicyCardList';
import Pagination from './components/Pagination';
import PolicyCounter from './components/PolicyCounter';
import styles from '../total_policy.module.css';
import { PolicyCard } from "@/types/api/policy.c";
import { fetchAllPolicies } from "@/libs/api/policy/policy.c";

export default function PolicyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('title');
  const [region, setRegion] = useState('전국');
  const [sortBy, setSortBy] = useState('date_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [bookmarkedPolicyIds, setBookmarkedPolicyIds] = useState<number[]>([]);
  const [policies, setPolicies] = useState<PolicyCard[]>([]);

useEffect(() => {
  fetchAllPolicies()
    .then(data => {
      console.log('받은 정책 데이터:', data);  // 여기에 데이터가 찍히나요?
      setPolicies(data);
    })
    .catch(err => console.error('API 호출 에러:', err));
}, []);

  const itemsPerPage = 12;

  const filteredAndSortedPolicies = useMemo(() => {
    let filtered = policies;

    if (searchQuery.trim()) {
      filtered = filtered.filter(policy =>
        policy.plcy_nm.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      } else if (sortBy === 'date_asc') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

    return filtered;
  }, [policies, searchQuery, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, sortBy]);

  const totalFiltered = filteredAndSortedPolicies.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);
  const hasResults = totalFiltered > 0;

  const paginatedPolicies = filteredAndSortedPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const router = useRouter();

  const handleCardClick = (id: number) => router.push(`/policy_detail/${id}`);
  const handleSearch = (query: string) => setSearchQuery(query.trim());
  const handleClearSearch = () => setSearchQuery('');
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleBookmarkToggle = (policyId: number) => {
    setBookmarkedPolicyIds(prev =>
      prev.includes(policyId)
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId]
    );
  };

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.headerTitle}>전체 정책</h1>
        <PolicyCounter total={policies.length} filtered={totalFiltered} />
        <PolicyFilterBar
          searchType={searchType}
          setSearchType={setSearchType}
          region={region}
          setRegion={setRegion}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
        />

        {!hasResults ? (
          <div className={styles.noResults}>
            <h3>검색 결과가 없습니다.</h3>
            <p>검색어: {searchQuery}</p>
            <button onClick={handleClearSearch} className={styles.clearButton}>
              전체 정책 보기
            </button>
          </div>
        ) : (
          <PolicyCardList
            policies={paginatedPolicies}
            onCardClick={handleCardClick}
            bookmarkedPolicyIds={bookmarkedPolicyIds}
            onBookmarkToggle={handleBookmarkToggle}
          />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
