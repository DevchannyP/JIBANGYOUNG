import { AdminRegionTab } from "@/app/admin/components/AdminRegionTab";
import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useAdminRegion } from "@/app/admin/hooks/useAdminRegion";
import { fetchAdMentorLogList } from "@/libs/api/admin/adminMentor.api";
import { AdMentorLogList } from "@/types/api/adMentorLogList";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "../MentorStats.module.css";
import { MentorStatsCard } from "./MentorStatsCard";

const MENTOR_ROLES = ["MENTOR_A", "MENTOR_B", "MENTOR_C"];

export function MentorStatsList() {
  const [logs, setLogs] = useState<AdMentorLogList[]>([]);
  const [searchResult, setSearchResult] = useState<AdMentorLogList[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<number>(0);
  const ITEMS_PER_PAGE = 10;

  // 전체 지역 목록
  const { regionOptions: allRegionOptions } = useAdminRegion();

  // logs/searchResult에 등장하는 지역만 추출
  const regionIdsInStats = useMemo(
    () => Array.from(new Set(logs.map((l) => l.regionId))),
    [logs]
  );

  // 담당 지역만 노출할 옵션 + '전체' 탭 추가
  const filteredRegionOptions = [
    { code: 0, name: "전체" },
    ...allRegionOptions.filter((opt) => regionIdsInStats.includes(opt.code)),
  ];

  // regionId → 지역명 매핑 함수
  const regionCodeToName = useCallback(
    (code: number) => {
      const found = allRegionOptions.find((r) => r.code === code);
      return found ? found.name : String(code);
    },
    [allRegionOptions]
  );

  // API 연동
  useEffect(() => {
    fetchAdMentorLogList()
      .then((data: AdMentorLogList[]) => {
        setLogs(data);
        setSearchResult(data);
      })
      .catch((e) => {
        alert(
          e?.response?.data?.message || e?.message || "멘토 활동 통계 조회 실패"
        );
        setLogs([]);
        setSearchResult([]);
      });
  }, [allRegionOptions]);

  // 지역 필터
  const handleSelectRegion = useCallback(
    (_regionName: string, regionId: number) => {
      setSelectedRegion(regionId);
      setCurrentPage(1);
      let filtered =
        regionId === 0 ? logs : logs.filter((l) => l.regionId === regionId);
      if (searchKeyword.trim()) {
        filtered = filtered.filter(
          (log) =>
            log.role.includes(searchKeyword.trim()) ||
            regionCodeToName(log.regionId).includes(searchKeyword.trim())
        );
      }
      setSearchResult(filtered);
    },
    [logs, searchKeyword, regionCodeToName]
  );

  // 검색 (등급, 지역명)
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      let filtered = selectedRegion
        ? logs.filter((l) => l.regionId === selectedRegion)
        : logs;
      if (keyword.trim()) {
        filtered = filtered.filter(
          (log) =>
            log.role.includes(keyword.trim()) ||
            regionCodeToName(log.regionId).includes(keyword.trim())
        );
      }
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [logs, selectedRegion, regionCodeToName]
  );

  // 지역별 그룹
  const groupedRegions = Array.from(
    new Set(searchResult.map((l) => l.regionId))
  );
  const paginatedRegions = groupedRegions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(groupedRegions.length / ITEMS_PER_PAGE);

  return (
    <div>
      <h1 className={styles.title}>멘토 활동 통계</h1>
      <AdminRegionTab
        regionOptions={filteredRegionOptions} // 담당 지역만!
        selectedRegionCode={selectedRegion}
        onSelectRegion={handleSelectRegion}
      />
      <AdminSearch
        placeholder="멘토 등급/지역명 검색"
        onSearch={handleSearch}
      />
      <div className={styles.statsGrid}>
        {paginatedRegions.length === 0 ? (
          <div style={{ padding: "30px 0", textAlign: "center" }}>
            일치하는 정보가 없습니다.
          </div>
        ) : (
          paginatedRegions.flatMap((regionId) =>
            MENTOR_ROLES.map((role) => {
              const data = searchResult.find(
                (l) => l.regionId === regionId && l.role === role
              );
              return (
                <MentorStatsCard
                  key={`${regionId}-${role}`}
                  log={
                    data ?? {
                      userId: 0,
                      nickname: "",
                      role,
                      roleDescription: "",
                      regionId,
                      noticeCount: 0,
                      postCount: 0,
                      commentCount: 0,
                      approvedCount: 0,
                      ignoredCount: 0,
                      invalidCount: 0,
                      pendingCount: 0,
                      rejectedCount: 0,
                      requestedCount: 0,
                    }
                  }
                  regionName={regionCodeToName(regionId)}
                />
              );
            })
          )
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
