import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useCallback, useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";

// 타입 정의
export interface MentorLog {
  id: number;
  level: string;
  region: string;
  postCount: number;
  commentCount: number;
  answerDone: number;
  answerNotDone: number;
  reportDone: number;
  reportProcess: number;
  reportPending: number;
}

// 더미 데이터 (실제 DB 연동 시 이 부분만 API로 대체)
const dummyMentorLogs: MentorLog[] = [
  {
    id: 3,
    level: "Lv.4.운영자",
    region: "서울",
    postCount: 150,
    commentCount: 230,
    answerDone: 220,
    answerNotDone: 30,
    reportDone: 200,
    reportProcess: 40,
    reportPending: 10,
  },
  {
    id: 2,
    level: "Lv.3.실버멤버",
    region: "서울",
    postCount: 100,
    commentCount: 120,
    answerDone: 90,
    answerNotDone: 30,
    reportDone: 60,
    reportProcess: 30,
    reportPending: 10,
  },
  {
    id: 1,
    level: "Lv.2.초보자",
    region: "서울",
    postCount: 60,
    commentCount: 80,
    answerDone: 45,
    answerNotDone: 35,
    reportDone: 20,
    reportProcess: 10,
    reportPending: 10,
  },
];

// row 컴포넌트
export function MentorLogRow({
  log,
  index,
  ITEMS_PER_PAGE,
  currentPage,
}: {
  log: MentorLog;
  index: number;
  ITEMS_PER_PAGE: number;
  currentPage: number;
}) {
  // 번호는 최신순(내림차순)
  const order = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
  return (
    <tr>
      <td>{order}</td>
      <td>{log.level}</td>
      <td>{log.region}</td>
      <td>{log.postCount}</td>
      <td>{log.commentCount}</td>
      <td>
        {log.answerDone + log.answerNotDone}
        <div style={{ fontSize: 12, color: "#888" }}>
          (완료: {log.answerDone}, 미완료: {log.answerNotDone})
        </div>
      </td>
      <td>
        {log.reportDone + log.reportProcess + log.reportPending}
        <div style={{ fontSize: 12, color: "#888" }}>
          (완료: {log.reportDone}, 진행중: {log.reportProcess}, 기각:{" "}
          {log.reportPending})
        </div>
      </td>
    </tr>
  );
}

export function MentorStatsList() {
  const [logs, setLogs] = useState<MentorLog[]>([]);
  const [searchResult, setSearchResult] = useState<MentorLog[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setLogs(dummyMentorLogs);
    setSearchResult(dummyMentorLogs);
  }, []);

  // 검색
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      let filtered = logs;
      if (keyword.trim()) {
        filtered = logs.filter((log) => log.level.includes(keyword.trim()));
      }
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [logs]
  );

  const goToPage = (page: number) => setCurrentPage(page);

  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>멘토 활동 통계</h1>
      <AdminSearch placeholder="등급 검색" onSearch={handleSearch} />
      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>NO</th>
              <th>등급</th>
              <th>지역</th>
              <th>게시글 작성수</th>
              <th>댓글 작성수</th>
              <th>멘티 답변 완료수</th>
              <th>신고 처리</th>
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
              paginatedData.map((log, idx) => (
                <MentorLogRow
                  key={log.id}
                  log={log}
                  index={idx}
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                />
              ))
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </div>
  );
}
