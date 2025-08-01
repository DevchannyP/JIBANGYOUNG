import { AdminRegionTab } from "@/app/admin/components/AdminRegionTab";
import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useAdminRegion } from "@/app/admin/hooks/useAdminRegion";
import { fetchAdMentorLogList } from "@/libs/api/admin/admin.api";
import { AdMentorLogList } from "@/types/api/adMentorLogList";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "../../admin/AdminPage.module.css";
import { MentorLogRow } from "./MentorLogRow";

export function MentorLogList() {
  const [logs, setLogs] = useState<AdMentorLogList[]>([]);
  const [searchResult, setSearchResult] = useState<AdMentorLogList[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<number>(0);
  const ITEMS_PER_PAGE = 10;

  // 지역 옵션 가져오기
  const { regionOptions, loading: regionLoading } = useAdminRegion();

  // 1. 활동로그 API 데이터 가져오기
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

  // 2. 지역코드→지역명 매핑 함수 (for 리스트)
  const regionCodeToName = useMemo(() => {
    const map = new Map(regionOptions.map((r) => [r.code, r.name]));
    return (code: number) => map.get(code) ?? String(code);
  }, [regionOptions]);

  // 3. 지역 탭 선택 필터링
  const handleSelectRegion = useCallback(
    (regionName: string, regionId: number) => {
      setSelectedRegion(regionId);
      setCurrentPage(1);
      let filtered =
        regionId === 0 ? logs : logs.filter((l) => l.regionId === regionId);
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

  // 4. 검색
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

  // 5. 페이지네이션
  const goToPage = (page: number) => setCurrentPage(page);

  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>멘토 활동로그</h1>

      <AdminRegionTab
        regionOptions={regionOptions}
        selectedRegionCode={selectedRegion}
        onSelectRegion={handleSelectRegion}
      />

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
                  log={{
                    ...log,
                    // 지역명 추가 (MentorLogRow에서 사용 시)
                    regionName: regionCodeToName(log.regionId),
                  }}
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
