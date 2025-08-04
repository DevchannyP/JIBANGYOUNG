"use client";

import { fetchAllPolicies } from "@/libs/api/policy/policy.c";
import { PolicyCard } from "@/types/api/policy.c";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from '../total_policy.module.css';
import Pagination from "../totalPolicies/components/Pagination";
import PolicyCardList from "../totalPolicies/components/PolicyCardList";
import PolicyCounter from "../totalPolicies/components/PolicyCounter";
import SkeletonLoader from "../totalPolicies/skeleton";


interface PolicyFavoriteClientProps {
  userId: number; // 사용자 ID
  itemsPerPage: number;
}


export default function PolicyFavoriteClient({ userId, itemsPerPage }: PolicyFavoriteClientProps) {
  const [policies, setPolicies] = useState<PolicyCard[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

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

  // 찜한 정책만 불러오기 (전체 정책 불러오고 찜목록에 있는 것만 필터링)
  useEffect(() => {
    const loadFavoritePolicies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (bookmarkedPolicyIds.length === 0) {
          setPolicies([]);
          setTotal(0);
          return;
        }
        const allPolicies = await fetchAllPolicies();

        // 찜한 정책 ID와 매칭되는 정책만 필터링
        const favoritePolicies = allPolicies.filter(policy => bookmarkedPolicyIds.includes(policy.NO));

        setPolicies(favoritePolicies);
        setTotal(favoritePolicies.length);
      } catch (err) {
        setError("찜한 정책 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoritePolicies();
  }, [bookmarkedPolicyIds]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(total / itemsPerPage);
  const paginatedPolicies = policies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardClick = useCallback((id: number) => {
    router.push(`./policy_detail/${id}`);
  }, [router]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);

  // 찜 토글 - localStorage & 상태 업데이트
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

  if (total === 0) {
    return (
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.noResults}>
            <h3>찜한 정책이 없습니다.</h3>
            <p>마음에 드는 정책을 찜해보세요!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <PolicyCounter total={total} filtered={total} />

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
      </div>
    </div>
  );
}
