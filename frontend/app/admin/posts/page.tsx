"use client";

import { useState } from "react";
import styles from "../AdminPage.module.css";

import { AdminRegionTab } from "../components/AdminRegionTab";
import { SearchBar } from "../components/AdminSearch";
import AdminSidebar from "../components/AdminSidebar";
import { AdminPostList } from "./components/AdminPostList";

export interface Post {
  no: number;
  title: string;
  writer: string;
  date: string;
  url: string;
  region: string;
  regionCode: number;
}

const initialPosts: Post[] = [
  {
    no: 1,
    title: "[공지] 2025년 청년 주택 지원금 안내문",
    writer: "홍길동",
    date: "2025-07-05",
    url: "/post/1",
    region: "서울",
    regionCode: 1001,
  },
  {
    no: 2,
    title: "서울 정책 아시는분 알려주세요",
    writer: "홍길동",
    date: "2025-07-05",
    url: "/post/2",
    region: "충청북도",
    regionCode: 1003,
  },
  {
    no: 3,
    title: "멘토님에게 문의 어떻게 하나요?",
    writer: "노진구",
    date: "2025-07-05",
    url: "/post/3",
    region: "경기도",
    regionCode: 1002,
  },
  {
    no: 4,
    title: "경기도 청년 복지 정책 정리",
    writer: "이슬기",
    date: "2025-07-06",
    url: "/post/4",
    region: "충청남도",
    regionCode: 1004,
  },
  {
    no: 5,
    title: "충청북도 전입신고 방법 공유",
    writer: "오푸리",
    date: "2025-06-07",
    url: "/post/5",
    region: "전라북도",
    regionCode: 1005,
  },
  {
    no: 6,
    title: "전라남도 관광지 추천 부탁드려요",
    writer: "이다재",
    date: "2025-05-08",
    url: "/post/6",
    region: "전라남도",
    regionCode: 1006,
  },
  {
    no: 7,
    title: "경상북도 문화재 질문 있습니다",
    writer: "가시로",
    date: "2025-04-09",
    url: "/post/7",
    region: "경상북도",
    regionCode: 1007,
  },
  {
    no: 8,
    title: "강원도 취업 지원 정책 소개",
    writer: "임도로",
    date: "2025-02-25",
    url: "/post/8",
    region: "경상남도",
    regionCode: 1008,
  },
  {
    no: 9,
    title: "제주도 렌트카 예약 방법 알려주세요",
    writer: "다리고",
    date: "2025-01-18",
    url: "/post/9",
    region: "강원도",
    regionCode: 1009,
  },
  {
    no: 10,
    title: "세종시 생활 정보 공유해요",
    writer: "오라니",
    date: "2025-07-12",
    url: "/post/10",
    region: "제주도",
    regionCode: 1010,
  },
  {
    no: 11,
    title: "전국 공공임대주택 신청 방법",
    writer: "오라니",
    date: "2025-07-13",
    url: "/post/11",
    region: "세종",
    regionCode: 1011,
  },
];

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchResult, setSearchResult] = useState<Post[]>(initialPosts);
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 공통 필터 함수
  const filterData = (regionCode: number, keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();

    const filtered = posts.filter((p) => {
      const matchRegion = regionCode === 0 || p.regionCode === regionCode;

      const matchKeyword =
        trimmed === "" ||
        p.title.toLowerCase().includes(trimmed) ||
        p.writer.toLowerCase().includes(trimmed) ||
        p.date.toLowerCase().includes(trimmed);

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
