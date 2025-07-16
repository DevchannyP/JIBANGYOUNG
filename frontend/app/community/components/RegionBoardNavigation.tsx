// 지역 게시판 네비게이션
"use client";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "../Community.module.css";

export type Region = "부산" | "제주도" | "서울" | "대구" | "인천";
interface RegionBoardNavigationProps {
  regions: Region[];
  currentRegion?: Region;
}

const RegionBoardNavigation: React.FC<RegionBoardNavigationProps> = ({
  regions,
  currentRegion,
}) => {
  const router = useRouter();

  const handleRegionClick = (region: Region) => {
    // 지역별 게시판 페이지로 이동
    router.push(`${region.toLowerCase()}z`);
  };

  return (
    <div className={styles["regionr-navigation"]}>
      {regions.map((region) => (
        <button
          key={region}
          className={currentRegion === region ? styles.active : ""}
          onClick={() => handleRegionClick(region)}
        >
          {region}
        </button>
      ))}
    </div>
  );
};

export default RegionBoardNavigation;
