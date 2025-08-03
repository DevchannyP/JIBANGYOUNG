import { useCallback, useEffect, useState } from "react";
import styles from "../AdminPage.module.css";
import { CommonModal } from "../components/AdminModal";
import { Pagination } from "../components/Pagination";
import { AdminReportTab } from "./AdminReportTab";
import { AdminSearch } from "./AdminSearch";

type StatusType = "blind" | "processing" | "reject";
type ReportType = "게시글" | "댓글";

interface Report {
  no: number;
  title: string;
  reporter: string;
  date: string;
  count: number;
  status: StatusType;
  region: string;
  regionCode: number;
  url: string;
  reason: string;
  type: ReportType;
}

const STATUS_MAP = {
  blind: { label: "블라인드 처리완료", color: "blue" },
  processing: { label: "처리중", color: "gray" },
  reject: { label: "기각처리", color: "goldenrod" },
};

const initialReports: Report[] = [
  {
    no: 1,
    title: "서울은 너무 사람이 많아 살기 싫어요.",
    reporter: "홍길동",
    date: "2025-07-04",
    count: 15,
    status: "blind",
    region: "서울",
    regionCode: 1001,
    url: "https://example.com/post/1",
    reason: "욕설 및 비방 글로 신고되었습니다.",
    type: "게시글",
  },
  {
    no: 2,
    title: "경기도 교통 너무 막혀요.",
    reporter: "김철수",
    date: "2025-07-05",
    count: 8,
    status: "processing",
    region: "경기도",
    regionCode: 1002,
    url: "https://example.com/post/2",
    reason: "허위 사실 유포로 신고되었습니다.",
    type: "댓글",
  },
  {
    no: 3,
    title: "충청북도 공기 너무 좋아요.",
    reporter: "이영희",
    date: "2025-07-06",
    count: 3,
    status: "reject",
    region: "충청북도",
    regionCode: 1003,
    url: "https://example.com/post/3",
    reason: "단순 의견 표현으로 기각되었습니다.",
    type: "게시글",
  },
  {
    no: 4,
    title: "충청남도 맛집 많아요.",
    reporter: "박철민",
    date: "2025-07-07",
    count: 5,
    status: "processing",
    region: "충청남도",
    regionCode: 1004,
    url: "https://example.com/post/4",
    reason: "상업적 홍보로 신고되었습니다.",
    type: "댓글",
  },
  {
    no: 5,
    title: "전라북도 물가가 저렴해요.",
    reporter: "최지우",
    date: "2025-07-08",
    count: 2,
    status: "blind",
    region: "전라북도",
    regionCode: 1005,
    url: "https://example.com/post/5",
    reason: "지역 비방으로 신고되었습니다.",
    type: "게시글",
  },
  {
    no: 6,
    title: "전라남도는 아름다운 곳이에요.",
    reporter: "한예슬",
    date: "2025-07-09",
    count: 4,
    status: "reject",
    region: "전라남도",
    regionCode: 1006,
    url: "https://example.com/post/6",
    reason: "신고 대상이 아님으로 기각되었습니다.",
    type: "게시글",
  },
  {
    no: 7,
    title: "경상북도는 문화유산이 많아요.",
    reporter: "장도윤",
    date: "2025-07-10",
    count: 7,
    status: "blind",
    region: "경상북도",
    regionCode: 1007,
    url: "https://example.com/post/7",
    reason: "욕설 포함으로 블라인드 처리되었습니다.",
    type: "댓글",
  },
  {
    no: 8,
    title: "경상남도는 살기 좋아요.",
    reporter: "정우성",
    date: "2025-07-11",
    count: 6,
    status: "processing",
    region: "경상남도",
    regionCode: 1008,
    url: "https://example.com/post/8",
    reason: "도배성 게시물로 신고됨.",
    type: "게시글",
  },
  {
    no: 9,
    title: "강원도는 자연이 좋아요.",
    reporter: "고소영",
    date: "2025-07-12",
    count: 9,
    status: "blind",
    region: "강원도",
    regionCode: 1009,
    url: "https://example.com/post/9",
    reason: "허위 정보 유포로 블라인드 처리됨.",
    type: "댓글",
  },
  {
    no: 10,
    title: "제주도는 관광지죠.",
    reporter: "오장군",
    date: "2025-07-13",
    count: 11,
    status: "processing",
    region: "제주도",
    regionCode: 1010,
    url: "https://example.com/post/10",
    reason: "불필요한 중복 게시물 신고됨.",
    type: "게시글",
  },
  {
    no: 11,
    title: "세종시는 행정의 중심입니다.",
    reporter: "이지은",
    date: "2025-07-14",
    count: 1,
    status: "reject",
    region: "세종",
    regionCode: 1011,
    url: "https://example.com/post/11",
    reason: "정상 게시글로 판단되어 기각됨.",
    type: "게시글",
  },
];

export function AdminReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchResult, setSearchResult] = useState<Report[]>([]);
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const [selectedType, setSelectedType] = useState<ReportType | "게시글">(
    "게시글"
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 초기 데이터 세팅
  useEffect(() => {
    setReports(initialReports);
    setSearchResult(initialReports);
  }, []);

  // 통합 필터
  const filterData = useCallback(
    (regionCode: number, keyword: string, type: string) => {
      const trimmed = keyword.trim().toLowerCase();
      let filtered = reports.filter((r) => {
        const matchRegion = regionCode === 0 || r.regionCode === regionCode;
        const matchKeyword =
          trimmed === "" ||
          r.title.toLowerCase().includes(trimmed) ||
          r.date.toLowerCase().includes(trimmed);
        const matchType = type === "전체" || r.type === type;
        return matchRegion && matchKeyword && matchType;
      });
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [reports]
  );

  // 지역 선택
  const handleRegionChange = useCallback(
    (_region: string, code: number) => {
      setSelectedRegionCode(code);
      filterData(code, searchKeyword, selectedType);
    },
    [filterData, searchKeyword, selectedType]
  );

  // 타입 선택
  const handleTypeChange = useCallback(
    (type: string) => {
      setSelectedType(type as ReportType | "게시글");
      filterData(selectedRegionCode, searchKeyword, type);
    },
    [filterData, selectedRegionCode, searchKeyword]
  );

  // 키워드 검색
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      filterData(selectedRegionCode, keyword, selectedType);
    },
    [filterData, selectedRegionCode, selectedType]
  );

  // URL 클릭
  const handleUrlClick = useCallback((e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank");
  }, []);

  // 상태변경, 삭제 함수들 useCallback 적용
  const updateBlind = useCallback(
    (no: number, isBlind: boolean) => {
      const updated: Report[] = reports.map((r) =>
        r.no === no ? { ...r, status: isBlind ? "blind" : "processing" } : r
      );
      setReports(updated);
      setSearchResult(updated);
      setSelectedReport(null);
    },
    [reports]
  );

  const updateStatus = useCallback((no: number, status: StatusType) => {
    setReports((prevReports) => {
      const updated = prevReports.map((r) =>
        r.no === no ? { ...r, status } : r
      );
      setSearchResult(updated);
      return updated;
    });
    setSelectedReport(null);
  }, []);

  const handleDelete = useCallback((report: Report) => {
    setReports((prevReports) => {
      let updated: Report[];
      if (report.type === "댓글") {
        updated = prevReports.map((r) =>
          r.no === report.no ? { ...r, status: "reject" } : r
        );
      } else {
        updated = prevReports.filter((r) => r.no !== report.no);
      }
      setSearchResult(updated);
      return updated;
    });
    setSelectedReport(null);
  }, []);

  // 페이징
  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>신고 목록</h1>

      <AdminReportTab
        selectedType={selectedType}
        onSelectType={handleTypeChange}
      />

      <AdminSearch placeholder="제목 검색" onSearch={handleSearch} />

      <div className={styles.tableWrapper}>
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
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "20px" }}
                >
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
                  <td>
                    {searchResult.length -
                      ((currentPage - 1) * ITEMS_PER_PAGE + index)}
                  </td>
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
    </div>
  );
}

// Modal 버튼 생성 함수 (변경 없음)
function getModalButtons(
  report: Report,
  updateBlind: (no: number, isBlind: boolean) => void,
  updateStatus: (no: number, status: StatusType) => void,
  handleDelete: (report: Report) => void
) {
  const buttons: {
    label: string;
    onClick: () => void;
    type?: "primary" | "secondary" | "danger";
  }[] = [];

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
