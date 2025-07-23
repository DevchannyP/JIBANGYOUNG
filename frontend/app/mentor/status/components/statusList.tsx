"use client";

import { useState } from "react";
import styles from "../../../admin/AdminPage.module.css";
import { Status } from "../page";

interface StatusListProps {
  data: Status[];
}

export default function StatusList({ data }: StatusListProps) {
  const [users, setUsers] = useState<Status[]>(data);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const handleStatusChange = (
    userNo: number,
    newStatus: "정상" | "경고" | "차단"
  ) => {
    setUsers(
      users.map((user) =>
        user.no === userNo ? { ...user, status: newStatus } : user
      )
    );
    setDropdownOpen(null);
  };

  const handleSave = () => {
    console.log("저장 버튼 클릭됨");
  };

  return (
    <div>
      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>NO</th>
              <th>이름</th>
              <th>ID</th>
              <th>등급</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>활동점수</th>
              <th>활동제한</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.no}>
                <td>{user.no.toString().padStart(2, "0")}</td>
                <td>{user.name}</td>
                <td>{user.id}</td>
                <td>{user.grade}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td
                  className={user.activityScore < 0 ? styles.negativeScore : ""}
                >
                  {user.activityScore}
                </td>
                <td>
                  <select
                    value={user.status}
                    onChange={(e) =>
                      handleStatusChange(
                        user.no,
                        e.target.value as Status["status"]
                      )
                    }
                    className={styles.roleSelect}
                  >
                    <option value="정상">정상</option>
                    <option value="경고">경고</option>
                    <option value="차단">차단</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={styles.saveButton} onClick={handleSave}>
          저장하기
        </button>
      </div>
    </div>
  );
}
