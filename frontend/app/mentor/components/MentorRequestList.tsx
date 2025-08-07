import { AdminRegionTab } from "@/app/admin/components/AdminRegionTab";
import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useAdminRegion } from "@/app/admin/hooks/useAdminRegion";
import {
  approveMentorRequestFirst,
  approveMentorRequestSecond,
  fetchAdMentorRequestList,
  rejectMentorRequest,
  requestMentorApproval,
} from "@/libs/api/admin/adminMentor.api";
import { AdMentorRequest } from "@/types/api/adMentorRequest";
import { useCallback, useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";
import { MentorRequestModal } from "./MentorRequestModal";
import { MentorRequestRow } from "./MentorRequestRow";

export function MentorRequestList() {
  const [applications, setApplications] = useState<AdMentorRequest[]>([]);
  const [searchResult, setSearchResult] = useState<AdMentorRequest[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<AdMentorRequest | null>(
    null
  );
  const [selectedRegionId, setSelectedRegionId] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const ITEMS_PER_PAGE = 10;

  // 로컬스토리지에서 userRole 가져오기 (초기 1회만)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("auth-store-v2");
        if (raw) {
          const user = JSON.parse(raw)?.state?.user;
          setUserRole(user?.role);
        }
      } catch (e) {
        setUserRole(undefined);
      }
    }
  }, []);

  // 지역탭 옵션 불러오기
  const { regionOptions } = useAdminRegion();

  // 최초 데이터 로드
  useEffect(() => {
    fetchAdMentorRequestList()
      .then((data) => {
        setApplications(data);
        setSearchResult(data);
      })
      .catch((e) => {
        alert(
          e?.response?.data?.message || e?.message || "멘토 신청 목록 조회 실패"
        );
      });
  }, []);

  // 필터 함수
  const filterData = useCallback(
    (regionId: number, keyword: string) => {
      let filtered = applications;
      if (regionId && regionId !== 0) {
        filtered = filtered.filter((app) => app.regionId === regionId);
      }
      if (keyword.trim() !== "") {
        const lowered = keyword.trim().toLowerCase();
        filtered = filtered.filter(
          (app) =>
            app.userName.toLowerCase().includes(lowered) ||
            app.userEmail.toLowerCase().includes(lowered) ||
            (app.reason && app.reason.toLowerCase().includes(lowered)) ||
            (app.status && app.status.toLowerCase().includes(lowered)) ||
            (app.createdAt && app.createdAt.includes(lowered))
        );
      }
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [applications]
  );

  // 지역 변경 핸들러
  const handleRegionChange = useCallback(
    (_region: string, code: number) => {
      setSelectedRegionId(code);
      filterData(code, searchKeyword);
    },
    [filterData, searchKeyword]
  );

  // 검색 핸들러
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      filterData(selectedRegionId, keyword);
    },
    [filterData, selectedRegionId]
  );

  // 1차 승인
  const handleFirstApprove = useCallback((id: number) => {
    approveMentorRequestFirst(id)
      .then(() => {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "FIRST_APPROVED" } : app
          )
        );
        setSearchResult((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "FIRST_APPROVED" } : app
          )
        );
        setSelectedMentor(null);
        alert("1차 승인 처리 완료되었습니다!");
      })
      .catch((e) => {
        alert(
          e?.response?.data?.message ||
            e?.message ||
            "처리 중 오류가 발생했습니다."
        );
      });
  }, []);

  // 2차 승인
  const handleSecondApprove = useCallback((id: number) => {
    approveMentorRequestSecond(id)
      .then(() => {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "SECOND_APPROVED" } : app
          )
        );
        setSearchResult((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "SECOND_APPROVED" } : app
          )
        );
        setSelectedMentor(null);
        alert("2차 승인 처리 완료되었습니다!");
      })
      .catch((e) => {
        alert(
          e?.response?.data?.message ||
            e?.message ||
            "처리 중 오류가 발생했습니다."
        );
      });
  }, []);

  // 반려
  const handleReject = useCallback((id: number) => {
    rejectMentorRequest(id)
      .then(() => {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "REJECTED" } : app
          )
        );
        setSearchResult((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "REJECTED" } : app
          )
        );
        setSelectedMentor(null);
        alert("반려 처리 완료되었습니다!");
      })
      .catch((e) => {
        alert(
          e?.response?.data?.message ||
            e?.message ||
            "처리 중 오류가 발생했습니다."
        );
      });
  }, []);

  // 승인요청
  const handleRequest = useCallback((id: number) => {
    requestMentorApproval(id)
      .then(() => {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "REQUESTED" } : app
          )
        );
        setSearchResult((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "REQUESTED" } : app
          )
        );
        setSelectedMentor(null);
        alert("승인요청 처리 완료되었습니다!");
      })
      .catch((e) => {
        alert(
          e?.response?.data?.message ||
            e?.message ||
            "처리 중 오류가 발생했습니다."
        );
      });
  }, []);

  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>멘토 신청 목록</h1>

      <AdminRegionTab
        regionOptions={regionOptions}
        selectedRegionCode={selectedRegionId}
        onSelectRegion={handleRegionChange}
      />

      <AdminSearch
        placeholder="이름, 이메일, 사유, 상태, 신청일 검색"
        onSearch={handleSearch}
      />

      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>NO</th>
              <th>이름</th>
              <th>이메일</th>
              <th>신청지역</th>
              <th>신청일자</th>
              <th>담당자</th>
              <th>승인여부</th>
              <th>첨부파일</th>
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
              paginatedData.map((app, index) => (
                <MentorRequestRow
                  key={app.id}
                  app={app}
                  index={index + (currentPage - 1) * ITEMS_PER_PAGE}
                  total={searchResult.length}
                  onClick={() => setSelectedMentor(app)}
                  regionOptions={regionOptions}
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

      {selectedMentor && (
        <MentorRequestModal
          data={selectedMentor}
          userRole={userRole}
          onRequest={() => handleRequest(selectedMentor.id)}
          onFirstApprove={() => handleFirstApprove(selectedMentor.id)}
          onSecondApprove={() => handleSecondApprove(selectedMentor.id)}
          onReject={() => handleReject(selectedMentor.id)}
          onClose={() => setSelectedMentor(null)}
        />
      )}
    </div>
  );
}
