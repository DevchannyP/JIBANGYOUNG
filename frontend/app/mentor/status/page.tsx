"use client";

import { useState } from "react";
import { SearchBar } from "@/app/admin/components/AdminSearch";
import styles from "../../admin/AdminPage.module.css";
import MentorSidebar from "../components/MentorSidebar";
import StatusList from "./components/statusList";

export interface Status {
  no: number;
  name: string;
  id: string;
  grade: string;
  email: string;
  phone: string;
  activityScore: number;
  status: "정상" | "경고" | "차단";
}

// 초기 데이터 (샘플)
const initialStatus: Status[] = [
  {
    no: 2,
    name: "종철동",
    id: "TEST01",
    grade: "회원",
    email: "abv@naver.com",
    phone: "010-****-8860",
    activityScore: -5,
    status: "정상",
  },
  {
    no: 1,
    name: "김철수",
    id: "TEST02",
    grade: "멘토",
    email: "kim@naver.com",
    phone: "010-****-1234",
    activityScore: 10,
    status: "경고",
  },
];

export default function StatusPage() {
  const [status, setStatus] = useState<Status[]>(initialStatus);
  const [searchResult, setSearchResult] = useState<Status[]>(initialStatus);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 필터링 함수
  const filterData = (keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();

    const filtered = status.filter((r) => {
      return (
        r.name.toLowerCase().includes(trimmed) ||
        r.id.toLowerCase().includes(trimmed) ||
        r.email.toLowerCase().includes(trimmed) ||
        r.phone.toLowerCase().includes(trimmed)
      );
    });

    setSearchResult(filtered);
  };

  // 검색 핸들러
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    filterData(keyword);
  };

  return (
    <div className={styles.adminContent}>
      <MentorSidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.title}>유저 상태 제어</h1>

        <SearchBar
          placeholder="이름, ID, 이메일, 전화번호 검색"
          onSearch={handleSearch}
        />

        <StatusList data={searchResult} />
      </div>
    </div>
  );
}
