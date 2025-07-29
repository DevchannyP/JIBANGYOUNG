import { AdminUser } from "@/types/api/adminUser";
import styles from "../AdminPage.module.css";

interface AdminUserRowProps {
  user: AdminUser;
  index: number;
  totalCount: number;
  ITEMS_PER_PAGE: number;
  currentPage: number;
  editedRole: string | undefined;
  onRoleChange: (id: number, newRole: string) => void;
  onSaveRole: (user: AdminUser) => void;
}

export function AdminUserRow({
  user,
  index,
  totalCount,
  ITEMS_PER_PAGE,
  currentPage,
  editedRole,
  onRoleChange,
  onSaveRole,
}: AdminUserRowProps) {
  const isChanged = editedRole !== undefined && editedRole !== user.role;

  return (
    <tr>
      <td>{totalCount - ((currentPage - 1) * ITEMS_PER_PAGE + index)}</td>
      <td>{user.username}</td>
      <td>{user.nickname}</td>
      <td>{user.gender}</td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
      <td>{user.birth_date}</td>
      <td>{user.region}</td>
      <td>
        <select
          value={editedRole !== undefined ? editedRole : user.role}
          onChange={(e) => onRoleChange(user.id, e.target.value)}
          className={styles.roleSelect}
        >
          <option value="USER">사용자</option>
          <option value="MENTOR_A">멘토A</option>
          <option value="MENTOR_B">멘토B</option>
          <option value="MENTOR_C">멘토C</option>
          <option value="ADMIN">관리자</option>
        </select>
        <button
          className={styles.saveButton}
          disabled={!isChanged}
          style={{ marginLeft: 8 }}
          onClick={() => onSaveRole(user)}
        >
          저장
        </button>
      </td>
    </tr>
  );
}
