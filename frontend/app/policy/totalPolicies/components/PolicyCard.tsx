import React from 'react';
import styles from '../../total_policy.module.css';
import { PolicyCard as PolicyCardType } from '@/types/api/policy.c';

interface PolicyCardProps {
  policy: PolicyCardType;
  onClick: () => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (policyId: number) => void;
}

const PolicyCard: React.FC<PolicyCardProps> = ({
  policy,
  onClick,
  isBookmarked = false,
  onBookmarkToggle,
}) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkToggle?.(policy.NO);
  };

  let dDayText = '';
if (policy.deadline === '2099-12-31') {
  dDayText = '상시';
} else {
  dDayText = policy.d_day === 0 ? 'D-day' : `D-${policy.d_day}`;
}

  return (
    <div className={styles.item} onClick={onClick} style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: policy.d_day === 0 ? '#ff4d4f' : '#1890ff',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          userSelect: 'none',
          zIndex: 10,
        }}
      >
        {dDayText}
      </div>

      <div className={styles.cardHeader}>
        <h3 className={styles.itemTitle}>{policy.plcy_nm}</h3>
        {onBookmarkToggle && (
          <button
            className={styles.bookmarkButton}
            onClick={handleBookmarkClick}
            aria-label={isBookmarked ? '찜 해제' : '찜하기'}
          >
            <span
              className={`${styles.heartIcon} ${isBookmarked ? styles.bookmarked : ''}`}
            >
              {isBookmarked ? '♥' : '♡'}
            </span>
          </button>
        )}
      </div>

      <p style={{ marginTop: '8px', color: '#555', fontSize: '0.9rem' }}>
        키워드: {policy.plcy_kywd_nm || '없음'}
      </p>
    </div>
  );
};

export default PolicyCard;
