// MentorLogList.tsx

import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useAdminRegion } from "@/app/admin/hooks/useAdminRegion";
import { useCallback, useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";
import { MentorLogRow } from "./MentorLogRow";

// 타입 및 더미 데이터 정의
export interface MentorLog {
  id: number;
  level: string;
  region: string;
  postCount: number;
  commentCount: number;
  reportProcessed: number;
}

const dummyMentorLogs: MentorLog[] = [
  {
    id: 2,
    level: "Lv.3.실버멤버",
    region: "서울",
    postCount: 50,
    commentCount: 50,
    reportProcessed: 26,
  },
  {
    id: 1,
    level: "Lv.4.운영자",
    region: "서울",
    postCount: 150,
    commentCount: 150,
    reportProcessed: 268,
  },
];

export function MentorLogList() {
  const [logs, setLogs] = useState<MentorLog[]>([]);
  const [searchResult, setSearchResult] = useState<MentorLog[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState("서울"); // 기본값 예시
  const ITEMS_PER_PAGE = 10;

  // 공통 지역탭 훅 사용
  const { regionOptions, loading: regionLoading } = useAdminRegion();

  useEffect(() => {
    setLogs(dummyMentorLogs);
    setSearchResult(dummyMentorLogs);
  }, []);

  // 지역 선택
  const handleSelectRegion = useCallback(
    (region: string) => {
      setSelectedRegion(region);
      setCurrentPage(1);
      let filtered =
        region === "전체" ? logs : logs.filter((l) => l.region === region);
      if (searchKeyword.trim()) {
        filtered = filtered.filter((log) =>
          log.level.includes(searchKeyword.trim())
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
      let filtered =
        selectedRegion === "전체"
          ? logs
          : logs.filter((l) => l.region === selectedRegion);
      if (keyword.trim()) {
        filtered = filtered.filter((log) => log.level.includes(keyword.trim()));
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

      {/* <AdminRegionTab
        regionOptions={regionOptions}
        selectedRegionCode={selectedRegionCode}
        onSelectRegion={handleSelectRegion}
      /> */}

      <AdminSearch placeholder="등급 검색" onSearch={handleSearch} />
      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>NO</th>
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
                  colSpan={6}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  일치하는 정보가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedData.map((log, idx) => (
                <MentorLogRow
                  key={log.id}
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
