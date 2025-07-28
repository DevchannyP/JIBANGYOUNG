import { fetchAllUsers, updateUserRoles } from "@/libs/api/admin/admin.api";
import { AdminUser } from "@/types/api/adminUser";
import { useEffect, useState } from "react";
import styles from "../AdminPage.module.css";

import { AdminSearch } from "./AdminSearch";
import { Pagination } from "./Pagination";

export function AdminUserList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchResult, setSearchResult] = useState<AdminUser[]>([]);
  const [editedRoles, setEditedRoles] = useState<{ [key: number]: string }>({});
  const [isChanged, setIsChanged] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchAllUsers()
      .then((data) => {
        setUsers(data);
        setSearchResult(data);
      })
      .catch((err) => {
        console.error(err);
        alert("사용자 데이터를 불러오는데 실패했습니다.");
      });
  }, []);

  const handleSearch = (keyword: string) => {
    if (keyword.trim() === "") {
      setSearchResult(users);
      return;
    }

    const result = users.filter(
      (user) =>
        user.username.includes(keyword) ||
        user.nickname.includes(keyword) ||
        user.email.includes(keyword) ||
        user.phone.includes(keyword) ||
        user.birth_date.includes(keyword) ||
        user.region.includes(keyword)
    );

    setSearchResult(result);
    setCurrentPage(1); // 검색 시 페이지 초기화
  };

  const handleRoleChange = (id: number, newRole: string) => {
    setEditedRoles((prev) => ({
      ...prev,
      [id]: newRole,
    }));
    setIsChanged(true);
  };

  const handleSave = async () => {
    const changedUsers = users.filter((user) => {
      const changedRole = editedRoles[user.id];
      return changedRole && changedRole !== user.role;
    });

    if (changedUsers.length === 0) {
      alert("변경된 권한이 없습니다.");
      return;
    }

    const payload = changedUsers.map((user) => ({
      id: user.id,
      role: editedRoles[user.id],
    }));

    try {
      await updateUserRoles(payload);

      const updatedUsers = users.map((user) =>
        editedRoles[user.id] ? { ...user, role: editedRoles[user.id] } : user
      );

      setUsers(updatedUsers);
      setSearchResult(updatedUsers);

      const changedNames = changedUsers.map((user) => user.nickname).join(", ");
      alert(`${changedNames} 님의 권한이 변경되었습니다.`);

      setEditedRoles({});
      setIsChanged(false);
    } catch (e: any) {
      alert(e.message || "저장 중 오류가 발생했습니다.");
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1 className={styles.title}>사용자 관리</h1>

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
              <th>성별</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>생년월일</th>
              <th>지역</th>
              <th>권한</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "20px" }}>
                  일치하는 정보가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedData.map((user, index) => (
                <tr key={user.id}>
                  <td>
                    {searchResult.length - ((currentPage - 1) * ITEMS_PER_PAGE + index)}
                  </td>
                  <td>{user.username}</td>
                  <td>{user.nickname}</td>
                  <td>{user.gender}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.birth_date}</td>
                  <td>{user.region}</td>
                  <td>
                    <select
                      value={
                        editedRoles[user.id] !== undefined
                          ? editedRoles[user.id]
                          : user.role
                      }
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={styles.roleSelect}
                    >
                      <option value="USER">사용자</option>
                      <option value="MENTOR_A">멘토A</option>
                      <option value="MENTOR_B">멘토B</option>
                      <option value="MENTOR_C">멘토C</option>
                      <option value="ADMIN">관리자</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <button
            onClick={handleSave}
            className={styles.saveButton}
            disabled={!isChanged}
          >
            저장하기
          </button>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </div>
  );
}