"use client";

import { useState } from "react";
import styles from "../../AdminPage.module.css";
import { Pagination } from "../../components/Pagination";
import { AdminUser } from "@/types/api/adminUser";

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

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  // 권한 변경 (함수형 업데이트: 최신상태 보장)
  const handleRoleChange = (id: number, newRole: string) => {
    setEditedRoles((prev) => ({
      ...prev,
      [id]: newRole,
    }));
  };

  // 권한 변경(저장)
  const handleSave = () => {
    const updatedUsers = allUsers.map((user) => {
      if (editedRoles[user.id]) {
        return { ...user, role: editedRoles[user.id] };
      }
      return user;
    });

    setUsers(updatedUsers);
    setSearchResult(updatedUsers);

    const changedUsers = allUsers.filter((user) => editedRoles[user.id]);

    if (changedUsers.length > 0) {
      const messages = changedUsers
        .map(
          (user) =>
            `${user.username}님이 ${editedRoles[user.id]}로 저장되었습니다.`
        )
        .join("\n");

      alert(messages);
    } else {
      alert("변경사항이 없습니다.");
    }

    setEditedRoles({});
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
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>생년월일</th>
            <th>비밀번호</th>
            <th>권한</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                일치하는 정보가 없습니다.
              </td>
            </tr>
          ) : (
            paginatedData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.birthDate}</td>
                <td>{user.password}</td>
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
        <button onClick={handleSave} className={styles.saveButton}>
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
