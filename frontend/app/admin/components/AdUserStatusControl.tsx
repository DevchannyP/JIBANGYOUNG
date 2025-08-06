import { ChangeUserStatusPayload } from "@/types/api/adminUser";

interface UserStatusControlProps {
  value: ChangeUserStatusPayload["status"];
  onChange: (value: ChangeUserStatusPayload["status"]) => void;
}

const USER_STATUS_OPTIONS: {
  value: ChangeUserStatusPayload["status"];
  label: string;
}[] = [
  { value: "ACTIVE", label: "활성" },
  { value: "DEACTIVATED", label: "비활성" },
  { value: "SUSPENDED", label: "정지" },
  { value: "DELETED", label: "삭제" },
];

export function AdUserStatusControl({
  value,
  onChange,
}: UserStatusControlProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <b>유저 상태:</b>
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value as ChangeUserStatusPayload["status"])
        }
        style={{ marginLeft: 8, marginRight: 8 }}
      >
        {USER_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
