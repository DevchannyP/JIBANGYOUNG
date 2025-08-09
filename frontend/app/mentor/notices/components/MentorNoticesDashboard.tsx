"use client";

import type { MentorNotice } from "@/libs/api/mentor/mentor.api";
import { getMentorNotices } from "@/libs/api/mentor/mentor.api";
import { getRegionsBoard } from "@/libs/api/region.api";
import type { Region } from "@/types/api/region.d";
import { regionFullPath } from "@/components/constants/region-map";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../MentorNotices.module.css";

// HTML 태그를 제거하고 순수 텍스트만 추출하는 함수
const stripHtmlTags = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "") // HTML 태그 제거
    .replace(/&nbsp;/g, " ") // &nbsp; 공백 문자 변환
    .replace(/&amp;/g, "&") // &amp; 변환
    .replace(/&lt;/g, "<") // &lt; 변환
    .replace(/&gt;/g, ">") // &gt; 변환
    .replace(/&quot;/g, '"') // &quot; 변환
    .replace(/&#39;/g, "'") // &#39; 변환
    .trim();
};

// 텍스트를 지정된 길이로 축약하는 함수
const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function MentorNoticesDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [keyword, setKeyword] = useState("");
  const [notices, setNotices] = useState<MentorNotice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 멘토 권한 체크
  const isMentor = user?.role && ['MENTOR_A', 'MENTOR_B', 'MENTOR_C', 'ADMIN'].includes(user.role);

  // 멘토가 아닌 경우 접근 차단
  useEffect(() => {
    if (user && !isMentor) {
      alert("멘토 권한이 필요합니다.");
      router.push("/dashboard");
      return;
    }
  }, [user, isMentor, router]);

  useEffect(() => {
    if (!user || !isMentor) return;
    
    const fetchRegions = async () => {
      try {
        const regionData = await getRegionsBoard();
        setRegions(regionData);
      } catch (error) {
        console.error("지역 목록을 불러오지 못했습니다:", error);
      }
    };
    fetchRegions();
  }, [user, isMentor]);

  useEffect(() => {
    if (!user || !isMentor) return;
    fetchNotices();
  }, [selectedRegion, currentPage, user, isMentor]);

  const fetchNotices = async () => {
    if (!user || !isMentor) return;
    
    setLoading(true);
    try {
      const response = await getMentorNotices(
        selectedRegion ? Number(selectedRegion) : undefined,
        currentPage,
        10,
        keyword
      );
      setNotices(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("멘토 공지를 불러오지 못했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchNotices();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNoticeClick = (noticeId: number) => {
    router.push(`/mentor/notices/${noticeId}`);
  };

  const handleWriteClick = () => {
    const regionParam = selectedRegion ? `?regionId=${selectedRegion}` : "";
    router.push(`/mentor/notices/write${regionParam}`);
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 권한 체크 - 로딩 중이거나 멘토가 아닌 경우
  if (!user) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>로그인이 필요합니다.</div>;
  }

  if (!isMentor) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>멘토 권한이 필요합니다.</div>;
  }

  return (
    <div>
      {/* 검색 영역 */}
      <div className={styles.searchContainer}>
        <select
          title="지역 선택"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className={styles.regionSelect}
        >
          <option value="">전체 지역</option>
          {regions.map((region) => (
            <option key={region.regionCode} value={region.regionCode}>
              {region.regionCode === "99999" ? "전국" : regionFullPath(region.regionCode)}
            </option>
          ))}
        </select>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className={styles.searchInput}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            검색
          </button>
        </div>

        <button onClick={handleWriteClick} className={styles.writeButton}>
          글쓰기
        </button>
      </div>

      {/* 공지 목록 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>로딩 중...</div>
      ) : (
        <>
          <div className={styles.noticeGrid}>
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={styles.noticeCard}
                onClick={() => handleNoticeClick(notice.id)}
              >
                <div className={styles.commentIcon}>
                  <span>💬</span>
                </div>

                <h3 className={styles.noticeTitle}>{notice.title}</h3>

                <div className={styles.noticeInfo}>
                  <span className={styles.regionBadge}>
                    {notice.regionCode === "99999" ? "전국" : regionFullPath(notice.regionCode)}
                  </span>
                  <span>📅 {notice.createdAt}</span>
                  <span>💬</span>
                </div>

                <div className={styles.noticeContent}>
                  {truncateText(stripHtmlTags(notice.content), 40)}
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              &lt;
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
