'use client';
import { fetchRecommendations } from '@/libs/api/recommendation.api';
import { useEffect, useState } from 'react';

export default function PolicyResultClient({ userId, responseId }: { userId: number; responseId: number }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecommendations(userId, responseId); // POST 호출
        setRecommendations(data);
      } catch (err) {
        console.error('추천 생성 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, responseId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      {recommendations.map((rec, idx) => (
        <div key={idx} className="p-4 mb-4 border rounded-lg">
          <h2 className="font-bold">{rec.policyName}</h2>
          <p>{rec.description}</p>
        </div>
      ))}
    </div>
  );
}
