'use client';

import { fetchRecommendations } from '@/libs/api/recommendation.api';
import { RecommendationResultDto } from '@/types/api/recommendation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FooterActions from './components/FooterActions';
import RecommendationList from './components/RecommendationList';

interface RecommendationDataLoaderProps {
  userId: number;
  responseId: number;
}

const RecommendationDataLoader: React.FC<RecommendationDataLoaderProps> = ({
  userId,
  responseId,
}) => {
  const [data, setData] = useState<RecommendationResultDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedPolicyIds, setBookmarkedPolicyIds] = useState<number[]>([]);
  const router = useRouter(); // ⬅️ Next.js navigation 훅

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchRecommendations(userId, responseId);
        setData(res);
      } catch (err) {
        setError('추천 정보를 불러오는데 실패했습니다.');
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [userId, responseId]);

  const handlePolicyClick = (policyId: number) => {
    // 정책 상세 페이지 이동
    router.push(`/policy/policy_detail/${policyId}`);
  };

  const handleBookmarkToggle = (policyId: number) => {
    setBookmarkedPolicyIds((prev) =>
      prev.includes(policyId)
        ? prev.filter((id) => id !== policyId)
        : [...prev, policyId]
    );

    // 예: 북마크 토글 API 호출 등
  };

  const handleViewAllPolicies = () => {
    router.push('/policy/totalPolicies');
  };

  const handleRetakeSurvey = () => {
    router.push('/survey/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">추천 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="error-container">
        <p className="error-text">추천 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <RecommendationList
        data={data}
        onPolicyClick={handlePolicyClick}
        onBookmarkToggle={handleBookmarkToggle}
        bookmarkedPolicyIds={bookmarkedPolicyIds}
        userId={userId}
      />
      <FooterActions
        onViewAllPolicies={handleViewAllPolicies}
        onRetakeSurvey={handleRetakeSurvey}
      />
    </div>
  );
};

export default RecommendationDataLoader;
