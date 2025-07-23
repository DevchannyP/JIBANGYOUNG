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
import { fetchPoliciesByRegion } from "@/libs/api/policy/region.api";

export default function PolicyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('title');
  const [region, setRegion] = useState<number>(99999); // 99999: 전국
  const [sortBy, setSortBy] = useState('d_day_desc'); // D-Day 기준으로 변경
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedPolicyIds, setBookmarkedPolicyIds] = useState<number[]>([]);
  const [policies, setPolicies] = useState<PolicyCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 정책 데이터 불러오기
  useEffect(() => {
    setIsLoading(true);
    const fetchPolicies = async () => {
      try {
        if (region === 99999) {
          const allData = await fetchAllPolicies();
          setPolicies(allData);
        } else {
          const [regionData, nationalData] = await Promise.all([
            fetchPoliciesByRegion(region),
            fetchPoliciesByRegion(99999),
          ]);
          const merged = [...regionData, ...nationalData].filter(
            (policy, index, self) =>
              index === self.findIndex(p => p.plcy_no === policy.plcy_no)
          );
          setPolicies(merged);
        }
      } catch (err) {
        console.error("정책 데이터 API 호출 에러:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, [region]);

  const itemsPerPage = 12;

  // 검색어와 정렬 적용 (D-Day 기준 정렬 적용)
  const filteredAndSortedPolicies = useMemo(() => {
    let filtered = policies;

    if (searchQuery.trim()) {
      filtered = filtered.filter(policy =>
        policy.plcy_nm.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const today = new Date();

      if (sortBy === "d_day_desc") {
        const dDayA = (new Date(a.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        const dDayB = (new Date(b.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return dDayA - dDayB; // 남은 일 수가 적은 순
       }
       // else if (sortBy === "favorite_asc") {
      //   //return (b.favoriteCount ?? 0) - (a.favoriteCount ?? 0); // 인기순
      //   return 
      // }

      return 0;
    });

    return filtered;
  }, [policies, searchQuery, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, region]);

  const totalFiltered = filteredAndSortedPolicies.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);

  const paginatedPolicies = filteredAndSortedPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const router = useRouter();

  const handleCardClick = (id: number) => router.push(`./policy_detail/${id}`);
  const handleSearch = (query: string) => setSearchQuery(query.trim());
  const handleClearSearch = () => setSearchQuery("");
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

        {isLoading ? (
          <div className={styles.loading}>데이터를 불러오는 중...</div>
        ) : totalFiltered === 0 ? (
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
