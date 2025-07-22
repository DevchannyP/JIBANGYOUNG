"use client";

import { useState } from "react";
import styles from "../../AdminPage.module.css";
import { Pagination } from "../../components/Pagination";
import { AdminUser } from "@/types/api/adminUser";
import { updateUserRoles } from "@/libs/api/admin/admin.api";

interface AdminUserListProps {
  users: AdminUser[];
  allUsers: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  setSearchResult: React.Dispatch<React.SetStateAction<AdminUser[]>>;
}

export function AdminUserList({
  users,
  allUsers,
  setUsers,
  setSearchResult,
}: AdminUserListProps) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [editedRoles, setEditedRoles] = useState<{ [key: number]: string }>({});
  const [isChanged, setIsChanged] = useState(false); // ✅ 저장 버튼 상태

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  // 권한 변경
  const handleRoleChange = (id: number, newRole: string) => {
    console.log(`변경된 유저 ID: ${id}, 새로운 권한: ${newRole}`);
    
    setEditedRoles((prev) => ({
      ...prev,
      [id]: newRole,
    }));
    setIsChanged(true); //  변경 시 저장 버튼 활성화
  };

  // 권한 저장
const handleSave = async () => {
  // 변경된 유저 중 실제로 role이 다른 경우만 필터링
  const changedUsers = allUsers.filter((user) => {
    const changedRole = editedRoles[user.id];
    return changedRole && changedRole !== user.role;
  });

  if (changedUsers.length === 0) {
    alert("변경된 권한이 없습니다.");
    return; //  API 호출 X
  }

  // 서버에 보낼 payload
  const payload = changedUsers.map((user) => ({
    id: user.id,
    role: editedRoles[user.id],
  }));

  try {
    await updateUserRoles(payload);

    // 프론트 상태 업데이트
    const updatedUsers = allUsers.map((user) => {
      if (editedRoles[user.id]) {
        return { ...user, role: editedRoles[user.id] };
      }
      return user;
    });

    setUsers(updatedUsers);
    setSearchResult(updatedUsers);

    // 변경된 사람 이름 alert 출력
    const changedNames = changedUsers.map((user) => user.nickname).join(", ");
    alert(`${changedNames} 님의 권한이 변경되었습니다.`);

    // 상태 초기화
    setEditedRoles({});
    setIsChanged(false);
  } catch (e: any) {
    alert(e.message || "저장 중 오류가 발생했습니다.");
  }
};


  const paginatedData = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
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
            paginatedData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
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
                    <option value={"USER"}>사용자</option>
                    <option value={"MENTOR_A"}>멘토A</option>
                    <option value={"MENTOR_B"}>멘토B</option>
                    <option value={"MENTOR_C"}>멘토C</option>
                    <option value={"ADMIN"}>관리자</option>
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
  );
}
