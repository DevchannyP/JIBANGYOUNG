//app/policy/rec_Policies/page.tsx (찜한 정책 페이지)
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import PolicyCardList from '../totalPolicies/components/PolicyCardList';
import Pagination from '../totalPolicies/components/Pagination';
import PolicyCounter from '../totalPolicies/components/PolicyCounter';
import styles from '../total_policy.module.css';
import PolicyFilterBar from "../totalPolicies/components/PolicyFilterBar";

// 전체 정책 데이터 (실제로는 API에서 가져와야 함)
const allPolicies = [
  { No: 1, plcyNm: '교육 지원 정책 1', summary: '2025년 교육 지원 프로그램', support: '500만 원', deadline: '2025-08-01', category: '교육' },
  { No: 2, plcyNm: '복지 혜택 정책 2', summary: '저소득층 지원 안내', support: '300만 원', deadline: '2025-07-31', category: '복지' },
  { No: 3, plcyNm: '환경 보호 정책 3', summary: '탄소 배출 저감 방안', support: '700만 원', deadline: '2025-07-30', category: '환경' },
  { No: 4, plcyNm: '교육 지원 정책 4', summary: '온라인 학습 지원', support: '400만 원', deadline: '2025-07-29', category: '교육' },
  { No: 5, plcyNm: '복지 혜택 정책 5', summary: '노인 복지 확대', support: '600만 원', deadline: '2025-07-28', category: '복지' },
  { No: 6, plcyNm: '환경 보호 정책 6', summary: '재생에너지 도입', support: '800만 원', deadline: '2025-07-27', category: '환경' },
  { No: 7, plcyNm: '교육 지원 정책 7', summary: '2025년 교육 지원 프로그램', support: '550만 원', deadline: '2025-08-01', category: '교육' },
  { No: 8, plcyNm: '복지 혜택 정책 8', summary: '저소득층 지원 안내', support: '350만 원', deadline: '2025-07-31', category: '복지' },
  { No: 9, plcyNm: '환경 보호 정책 9', summary: '탄소 배출 저감 방안', support: '750만 원', deadline: '2025-07-30', category: '환경' },
  { No: 10, plcyNm: '교육 지원 정책 10', summary: '온라인 학습 지원', support: '450만 원', deadline: '2025-07-29', category: '교육' },
  { No: 11, plcyNm: '복지 혜택 정책 11', summary: '노인 복지 확대', support: '650만 원', deadline: '2025-07-28', category: '복지' },
  { No: 12, plcyNm: '환경 보호 정책 12', summary: '재생에너지 도입', support: '850만 원', deadline: '2025-07-27', category: '환경' }
];

export default function RecPoliciesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('title');
  const [region, setRegion] = useState('전국');
  const [sortBy, setSortBy] = useState('date_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // 찜한 정책 ID 목록 상태 관리
  const [bookmarkedPolicyIds, setBookmarkedPolicyIds] = useState<number[]>([]);

  // 컴포넌트 마운트 시 찜한 정책 ID 목록 로드
  useEffect(() => {
    // 실제로는 API 호출이나 로컬 스토리지에서 가져와야 함
    // 예시로 몇 개의 정책을 찜한 상태로 설정
    const savedBookmarks = [1, 3, 5, 7, 9]; // 예시 데이터
    setBookmarkedPolicyIds(savedBookmarks);
  }, []);

  const itemsPerPage = 12;

  // 찜한 정책만 필터링
  const bookmarkedPolicies = useMemo(() => {
    return allPolicies.filter(policy => bookmarkedPolicyIds.includes(policy.No));
  }, [bookmarkedPolicyIds]);

  // 필터링 및 정렬 로직을 useMemo로 최적화
  const filteredAndSortedPolicies = useMemo(() => {
    let filtered = bookmarkedPolicies;

    // 카테고리 필터링
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(policy => selectedCategories.includes(policy.category));
    }

    // 검색어 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(policy => {
        const searchField = policy[searchType as 'plcyNm' | 'summary'] || '';
        return searchField.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        case 'date_asc':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'support_desc':
          const aSupport = parseInt(a.support.replace(/[^0-9]/g, ''));
          const bSupport = parseInt(b.support.replace(/[^0-9]/g, ''));
          return bSupport - aSupport;
        default:
          return 0;
      }
    });

    return filtered;
  }, [bookmarkedPolicies, selectedCategories, searchQuery, searchType, sortBy]);

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

  // 찜 해제 처리 함수 - 즉시 리스트에서 제거
  const handleBookmarkToggle = (policyId: number) => {
    setBookmarkedPolicyIds(prev => {
      const isCurrentlyBookmarked = prev.includes(policyId);
      let newBookmarks;
      
      if (isCurrentlyBookmarked) {
        // 찜 해제
        newBookmarks = prev.filter(id => id !== policyId);
      } else {
        // 찜 추가 (이 페이지에서는 발생하지 않지만 일관성을 위해)
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
        <h1 className={styles.headerTitle}>찜한 정책</h1>
        
        <PolicyCounter total={bookmarkedPolicies.length} filtered={totalFiltered} />
        
        {bookmarkedPolicies.length > 0 && (
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
        )}
        
        {bookmarkedPolicies.length === 0 ? (
          <div className={styles.noResults}>
            <h3>찜한 정책이 없습니다.</h3>
            <p>관심있는 정책을 찜해보세요!</p>
            <Link href="/policy/totalPolicies" className={styles.clearButton}>
              전체 정책 보기
            </Link>
          </div>
        ) : !hasResults ? (
          <div className={styles.noResults}>
            <h3>검색 결과가 없습니다.</h3>
            <p>검색어: {searchQuery}</p>
            <button onClick={handleClearSearch} className={styles.clearButton}>
              찜한 정책 전체 보기
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
        
        {/* 찜한 정책이 있고 검색 결과가 있을 때만 Pagination 표시 */}
        {bookmarkedPolicies.length > 0 && hasResults && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}