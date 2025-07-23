"use client";

import { useState } from "react";
import styles from "../../AdminPage.module.css";
import { Pagination } from "../../components/Pagination";
import { AdminPost } from "@/types/api/adminPost";
import { deletePostById } from "@/libs/api/admin/admin.api";

interface AdminPostListProps {
  posts: AdminPost[];
  setPosts: React.Dispatch<React.SetStateAction<AdminPost[]>>;
  setSearchResult: React.Dispatch<React.SetStateAction<AdminPost[]>>;
  fullData: AdminPost[];
}

export function AdminPostList({
  posts,
  setPosts,
  setSearchResult,
  fullData,
}: AdminPostListProps) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

  const paginatedData = posts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePostById(id);
      const updated = fullData.filter((p) => p.id !== id);
      setPosts(updated);
      setSearchResult(updated);
    } catch (e: any) {
      alert("게시글 삭제 실패: " + e.message);
    }
  };

  return (
    <div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>NO</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일자</th>
            <th>조회수</th>
            <th>좋아요</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                일치하는 정보가 없습니다.
              </td>
            </tr>
          ) : (
            paginatedData.map((p, index) => (
              <tr key={p.id}>
                <td>
                  {posts.length - ((currentPage - 1) * ITEMS_PER_PAGE + index)}
                </td>
                <td>{p.title}</td>
                <td>{p.user_id}</td>
                <td>{p.created_at}</td>
                <td>{p.views}</td>
                <td>{p.likes}</td>
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
                  >
                    URL
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
