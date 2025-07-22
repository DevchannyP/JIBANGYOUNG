"use client";
import { getRegionRanking } from "@/libs/api/region.api";
import { useRegionStore } from "@/store/regionStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import styles from "../styles/RegionRankingSection.module.css";

const REGIONS = [
  "서울",
  "경기도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "강원도",
  "제주도",
];

export default function RegionRankingSection() {
  const { selectedRegion } = useRegionStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    REGIONS.forEach((r) => {
      queryClient.prefetchQuery({
        queryKey: ["regionRanking", r],
        queryFn: () => getRegionRanking(r),
        staleTime: 1000 * 60 * 20,
      });
    });
  }, [queryClient]);

  const { data, isLoading } = useQuery({
    queryKey: ["regionRanking", selectedRegion],
    queryFn: () => getRegionRanking(selectedRegion),
    staleTime: 1000 * 60 * 20,
    enabled: !!selectedRegion,
  });

  return (
    <div className={styles.rankingBox}>
      <h4 className={styles.rankingTitle}>주간 인기글 TOP10</h4>
      <ol className={styles.rankingList}>
        {(isLoading ? Array(10).fill(null) : data || []).map((item, i) =>
          item ? (
            <li key={i}>{item.title}</li>
          ) : (
            <li key={i}>
              <Skeleton height={18} />
            </li>
          )
        )}
      </ol>
    </div>
  );
}
