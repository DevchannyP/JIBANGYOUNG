//app/policy/totalPolicies/components/PolicyCard.tsx
"use client";

import React from 'react';
import styles from '../../total_policy.module.css';

interface Policy {
  No: number;
  plcyNm: string;
  summary: string;
  support: string;
  deadline: string;
  category: string;
}

interface PolicyCardProps {
  policy: Policy;
  onClick: () => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (policyId: number) => void;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ 
  policy, 
  onClick, 
  isBookmarked = false, 
  onBookmarkToggle 
}) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (onBookmarkToggle) {
      onBookmarkToggle(policy.No);
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return '마감됨';
    } else if (diffDays === 0) {
      return '오늘 마감';
    } else if (diffDays === 1) {
      return '내일 마감';
    } else {
      return `${diffDays}일 남음`;
    }
  };

  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.cardHeader}>
        <h3 className={styles.itemTitle}>{policy.plcyNm}</h3>
        {onBookmarkToggle && (
          <button 
            className={styles.bookmarkButton}
            onClick={handleBookmarkClick}
            aria-label={isBookmarked ? '찜 해제' : '찜하기'}
          >
            <span className={`${styles.heartIcon} ${isBookmarked ? styles.bookmarked : ''}`}>
              {isBookmarked ? '♥' : '♡'}
            </span>
          </button>
        )}
      </div>
      
      <div className={styles.itemSummary}>
        {policy.summary}
      </div>
      
      <div className={styles.policyInfo}>
        <div className={styles.itemSupport}>
          {policy.support}
        </div>
        <div className={styles.itemCategory}>
          {policy.category}
        </div>
        <div className={styles.itemDate}>
          {formatDeadline(policy.deadline)}
        </div>
      </div>
    </div>
  );
};

export default PolicyCard;