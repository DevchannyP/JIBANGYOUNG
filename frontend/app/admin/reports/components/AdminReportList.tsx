"use client";

import { useState } from "react";
import styles from "../../AdminPage.module.css";
import { CommonModal } from "../../components/AdminModal";
import { Pagination } from "../../components/Pagination";
import { Report } from "../page";

type ModalButton = {
  label: string;
  onClick: () => void;
  type?: "primary" | "secondary" | "danger";
};

const STATUS_MAP = {
  blind: { label: "블라인드 처리완료", color: "blue" },
  processing: { label: "처리중", color: "gray" },
  reject: { label: "기각처리", color: "goldenrod" },
};

interface AdminReportListProps {
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  setSearchResult: React.Dispatch<React.SetStateAction<Report[]>>;
  fullData: Report[];
}

export function AdminReportList({
  reports,
  setReports,
  setSearchResult,
  fullData,
}: AdminReportListProps) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);

  const paginatedData = reports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleUrlClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  const updateBlind = (no: number, isBlind: boolean) => {
    const updated: Report[] = fullData.map((r) =>
      r.no === no ? { ...r, status: isBlind ? "blind" : "processing" } : r
    );
    setReports(updated);
    setSearchResult(updated);
    setSelectedReport(null);
  };

  const updateStatus = (no: number, status: "reject") => {
    const updated: Report[] = fullData.map((r) =>
      r.no === no ? { ...r, status } : r
    );
    setReports(updated);
    setSearchResult(updated);
    setSelectedReport(null);
  };

  const handleDelete = (report: Report) => {
    let updated: Report[] = [];

    if (report.type === "댓글") {
      updated = fullData.map((r) =>
        r.no === report.no ? { ...r, status: "reject" } : r
      );
    } else {
      updated = fullData.filter((r) => r.no !== report.no);
    }

    setReports(updated);
    setSearchResult(updated);
    setSelectedReport(null);
  };

  return (
    <div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>NO</th>
            <th>제목</th>
            <th>신고일자</th>
            <th>누적 신고수</th>
            <th>처리상태</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                일치하는 정보가 없습니다.
              </td>
            </tr>
          ) : (
            paginatedData.map((report, index) => (
              <tr
                key={report.no}
                onClick={() => setSelectedReport(report)}
                style={{ cursor: "pointer" }}
              >
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td>{report.title}</td>
                <td>{report.date}</td>
                <td>{report.count}</td>
                <td>
                  <span style={{ color: STATUS_MAP[report.status].color }}>
                    • {STATUS_MAP[report.status].label}
                  </span>
                </td>
                <td>
                  <button
                    onClick={(e) => handleUrlClick(e, report.url)}
                    style={{ cursor: "pointer" }}
                  >
                    🔗
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {selectedReport && (
        <CommonModal
          title="신고 상세보기"
          content={
            <div>
              <p>
                <b>제목:</b> {selectedReport.title}
              </p>
              <p>
                <b>신고자:</b> {selectedReport.reporter}
              </p>
              <p>
                <b>신고유형:</b> {selectedReport.type}
              </p>
              <p>
                <b>신고일:</b> {selectedReport.date}
              </p>
              <p>
                <b>누적 신고수:</b> {selectedReport.count}
              </p>
              <p>
                <b>신고사유:</b>
              </p>
              <textarea
                value={selectedReport.reason}
                readOnly
                style={{ width: "100%", height: "100px" }}
              />
            </div>
          }
          buttons={getModalButtons(
            selectedReport,
            updateBlind,
            updateStatus,
            handleDelete
          )}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

function getModalButtons(
  report: Report,
  updateBlind: (no: number, isBlind: boolean) => void,
  updateStatus: (no: number, status: "reject") => void,
  handleDelete: (report: Report) => void
) {
  const buttons: ModalButton[] = [];

  const handleWithAlert = (action: () => void) => {
    action();
    alert("처리완료");
  };

  if (report.status === "blind") {
    buttons.push(
      {
        label: "블라인드 해제",
        onClick: () => handleWithAlert(() => updateBlind(report.no, false)),
        type: "primary",
      },
      {
        label: "삭제",
        onClick: () => handleWithAlert(() => handleDelete(report)),
        type: "danger",
      }
    );
  } else {
    buttons.push(
      {
        label: "블라인드 처리",
        onClick: () => handleWithAlert(() => updateBlind(report.no, true)),
        type: "primary",
      },
      {
        label: "기각처리",
        onClick: () => handleWithAlert(() => updateStatus(report.no, "reject")),
        type: "secondary",
      },
      {
        label: "삭제",
        onClick: () => handleWithAlert(() => handleDelete(report)),
        type: "danger",
      }
    );
  }

  return buttons;
}
