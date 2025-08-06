'use client';

import { fetchFavoritePoliciesByPolicyNos } from "@/libs/api/policy/sync";
import type { PolicyCard } from "@/types/api/policy.c";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from '../total_policy.module.css';
import Pagination from "../totalPolicies/components/Pagination";
import PolicyCardList from "../totalPolicies/components/PolicyCardList";
import PolicyCounter from "../totalPolicies/components/PolicyCounter";
import PolicyFilterBar from "../totalPolicies/components/PolicyFilterBar";
import SkeletonLoader from "../totalPolicies/skeleton";

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
}

export default function PolicyFavoritesClient({ serverState }: PolicyClientProps) {
  const [favoritePolicies, setFavoritePolicies] = useState<PolicyCard[]>([]);
  const [bookmarkedPolicyIds, setBookmarkedPolicyIds] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem("bookmarkedPolicyIds");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<'title' | 'keyword'>("title");
  const [sortBy, setSortBy] = useState<'d_day_desc' | 'favorite_asc'>("d_day_desc");

  useEffect(() => {
    const fetchFavoritePoliciesFromServer = async () => {
      if (bookmarkedPolicyIds.length === 0) {
        setFavoritePolicies([]);
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const policies = await fetchFavoritePoliciesByPolicyNos(bookmarkedPolicyIds);
        setFavoritePolicies(policies);
      } catch (err) {
        setError("찜한 정책을 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritePoliciesFromServer();
  }, [bookmarkedPolicyIds]);

  const filteredAndSortedPolicies = useMemo(() => {
    let filtered = [...favoritePolicies];

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

    if (sortBy === "d_day_desc") {
      const today = new Date();
      filtered.sort((a, b) => {
        const dDayA = new Date(a.deadline).getTime() - today.getTime();
        const dDayB = new Date(b.deadline).getTime() - today.getTime();
        return dDayA - dDayB; // 마감 빠른 순
      });
    } else if (sortBy === "favorite_asc") {
      filtered.sort((a, b) => {
        const favA = a.favorites ?? 0;
        const favB = b.favorites ?? 0;
        return favB - favA; // 찜 많은 순
      });
    }

    return filtered;
  }, [favoritePolicies, searchQuery, searchType, sortBy]);

  const totalFiltered = filteredAndSortedPolicies.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);

  const paginatedPolicies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPolicies.slice(start, start + itemsPerPage);
  }, [filteredAndSortedPolicies, currentPage]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleCardClick = useCallback((id: number) => {
    window.location.href = `./policy_detail/${id}`;
  }, []);

  const handleBookmarkToggle = useCallback((policyId: number) => {
    setBookmarkedPolicyIds((prev) => {
      let updated;
      if (prev.includes(policyId)) {
        updated = prev.filter(id => id !== policyId);
      } else {
        updated = [...prev, policyId];
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem("bookmarkedPolicyIds", JSON.stringify(updated));
        } catch {
          // ignore
        }
      }

      return updated;
    });
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.trim());
    setCurrentPage(1); // 검색 시 페이지 초기화
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1); // 초기화 시 페이지 초기화
  }, []);

  if (isLoading) return <SkeletonLoader />;

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
        <PolicyCounter total={favoritePolicies.length} filtered={totalFiltered} />

        <PolicyFilterBar
          searchType={searchType}
          setSearchType={setSearchType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          region={99999}
          setRegion={() => {}} // 지역 필터 비활성화
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
        />

        {totalFiltered === 0 ? (
          <div className={styles.noResults}>
            <h3>찜한 정책이 없습니다</h3>
            <p>관심있는 정책을 찜하면 여기에 표시됩니다.</p>
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
              onPageChange={handlePageChange}
              totalItems={totalFiltered}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
