'use client';

import PolicyCardList from '@/app/policy/totalPolicies/components/PolicyCardList';
import SkeletonLoader from '@/app/policy/totalPolicies/skeleton';
import { syncBookmarkedPolicies } from '@/libs/api/policy/sync';
import { fetchPolicies, fetchRegionReason } from '@/libs/api/recommendation.api';
import { PolicyCard } from '@/types/api/policy.c';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './RecommendationRegion.css';
import { ActionButtons } from './components/ActionButtons';
import { ReasonCards } from './components/ReasonCard';
import { RecommendationHeader } from './components/RecommendationHeader';

interface RecommendationRegionReasonDto {
  rankGroup: number;
  regionName: string;
  reason1: string;
  reason2: string;
  reason3: string;
  reason4: string;
}

interface RecRegionClientProps {
  userId: number;
  responseId: number;
  regionCode: number;
}

// 서버에서 오는 DTO (정책 원형 데이터)
interface PolicyCardDto {
  NO: number;
  plcy_nm: string;
  aply_ymd?: string;
  sidoName: string;
  plcy_kywd_nm: string;
  plcy_no: string;
  deadline: string;
  d_day: number;
  favorites: number;
}

// 변환 함수: DTO → UI 컴포넌트용 PolicyCard
function mapDtoToPolicyCard(dto: PolicyCardDto): PolicyCard {
  return {
    NO: dto.NO,
    plcy_nm: dto.plcy_nm,
    aply_ymd: dto.aply_ymd,
    sidoName: dto.sidoName,
    plcy_kywd_nm: dto.plcy_kywd_nm,
    plcy_no: dto.plcy_no,
    deadline: dto.deadline,
    d_day: dto.d_day,
    favorites: dto.favorites,
  };
}

const ITEMS_PER_PAGE = 4;
const STORAGE_KEY = 'bookmarkedPolicyIds';

export default function RecRegionClient({
  userId,
  responseId,
  regionCode,
}: RecRegionClientProps) {
  const router = useRouter();
  const [regionReason, setRegionReason] = useState<RecommendationRegionReasonDto | null>(null);
  const [policies, setPolicies] = useState<PolicyCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedPolicyIds, setBookmarkedPolicyIds] = useState<number[]>([]);

  const totalPages = Math.ceil(policies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPolicies = policies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // localStorage에서 북마크 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setBookmarkedPolicyIds(JSON.parse(stored));
        }
      } catch {
        // 무시
      }
    }
  }, []);

  // 5분마다 localStorage 북마크 동기화 서버 전송
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
}, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reasonData, policiesData] = await Promise.all([
          fetchRegionReason(userId, responseId, regionCode.toString()),
          fetchPolicies(userId, responseId, regionCode.toString()),
        ]);

        setRegionReason(reasonData);
        setPolicies(policiesData.map(mapDtoToPolicyCard));
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, responseId, regionCode]);

  const handleBookmarkToggle = (policyId: number) => {
    setBookmarkedPolicyIds((prev) => {
      const isBookmarked = prev.includes(policyId);
      const updated = isBookmarked
        ? prev.filter((id) => id !== policyId)
        : [...prev, policyId];

      // localStorage에 저장
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // 무시
        }
      }

      return updated;
    });
  };

  if (loading) {
    return (
      <SkeletonLoader/>
    );
  }

  if (error || !regionReason) {
    return (
      <div className="recommendation-container">
        <p className="error-text">{error || '데이터를 찾을 수 없습니다.'}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="recommendation-container">
      <RecommendationHeader
        regionName={regionReason.regionName}
        rankGroup={regionReason.rankGroup}
      />

      <ReasonCards
        reason1={regionReason.reason1}
        reason2={regionReason.reason2}
        reason3={regionReason.reason3}
        reason4={regionReason.reason4}
      />

      <div className="policy-section">
        <h2 className="policy-title">
          <span className="policy-region-name">{regionReason.regionName}</span> 관련 추천정책입니다.
        </h2>

        {policies.length > 0 ? (
          <>
            <PolicyCardList
              policies={currentPolicies}
              onCardClick={(policyNo) => router.push(`/policy/policy_detail/${policyNo}`)}
              bookmarkedPolicyIds={bookmarkedPolicyIds} // 북마크 상태 전달
              onBookmarkToggle={handleBookmarkToggle}  // 토글 핸들러 전달
            />

            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                이전
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          </>
        ) : (
          <p className="error-text">관련 정책이 없습니다.</p>
        )}
      </div>

      <ActionButtons userId={userId} responseId={responseId} regionCode={regionCode} />
    </div>
  );
}
