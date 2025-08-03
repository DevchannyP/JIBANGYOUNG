'use client';

import { fetchAllPolicies } from "@/libs/api/policy/policy.c";
import { fetchPoliciesByRegion } from "@/libs/api/policy/region.api";
import { syncBookmarkedPolicies } from "@/libs/api/policy/sync";
import { PolicyCard } from "@/types/api/policy.c";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from '../total_policy.module.css';
import Pagination from './components/Pagination';
import PolicyCardList from './components/PolicyCardList';
import PolicyCounter from './components/PolicyCounter';
import PolicyFilterBar from './components/PolicyFilterBar';
import SkeletonLoader from "./skeleton";

interface ServerState {
  currentPage: number;
  searchType: 'title' | 'keyword';
  region: number;
  sortBy: 'd_day_desc' | 'favorite_asc';
  searchQuery: string;
  itemsPerPage: number;
}

interface PolicyClientProps {
  serverState: ServerState;
  userId: number;  // userId prop 추가
}

export default function PolicyClient({ serverState, userId }: PolicyClientProps) {
  const [policies, setPolicies] = useState<PolicyCard[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(serverState.currentPage);
  const [searchType, setSearchType] = useState(serverState.searchType);
  const [region, setRegion] = useState(serverState.region);
  const [sortBy, setSortBy] = useState(serverState.sortBy);
  const [searchQuery, setSearchQuery] = useState(serverState.searchQuery);

  // --- localStorage에서 북마크 초기값 복원 ---
  const [bookmarkedPolicyIds, setBookmarkedPolicyIds] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bookmarkedPolicyIds');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // 초기 데이터 CSR 패칭
  useEffect(() => {
    const loadPolicies = async () => {
      setIsLoading(true);
      try {
        const allPolicies = await fetchAllPolicies();
        const sorted = allPolicies.sort((a, b) => {
          const today = new Date();
          const dDayA = (new Date(a.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          const dDayB = (new Date(b.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          return dDayA - dDayB;
        });
        setPolicies(sorted);
        setTotal(sorted.length);
      } catch (err) {
        setError("정책 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPolicies();
  }, []);

  // 지역 변경 시 데이터 재패칭
  const fetchPoliciesByRegionChange = useCallback(async (newRegion: number) => {
    setIsLoading(true);
    setError(null);

    try {
      if (newRegion === 99999) {
        const allPolicies = await fetchAllPolicies();
        const sorted = allPolicies.sort((a, b) => {
          const today = new Date();
          const dDayA = (new Date(a.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          const dDayB = (new Date(b.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          return dDayA - dDayB;
        });
        setPolicies(sorted);
        setTotal(sorted.length);
      } else {
        const [regionData, nationalData] = await Promise.all([
          fetchPoliciesByRegion(newRegion),
          fetchPoliciesByRegion(99999),
        ]);

        const merged = [...regionData, ...nationalData].filter(
          (policy, index, self) =>
            index === self.findIndex(p => p.plcy_no === policy.plcy_no)
        );

        setPolicies(merged);
        setTotal(merged.length);
      }
    } catch (err) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoliciesByRegionChange(region);
  }, [region, fetchPoliciesByRegionChange]);

  // 검색 및 정렬 적용
  const filteredAndSortedPolicies = useMemo(() => {
    let filtered = [...policies];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(policy => {
        if (searchType === 'title') {
          return policy.plcy_nm.toLowerCase().includes(query);
        } else if (searchType === 'keyword') {
          return policy.plcy_kywd_nm?.toLowerCase().includes(query) || false;
        }
        return false;
      });
    }

    filtered.sort((a, b) => {
      const today = new Date();
      if (sortBy === "d_day_desc") {
        const dDayA = (new Date(a.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        const dDayB = (new Date(b.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return dDayA - dDayB;
      }
      return 0;
    });

    return filtered;
  }, [policies, searchQuery, searchType, sortBy]);

  // 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, region]);

  const totalFiltered = filteredAndSortedPolicies.length;
  const totalPages = Math.ceil(totalFiltered / serverState.itemsPerPage);
  const paginatedPolicies = filteredAndSortedPolicies.slice(
    (currentPage - 1) * serverState.itemsPerPage,
    currentPage * serverState.itemsPerPage
  );

  // 이벤트 핸들러
  const handleCardClick = useCallback((id: number) => {
    router.push(`./policy_detail/${id}`);
  }, [router]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.trim());
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setRegion(99999);
  }, []);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);

  // --- 북마크 토글 & localStorage 저장 ---
  const handleBookmarkToggle = useCallback((policyId: number) => {
    setBookmarkedPolicyIds(prev => {
      let updated: number[];
      if (prev.includes(policyId)) {
        updated = prev.filter(id => id !== policyId);
      } else {
        updated = [...prev, policyId];
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('bookmarkedPolicyIds', JSON.stringify(updated));
        } catch {
          // localStorage error 무시
        }
      }

      return updated;
    });
  }, []);

  // --- 5분마다 localStorage 북마크 상태 서버 전송 ---
useEffect(() => {
  const syncBookmarksToServer = async () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('bookmarkedPolicyIds');
      const bookmarkedIds = stored ? JSON.parse(stored) : [];

      await syncBookmarkedPolicies(userId, bookmarkedIds); // 💡 변경된 부분
    } catch (error) {
      console.error('북마크 동기화 실패:', error);
    }
  };

  const intervalId = setInterval(syncBookmarksToServer, 1 * 60 * 1000);

  return () => clearInterval(intervalId);
}, [1001]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.error}>
            <h3>오류가 발생했습니다</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <PolicyCounter total={total} filtered={totalFiltered} />

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

        {totalFiltered === 0 ? (
          <div className={styles.noResults}>
            <h3>검색 결과가 없습니다</h3>
            <p>검색어: <strong>{searchQuery}</strong></p>
            <p>다른 검색어로 시도해보거나 필터를 초기화해주세요.</p>
            <button onClick={handleClearSearch} className={styles.clearButton}>
              필터 초기화
            </button>
          </div>
        ) : (
          <>
            <PolicyCardList
              policies={paginatedPolicies}
              onCardClick={handleCardClick}
              bookmarkedPolicyIds={bookmarkedPolicyIds}
              onBookmarkToggle={handleBookmarkToggle}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
