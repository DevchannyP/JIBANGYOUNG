import { CommonModal } from "@/app/admin/components/AdminModal";
import { AdminReportTab } from "@/app/admin/components/AdminReportTab";
import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import {
  fetchMentorReports,
  requestReportApproval,
} from "@/libs/api/admin/adminMentor.api";
import {
  Report,
  ReportTabType,
  reportTabToType, // 변환 맵은 타입 파일에서 import!
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
  const ITEMS_PER_PAGE = 10;

  // 신고내역 fetch
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

  // 통합 필터
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

  // 지역 필터 핸들러
  const handleRegionChange = useCallback(
    (_region: string, code: number) => {
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

  // 상태 변경(승인요청, 무시, 무효) 공통 핸들러
  const handleChangeStatus = useCallback(
    async (
      reportId: number,
      nextStatus: "REQUESTED" | "IGNORED" | "INVALID"
    ) => {
      if (!selectedReport) return;
      try {
        // 서버 반영 (userId 필요 시 넘겨줌)
        await requestReportApproval(reportId, nextStatus);

        // 프론트 상태 동기화
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
      } catch (e: any) {
        alert(e.message || "상태 변경 실패");
      }
    },
    [selectedReport]
  );

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
                  <b>신고유형:</b> {selectedReport.targetType}
                </p>
                <p>
                  <b>신고일:</b> {selectedReport.createdAt}
                </p>
                <p>
                  <b>상태:</b> {selectedReport.reviewResultCode}
                </p>
                <p>
                  <b>신고사유:</b>{" "}
                  {selectedReport.reasonDetail ?? selectedReport.reasonCode}
                </p>
                <textarea
                  value={selectedReport.reasonDetail ?? ""}
                  readOnly
                  style={{ width: "100%", height: "100px" }}
                />
              </div>
            }
            buttons={[
              ...(selectedReport.reviewResultCode === "PENDING"
                ? [
                    {
                      label: "승인 요청",
                      onClick: () =>
                        handleChangeStatus(selectedReport.id, "REQUESTED"),
                      type: "primary" as const,
                    },
                    {
                      label: "무시",
                      onClick: () =>
                        handleChangeStatus(selectedReport.id, "IGNORED"),
                      type: "secondary" as const,
                    },
                    {
                      label: "무효",
                      onClick: () =>
                        handleChangeStatus(selectedReport.id, "INVALID"),
                      type: "danger" as const,
                    },
                  ]
                : []),
              {
                label: "닫기",
                onClick: () => setSelectedReport(null),
                type: "secondary" as const,
              },
            ]}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </div>
    </div>
  );
}
