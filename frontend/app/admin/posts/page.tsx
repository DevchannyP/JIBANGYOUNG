"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../AdminPage.module.css";

import { AdminRegionTab } from "../components/AdminRegionTab";
import { SearchBar } from "../components/AdminSearch";
import AdminSidebar from "../components/AdminSidebar";
import { AdminPostList } from "./components/AdminPostList";
import { AdminPost } from "@/types/api/adminPost";
import { featchAllPost } from "@/libs/api/admin/admin.api";

export default function PostPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [searchResult, setSearchResult] = useState<AdminPost[]>([]);
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 최초 게시글 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await featchAllPost();
        setPosts(data);
        setSearchResult(data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  // 공통 필터 함수
  const filterData = (regionCode: number, keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();

    const filtered = posts.filter((p) => {
      const matchRegion = regionCode === 0 || p.region_id === regionCode;

      const matchKeyword =
        trimmed === "" ||
        p.title.toLowerCase().includes(trimmed) ||
        p.id.toString().includes(trimmed) ||
        p.created_at.toLowerCase().includes(trimmed);

      return matchRegion && matchKeyword;
    });

    setSearchResult(filtered);
  };

  // 지역 변경 핸들러
  const handleRegionChange = (region: string, code: number) => {
    setSelectedRegionCode(code);
    filterData(code, searchKeyword);
  };

  // 검색어 입력 핸들러
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    filterData(selectedRegionCode, keyword);
  };

  return (
    <div className={styles.adminContent}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.title}>게시글 목록</h1>

        <AdminRegionTab
          selectedRegionCode={selectedRegionCode}
          onSelectRegion={handleRegionChange}
        />

        <SearchBar placeholder="제목 검색" onSearch={handleSearch} />

        <AdminPostList
          posts={searchResult}
          setPosts={setPosts}
          setSearchResult={setSearchResult}
          fullData={posts}
        />
      </div>
    </div>
  );
}
