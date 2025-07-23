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
        className={styles.badgeContainer} // CSS로 위치 제어
      >
        <span className={styles.dDayBadge}>
          {dDayText}
        </span>
        <span className={styles.sidoName}>
          {policy.sidoName || '지역 미등록'}
        </span>
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

      <div className={`${styles.cardHeader} ${styles.adjustedCardHeader}`}>
        <h3 className={styles.itemTitle}>{policy.plcy_nm}</h3>
      </div>

      <p style={{ marginTop: '8px', color: '#555', fontSize: '0.9rem' }}>
        키워드: {policy.plcy_kywd_nm || '없음'}
      </p>
    </div>
  );
};

export default PolicyCard;
