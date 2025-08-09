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
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [currentNickname, setCurrentNickname] = useState<string | undefined>();
  const ITEMS_PER_PAGE = 10;

  // 전체 지역 옵션
  const { regionOptions: allRegionOptions } = useAdminRegion();

  // 로컬스토리지에서 로그인 유저 역할/닉네임
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("auth-store-v2");
        if (raw) {
          const user = JSON.parse(raw)?.state?.user;
          setUserRole(user?.role);
          setCurrentNickname(user?.nickname);
        }
      } catch {
        setUserRole(undefined);
        setCurrentNickname(undefined);
      }
    }
  }, []);

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

  // 데이터에 등장하는 regionId만 추출 (중복 제거)
  const availableRegionIds = useMemo(
    () => Array.from(new Set(applications.map((a) => a.regionId))),
    [applications]
  );

  // ✅ 전체 옵션 중 등장한 지역만 + '전체' 탭
  const filteredRegionOptions = useMemo(
    () => [
      { code: 0, name: "전체" },
      ...allRegionOptions.filter((opt) =>
        availableRegionIds.includes(opt.code)
      ),
    ],
    [allRegionOptions, availableRegionIds]
  );

  // ✅ 옵션 변경/초기 로드 때 선택된 탭 유효성 보정 + 필터 재적용
  useEffect(() => {
    if (filteredRegionOptions.length === 0) return;
    const stillValid = filteredRegionOptions.some(
      (o) => o.code === selectedRegionId
    );
    const nextCode = stillValid
      ? selectedRegionId
      : filteredRegionOptions[0].code;
    if (nextCode !== selectedRegionId) setSelectedRegionId(nextCode);
    filterData(nextCode, searchKeyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRegionOptions]);

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
            (app.createdAt && app.createdAt.toLowerCase().includes(lowered))
        );
      }
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [applications]
  );

  // 공통 패처: 한 행만 부분 업데이트 (applications + searchResult 동시 갱신)
  const patchRow = useCallback(
    (id: number, patch: Partial<AdMentorRequest>) => {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, ...patch } : app))
      );
      setSearchResult((prev) =>
        prev.map((app) => (app.id === id ? { ...app, ...patch } : app))
      );
    },
    []
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
  const handleFirstApprove = useCallback(
    (id: number) => {
      approveMentorRequestFirst(id)
        .then(() => {
          patchRow(id, {
            status: "FIRST_APPROVED",
            nickname: currentNickname ?? null,
          });
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
    },
    [patchRow, currentNickname]
  );

  // 2차 승인
  const handleSecondApprove = useCallback(
    (id: number) => {
      approveMentorRequestSecond(id)
        .then(() => {
          patchRow(id, {
            status: "SECOND_APPROVED",
            nickname: currentNickname ?? null,
          });
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
    },
    [patchRow, currentNickname]
  );

  // 반려
  const handleReject = useCallback(
    (id: number, reason: string) => {
      const trimmed = reason.trim();
      if (!trimmed) {
        alert("반려 사유를 입력해 주세요.");
        return;
      }

      rejectMentorRequest(id, trimmed)
        .then(() => {
          patchRow(id, {
            status: "REJECTED",
            nickname: currentNickname ?? null,
            rejectionReason: trimmed,
          });
          setSelectedMentor(null);
          alert("반려 처리 완료되었습니다!");
        })
        .catch((e) => {
          alert(
            e?.response?.data?.message ||
              e?.message ||
              "반려 처리 중 오류가 발생했습니다."
          );
        });
    },
    [patchRow, currentNickname]
  );

  // 승인요청
  const handleRequest = useCallback(
    (id: number) => {
      requestMentorApproval(id)
        .then(() => {
          patchRow(id, {
            status: "REQUESTED",
            nickname: currentNickname ?? null,
          });
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
    },
    [patchRow, currentNickname]
  );

  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>멘토 신청 목록</h1>

      <AdminRegionTab
        regionOptions={filteredRegionOptions}
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
              <th>ID</th>
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
                  regionOptions={filteredRegionOptions}
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
          onReject={(reason) => handleReject(selectedMentor.id, reason)}
          onClose={() => setSelectedMentor(null)}
          regionOptions={filteredRegionOptions}
        />
      )}
    </div>
  );
}
