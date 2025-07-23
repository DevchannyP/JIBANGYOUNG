"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import styles from "../Community.module.css";
import { region } from "../types";

const RegionBoardNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleRegionClick = (code: string) => {
    router.push(`/community/${code}`); // 지역 코드 기반 URL 이동
  };

  return (
    <div className={styles["regionr-navigation"]}>
      {Object.entries(region)
        .filter(([code]) => code !== "99") // 전국 제외
        .map(([code, Name]) => {
          const isActive = pathname === `/community/${code}`;
          return (
            <button
              key={code}
              onClick={() => handleRegionClick(code)}
              className={isActive ? styles["region-active"] : ""}
            >
              {Name}
            </button>
          );
        })}
    </div>
  );
};

export default RegionBoardNavigation;
