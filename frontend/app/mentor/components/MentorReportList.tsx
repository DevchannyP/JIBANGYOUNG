import { CommonModal } from "@/app/admin/components/AdminModal";
import { AdminReportTab } from "@/app/admin/components/AdminReportTab";
import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import {
  fetchMentorReports,
  requestReportApproval,
} from "@/libs/api/admin/adminMentor.api";
import {
  REPORT_TAB_OPTIONS,
  Report,
  ReportTabType,
  reportTabToType,
} from "@/types/api/adMentorReport";
import { useCallback, useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";
import { MentorReportListRow } from "./MentorReportListRow";

export function MentorReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchResult, setSearchResult] = useState<Report[]>([]);
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const [selectedType, setSelectedType] = useState<ReportTabType>("게시글");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const ITEMS_PER_PAGE = 10;

  // r유저 role 가져오기 (localStorage)
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

  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr.replace("T", " ").slice(0, 10);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  useEffect(() => {
    fetchMentorReports(reportTabToType[selectedType])
      .then((data) => {
        setReports(data);
        setSearchResult(data);
      })
      .catch((e) => {
        alert(e.message || "신고 목록 조회 실패");
      });
  }, [selectedType]);

  const filterData = useCallback(
    (regionCode: number, keyword: string) => {
      const trimmed = keyword.trim().toLowerCase();
      let filtered = reports.filter((r) => {
        const matchRegion = regionCode === 0 || r.regionId === regionCode;
        const matchKeyword =
          trimmed === "" ||
          (r.reasonDetail?.toLowerCase().includes(trimmed) ?? false) ||
          (r.reasonCode?.toLowerCase().includes(trimmed) ?? false);
        return matchRegion && matchKeyword;
      });
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [reports]
  );

  const handleRegionChange = useCallback(
    (_region: string, code: number) => {
      setSelectedRegionCode(code);
      filterData(code, searchKeyword);
    },
    [filterData, searchKeyword]
  );

  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      filterData(selectedRegionCode, keyword);
    },
    [filterData, selectedRegionCode]
  );

  const handleUrlClick = useCallback((e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) window.open(url, "_blank");
  }, []);

  const handleChangeStatus = useCallback(
    async (
      reportId: number,
      nextStatus: "REQUESTED" | "IGNORED" | "INVALID" | "PENDING"
    ) => {
      if (!selectedReport) return;
      try {
        await requestReportApproval(reportId, nextStatus as any);
        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId ? { ...r, reviewResultCode: nextStatus } : r
          )
        );
        setSearchResult((prev) =>
          prev.map((r) =>
            r.id === reportId ? { ...r, reviewResultCode: nextStatus } : r
          )
        );
        setSelectedReport(null);

        const data = await fetchMentorReports(reportTabToType[selectedType]);
        setReports(data);
        setSearchResult(data);
        alert("처리 완료되었습니다.");
      } catch (e: any) {
        alert(e.message || "상태 변경 실패");
      }
    },
    [selectedReport, selectedType]
  );

  // 버튼 role별 분기 함수
  function getModalButtons(
    selectedReport: Report,
    userRole: string | undefined
  ) {
    if (!userRole) return [];
    if (userRole === "MENTOR_C") {
      return [
        {
          label: "닫기",
          onClick: () => setSelectedReport(null),
          type: "secondary" as const,
        },
      ];
    }
    if (userRole === "MENTOR_B") {
      if (selectedReport.reviewResultCode === "PENDING") {
        return [
          {
            label: "무시",
            onClick: () => handleChangeStatus(selectedReport.id, "IGNORED"),
            type: "secondary" as const,
          },
          {
            label: "무효",
            onClick: () => handleChangeStatus(selectedReport.id, "INVALID"),
            type: "danger" as const,
          },
          {
            label: "닫기",
            onClick: () => setSelectedReport(null),
            type: "secondary" as const,
          },
        ];
      }
      return [
        {
          label: "닫기",
          onClick: () => setSelectedReport(null),
          type: "secondary" as const,
        },
      ];
    }
    // MENTOR_A (전부 허용)
    return [
      ...(["PENDING", "IGNORED", "INVALID"].includes(
        selectedReport.reviewResultCode
      )
        ? [
            {
              label: "승인 요청",
              onClick: () => handleChangeStatus(selectedReport.id, "REQUESTED"),
              type: "primary" as const,
            },
          ]
        : []),
      ...(selectedReport.reviewResultCode === "PENDING"
        ? [
            {
              label: "무시",
              onClick: () => handleChangeStatus(selectedReport.id, "IGNORED"),
              type: "secondary" as const,
            },
            {
              label: "무효",
              onClick: () => handleChangeStatus(selectedReport.id, "INVALID"),
              type: "danger" as const,
            },
          ]
        : []),
      ...(["IGNORED", "INVALID"].includes(selectedReport.reviewResultCode)
        ? [
            {
              label: "검토중",
              onClick: () => handleChangeStatus(selectedReport.id, "PENDING"),
              type: "secondary" as const,
            },
          ]
        : []),
      ...(selectedReport.reviewResultCode === "REQUESTED"
        ? [
            {
              label: "승인요청 취소",
              onClick: () => handleChangeStatus(selectedReport.id, "PENDING"),
              type: "danger" as const,
            },
          ]
        : []),
      {
        label: "닫기",
        onClick: () => setSelectedReport(null),
        type: "secondary" as const,
      },
    ];
  }

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
        tabOptions={REPORT_TAB_OPTIONS.filter((opt) => opt !== "유저")}
      />
      <AdminSearch placeholder="제목/사유 검색" onSearch={handleSearch} />
      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>NO</th>
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
                <MentorReportListRow
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
                  <b>신고유형:</b> {selectedReport.reasonDescription}
                </p>
                <p>
                  <b>신고일:</b> {formatDate(selectedReport.createdAt)}
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
            buttons={getModalButtons(selectedReport, userRole)}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </div>
    </div>
  );
}
