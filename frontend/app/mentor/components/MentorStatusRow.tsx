import styles from "../../admin/AdminPage.module.css";

type MentorStatus = "ACTIVE" | "DEACTIVATED" | "SUSPENDED" | "DELETED";

interface MentorUser {
  id: number;
  username: string;
  nickname: string;
  role: string; // 등급
  email: string;
  phone: string;
  region: string;
  status: MentorStatus; // 상태
}

interface MentorStatusRowProps {
  user: MentorUser;
  index: number;
  totalCount: number;
  ITEMS_PER_PAGE: number;
  currentPage: number;
  editedStatus?: MentorStatus;
  onStatusChange: (id: number, newStatus: MentorStatus) => void;
  onSaveStatus: (user: MentorUser) => void;
}

export function MentorStatusRow({
  user,
  index,
  totalCount,
  ITEMS_PER_PAGE,
  currentPage,
  editedStatus,
  onStatusChange,
  onSaveStatus,
}: MentorStatusRowProps) {
  const isChanged = editedStatus !== undefined && editedStatus !== user.status;

  return (
    <tr>
      <td>{totalCount - ((currentPage - 1) * ITEMS_PER_PAGE + index)}</td>
      <td>{user.username}</td>
      <td>{user.nickname}</td>
      <td>{user.role}</td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
      <td>{user.region}</td>
      <td>
        <select
          value={editedStatus !== undefined ? editedStatus : user.status}
          onChange={(e) =>
            onStatusChange(user.id, e.target.value as MentorStatus)
          }
          className={styles.roleSelect}
        >
          <option value="ACTIVE">활성</option>
          <option value="DEACTIVATED">비활성</option>
          <option value="SUSPENDED">정지</option>
          <option value="DELETED">삭제</option>
        </select>
        <button
          className={styles.saveButton}
          disabled={!isChanged}
          style={{ marginLeft: 8 }}
          onClick={() => onSaveStatus(user)}
        >
          저장
        </button>
      </td>
    </tr>
  );
}
