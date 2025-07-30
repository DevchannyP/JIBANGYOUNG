'use client';

import { fetchRecommendationResults } from '@/libs/api/recommendation.api';
import { useEffect, useState } from 'react';

export default function PolicyResultClient({ userId, responseId }: { userId: number; responseId: number }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecommendationResults(userId, responseId);
        setRecommendations(data);
      } catch (err) {
        console.error('추천 결과 조회 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, responseId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      {recommendations.length === 0 ? (
        <p>추천 결과가 없습니다.</p>
      ) : (
        recommendations.map((rec, idx) => (
          <div key={idx} className="p-4 mb-4 border rounded-lg">
            <h2 className="font-bold">{rec.policyName}</h2>
            <p>{rec.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
