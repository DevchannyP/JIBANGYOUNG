// app/policy/totalPolicies/components/PolicyCardList.tsx (3열 카드 그리드)
"use client";

import PolicyCard from './PolicyCard';
import styles from '../../total_policy.module.css';

export interface Policy {
  No: number;
  plcyNm: string;
  // summary: string;
  // support: string;
  // deadline: string;
  // category: string;
}

interface PolicyCardListProps {
  policies: Policy[];
  onCardClick: (No: number) => void;
  bookmarkedPolicyIds?: number[];
  onBookmarkToggle?: (policyId: number) => void;
}

export default function PolicyCardList({ 
  policies, 
  onCardClick, 
  bookmarkedPolicyIds = [], 
  onBookmarkToggle 
}: PolicyCardListProps) {
  return (
    <div className={styles.list}>
      {policies.map((policy) => (
        <PolicyCard 
          key={policy.No} 
          policy={policy}
          onClick={() => onCardClick(policy.No)}
          isBookmarked={bookmarkedPolicyIds.includes(policy.No)}
          onBookmarkToggle={onBookmarkToggle}
        />
      ))}
    </div>
  );
}