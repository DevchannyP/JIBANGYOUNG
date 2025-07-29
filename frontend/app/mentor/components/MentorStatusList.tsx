import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useCallback, useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";
import { MentorStatusRow } from "./MentorStatusRow";
// 실제 API 연결 예정
// import { fetchMentorUsers } from "@/libs/api/mentor.api";

export function MentorStatusList() {
  // 실제로는 API로 받아오세요!
  const [users, setUsers] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editedStatus, setEditedStatus] = useState<{ [key: number]: string }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // [임시 데이터] - 실제로는 API fetch로 교체
  useEffect(() => {
    // fetchMentorUsers().then(setUsers);
    const mock = [
      {
        id: 1,
        username: "TEST",
        nickname: "임꺽정",
        role: "회원",
        email: "abv@naver.com",
        phone: "010-****-8860",
        region: "서울",
        status: "정상",
      },
      {
        id: 2,
        username: "TEST",
        nickname: "홍길동",
        role: "회원",
        email: "abv@naver.com",
        phone: "010-****-8860",
        region: "서울",
        status: "정상",
      },
    ];
    setUsers(mock);
    setSearchResult(mock);
  }, []);

  // 검색 필터
  const filterData = useCallback(
    (keyword: string) => {
      const trimmed = keyword.trim().toLowerCase();
      const filtered = users.filter((user) => {
        return (
          trimmed === "" ||
          user.username.toLowerCase().includes(trimmed) ||
          user.nickname.toLowerCase().includes(trimmed) ||
          user.email.toLowerCase().includes(trimmed) ||
          user.phone.includes(trimmed)
        );
      });
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [users]
  );

  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      filterData(keyword);
    },
    [filterData]
  );

  // 상태 select 박스 변경
  const handleStatusChange = (id: number, newStatus: string) => {
    setEditedStatus((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  // 저장 (한 명씩)
  const handleSaveStatus = (user: any) => {
    const newStatus = editedStatus[user.id];
    if (!newStatus || newStatus === user.status) {
      alert("변경된 상태가 없습니다.");
      return;
    }
    // 실제로는 API 호출 필요
    // await updateMentorUserStatus(user.id, newStatus);

    // 상태 업데이트
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, status: newStatus } : u
    );
    setUsers(updatedUsers);
    setSearchResult(updatedUsers);

    setEditedStatus((prev) => {
      const copy = { ...prev };
      delete copy[user.id];
      return copy;
    });
    alert(`${user.nickname}님의 상태가 변경되었습니다.`);
  };

  const goToPage = (page: number) => setCurrentPage(page);

  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>유저 상태제어</h1>
      <AdminSearch
        placeholder="이름, ID, 이메일, 전화번호 검색"
        onSearch={handleSearch}
      />
      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>NO</th>
              <th>ID</th>
              <th>닉네임</th>
              <th>등급</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>지역</th>
              <th>활동제한</th>
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
              paginatedData.map((user, idx) => (
                <MentorStatusRow
                  key={user.id}
                  user={user}
                  index={idx}
                  totalCount={searchResult.length}
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                  editedStatus={editedStatus[user.id]}
                  onStatusChange={handleStatusChange}
                  onSaveStatus={handleSaveStatus}
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
