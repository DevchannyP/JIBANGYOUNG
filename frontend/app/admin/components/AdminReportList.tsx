import { CommonModal } from "@/app/admin/components/AdminModal";
import { AdminReportTab } from "@/app/admin/components/AdminReportTab";
import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import {
  adminApproveOrRejectReport,
  fetchAdminReports,
} from "@/libs/api/admin/admin.api";
//import { changeUserStatus } from "@/libs/api/admin/user.api"; // ✅ 추가!
import {
  Report,
  REPORT_TAB_OPTIONS,
  reportTabToType,
  ReportTabType,
} from "@/types/api/adMentorReport";
import { useCallback, useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";
import { AdminReportListRow } from "./AdminReportListRow";

const USER_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "활성" },
  { value: "DEACTIVATED", label: "비활성" },
  { value: "SUSPENDED", label: "정지" },
  { value: "DELETED", label: "삭제" },
];

export function AdminReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchResult, setSearchResult] = useState<Report[]>([]);
  const [selectedType, setSelectedType] = useState<ReportTabType>("게시글");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userStatus, setUserStatus] = useState("");
  const ITEMS_PER_PAGE = 10;

  // 탭(신고유형) 변경 시마다 fetch (type 전달)
  useEffect(() => {
    fetchAdminReports(reportTabToType[selectedType])
      .then((data) => {
        setReports(data);
        setSearchResult(data);
      })
      .catch((e) => {
        alert(e.message || "신고 목록 조회 실패");
      });
  }, [selectedType]);

  // 신고 row 클릭시, 유저 신고면 상태 셀렉트값 초기화
  useEffect(() => {
    if (selectedReport && selectedReport.targetType === "USER") {
      setUserStatus(selectedReport.targetUserStatus || "ACTIVE");
    }
  }, [selectedReport]);

  // 검색 필터
  const filterData = useCallback(
    (keyword: string) => {
      const trimmed = keyword.trim().toLowerCase();
      let filtered = reports.filter(
        (r) =>
          trimmed === "" ||
          (r.reasonDetail?.toLowerCase().includes(trimmed) ?? false) ||
          (r.reasonCode?.toLowerCase().includes(trimmed) ?? false)
      );
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [reports]
  );

  // 검색 핸들러
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      filterData(keyword);
    },
    [filterData]
  );
  // URL 클릭 핸들러
  const handleUrlClick = useCallback((e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) window.open(url, "_blank");
  }, []);

  // 승인/반려 처리
  const handleChangeStatus = useCallback(
    async (
      reportId: number,
      nextStatus: "APPROVED" | "REJECTED" | "REQUESTED"
    ) => {
      if (!selectedReport) return;
      try {
        await adminApproveOrRejectReport(reportId, nextStatus);
        const data = await fetchAdminReports(reportTabToType[selectedType]);
        setReports(data);
        setSearchResult(data);
        setSelectedReport(null);
        alert("처리 완료되었습니다.");
      } catch (e: any) {
        alert(e.message || "상태 변경 실패");
      }
    },
    [selectedReport, selectedType]
  );

  // 유저 상태 변경 핸들러
  // const handleUserStatusChange = async () => {
  //   if (!selectedReport) return;
  //   try {
  //     await changeUserStatus(selectedReport.targetId, userStatus);
  //     alert("유저 상태가 변경되었습니다.");
  //     setSelectedReport(null);
  //   } catch (e: any) {
  //     alert(e.message || "유저 상태 변경 실패");
  //   }
  // };

  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>신고 목록</h1>
      <AdminReportTab
        selectedType={selectedType}
        onSelectType={setSelectedType}
        tabOptions={REPORT_TAB_OPTIONS}
      />
      <AdminSearch placeholder="사유 검색" onSearch={handleSearch} />
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
                  colSpan={6}
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
                  <div style={{ marginBottom: 12 }}>
                    <b>유저 상태:</b>{" "}
                    <select
                      value={userStatus}
                      onChange={(e) => setUserStatus(e.target.value)}
                      style={{ marginLeft: 8, marginRight: 8 }}
                    >
                      {USER_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {/* <button
                      onClick={handleUserStatusChange}
                      style={{
                        marginLeft: 8,
                        padding: "3px 12px",
                        background: "#0091ff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      저장
                    </button> */}
                  </div>
                )}
                <p>
                  <b>신고유형:</b> {selectedReport.reasonDescription}
                </p>
                <p>
                  <b>담당자:</b> {selectedReport.reviewerName ?? "미지정"}
                </p>
                <p>
                  <b>신고사유:</b>{" "}
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
                      onClick: () =>
                        handleChangeStatus(selectedReport.id, "REQUESTED"),
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
                      onClick: () =>
                        handleChangeStatus(selectedReport.id, "APPROVED"),
                      type: "primary" as const,
                    },
                    {
                      label: "반려",
                      onClick: () =>
                        handleChangeStatus(selectedReport.id, "REJECTED"),
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
