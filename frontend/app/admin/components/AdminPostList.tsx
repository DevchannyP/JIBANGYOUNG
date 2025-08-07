import { AdminPost } from "@/types/api/adminPost";
import { useCallback, useEffect, useState } from "react";
import styles from "../AdminPage.module.css";

import {
  deleteAdminPost,
  featchAllPost,
  restoreAdminPost,
} from "@/libs/api/admin/admin.api";
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
  const [processingId, setProcessingId] = useState<number | null>(null);

  const { regionOptions, loading: regionLoading } = useAdminRegion();

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

  const filterData = useCallback(
    (regionCode: number, keyword: string) => {
      const trimmed = keyword.trim().toLowerCase();
      const filtered = posts.filter((p) => {
        const codePrefix = Math.floor(p.region_id / 1000) * 1000;
        const normalizedRegionCode =
          regionCode === 0 ? 0 : Math.floor(regionCode / 1000) * 1000;
        const matchRegion =
          normalizedRegionCode === 0 || codePrefix === normalizedRegionCode;
        const matchKeyword =
          trimmed === "" ||
          p.title.toLowerCase().includes(trimmed) ||
          p.nickname.toString().includes(trimmed) ||
          String(p.created_at).toLowerCase().includes(trimmed);
        return matchRegion && matchKeyword;
      });
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [posts]
  );

  const handleRegionChange = useCallback(
    (_region: string, code: number) => {
      setSelectedRegionCode(code);
      filterData(code, searchKeyword);
    },
    [filterData, searchKeyword]
  );

  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      filterData(selectedRegionCode, keyword);
    },
    [filterData, selectedRegionCode]
  );

  // 삭제 기능 (논리삭제)
  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    setProcessingId(id);
    try {
      await deleteAdminPost(id);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, deleted: true } : p))
      );
      setSearchResult((prev) =>
        prev.map((p) => (p.id === id ? { ...p, deleted: true } : p))
      );
      alert("게시글이 삭제되었습니다.");
    } catch (error: any) {
      alert(error.message || "게시글 삭제 실패");
    } finally {
      setProcessingId(null);
    }
  };

  // 복구 기능
  const handleRestore = async (id: number) => {
    if (!window.confirm("정말 이 게시글을 복구하시겠습니까?")) return;
    setProcessingId(id);
    try {
      await restoreAdminPost(id);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, deleted: false } : p))
      );
      setSearchResult((prev) =>
        prev.map((p) => (p.id === id ? { ...p, deleted: false } : p))
      );
      alert("게시글이 복구되었습니다.");
    } catch (error: any) {
      alert(error.message || "게시글 복구 실패");
    } finally {
      setProcessingId(null);
    }
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
                  onRestore={handleRestore}
                  processing={processingId === p.id}
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
