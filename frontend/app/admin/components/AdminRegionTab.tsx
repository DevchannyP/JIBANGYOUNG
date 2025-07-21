"use client";

import styles from "../AdminPage.module.css";

interface AdminRegionTabProps {
  selectedRegionCode: number;
  onSelectRegion: (regionName: string, code: number) => void;
}

const regionOptions = [
  { name: "전체", code: 0 },
  { name: "서울", code: 1001 },
  { name: "경기도", code: 1002 },
  { name: "충청북도", code: 1003 },
  { name: "충청남도", code: 1004 },
  { name: "전라북도", code: 1005 },
  { name: "전라남도", code: 1006 },
  { name: "경상북도", code: 1007 },
  { name: "경상남도", code: 1008 },
  { name: "강원도", code: 1009 },
  { name: "제주도", code: 1010 },
];

export function AdminRegionTab({
  selectedRegionCode,
  onSelectRegion,
}: AdminRegionTabProps) {
  return (
    <div className={styles.regionTabs}>
      {regionOptions.map((region) => (
        <button
          key={region.code}
          onClick={() => onSelectRegion(region.name, region.code)}
          className={
            selectedRegionCode === region.code ? styles.activeRegion : ""
          }
        >
          {region.name}
        </button>
      ))}
    </div>
  );
}
