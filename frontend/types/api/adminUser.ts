export interface AdminUser {
  id: number;
  username: string;
  email: string;
  phone: string;
  birth_date: string;
  role: string;
  nickname: string;
  gender: string;
  region: string;
}

// 유저 상태 변경용 payload
export interface ChangeUserStatusPayload {
  status: "ACTIVE" | "DEACTIVATED" | "SUSPENDED" | "DELETED";
}
