// app/policy/totalPolicies/components/PolicyCardList.tsx
"use client";

import PolicyCard from './PolicyCard';
import styles from '../../total_policy.module.css';
import { PolicyCard as PolicyCardType } from '@/types/api/policy.c';

interface PolicyCardListProps {
  policies: PolicyCardType[];
  onCardClick: (NO: number) => void;
  bookmarkedPolicyIds?: number[];
  onBookmarkToggle?: (policyId: number) => void;
}

export default function PolicyCardList({ 
  policies, 
  onCardClick, 
  bookmarkedPolicyIds = [], 
  onBookmarkToggle 
}: PolicyCardListProps) {

  console.log("PolicyCardList에 받은 policies:", policies);

  return (
    <div className={styles.list}>
      {policies.map((policy, index) => (
        <PolicyCard 
          key={policy.NO}
          policy={policy}
          onClick={() => onCardClick(policy.NO)}
          isBookmarked={bookmarkedPolicyIds.includes(policy.NO)}
          onBookmarkToggle={onBookmarkToggle}
        />
      ))}
    </div>
  );
}