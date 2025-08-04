import PolicyCardList from '@/app/policy/totalPolicies/components/PolicyCardList';
import { RecommendationResultDto } from '@/types/api/recommendation';
import React, { useState } from 'react';
import AdditionalPoliciesCarousel from './AdditionalPoliciesCarousel';
import RecommendationRegionCard from './RecommendedRegionCard';

interface RecommendationListProps {
  data: RecommendationResultDto[];
  onPolicyClick: (policyId: number) => void;
  onRegionClick: (regionCode: string) => void;
  onBookmarkToggle: (policyId: number) => void;
  bookmarkedPolicyIds: number[];
  userId: number;
}

const RecommendationList: React.FC<RecommendationListProps> = ({
  data,
  onPolicyClick,
  onRegionClick,
  onBookmarkToggle,
  bookmarkedPolicyIds,
  userId
}) => {
  const [hoveredRank, setHoveredRank] = useState<number | null>(null);
  const [selectedRank, setSelectedRank] = useState<number>(1); // 기본 선택 지역

  // 현재 활성화된 rank (hover 중이면 hover된 rank, 아니면 선택된 rank)
  const activeRank = hoveredRank ?? selectedRank;

  // 마우스가 지역 카드에서 벗어날 때 해당 지역을 선택으로 고정
  const handleMouseLeave = (rank: number) => {
    setHoveredRank(null);
    setSelectedRank(rank);
  };

  // 현재 상단에 보여줄 선택된 지역 데이터
  const selectedRegion = data.find(d => d.rankGroup === activeRank) || data[0];

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px 0',
    background: 'white',
    marginBottom: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: '#333333',
    margin: 0
  };

  const regionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '40px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  const getRegionCardStyle = (rank: number): React.CSSProperties => ({
    background: rank === activeRank
      ? (rank === 1 ? 'linear-gradient(135deg, #e8f0fe 0%, white 100%)' : '#e8f0fe')
      : 'white',
    border: rank === activeRank ? '2px solid #4285f4' : '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '24px',
    minWidth: '200px',
    maxWidth: '280px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    transform: rank === activeRank ? 'translateY(-2px)' : 'none',
    boxShadow: rank === activeRank ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
  });

  const policySectionStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '40px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  const policySectionHeaderStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const policySectionTitleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#333333',
    margin: 0
  };

  return (
    <div style={containerStyle}>
      {/* 페이지 헤더 */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>{userId} 님의 TOP3 추천지역</h1>
      </div>

      {/* 추천 지역 카드들 */}
      <div style={regionsContainerStyle}>
        {data.map(({ no, rankGroup, regionName, regionDescription, regionCode }) => (
          <div
            key={no}
            style={getRegionCardStyle(rankGroup)}
            onMouseEnter={() => setHoveredRank(rankGroup)}
            onMouseLeave={() => handleMouseLeave(rankGroup)}
          >
            <RecommendationRegionCard
              rank={rankGroup}
              regionName={regionName}
              regionDescription={regionDescription}
              regionCode={regionCode ? String(regionCode) : `region-${rankGroup}`}
              onClick={onRegionClick}
            />
          </div>
        ))}
      </div>

      {/* 선택된 지역의 정책 카드 섹션 */}
      <div style={policySectionStyle}>
        <div style={policySectionHeaderStyle}>
          <h2 style={policySectionTitleStyle}>
            {selectedRegion.regionName} 맞춤 추천정책입니다.
          </h2>
        </div>

        <PolicyCardList
          policies={selectedRegion.policies}
          onCardClick={onPolicyClick}
          bookmarkedPolicyIds={bookmarkedPolicyIds}
          onBookmarkToggle={onBookmarkToggle}
          itemsPerPage={4}
        />
      </div>

      {/* 다른 지역의 추천 정책 캐러셀 */}
      <AdditionalPoliciesCarousel
        allRegionsData={data}
        selectedRegionRank={activeRank}
        onPolicyClick={onPolicyClick}
        onBookmarkToggle={onBookmarkToggle}
        bookmarkedPolicyIds={bookmarkedPolicyIds}
      />
    </div>
  );
};

export default RecommendationList;