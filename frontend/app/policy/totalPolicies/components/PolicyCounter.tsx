// app/policy/totalPolicies/components/PolicyCounter.tsx (상단 회색 박스에 "전체 000건 중 000건 노출")
"use client";

import styles from '../../total_policy.module.css';

interface PolicyCounterProps {
  total: number;
  filtered: number;
}

export default function PolicyCounter({ total, filtered }: PolicyCounterProps) {
  return (
    <div className={styles.counter}>
      전체 {total}건 중 {filtered}건 노출
    </div>
  );
}