//app/policy/totalPolicies/page.tsx (전체 정책 view 페이지)
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PolicyFilterBar from './components/PolicyFilterBar';
import PolicyCardList from './components/PolicyCardList';
import Pagination from './components/Pagination';
import PolicyCounter from './components/PolicyCounter';
import styles from '../total_policy.module.css';
import { PolicyResponseDto } from "@/types/api/policy";
import { fetchAllPolicies } from "@/libs/api/policyApi";

export default function PolicyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('title');
  const [region, setRegion] = useState('전국');
  const [sortBy, setSortBy] = useState('date_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // 찜한 정책 ID 목록 상태 관리
  const [bookmarkedPolicyIds, setBookmarkedPolicyIds] = useState<number[]>([]);

  //정책 데이터 호출
  const [policies, setPolicies] = useState<PolicyResponseDto[]>([]);

useEffect(() => {
  fetchAllPolicies()
    .then(data => {
      console.log('받은 정책 데이터:', data);
      setPolicies(data);
    })
    .catch(err => console.error('API 호출 에러:', err));
    }, []);

  const itemsPerPage = 12;

  // 필터링 및 정렬 로직을 useMemo로 최적화
  const filteredAndSortedPolicies = useMemo(() => {
    let filtered = policies;

    // 카테고리 필터링
    // if (selectedCategories.length > 0) {
    //   filtered = filtered.filter(policy => selectedCategories.includes(policy.category));
    // }

    // 검색어 필터링
    // if (searchQuery.trim()) {
    //   filtered = filtered.filter(policy => {
    //     //const searchField = policy[searchType as 'plcyNm' | 'summary'] || '';
    //     return searchField.toLowerCase().includes(searchQuery.toLowerCase());
    //   });
    // }

    // 정렬
    // filtered.sort((a, b) => {
    //   switch (sortBy) {
    //     case 'date_desc':
    //       return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    //     case 'date_asc':
    //       return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    //     case 'support_desc':
    //       const aSupport = parseInt(a.support.replace(/[^0-9]/g, ''));
    //       const bSupport = parseInt(b.support.replace(/[^0-9]/g, ''));
    //       return bSupport - aSupport;
    //     default:
    //       return 0;
    //   }
    // });

    return filtered;
  }, [policies, selectedCategories, searchQuery, searchType, sortBy]);

  // 검색 결과나 필터 변경 시 페이지를 1로 초기화
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

  const handleCardClick = (id: number) => {
    router.push(`/policy_detail/${id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // 찜 토글 처리 함수
  const handleBookmarkToggle = (policyId: number) => {
    setBookmarkedPolicyIds(prev => {
      const isCurrentlyBookmarked = prev.includes(policyId);
      let newBookmarks;
      
      if (isCurrentlyBookmarked) {
        // 찜 해제
        newBookmarks = prev.filter(No => No !== policyId);
      } else {
        // 찜 추가
        newBookmarks = [...prev, policyId];
      }
      
      // 실제로는 API 호출이나 로컬 스토리지 업데이트 필요
      // updateBookmarksOnServer(newBookmarks);
      
      return newBookmarks;
    });
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
        
        {/* Pagination을 항상 노출하도록 수정 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}