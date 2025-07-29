import { fetchAllUsers, updateUserRoles } from "@/libs/api/admin/admin.api";
import { AdminUser } from "@/types/api/adminUser";
import { useCallback, useEffect, useState } from "react";
import styles from "../AdminPage.module.css";
import { useAdminRegion } from "../hooks/useAdminRegion";
import { AdminRegionTab } from "./AdminRegionTab";
import { AdminSearch } from "./AdminSearch";
import { AdminUserRow } from "./AdminUserRow";
import { Pagination } from "./Pagination";

export function AdminUserList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchResult, setSearchResult] = useState<AdminUser[]>([]);
  const [editedRoles, setEditedRoles] = useState<{ [key: number]: string }>({});
  const [isChanged, setIsChanged] = useState(false);
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { regionOptions, loading: regionLoading } = useAdminRegion();

  // 최초 1회 전체 사용자 불러오기
  useEffect(() => {
    fetchAllUsers()
      .then((data) => {
        setUsers(data); // 초기 users만 세팅
        setSearchResult(data); // 초기 전체 목록 표시
      })
      .catch((err) => {
        console.error(err);
        alert("사용자 데이터를 불러오는데 실패했습니다.");
      });
  }, []);

  // 검색/지역 필터 함수 (오직 users만 의존성)
  const filterData = useCallback(
    (regionCode: number, keyword: string) => {
      const trimmed = keyword.trim().toLowerCase();
      const normalizedCode =
        regionCode === 0 ? 0 : Math.floor(regionCode / 1000) * 1000;
      // 탭 이름을 구하기 위해 regionOptions에서 찾아옴
      const selectedRegionName =
        regionCode === 0
          ? null
          : regionOptions.find((opt) => opt.code === regionCode)?.name;

      const filtered = users.filter((user) => {
        // region이 없으면 패스
        if (!user.region) return false;

        // 여러 지역 지원: '서울,부산' → ['서울', '부산']
        const regionList = user.region.split(",").map((s) => s.trim());

        // '전체'탭은 무조건 포함
        const matchRegion =
          normalizedCode === 0 ||
          (!!selectedRegionName && regionList.includes(selectedRegionName));

        const matchKeyword =
          trimmed === "" ||
          user.username.toLowerCase().includes(trimmed) ||
          user.nickname.toLowerCase().includes(trimmed) ||
          user.email.toLowerCase().includes(trimmed) ||
          user.phone.includes(trimmed) ||
          user.birth_date.includes(trimmed) ||
          user.region.includes(trimmed);

        return matchRegion && matchKeyword;
      });

      setSearchResult(filtered);
      setCurrentPage(1); // 필터 변경시 첫 페이지로
    },
    [users, regionOptions]
  );

  // 🔎 검색어 입력 (디바운스 SearchBar에서 전달됨)
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      filterData(selectedRegionCode, keyword);
    },
    [filterData, selectedRegionCode]
  );

  // 🌎 지역 탭 변경
  const handleRegionChange = useCallback(
    (_region: string, code: number) => {
      setSelectedRegionCode(code);
      filterData(code, searchKeyword);
    },
    [filterData, searchKeyword]
  );

  // 권한 select박스 변경
  const handleRoleChange = (id: number, newRole: string) => {
    setEditedRoles((prev) => ({
      ...prev,
      [id]: newRole,
    }));
  };

  // 권한 변경저장
  const handleSaveRole = async (user: AdminUser) => {
    const newRole = editedRoles[user.id];
    if (!newRole || newRole === user.role) {
      alert("변경된 권한이 없습니다.");
      return;
    }

    try {
      await updateUserRoles([{ id: user.id, role: newRole }]);
      // 프론트 상태도 갱신
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, role: newRole } : u
      );
      setUsers(updatedUsers);
      setSearchResult(updatedUsers);

      setEditedRoles((prev) => {
        const updated = { ...prev };
        delete updated[user.id];
        return updated;
      });
      alert(`${user.nickname} 님의 권한이 변경되었습니다.`);
    } catch (e: any) {
      alert(e.message || "저장 중 오류가 발생했습니다.");
    }
  };

  // 페이지 이동
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (regionLoading) return <div>지역 정보 불러오는 중...</div>;

  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>사용자 관리</h1>

      <AdminRegionTab
        regionOptions={regionOptions}
        selectedRegionCode={selectedRegionCode}
        onSelectRegion={handleRegionChange}
      />

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
                <td
                  colSpan={9}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  일치하는 정보가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedData.map((user, index) => (
                <AdminUserRow
                  key={user.id}
                  user={user}
                  index={index}
                  totalCount={searchResult.length}
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                  editedRole={editedRoles[user.id]}
                  onRoleChange={handleRoleChange}
                  onSaveRole={handleSaveRole}
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
