// components/BoardContent.tsx (클라이언트 컴포넌트)
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import styles from "./BoardList.module.css";
import BoardTable from "./BoardTable";
import Pagination from "./Pagination";
import SearchSection from "./SearchSection";

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  category?: string;
}

interface BoardContentProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  regionCode: string;
}

const BoardContent: React.FC<BoardContentProps> = ({
  posts,
  currentPage,
  totalPages,
}) => {
  const router = useRouter();
  const [searchType, setSearchType] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const handleWrite = () => {
    router.push(`/community/${regionCode}/write`);
  };

  const handleSearch = (type: string, query: string) => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("search", query);
      params.set("searchType", type);
    }
    router.push(`/board?${params.toString()}`);
  };

  return (
    <>
      <div className={styles.boardHeader}>
        <h1 className={styles.boardTitle}>게시판</h1>
        <button
          className={styles.writeButton}
          type="button"
          onClick={handleWrite}
        >
          글쓰기
        </button>
      </div>

      <BoardTable posts={posts} />

      <div className={styles.bottomSection}>
        <SearchSection
          searchType={searchType}
          searchQuery={searchQuery}
          onSearchTypeChange={setSearchType}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
};

export default BoardContent;
