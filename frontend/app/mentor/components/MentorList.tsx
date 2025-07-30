import { DownloadButton } from "@/app/admin/components/AdminDownBtn";
import { CommonModal } from "@/app/admin/components/AdminModal";
import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";

interface MentorApply {
  no: number;
  name: string;
  email: string;
  reason: string;
  region: string;
  regionCode: number;
  date: string;
  status: string;
  fileUrl: string;
}

const initialMentorApplications: MentorApply[] = [
  {
    no: 1,
    name: "홍길동",
    email: "hong1@naver.com",
    reason: "서울에서 멘토를 하고 싶습니다.",
    region: "서울",
    regionCode: 1001,
    date: "2025-07-06",
    status: "대기중",
    fileUrl: "/files/sample1.pdf",
  },
  {
    no: 2,
    name: "김철수",
    email: "kim2@naver.com",
    reason: "경기도에서 멘토를 하고 싶습니다.",
    region: "경기도",
    regionCode: 1002,
    date: "2025-07-07",
    status: "대기중",
    fileUrl: "/files/sample2.pdf",
  },
  {
    no: 3,
    name: "이영희",
    email: "lee3@naver.com",
    reason: "충청북도에서 멘토를 하고 싶습니다.",
    region: "충청북도",
    regionCode: 1003,
    date: "2025-07-08",
    status: "대기중",
    fileUrl: "/files/sample3.pdf",
  },
  {
    no: 4,
    name: "박민수",
    email: "park4@naver.com",
    reason: "충청남도에서 멘토를 하고 싶습니다.",
    region: "충청남도",
    regionCode: 1004,
    date: "2025-07-09",
    status: "대기중",
    fileUrl: "/files/sample4.pdf",
  },
  {
    no: 5,
    name: "최지우",
    email: "choi5@naver.com",
    reason: "전라북도에서 멘토를 하고 싶습니다.",
    region: "전라북도",
    regionCode: 1005,
    date: "2025-07-10",
    status: "대기중",
    fileUrl: "/files/sample5.pdf",
  },
  {
    no: 6,
    name: "한예슬",
    email: "han6@naver.com",
    reason: "전라남도에서 멘토를 하고 싶습니다.",
    region: "전라남도",
    regionCode: 1006,
    date: "2025-07-11",
    status: "대기중",
    fileUrl: "/files/sample6.pdf",
  },
  {
    no: 7,
    name: "정우성",
    email: "jung7@naver.com",
    reason: "경상북도에서 멘토를 하고 싶습니다.",
    region: "경상북도",
    regionCode: 1007,
    date: "2025-07-12",
    status: "대기중",
    fileUrl: "/files/sample7.pdf",
  },
  {
    no: 8,
    name: "고소영",
    email: "ko8@naver.com",
    reason: "경상남도에서 멘토를 하고 싶습니다.",
    region: "경상남도",
    regionCode: 1008,
    date: "2025-07-13",
    status: "대기중",
    fileUrl: "/files/sample8.pdf",
  },
  {
    no: 9,
    name: "이민호",
    email: "lee9@naver.com",
    reason: "강원도에서 멘토를 하고 싶습니다.",
    region: "강원도",
    regionCode: 1009,
    date: "2025-07-14",
    status: "대기중",
    fileUrl: "/files/sample9.pdf",
  },
  {
    no: 10,
    name: "장도윤",
    email: "jang10@naver.com",
    reason: "제주도에서 멘토를 하고 싶습니다.",
    region: "제주도",
    regionCode: 1010,
    date: "2025-07-15",
    status: "대기중",
    fileUrl: "/files/sample10.pdf",
  },
];

export function MentorList() {
  const [applications, setApplications] = useState<MentorApply[]>([]);
  const [searchResult, setSearchResult] = useState<MentorApply[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<MentorApply | null>(
    null
  );
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    // 실제 서버라면 fetch해서 setApplications!
    setApplications(initialMentorApplications);
    setSearchResult(initialMentorApplications);
  }, []);

  // 지역/검색 필터 함수
  const filterData = (regionCode: number, keyword: string) => {
    let filtered = applications;

    if (regionCode !== 0) {
      filtered = filtered.filter((app) => app.regionCode === regionCode);
    }

    if (keyword.trim() !== "") {
      filtered = filtered.filter(
        (app) =>
          app.name.includes(keyword) ||
          app.email.includes(keyword) ||
          app.reason.includes(keyword) ||
          app.date.includes(keyword) ||
          app.status.includes(keyword) ||
          app.region.includes(keyword)
      );
    }

    setSearchResult(filtered);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  };

  // 지역 변경 핸들러
  const handleRegionChange = (_region: string, code: number) => {
    setSelectedRegionCode(code);
    filterData(code, searchKeyword);
  };

  // 검색 핸들러
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    filterData(selectedRegionCode, keyword);
  };

  // 승인/거절
  const updateStatus = (no: number, status: string) => {
    const updated = applications.map((app) =>
      app.no === no ? { ...app, status } : app
    );
    setApplications(updated);
    setSearchResult(updated); // 검색결과도 업데이트
    setSelectedMentor(null);
  };

  // 페이지네이션
  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>멘토 신청 목록</h1>

      {/* <AdminRegionTab
        selectedRegionCode={selectedRegionCode}
        onSelectRegion={handleRegionChange}
      /> */}

      <AdminSearch
        placeholder="이름, 이메일, 지역 검색"
        onSearch={handleSearch}
      />

      <div className={styles.tableWrapper}>
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
                <td
                  colSpan={8}
                  style={{ textAlign: "center", padding: "20px" }}
                >
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
                  <td>
                    {searchResult.length -
                      ((currentPage - 1) * ITEMS_PER_PAGE + index)}
                  </td>
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
          onPageChange={setCurrentPage}
        />

        {/* 상세 모달 */}
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
    </div>
  );
}
