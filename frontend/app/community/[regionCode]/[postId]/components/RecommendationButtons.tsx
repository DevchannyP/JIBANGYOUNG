'use client';

import React, { useState } from 'react';
import styles from '../../../Community.module.css';
import { recommendPost } from '@/libs/api/community/community.api';

interface RecommendationButtonsProps {
  postId: number;
}

const RecommendationButtons: React.FC<RecommendationButtonsProps> = ({
  postId,
}) => {
  // 각 추천 타입별 갯수를 관리하는 상태
  const [recommendCounts, setRecommendCounts] = useState({
    쏠쏠정보: 0,
    흥미진진: 0,
    공감백배: 0,
    분석탁월: 0,
    후속강추: 0,
  });

  const handleRecommend = async (type: string) => {
    try {
      await recommendPost(postId, type);
      // 성공 시 해당 추천 타입의 갯수를 1 증가
      setRecommendCounts((prevCounts) => ({
        ...prevCounts,
        [type]: prevCounts[type as keyof typeof prevCounts] + 1,
      }));
      alert(`${type} 추천이 완료되었습니다!`);
    } catch (error) {
      console.error("추천 실패:", error);
      alert("추천에 실패했습니다.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <div style={{ display: "inline-block", margin: "0 10px" }}>
        <button
          onClick={() => handleRecommend("쏠쏠정보")}
          className={styles.recommendButton}
        >
          쏠쏠정보
        </button>
        <div className={styles.recommendCount}>{recommendCounts['쏠쏠정보']}</div>
      </div>
      <div style={{ display: "inline-block", margin: "0 10px" }}>
        <button
          onClick={() => handleRecommend("흥미진진")}
          className={styles.recommendButton}
        >
          흥미진진
        </button>
        <div className={styles.recommendCount}>{recommendCounts['흥미진진']}</div>
      </div>
      <div style={{ display: "inline-block", margin: "0 10px" }}>
        <button
          onClick={() => handleRecommend("공감백배")}
          className={styles.recommendButton}
        >
          공감백배
        </button>
        <div className={styles.recommendCount}>{recommendCounts['공감백배']}</div>
      </div>
      <div style={{ display: "inline-block", margin: "0 10px" }}>
        <button
          onClick={() => handleRecommend("분석탁월")}
          className={styles.recommendButton}
        >
          분석탁월
        </button>
        <div className={styles.recommendCount}>{recommendCounts['분석탁월']}</div>
      </div>
      <div style={{ display: "inline-block", margin: "0 10px" }}>
        <button
          onClick={() => handleRecommend("후속강추")}
          className={styles.recommendButton}
        >
          후속강추
        </button>
        <div className={styles.recommendCount}>{recommendCounts['후속강추']}</div>
      </div>
    </div>
  );
};

export default RecommendationButtons;
