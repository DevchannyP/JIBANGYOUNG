'use client';

import PolicyCardList from '@/app/policy/totalPolicies/components/PolicyCardList';
import { fetchPolicies, fetchRegionReason } from '@/libs/api/recommendation.api';
import { PolicyCard } from '@/types/api/policy.c';
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
  };
}

const ITEMS_PER_PAGE = 4;

export default function RecRegionClient({
  userId,
  responseId,
  regionCode,
}: RecRegionClientProps) {
  const [regionReason, setRegionReason] = useState<RecommendationRegionReasonDto | null>(null);
  const [policies, setPolicies] = useState<PolicyCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(policies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPolicies = policies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reasonData, policiesData] = await Promise.all([
          fetchRegionReason(userId, responseId, regionCode.toString()),
          fetchPolicies(userId, responseId, regionCode.toString()),
        ]);

        setRegionReason(reasonData);
        setPolicies(policiesData.map(mapDtoToPolicyCard)); // DTO → UI 데이터 매핑
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, responseId, regionCode]);

  if (loading) {
    return (
      <div className="recommendation-container">
        <p className="loading-text">데이터를 불러오는 중...</p>
      </div>
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
              onCardClick={(policyNo) => console.log('정책 클릭:', policyNo)}
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
