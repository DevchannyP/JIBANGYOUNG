import { CommonModal } from "@/app/admin/components/AdminModal";
import { AdminRegionTab } from "@/app/admin/components/AdminRegionTab"; // ✅ 추가
import { AdminReportTab } from "@/app/admin/components/AdminReportTab";
import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useAdminRegion } from "@/app/admin/hooks/useAdminRegion"; // ✅ 추가
import {
  adminApproveOrRejectReport,
  changeUserStatus,
  fetchAdminReports,
} from "@/libs/api/admin/admin.api";
import {
  Report,
  REPORT_TAB_OPTIONS,
  reportTabToType,
  ReportTabType,
} from "@/types/api/adMentorReport";
import { ChangeUserStatusPayload } from "@/types/api/adminUser";
import { useCallback, useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";
import { AdminReportListRow } from "./AdminReportListRow";
import { AdUserStatusControl } from "./AdUserStatusControl";

// 유효한 상태값으로 변환
const VALID_STATUS = ["ACTIVE", "DEACTIVATED", "SUSPENDED", "DELETED"] as const;
function toValidStatus(status?: string): ChangeUserStatusPayload["status"] {
  return VALID_STATUS.includes(status as any)
    ? (status as ChangeUserStatusPayload["status"])
    : "ACTIVE";
}

export function AdminReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchResult, setSearchResult] = useState<Report[]>([]);
  const [selectedType, setSelectedType] = useState<ReportTabType>("게시글");

  // ✅ 지역 탭 상태/옵션
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const { regionOptions, loading: regionLoading } = useAdminRegion();

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // "유저" 신고 선택 시, select 값 관리
  const [userStatus, setUserStatus] =
    useState<ChangeUserStatusPayload["status"]>("ACTIVE");

  const ITEMS_PER_PAGE = 10;

  // 탭(신고유형) 변경 시마다 fetch (type 전달)
  useEffect(() => {
    fetchAdminReports(reportTabToType[selectedType])
      .then((data) => {
        setReports(data);
        setSearchResult(data);
        // ✅ 탭 변경 시 필터 초기화
        setSelectedRegionCode(0);
        setSearchKeyword("");
        setCurrentPage(1);
      })
      .catch((e) => {
        alert(e.message || "신고 목록 조회 실패");
      });
  }, [selectedType]);

  // 신고 row 클릭 시, userStatus 초기값도 설정
  useEffect(() => {
    if (selectedReport && selectedReport.targetType === "USER") {
      setUserStatus(toValidStatus(selectedReport.targetUserStatus));
    }
  }, [selectedReport]);

  // ✅ 공통 필터 함수 (지역 + 키워드)
  const filterData = useCallback(
    (regionCode: number, keyword: string) => {
      const trimmed = keyword.trim().toLowerCase();

      const filtered = reports.filter((r) => {
        // 지역 정규화(천 단위) — AdminPostList와 동일하게 동작
        // 예: 30123 -> 30000, 30100 선택 시 같은 그룹으로 간주
        const codePrefix =
          typeof r.regionId === "number"
            ? Math.floor(r.regionId / 1000) * 1000
            : 0;
        const normalizedRegionCode =
          regionCode === 0 ? 0 : Math.floor(regionCode / 1000) * 1000;

        const matchRegion =
          normalizedRegionCode === 0 || codePrefix === normalizedRegionCode;

        const matchKeyword =
          trimmed === "" ||
          (r.reasonDetail?.toLowerCase().includes(trimmed) ?? false) ||
          (r.reasonCode?.toLowerCase().includes(trimmed) ?? false) ||
          (r.reasonDescription?.toLowerCase().includes(trimmed) ?? false) ||
          (r.targetTitle?.toLowerCase().includes(trimmed) ?? false) ||
          (r.reviewerName?.toLowerCase().includes(trimmed) ?? false);

        return matchRegion && matchKeyword;
      });

      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [reports]
  );

  // ✅ 지역 탭 핸들러
  const handleRegionChange = useCallback(
    (_regionName: string, code: number) => {
      setSelectedRegionCode(code);
      filterData(code, searchKeyword);
    },
    [filterData, searchKeyword]
  );

  // 검색 핸들러
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      filterData(selectedRegionCode, keyword);
    },
    [filterData, selectedRegionCode]
  );

  // URL 클릭 핸들러
  const handleUrlClick = useCallback((e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) window.open(url, "_blank");
  }, []);

  // 승인(+유저 상태 변경) 처리
  const handleApprove = useCallback(async () => {
    if (!selectedReport) return;
    try {
      if (selectedReport.targetType === "USER") {
        await changeUserStatus(selectedReport.targetId, userStatus);
      }
      await adminApproveOrRejectReport(selectedReport.id, "APPROVED");
      const data = await fetchAdminReports(reportTabToType[selectedType]);
      setReports(data);
      // ✅ 현재 필터 유지 반영
      filterData(selectedRegionCode, searchKeyword);
      setSelectedReport(null);
      alert("유저 상태 변경 및 승인 완료!");
    } catch (e: any) {
      alert(e.message || "승인 처리 실패");
    }
  }, [
    selectedReport,
    userStatus,
    selectedType,
    filterData,
    selectedRegionCode,
    searchKeyword,
  ]);

  // 반려 처리
  const handleReject = useCallback(async () => {
    if (!selectedReport) return;
    try {
      await adminApproveOrRejectReport(selectedReport.id, "REJECTED");
      const data = await fetchAdminReports(reportTabToType[selectedType]);
      setReports(data);
      filterData(selectedRegionCode, searchKeyword); // ✅ 필터 유지
      setSelectedReport(null);
      alert("반려 처리 완료!");
    } catch (e: any) {
      alert(e.message || "반려 처리 실패");
    }
  }, [
    selectedReport,
    selectedType,
    filterData,
    selectedRegionCode,
    searchKeyword,
  ]);

  // 승인취소 처리
  const handleRequest = useCallback(async () => {
    if (!selectedReport) return;
    try {
      await adminApproveOrRejectReport(selectedReport.id, "REQUESTED");
      const data = await fetchAdminReports(reportTabToType[selectedType]);
      setReports(data);
      filterData(selectedRegionCode, searchKeyword); // ✅ 필터 유지
      setSelectedReport(null);
      alert("승인 취소 완료!");
    } catch (e: any) {
      alert(e.message || "승인취소 실패");
    }
  }, [
    selectedReport,
    selectedType,
    filterData,
    selectedRegionCode,
    searchKeyword,
  ]);

  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (regionLoading) return <div>지역 정보 불러오는 중...</div>;

  return (
    <div>
      <h1 className={styles.title}>신고 목록</h1>

      <AdminRegionTab
        regionOptions={regionOptions}
        selectedRegionCode={selectedRegionCode}
        onSelectRegion={handleRegionChange}
      />
      <AdminReportTab
        selectedType={selectedType}
        onSelectType={setSelectedType}
        tabOptions={REPORT_TAB_OPTIONS}
      />
      <AdminSearch
        placeholder="사유/제목/담당자 검색"
        onSearch={handleSearch}
      />

      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>NO</th>
              <th>신고대상</th>
              <th>신고유형</th>
              <th>신고일자</th>
              <th>처리상태</th>
              <th>담당자</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  일치하는 정보가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedData.map((report) => (
                <AdminReportListRow
                  key={report.id}
                  report={report}
                  onClick={() => setSelectedReport(report)}
                  onUrlClick={handleUrlClick}
                />
              ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(searchResult.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />

        {selectedReport && (
          <CommonModal
            title="신고 상세보기"
            content={
              <div>
                <p>
                  <b>신고자:</b>{" "}
                  {selectedReport.reporterName ?? selectedReport.userId}
                </p>
                <p>
                  <b>신고대상:</b> {selectedReport.targetTitle}
                </p>
                {selectedReport.targetType === "USER" && (
                  <AdUserStatusControl
                    value={userStatus}
                    onChange={setUserStatus}
                  />
                )}
                <p>
                  <b>신고유형:</b> {selectedReport.reasonDescription}
                </p>
                <p>
                  <b>담당자:</b> {selectedReport.reviewerName ?? "미지정"}
                </p>
                <p>
                  <b>신고사유:</b>
                </p>
                <textarea
                  value={
                    selectedReport.reasonDetail ??
                    selectedReport.reasonCode ??
                    ""
                  }
                  readOnly
                  style={{ width: "100%", height: "100px" }}
                />
              </div>
            }
            buttons={
              selectedReport.reviewResultCode === "APPROVED"
                ? [
                    {
                      label: "승인취소",
                      onClick: handleRequest,
                      type: "danger" as const,
                    },
                    {
                      label: "닫기",
                      onClick: () => setSelectedReport(null),
                      type: "secondary" as const,
                    },
                  ]
                : [
                    {
                      label: "승인",
                      onClick: handleApprove,
                      type: "primary" as const,
                    },
                    {
                      label: "반려",
                      onClick: handleReject,
                      type: "danger" as const,
                    },
                    {
                      label: "닫기",
                      onClick: () => setSelectedReport(null),
                      type: "secondary" as const,
                    },
                  ]
            }
            onClose={() => setSelectedReport(null)}
          />
        )}
      </div>
    </div>
  );
}
