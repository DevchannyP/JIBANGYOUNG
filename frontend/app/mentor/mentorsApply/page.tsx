"use client";

import { useState } from "react";
import styles from "../../admin/AdminPage.module.css";
import MentorSidebar from "../components/MentorSidebar";
import { AdminRegionTab } from "@/app/admin/components/AdminRegionTab";
import { SearchBar } from "@/app/admin/components/AdminSearch";
import { MentorApplyList } from "@/app/admin/mentorsApply/components/MentorsApplyList";

const initialMentorApplications = [
  {
    no: 1,
    name: "홍길동",
    email: "hong1@naver.com",
    reason: "서울에서 멘토를 하고 싶습니다.",
    region: "서울",
    regionCode: 1001,
    date: "2025-07-06",
    status: "대기중",
    fileUrl: "/files/sample1.pdf",
  },
  {
    no: 2,
    name: "김철수",
    email: "kim2@naver.com",
    reason: "경기도에서 멘토를 하고 싶습니다.",
    region: "경기도",
    regionCode: 1002,
    date: "2025-07-07",
    status: "대기중",
    fileUrl: "/files/sample2.pdf",
  },
  {
    no: 3,
    name: "이영희",
    email: "lee3@naver.com",
    reason: "충청북도에서 멘토를 하고 싶습니다.",
    region: "충청북도",
    regionCode: 1003,
    date: "2025-07-08",
    status: "대기중",
    fileUrl: "/files/sample3.pdf",
  },
  {
    no: 4,
    name: "박민수",
    email: "park4@naver.com",
    reason: "충청남도에서 멘토를 하고 싶습니다.",
    region: "충청남도",
    regionCode: 1004,
    date: "2025-07-09",
    status: "대기중",
    fileUrl: "/files/sample4.pdf",
  },
  {
    no: 5,
    name: "최지우",
    email: "choi5@naver.com",
    reason: "전라북도에서 멘토를 하고 싶습니다.",
    region: "전라북도",
    regionCode: 1005,
    date: "2025-07-10",
    status: "대기중",
    fileUrl: "/files/sample5.pdf",
  },
  {
    no: 6,
    name: "한예슬",
    email: "han6@naver.com",
    reason: "전라남도에서 멘토를 하고 싶습니다.",
    region: "전라남도",
    regionCode: 1006,
    date: "2025-07-11",
    status: "대기중",
    fileUrl: "/files/sample6.pdf",
  },
  {
    no: 7,
    name: "정우성",
    email: "jung7@naver.com",
    reason: "경상북도에서 멘토를 하고 싶습니다.",
    region: "경상북도",
    regionCode: 1007,
    date: "2025-07-12",
    status: "대기중",
    fileUrl: "/files/sample7.pdf",
  },
  {
    no: 8,
    name: "고소영",
    email: "ko8@naver.com",
    reason: "경상남도에서 멘토를 하고 싶습니다.",
    region: "경상남도",
    regionCode: 1008,
    date: "2025-07-13",
    status: "대기중",
    fileUrl: "/files/sample8.pdf",
  },
  {
    no: 9,
    name: "이민호",
    email: "lee9@naver.com",
    reason: "강원도에서 멘토를 하고 싶습니다.",
    region: "강원도",
    regionCode: 1009,
    date: "2025-07-14",
    status: "대기중",
    fileUrl: "/files/sample9.pdf",
  },
  {
    no: 10,
    name: "장도윤",
    email: "jang10@naver.com",
    reason: "제주도에서 멘토를 하고 싶습니다.",
    region: "제주도",
    regionCode: 1010,
    date: "2025-07-15",
    status: "대기중",
    fileUrl: "/files/sample10.pdf",
  },
];

export default function MentorApplyPage() {
  const [applications, setApplications] = useState(initialMentorApplications);
  const [searchResult, setSearchResult] = useState(initialMentorApplications);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  const filterData = (regionCode: number, keyword: string) => {
    let filtered = applications;

    if (regionCode !== 0) {
      filtered = filtered.filter((app) => app.regionCode === regionCode);
    }

    if (keyword.trim() !== "") {
      filtered = filtered.filter(
        (app) =>
          app.name.includes(keyword) ||
          app.email.includes(keyword) ||
          app.reason.includes(keyword) ||
          app.date.includes(keyword) ||
          app.status.includes(keyword) ||
          app.region.includes(keyword)
      );
    }

    setSearchResult(filtered);
  };

  const handleRegionChange = (region: string, code: number) => {
    setSelectedRegion(region);
    setSelectedRegionCode(code);
    filterData(code, searchKeyword);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    filterData(selectedRegionCode, keyword);
  };

  return (
    <div className={styles.adminContent}>
      <MentorSidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.title}>멘토 신청 목록</h1>

        <AdminRegionTab
          selectedRegionCode={selectedRegionCode}
          onSelectRegion={handleRegionChange}
        />

        <SearchBar
          placeholder="이름, 이메일, 지역 검색"
          onSearch={handleSearch}
        />

        <MentorApplyList
          applications={searchResult}
          setApplications={setApplications}
          setSearchResult={setSearchResult}
        />
      </div>
    </div>
  );
}
