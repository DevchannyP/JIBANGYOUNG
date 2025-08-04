import PolicyCardList from '@/app/policy/totalPolicies/components/PolicyCardList';
import { PolicyCard } from '@/types/api/policy.c';
import { RecommendationResultDto } from '@/types/api/recommendation';
import React, { useState } from 'react';

interface AdditionalPoliciesCarouselProps {
  allRegionsData: RecommendationResultDto[];
  selectedRegionRank: number;
  onPolicyClick: (policyId: number) => void;
  onBookmarkToggle: (policyId: number) => void;
  bookmarkedPolicyIds: number[];
}

const AdditionalPoliciesCarousel: React.FC<AdditionalPoliciesCarouselProps> = ({
  allRegionsData,
  selectedRegionRank,
  onPolicyClick,
  onBookmarkToggle,
  bookmarkedPolicyIds,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const POLICIES_PER_PAGE = 4;

  // 선택된 지역을 제외한 나머지 지역들의 정책들을 모두 가져오기
  const otherRegionsPolicies: PolicyCard[] = allRegionsData
    .filter(region => region.rankGroup !== selectedRegionRank) // rankGroup으로 필터링
    .flatMap(region => region.policies);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(otherRegionsPolicies.length / POLICIES_PER_PAGE);
  
  // 현재 페이지의 정책들
  const currentPolicies = otherRegionsPolicies.slice(
    currentPage * POLICIES_PER_PAGE,
    (currentPage + 1) * POLICIES_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  // 정책이 없거나 페이지가 0보다 작으면 렌더링하지 않음
  if (otherRegionsPolicies.length === 0 || totalPages === 0) {
    return null;
  }

  // 페이지가 변경되었을 때 현재 페이지가 범위를 벗어나면 조정
  const safePage = Math.min(currentPage, totalPages - 1);
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }

  const containerStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    marginTop: '40px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#333333',
    margin: 0
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#666666',
    marginTop: '8px'
  };

  const carouselContainerStyle: React.CSSProperties = {
    position: 'relative'
  };

  const navigationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '24px'
  };

  const buttonStyle: React.CSSProperties = {
    background: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: '#cccccc',
    cursor: 'not-allowed',
    boxShadow: 'none'
  };

  const pageIndicatorStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666666'
  };

  const dotContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  };

  const dotStyle = (isActive: boolean): React.CSSProperties => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: isActive ? '#4285f4' : '#cccccc',
    transition: 'background 0.2s ease'
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>다른 지역의 추천 정책</h3>
        <p style={subtitleStyle}>
          다른 추천 지역의 정책들도 확인해보세요
        </p>
      </div>

      <div style={carouselContainerStyle}>
        <PolicyCardList
          policies={currentPolicies}
          onCardClick={onPolicyClick}
          bookmarkedPolicyIds={bookmarkedPolicyIds}
          onBookmarkToggle={onBookmarkToggle}
          itemsPerPage={POLICIES_PER_PAGE}
        />

        {totalPages > 1 && (
          <div style={navigationStyle}>
            <button
              style={currentPage === 0 ? disabledButtonStyle : buttonStyle}
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              onMouseEnter={(e) => {
                if (currentPage !== 0) {
                  e.currentTarget.style.background = '#3367d6';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 0) {
                  e.currentTarget.style.background = '#4285f4';
                }
              }}
            >
              ‹
            </button>

            <div style={pageIndicatorStyle}>
              <span>{currentPage + 1} / {totalPages}</span>
              <div style={dotContainerStyle}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <div
                    key={index}
                    style={dotStyle(index === currentPage)}
                  />
                ))}
              </div>
            </div>

            <button
              style={currentPage === totalPages - 1 ? disabledButtonStyle : buttonStyle}
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages - 1) {
                  e.currentTarget.style.background = '#3367d6';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages - 1) {
                  e.currentTarget.style.background = '#4285f4';
                }
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalPoliciesCarousel;