import { AdminPost } from "@/types/api/adminPost";
import { useCallback, useEffect, useState } from "react";
import styles from "../AdminPage.module.css";

import { featchAllPost } from "@/libs/api/admin/admin.api";
import { Pagination } from "../components/Pagination";
import { useAdminRegion } from "../hooks/useAdminRegion";
import { AdminPostRow } from "./AdminPostRow";
import { AdminRegionTab } from "./AdminRegionTab";
import { AdminSearch } from "./AdminSearch";

export function AdminPostList() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [searchResult, setSearchResult] = useState<AdminPost[]>([]);
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 지역 목록 fetch
  const { regionOptions, loading: regionLoading } = useAdminRegion();

  // 최초 게시글 불러오기
  useEffect(() => {
    featchAllPost()
      .then((data) => {
        setPosts(data);
        setSearchResult(data);
      })
      .catch((error) => {
        console.error("게시글 불러오기 실패:", error);
      });
  }, []);

  // 게시글 지역 및 키워드로 필터링하는 함수
  const filterData = useCallback(
    (regionCode: number, keyword: string) => {
      const trimmed = keyword.trim().toLowerCase();
      const filtered = posts.filter((p) => {
        // 게시글의 지역 코드에서 앞 2자리만 추출하여 1000단위로 정규화 (예: 36110 → 36000)
        const codePrefix = Math.floor(p.region_id / 1000) * 1000;

        // 선택된 지역 코드도 동일하게 1000단위로 정규화
        const normalizedRegionCode =
          regionCode === 0 ? 0 : Math.floor(regionCode / 1000) * 1000;

        // 지역 필터: 전체(0)이거나 지역코드 일치 여부 확인
        const matchRegion =
          normalizedRegionCode === 0 || codePrefix === normalizedRegionCode;

        // 키워드 필터: 제목, 작성자ID, 작성일자에 포함 여부
        const matchKeyword =
          trimmed === "" ||
          p.title.toLowerCase().includes(trimmed) ||
          p.nickname.toString().includes(trimmed) ||
          String(p.created_at).toLowerCase().includes(trimmed);

        return matchRegion && matchKeyword;
      });

      // 결과 반영
      setSearchResult(filtered);
      setCurrentPage(1); // 페이지 초기화
    },
    [posts]
  );

  // 지역 변경 핸들러
  const handleRegionChange = useCallback(
    (_region: string, code: number) => {
      setSelectedRegionCode(code);
      filterData(code, searchKeyword);
    },
    [filterData, searchKeyword]
  );

  // 검색어 입력 핸들러
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      filterData(selectedRegionCode, keyword);
    },
    [filterData, selectedRegionCode]
  );

  // 삭제 기능
  const handleDelete = async (id: number) => {
    alert("게시글 삭제 실패");
  };

  // 페이징
  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (regionLoading) return <div>지역 정보 불러오는 중...</div>;

  return (
    <div>
      <h1 className={styles.title}>게시글 목록</h1>

      <AdminRegionTab
        regionOptions={regionOptions}
        selectedRegionCode={selectedRegionCode}
        onSelectRegion={handleRegionChange}
      />

      <AdminSearch placeholder="제목, 작성자 검색" onSearch={handleSearch} />

      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>NO</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일자</th>
              <th>조회수</th>
              <th>좋아요</th>
              <th>지역</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  일치하는 정보가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedData.map((p, index) => (
                <AdminPostRow
                  key={p.id}
                  post={p}
                  index={index}
                  searchResultLength={searchResult.length}
                  currentPage={currentPage}
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  regionOptions={regionOptions}
                  onDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
