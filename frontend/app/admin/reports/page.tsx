"use client";

import { useState } from "react";
import styles from "../AdminPage.module.css";
import { AdminRegionTab } from "../components/AdminRegionTab";
import { SearchBar } from "../components/AdminSearch";
import AdminSidebar from "../components/AdminSidebar";
import { AdminReportList } from "./components/AdminReportList";
import { AdminReportTab } from "./components/AdminReportTab";

export interface Report {
  no: number;
  title: string;
  reporter: string;
  date: string;
  count: number;
  status: "blind" | "processing" | "reject";
  region: string;
  regionCode: number;
  url: string;
  reason: string;
  type: "게시글" | "댓글";
}

const initialReports: Report[] = [
  {
    no: 1,
    title: "서울은 너무 사람이 많아 살기 싫어요.",
    reporter: "홍길동",
    date: "2025-07-04",
    count: 15,
    status: "blind",
    region: "서울",
    regionCode: 1001,
    url: "https://example.com/post/1",
    reason: "욕설 및 비방 글로 신고되었습니다.",
    type: "게시글",
  },
  {
    no: 2,
    title: "경기도 교통 너무 막혀요.",
    reporter: "김철수",
    date: "2025-07-05",
    count: 8,
    status: "processing",
    region: "경기도",
    regionCode: 1002,
    url: "https://example.com/post/2",
    reason: "허위 사실 유포로 신고되었습니다.",
    type: "댓글",
  },
  {
    no: 3,
    title: "충청북도 공기 너무 좋아요.",
    reporter: "이영희",
    date: "2025-07-06",
    count: 3,
    status: "reject",
    region: "충청북도",
    regionCode: 1003,
    url: "https://example.com/post/3",
    reason: "단순 의견 표현으로 기각되었습니다.",
    type: "게시글",
  },
  {
    no: 4,
    title: "충청남도 맛집 많아요.",
    reporter: "박철민",
    date: "2025-07-07",
    count: 5,
    status: "processing",
    region: "충청남도",
    regionCode: 1004,
    url: "https://example.com/post/4",
    reason: "상업적 홍보로 신고되었습니다.",
    type: "댓글",
  },
  {
    no: 5,
    title: "전라북도 물가가 저렴해요.",
    reporter: "최지우",
    date: "2025-07-08",
    count: 2,
    status: "blind",
    region: "전라북도",
    regionCode: 1005,
    url: "https://example.com/post/5",
    reason: "지역 비방으로 신고되었습니다.",
    type: "게시글",
  },
  {
    no: 6,
    title: "전라남도는 아름다운 곳이에요.",
    reporter: "한예슬",
    date: "2025-07-09",
    count: 4,
    status: "reject",
    region: "전라남도",
    regionCode: 1006,
    url: "https://example.com/post/6",
    reason: "신고 대상이 아님으로 기각되었습니다.",
    type: "게시글",
  },
  {
    no: 7,
    title: "경상북도는 문화유산이 많아요.",
    reporter: "장도윤",
    date: "2025-07-10",
    count: 7,
    status: "blind",
    region: "경상북도",
    regionCode: 1007,
    url: "https://example.com/post/7",
    reason: "욕설 포함으로 블라인드 처리되었습니다.",
    type: "댓글",
  },
  {
    no: 8,
    title: "경상남도는 살기 좋아요.",
    reporter: "정우성",
    date: "2025-07-11",
    count: 6,
    status: "processing",
    region: "경상남도",
    regionCode: 1008,
    url: "https://example.com/post/8",
    reason: "도배성 게시물로 신고됨.",
    type: "게시글",
  },
  {
    no: 9,
    title: "강원도는 자연이 좋아요.",
    reporter: "고소영",
    date: "2025-07-12",
    count: 9,
    status: "blind",
    region: "강원도",
    regionCode: 1009,
    url: "https://example.com/post/9",
    reason: "허위 정보 유포로 블라인드 처리됨.",
    type: "댓글",
  },
  {
    no: 10,
    title: "제주도는 관광지죠.",
    reporter: "오장군",
    date: "2025-07-13",
    count: 11,
    status: "processing",
    region: "제주도",
    regionCode: 1010,
    url: "https://example.com/post/10",
    reason: "불필요한 중복 게시물 신고됨.",
    type: "게시글",
  },
  {
    no: 11,
    title: "세종시는 행정의 중심입니다.",
    reporter: "이지은",
    date: "2025-07-14",
    count: 1,
    status: "reject",
    region: "세종",
    regionCode: 1011,
    url: "https://example.com/post/11",
    reason: "정상 게시글로 판단되어 기각됨.",
    type: "게시글",
  },
];

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [searchResult, setSearchResult] = useState<Report[]>(initialReports);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const [selectedType, setSelectedType] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");

  const filterData = (regionCode: number, keyword: string, type: string) => {
    let filtered = reports;

    if (regionCode !== 0) {
      filtered = filtered.filter((r) => r.regionCode === regionCode);
    }

    if (keyword.trim() !== "") {
      filtered = filtered.filter((r) =>
        r.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (type !== "전체") {
      filtered = filtered.filter((r) => r.type === type);
      if (type === "게시글") {
        filtered = [...filtered].sort((a, b) => a.no - b.no);
      }
    }

    setSearchResult(filtered);
  };

  const handleRegionChange = (region: string, code: number) => {
    setSelectedRegion(region);
    setSelectedRegionCode(code);
    filterData(code, searchKeyword, selectedType);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    filterData(selectedRegionCode, searchKeyword, type);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    filterData(selectedRegionCode, keyword, selectedType);
  };

  return (
    <div className={styles.adminContent}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.title}>신고 목록</h1>

        <AdminRegionTab
          selectedRegionCode={selectedRegionCode}
          onSelectRegion={handleRegionChange}
        />

        <AdminReportTab
          selectedType={selectedType}
          onSelectType={handleTypeChange}
        />

        <SearchBar placeholder="제목 검색" onSearch={handleSearch} />

        <AdminReportList
          reports={searchResult}
          setReports={setReports}
          setSearchResult={setSearchResult}
          fullData={reports}
        />
      </div>
    </div>
  );
}
