// app/policy/totalPolicies/components/PolicyCard.tsx (정책 카드)
"use client";

import { useState } from 'react';
import { Policy } from './PolicyCardList';
import styles from '../../total_policy.module.css';

interface PolicyCardProps extends Policy {
  onClick: () => void;
}

export default function PolicyCard({ 
  id, 
  title, 
  summary, 
  support, 
  deadline, 
  category,
  onClick 
}: PolicyCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 중단
    setIsBookmarked(!isBookmarked);
    
    // 여기서 백엔드 API 호출 (찜하기/취소)
    // bookmarkApi.toggle(id);
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: '마감', color: '#ef4444' };
    } else if (diffDays === 0) {
      return { text: '오늘 마감', color: '#f59e0b' };
    } else if (diffDays <= 7) {
      return { text: `${diffDays}일 남음`, color: '#f59e0b' };
    } else {
      return { text: date.toLocaleDateString('ko-KR'), color: '#6b7280' };
    }
  };

  const deadlineInfo = formatDeadline(deadline);

  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.cardHeader}>
        <h3 className={styles.itemTitle}>{title}</h3>
        <button 
          className={styles.bookmarkButton}
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? "찜 취소" : "찜하기"}
        >
          <span className={`${styles.heartIcon} ${isBookmarked ? styles.bookmarked : ''}`}>
            {isBookmarked ? '❤️' : '🤍'}
          </span>
        </button>
      </div>
      
      <p className={styles.itemSummary}>{summary}</p>
      
      <div className={styles.policyInfo}>
        <p className={styles.itemSupport}>💰 {support}</p>
        <p className={styles.itemCategory}>📂 {category}</p>
        <p 
          className={styles.itemDate}
          style={{ color: deadlineInfo.color }}
        >
          📅 {deadlineInfo.text}
        </p>
      </div>
    </div>
  );
}