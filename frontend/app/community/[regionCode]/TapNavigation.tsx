"use client";

import { useState } from 'react';
import styles from "./Community.module.css";

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState('전체');

  const tabs = [
    { id: '전체', label: '전체' },
    { id: '공지', label: '공지' },
    { id: '인기글', label: '인기글' },
    { id: '질문', label: '질문' },
    { id: '후기', label: '후기' }
  ];

  return (
    <div className={styles["regionr-navigation"]}>
      <div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}