"use client";

import { useState } from "react";
import styles from "../../AdminPage.module.css";
import { Pagination } from "../../components/Pagination";

interface Post {
  no: number;
  title: string;
  writer: string;
  date: string;
  url: string;
  region: string;
  regionCode: number;
}

interface AdminPostListProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setSearchResult: React.Dispatch<React.SetStateAction<Post[]>>;
  fullData: Post[];
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

  const handleDelete = (no: number) => {
    const updated = fullData.filter((p) => p.no !== no);
    setPosts(updated);
    setSearchResult(updated);
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
            <th>권한</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                일치하는 정보가 없습니다.
              </td>
            </tr>
          ) : (
            paginatedData.map((p, index) => (
              <tr key={p.no}>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td>{p.title}</td>
                <td>{p.writer}</td>
                <td>{p.date}</td>
                <td>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkBtn}
                  >
                    🔗
                  </a>
                  <button
                    onClick={() => handleDelete(p.no)}
                    className={styles.deleteBtn}
                  >
                    삭제
                  </button>
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
