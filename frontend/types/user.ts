// types/user.ts

export type UserRole =
  | "USER"
  | "ADMIN"
  | "MENTOR"
  | "MENTEE"
  | "MENTOR_A"
  | "MENTEE_B"; // 실제 Enum 값에 맞게 추가

export type UserStatus = "ACTIVE" | "PENDING" | "DELETED" | "BLOCKED"; // Enum 맞게 수정

export interface UserDto {
  id: number;
  username: string;
  email: string;
  nickname: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  profileImageUrl: string | null;
  birthDate: string; // ISO ("YYYY-MM-DD")
  gender: string; // "M" | "F" | ...?
  region: string;
  lastLoginAt: string; // ISO ("YYYY-MM-DDTHH:mm:ss")
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
