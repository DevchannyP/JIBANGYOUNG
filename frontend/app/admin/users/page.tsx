"use client";

import { useEffect, useState } from "react";
import styles from "../AdminPage.module.css";
import { SearchBar } from "../components/AdminSearch";
import AdminSidebar from "../components/AdminSidebar";
import { AdminUserList } from "./components/AdminUserList";
import { fetchAllUsers } from "../../../libs/api/admin/admin.api";
import { AdminUser } from "@/types/api/adminUser";

export default function UserPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchResult, setSearchResult] = useState<AdminUser[]>([]);

  // admin API 호출
  useEffect(() => {
    fetchAllUsers()
      .then((data) => {
        setUsers(data);
        setSearchResult(data);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
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
  };

  return (
    <div className={styles.adminContent}>
      <AdminSidebar />

      <div className={styles.mainContent}>
        <h1 className={styles.title}>사용자 관리</h1>

        <SearchBar
          placeholder="이름, ID, 이메일, 전화번호 검색"
          onSearch={handleSearch}
        />

        <AdminUserList
          users={searchResult}
          allUsers={users}
          setUsers={setUsers}
          setSearchResult={setSearchResult}
        />
      </div>
    </div>
  );
}
