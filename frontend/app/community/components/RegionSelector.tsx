"use client";

import { getRegionsBoard } from "@/libs/api/region.api";
import { Region } from "@/types/api/region.d";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "../Community.module.css";

export default function RegionSelector() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedSido, setSelectedSido] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await getRegionsBoard();
        setRegions(data);
      } catch (error) {
        console.error("Failed to fetch regions:", error);
      }
    };
    fetchRegions();
  }, []);

  // 중복 없는 시도 목록
  const uniqueSidos = useMemo(() => {
    return Array.from(new Set(regions.map((region) => region.sido)));
  }, [regions]);

  // 선택된 시도에 해당하는 시군구 목록
  const filteredGuGuns = useMemo(() => {
    return regions.filter(
      (region) => region.sido === selectedSido && region.guGun
    );
  }, [regions, selectedSido]);

  const handleSidoClick = (sido: string) => {
    // 이미 선택된 시도를 다시 클릭하면 비활성화
    if (selectedSido === sido) {
      setSelectedSido("");
    } else {
      // 새로운 시도 선택
      setSelectedSido(sido);
    }
  };

  const handleGuGunClick = (regionCode: number) => {
    router.push(`/community/${regionCode}`);
  };

  return (
    <div>
      <div className={styles["regionr-navigation"]}>
        {uniqueSidos.map((sido) => (
          <button
            key={sido}
            onClick={() => handleSidoClick(sido)}
            className={selectedSido === sido ? styles["region-active"] : ""}
          >
            {sido}
          </button>
        ))}
      </div>

      {/* selectedSido가 있을 때만 구군 버튼들이 표시됨 */}
      {selectedSido && (
        <div className={styles["region-gu-gun-links-container"]}>
          {filteredGuGuns.map((region, index) => (
            <span key={region.regionCode}>
              <a
                href={`/community/${region.regionCode}`}
                className={styles["region-gu-gun-link"]}
              >
                {region.guGun}
              </a>
              {index < filteredGuGuns.length - 1 && (
                <span className={styles["region-gu-gun-separator"]}>|</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
