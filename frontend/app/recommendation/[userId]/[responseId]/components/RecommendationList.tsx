import PolicyCardList from '@/app/policy/totalPolicies/components/PolicyCardList';
import { RecommendationResultDto } from '@/types/api/recommendation';
import React, { useState } from 'react';
import AdditionalPoliciesCarousel from './AdditionalPoliciesCarousel';
import RecommendationRegionCard from './RecommendedRegionCard';

interface RecommendationListProps {
  data: RecommendationResultDto[];
  onPolicyClick: (policyId: number) => void;
  onBookmarkToggle: (policyId: number) => void;
  bookmarkedPolicyIds: number[];
  userId: number;
}

const RecommendationList: React.FC<RecommendationListProps> = ({
  data,
  onPolicyClick,
  onBookmarkToggle,
  bookmarkedPolicyIds,
  userId
}) => {
  const [selectedRank, setSelectedRank] = useState(1);
  
  const selectedRegion = data.find(d => d.rank === selectedRank) ?? data[0];

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
    background: rank === selectedRank 
      ? (rank === 1 ? 'linear-gradient(135deg, #e8f0fe 0%, white 100%)' : '#e8f0fe')
      : 'white',
    border: rank === selectedRank ? '2px solid #4285f4' : '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '24px',
    minWidth: '200px',
    maxWidth: '280px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    transform: rank === selectedRank ? 'translateY(-2px)' : 'none',
    boxShadow: rank === selectedRank ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
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
        {data.map(({ no, rank, regionName, regionDescription }) => (
          <div
            key={no}
            style={getRegionCardStyle(rank)}
            onMouseEnter={() => setSelectedRank(rank)}
            onClick={() => setSelectedRank(rank)}
            onMouseLeave={() => {
              // 마우스가 벗어나도 선택 상태는 유지
            }}
          >
            <RecommendationRegionCard
              rank={rank}
              regionName={regionName}
              regionDescription={regionDescription}
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
        selectedRegionRank={selectedRank}
        onPolicyClick={onPolicyClick}
        onBookmarkToggle={onBookmarkToggle}
        bookmarkedPolicyIds={bookmarkedPolicyIds}
      />
    </div>
  );
};

export default RecommendationList;