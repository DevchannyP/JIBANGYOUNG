import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useAdminRegion } from "@/app/admin/hooks/useAdminRegion";

import { fetchAdMentorLogList } from "@/libs/api/admin/admin.api";
import { AdMentorLogList } from "@/types/api/adMentorLogList";
import { useCallback, useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";
import { MentorLogRow } from "./MentorLogRow";

// 타입은 서버와 맞게 유지

export function MentorLogList() {
  const [logs, setLogs] = useState<AdMentorLogList[]>([]);
  const [searchResult, setSearchResult] = useState<AdMentorLogList[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // regionId 기준 (지역 코드)
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const ITEMS_PER_PAGE = 10;

  // 공통 지역탭 훅
  const { regionOptions, loading: regionLoading } = useAdminRegion();

  // 1. API 호출하여 데이터 세팅
  useEffect(() => {
    fetchAdMentorLogList()
      .then((data) => {
        setLogs(data);
        setSearchResult(data);
      })
      .catch(() => {
        setLogs([]);
        setSearchResult([]);
      });
  }, []);

  // 2. 지역 필터링
  const handleSelectRegion = useCallback(
    (regionId: number | null) => {
      setSelectedRegion(regionId);
      setCurrentPage(1);
      let filtered = regionId
        ? logs.filter((l) => l.regionId === regionId)
        : logs;
      if (searchKeyword.trim()) {
        filtered = filtered.filter(
          (log) =>
            log.role.includes(searchKeyword.trim()) ||
            log.nickname.includes(searchKeyword.trim())
        );
      }
      setSearchResult(filtered);
    },
    [logs, searchKeyword]
  );

  // 3. 검색
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
            log.nickname.includes(keyword.trim())
        );
      }
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [logs, selectedRegion]
  );

  const goToPage = (page: number) => setCurrentPage(page);

  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>멘토 활동로그</h1>

      {/* 지역 탭 (옵션) */}
      {/* 
      <AdminRegionTab
        regionOptions={regionOptions}
        selectedRegionCode={selectedRegion}
        onSelectRegion={handleSelectRegion}
      />
      */}

      <AdminSearch placeholder="닉네임/등급 검색" onSearch={handleSearch} />
      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>NO</th>
              <th>닉네임</th>
              <th>등급</th>
              <th>지역</th>
              <th>게시글 작성수</th>
              <th>댓글 작성수</th>
              <th>신고 처리완료 건수</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  일치하는 정보가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedData.map((log, idx) => (
                <MentorLogRow
                  key={`${log.id}-${log.regionId}`}
                  log={log}
                  index={idx}
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                />
              ))
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </div>
  );
}
