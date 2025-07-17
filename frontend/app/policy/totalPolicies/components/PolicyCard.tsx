// /app/policy/totalPolicies/components/PolicyCard.tsx
import React from 'react';
import styles from '../../total_policy.module.css';
import { Policy } from '@/types/api/policy';

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
    e.stopPropagation();
    onBookmarkToggle?.(policy.No);
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
    </div>
  );
};

export default PolicyCard;
