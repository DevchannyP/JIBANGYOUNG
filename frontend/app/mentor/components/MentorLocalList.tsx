import { AdminRegionTab } from "@/app/admin/components/AdminRegionTab";
import { AdminSearch } from "@/app/admin/components/AdminSearch";
import { Pagination } from "@/app/admin/components/Pagination";
import { useAdminRegion } from "@/app/admin/hooks/useAdminRegion";
import { fetchMentorRegionUsers } from "@/libs/api/admin/adminMentor.api";
import { AdMentorUser } from "@/types/api/adMentorUser";
import { useCallback, useEffect, useState } from "react";
import styles from "../../admin/AdminPage.module.css";
import { MentorLocalRow } from "./MentorLocalRow";

export function MentorLocalList() {
  const [users, setUsers] = useState<AdMentorUser[]>([]);
  const [searchResult, setSearchResult] = useState<AdMentorUser[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegionCode, setSelectedRegionCode] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // 전체 지역 옵션
  const { regionOptions: allRegionOptions, loading: regionLoading } =
    useAdminRegion();

  // 멘토 목록 fetch
  useEffect(() => {
    fetchMentorRegionUsers()
      .then((data) => {
        setUsers(data);
        setSearchResult(data);
      })
      .catch((e) => {
        alert(
          e?.response?.data?.message || e?.message || "유저 목록 조회 실패"
        );
      });
  }, []);

  // 멘토 목록 기준, 사용된 region_id만 추출
  const userRegionIds = Array.from(new Set(users.map((u) => u.region_id)));

  // 지역탭 옵션: 멘토 목록에 등장하는 지역만 + '전체'
  const filteredRegionOptions = [
    { code: 0, name: "전체" },
    ...allRegionOptions.filter((option) => userRegionIds.includes(option.code)),
  ];

  // 지역 선택 시 필터
  const handleSelectRegion = useCallback(
    (regionName: string, code: number) => {
      setSelectedRegionCode(code);
      setCurrentPage(1);
      let filtered =
        code === 0 ? users : users.filter((u) => u.region_id === code);
      if (searchKeyword.trim()) {
        filtered = filtered.filter(
          (user) =>
            (user.nickname &&
              user.nickname
                .toLowerCase()
                .includes(searchKeyword.trim().toLowerCase())) ||
            (user.role &&
              user.role
                .toLowerCase()
                .includes(searchKeyword.trim().toLowerCase()))
        );
      }
      setSearchResult(filtered);
    },
    [users, searchKeyword]
  );

  // 검색 시 필터
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      let filtered =
        selectedRegionCode === 0
          ? users
          : users.filter((u) => u.region_id === selectedRegionCode);
      if (keyword.trim()) {
        filtered = filtered.filter(
          (user) =>
            (user.nickname &&
              user.nickname
                .toLowerCase()
                .includes(keyword.trim().toLowerCase())) ||
            (user.role &&
              user.role.toLowerCase().includes(keyword.trim().toLowerCase()))
        );
      }
      setSearchResult(filtered);
      setCurrentPage(1);
    },
    [users, selectedRegionCode]
  );

  const goToPage = (page: number) => setCurrentPage(page);

  const totalPages = Math.ceil(searchResult.length / ITEMS_PER_PAGE);
  const paginatedData = searchResult.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className={styles.title}>내 지역 멘토목록</h1>

      {/* 담당 지역만 노출! */}
      <AdminRegionTab
        regionOptions={filteredRegionOptions}
        selectedRegionCode={selectedRegionCode}
        onSelectRegion={handleSelectRegion}
      />

      <AdminSearch placeholder="닉네임/등급 검색" onSearch={handleSearch} />
      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>NO</th>
              <th>닉네임</th>
              <th>등급</th>
              <th>경고</th>
              <th>지역</th>
              <th>점수</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  {regionLoading
                    ? "지역 정보 로딩중..."
                    : "일치하는 정보가 없습니다."}
                </td>
              </tr>
            ) : (
              paginatedData.map((user, idx) => (
                <MentorLocalRow
                  key={`${user.id}-${user.region_id}`}
                  user={user}
                  index={idx}
                  totalCount={searchResult.length}
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                  regionOptions={allRegionOptions}
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
