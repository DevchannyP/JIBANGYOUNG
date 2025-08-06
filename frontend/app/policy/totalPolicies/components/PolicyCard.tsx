import { PolicyCard as PolicyCardType } from '@/types/api/policy.c';
import { Heart } from 'lucide-react';
import React, { memo } from 'react';
import styles from '../../total_policy.module.css';

interface PolicyCardProps {
  policy: PolicyCardType;
  onClick: () => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (policyId: number) => void;
}

// D-Day 계산 함수
const calculateDDay = (deadline: string): { text: string; isUrgent: boolean } => {
  if (deadline === '2099-12-31' || deadline === '9999-12-31') {
    return { text: '상시', isUrgent: false };
  }

  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: '마감', isUrgent: true };
  } else if (diffDays === 0) {
    return { text: 'D-day', isUrgent: true };
  } else if (diffDays <= 7) {
    return { text: `D-${diffDays}`, isUrgent: true };
  } else {
    return { text: `D-${diffDays}`, isUrgent: false };
  }
};

// 키워드 배열로 변환
const extractHashtags = (keywords: string | null | undefined): string[] => {
  if (!keywords) return [];
  return keywords
    .split(',')
    .map((kw) => kw.trim())
    .filter((kw) => kw.length > 0);
};

const PolicyCard: React.FC<PolicyCardProps> = memo(({
  policy,
  onClick,
  isBookmarked = false,
  onBookmarkToggle,
}) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onBookmarkToggle?.(policy.NO);
  };

  const handleCardClick = () => {
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const dDayInfo = calculateDDay(policy.deadline);
  const hashtags = extractHashtags(policy.plcy_kywd_nm);

  return (
    <article 
      className={styles.item} 
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${policy.plcy_nm} 정책 상세보기`}
    >
      <div className={styles.badgeContainer}>
        <span 
          className={`${styles.dDayBadge} ${dDayInfo.isUrgent ? styles.urgent : ''}`}
          aria-label={`마감일 ${dDayInfo.text}`}
        >
          {dDayInfo.text}
        </span>
        
        <span 
          className={styles.sidoName}
          aria-label={`지역 ${policy.sidoName || '지역 미등록'}`}
        >
          {policy.sidoName || '지역 미등록'}
        </span>
        
        {onBookmarkToggle && (
          <button
            className={styles.bookmarkButton}
            onClick={handleBookmarkClick}
            aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
            type="button"
          >
            <Heart
              className={`${styles.heartIcon} ${isBookmarked ? styles.bookmarked : ''}`}
              fill={isBookmarked ? '#6366f1' : 'none'}
            />
          </button>
        )}
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.itemTitle}>
          {policy.plcy_nm}
        </h3>

        <div className={styles.cardMeta}>
          {hashtags.length > 0 && (
            <div className={styles.keywordInfo}>
              {hashtags.map((tag, index) => (
                <span key={index} className={styles.hashtag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* 추천 개수 표시 */}
        <div className={styles.cardFooter}>
          <span className={styles.favoriteCount} aria-label={`총 추천 ${policy.favorites ?? 0}개`}>
            ❤️ {policy.favorites ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
});

PolicyCard.displayName = 'PolicyCard';

export default PolicyCard;
