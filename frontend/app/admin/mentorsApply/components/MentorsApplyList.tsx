"use client";

import { useState } from "react";
import styles from "../../AdminPage.module.css";
import { DownloadButton } from "../../components/AdminDownBtn";
import { CommonModal } from "../../components/AdminModal";
import { Pagination } from "../../components/Pagination";

interface MentorApply {
  no: number;
  name: string;
  email: string;
  reason: string;
  region: string;
  regionCode: number; // ✅ 선택적 속성으로 확장 (optional)
  date: string;
  status: string;
  fileUrl: string;
}

interface MentorApplyListProps {
  applications: MentorApply[];
  setApplications: React.Dispatch<React.SetStateAction<MentorApply[]>>;
  setSearchResult: React.Dispatch<React.SetStateAction<MentorApply[]>>;
}

export function MentorApplyList({
  applications,
  setApplications,
  setSearchResult,
}: MentorApplyListProps) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState<MentorApply | null>(
    null
  );

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);

  const paginatedData = applications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const updateStatus = (no: number, status: string) => {
    const updated = applications.map((app) =>
      app.no === no ? { ...app, status } : app
    );
    setApplications(updated);
    setSearchResult(updated);
    setSelectedMentor(null);
  };

  return (
    <div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>NO</th>
            <th>이름</th>
            <th>이메일</th>
            <th>신청사유</th>
            <th>지역</th>
            <th>신청일시</th>
            <th>승인여부</th>
            <th>첨부파일</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                일치하는 정보가 없습니다.
              </td>
            </tr>
          ) : (
            paginatedData.map((app, index) => (
              <tr
                key={app.no}
                onClick={() => setSelectedMentor(app)}
                style={{ cursor: "pointer" }}
              >
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td>{app.reason.slice(0, 15)}...</td>
                <td>{app.region}</td>
                <td>{app.date}</td>
                <td>{app.status}</td>
                <td>
                  <DownloadButton fileUrl={app.fileUrl} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {selectedMentor && (
        <CommonModal
          title="멘토 신청 상세"
          content={
            <div>
              <p>
                <b>이름:</b> {selectedMentor.name}
              </p>
              <p>
                <b>이메일:</b> {selectedMentor.email}
              </p>
              <p>
                <b>지역:</b> {selectedMentor.region}
              </p>
              <p>
                <b>신청일:</b> {selectedMentor.date}
              </p>
              <p>
                <b>신청사유:</b>
              </p>
              <textarea
                value={selectedMentor.reason}
                readOnly
                style={{ width: "100%", height: "100px" }}
              />
            </div>
          }
          buttons={[
            {
              label: "승인",
              onClick: () => updateStatus(selectedMentor.no, "승인됨"),
              type: "primary",
            },
            {
              label: "거절",
              onClick: () => updateStatus(selectedMentor.no, "거절됨"),
              type: "danger",
            },
          ]}
          onClose={() => setSelectedMentor(null)}
        />
      )}
    </div>
  );
}
