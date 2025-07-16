// app/policy/totalPolicies/components/PolicyCardList.tsx (3열 카드 그리드)
"use client";

import PolicyCard from './PolicyCard';
import styles from '../../total_policy.module.css';

export interface Policy {
  id: number;
  title: string;
  summary: string;
  support: string;
  deadline: string;
  category: string;
}

interface PolicyCardListProps {
  policies: Policy[];
  onCardClick: (id: number) => void;
}

export default function PolicyCardList({ policies, onCardClick }: PolicyCardListProps) {
  return (
    <div className={styles.list}>
      {policies.map((policy) => (
        <PolicyCard key={policy.id} {...policy} onClick={() => onCardClick(policy.id)} />
      ))}
    </div>
  );
}
