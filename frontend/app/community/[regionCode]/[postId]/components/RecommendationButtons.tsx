'use client';

import { getUserRecommendation, recommendPost } from '@/libs/api/community/community.api';
import { useAuthStore } from '@/store/authStore';
import React, { useEffect, useState } from 'react';
import styles from '../../../Community.module.css';

interface RecommendationButtonsProps {
  postId: number;
}

const RecommendationButtons: React.FC<RecommendationButtonsProps> = ({
  postId,
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const recommendationTypes = ['쏠쏠정보', '흥미진진', '공감백배', '분석탁월', '후속강추'];

  // 컴포넌트 마운트 시 현재 사용자의 추천 상태 조회
  useEffect(() => {
    if (user) {
      loadUserRecommendation();
    }
  }, [user, postId]);

  const loadUserRecommendation = async () => {
    try {
      const currentRecommendation = await getUserRecommendation(postId);
      setSelectedType(currentRecommendation);
    } catch (error) {
      console.error('추천 상태 조회 실패:', error);
    }
  };

  const handleRecommend = async (type: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);
    try {
      await recommendPost(postId, type);
      
      // 같은 타입 클릭 시 추천 취소, 다른 타입 클릭 시 변경
      const newSelectedType = selectedType === type ? null : type;
      setSelectedType(newSelectedType);
      
      if (newSelectedType === null) {
        alert(`${type} 추천이 취소되었습니다.`);
      } else {
        alert(`${type} 추천이 완료되었습니다!`);
      }
    } catch (error) {
      console.error('추천 실패:', error);
      alert('추천에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
          <div style={{ display: "inline-block", margin: "0 10px" }}>
            <button className={styles.recommendButton} disabled>쏠쏠정보</button>
          </div>
          <div style={{ display: "inline-block", margin: "0 10px" }}>
            <button className={styles.recommendButton} disabled>흥미진진</button>
          </div>
          <div style={{ display: "inline-block", margin: "0 10px" }}>
            <button className={styles.recommendButton} disabled>공감백배</button>
          </div>
          <div style={{ display: "inline-block", margin: "0 10px" }}>
            <button className={styles.recommendButton} disabled>분석탁월</button>
          </div>
          <div style={{ display: "inline-block", margin: "0 10px" }}>
            <button className={styles.recommendButton} disabled>후속강추</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <div style={{ marginBottom: '10px' }}>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: "inline-block", margin: "0 5px" }}>
          <button
            onClick={() => handleRecommend("쏠쏠정보")}
            disabled={isLoading}
            className={`${styles.recommendButton} ${
              selectedType === "쏠쏠정보" ? styles.recommendButtonActive : ''
            }`}
          >
            쏠쏠정보 {selectedType === "쏠쏠정보" && '✓'}
          </button>
        </div>
        <div style={{ display: "inline-block", margin: "0 5px" }}>
          <button
            onClick={() => handleRecommend("흥미진진")}
            disabled={isLoading}
            className={`${styles.recommendButton} ${
              selectedType === "흥미진진" ? styles.recommendButtonActive : ''
            }`}
          >
            흥미진진 {selectedType === "흥미진진" && '✓'}
          </button>
        </div>
        <div style={{ display: "inline-block", margin: "0 5px" }}>
          <button
            onClick={() => handleRecommend("공감백배")}
            disabled={isLoading}
            className={`${styles.recommendButton} ${
              selectedType === "공감백배" ? styles.recommendButtonActive : ''
            }`}
          >
            공감백배 {selectedType === "공감백배" && '✓'}
          </button>
        </div>
        <div style={{ display: "inline-block", margin: "0 5px" }}>
          <button
            onClick={() => handleRecommend("분석탁월")}
            disabled={isLoading}
            className={`${styles.recommendButton} ${
              selectedType === "분석탁월" ? styles.recommendButtonActive : ''
            }`}
          >
            분석탁월 {selectedType === "분석탁월" && '✓'}
          </button>
        </div>
        <div style={{ display: "inline-block", margin: "0 5px" }}>
          <button
            onClick={() => handleRecommend("후속강추")}
            disabled={isLoading}
            className={`${styles.recommendButton} ${
              selectedType === "후속강추" ? styles.recommendButtonActive : ''
            }`}
          >
            후속강추 {selectedType === "후속강추" && '✓'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationButtons;
