import { deletePostById, featchAllPost } from "@/libs/api/admin/admin.api";
import { AdminPost } from "@/types/api/adminPost";
import { useCallback, useEffect, useState } from "react";
import styles from "../AdminPage.module.css";

import { Pagination } from "../components/Pagination";
import { useAdminRegion } from "../hooks/useAdminRegion";
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

  // 공통 필터 함수
  const filterData = useCallback(
    (regionCode: number, keyword: string) => {
      const trimmed = keyword.trim().toLowerCase();
      const filtered = posts.filter((p) => {
        const code2 = Number(String(p.region_id).slice(0, 2));
        const matchRegion = regionCode === 0 || code2 === regionCode;
        const matchKeyword =
          trimmed === "" ||
          p.title.toLowerCase().includes(trimmed) ||
          p.id.toString().includes(trimmed) ||
          String(p.created_at).toLowerCase().includes(trimmed);

        return matchRegion && matchKeyword;
      });

      setSearchResult(filtered);
      setCurrentPage(1);
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
  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deletePostById(id);
        const updated = posts.filter((p) => p.id !== id);
        setPosts(updated);
        filterData(selectedRegionCode, searchKeyword);
        alert("게시글이 삭제되었습니다.");
      } catch (e: any) {
        alert("게시글 삭제 실패: " + e.message);
      }
    },
    [posts, filterData, selectedRegionCode, searchKeyword]
  );

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

      <AdminSearch placeholder="제목 검색" onSearch={handleSearch} />

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
              paginatedData.map((p, index) => {
                const code2 = Number(String(p.region_id).slice(0, 2));
                const regionName =
                  regionOptions.find((opt) => opt.code === code2)?.name ||
                  p.region_id;

                return (
                  <tr key={p.id}>
                    <td>
                      {searchResult.length -
                        ((currentPage - 1) * ITEMS_PER_PAGE + index)}
                    </td>
                    <td>{p.title}</td>
                    <td>{p.user_id}</td>
                    <td>{p.created_at}</td>
                    <td>{p.views}</td>
                    <td>{p.likes}</td>
                    <td>{regionName}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className={styles.deleteBtn}
                      >
                        삭제
                      </button>
                      <a
                        href={`/admin/posts/${p.id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginLeft: "8px" }}
                      >
                        URL
                      </a>
                    </td>
                  </tr>
                );
              })
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
