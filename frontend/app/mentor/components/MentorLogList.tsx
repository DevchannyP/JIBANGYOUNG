import { AdminRegionTab } from "@/app/admin/components/AdminRegionTab";
import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useAdminRegion } from "@/app/admin/hooks/useAdminRegion";
import { fetchAdMentorLogList } from "@/libs/api/admin/adminMentor.api";
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

  // 전체 지역 옵션
  const { regionOptions: allRegionOptions } = useAdminRegion();

  // 활동로그 API 데이터 가져오기
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

  // logs에 등장하는 regionId만 추출 (중복 제거)
  const logRegionIds = useMemo(
    () => Array.from(new Set(logs.map((l) => l.regionId))),
    [logs]
  );

  // 담당 지역만 필터링한 regionOptions + '전체'
  const filteredRegionOptions = [
    { code: 0, name: "전체" },
    ...allRegionOptions.filter((option) => logRegionIds.includes(option.code)),
  ];

  // 지역코드→지역명 매핑 함수
  const regionCodeToName = useMemo(() => {
    const map = new Map(allRegionOptions.map((r) => [r.code, r.name]));
    return (code: number) => map.get(code) ?? String(code);
  }, [allRegionOptions]);

  // 지역 탭 선택 필터링
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

  // 검색
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

  // 페이지네이션
  const goToPage = (page: number) => setCurrentPage(page);

  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>멘토 활동로그</h1>

      {/* 담당 지역만 지역탭에 노출 */}
      <AdminRegionTab
        regionOptions={filteredRegionOptions}
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
                  key={`${log.userId}-${log.regionId}`}
                  log={{
                    ...log,
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
