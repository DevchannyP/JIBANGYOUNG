'use client';

import { syncBookmarkedPolicies } from '@/libs/api/policy/sync';
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

const STORAGE_KEY = 'bookmarkedPolicyIds';

const RecommendationDataLoader: React.FC<RecommendationDataLoaderProps> = ({
  userId,
  responseId,
}) => {
  const [data, setData] = useState<RecommendationResultDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedPolicyIds, setBookmarkedPolicyIds] = useState<number[]>([]);
  const router = useRouter();

  // localStorage에서 북마크 아이디 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setBookmarkedPolicyIds(JSON.parse(stored));
        }
      } catch {
        console.log("아이디 복원 실패");
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
    router.push(`/policy/policy_detail/${policyId}`);
  };

  const handleRegionClick = (regionCode: string) => {
    router.push(`/recommendation/${userId}/${responseId}/${regionCode}`);
  };

  const handleBookmarkToggle = (policyId: number) => {
    setBookmarkedPolicyIds((prev) => {
      const isBookmarked = prev.includes(policyId);
      const updated = isBookmarked
        ? prev.filter((id) => id !== policyId)
        : [...prev, policyId];

      // localStorage 저장
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
        onRegionClick={handleRegionClick}
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