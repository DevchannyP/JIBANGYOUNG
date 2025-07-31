// /types/mypage.ts

// 1. 권한 Enum (User, UserProfile, 모든 API 통일)
export type UserRole = "USER" | "ADMIN" | "MENTOR_A" | "MENTOR_B" | "MENTOR_C";

// 2. 유저 상태 Enum (서버/프론트/DTO 전 계층 일치)
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED" | "PENDING";

// 3. 탭 타입 (내부 패널 키 일원화)
export type Tab =
  | "edit"
  | "score"
  | "posts"
  | "comments"
  | "surveys"
  | "alerts"
  | "reports"; // ← 포함 OK

// 4. 사이드바 메뉴 타입(내부탭/외부확장/권한)
export interface SidebarMenuItem {
  key: Tab | string; // 내부탭: Tab, 외부/확장: string(예: mentorApply)
  label: string; // 메뉴명 (ex: '내 게시글', '멘토 신청')
  external?: boolean; // 외부 링크/라우팅 분기
  path?: string; // 이동 경로
  roles?: UserRole[]; // 노출 권한(미지정 시 전체)
}

// 5. 유저 프로필/계정 DTO (User, UserProfile 완전 일치 구조)
export interface UserProfileDto {
  id: number;
  username: string;
  email: string;
  nickname: string | null;
  phone: string | null;
  profileImageUrl: string | null;
  region: string | string[] | null; // 단일/다중지역 모두 지원
  role: UserRole;
  status: UserStatus;
  birthDate: string | null; // "YYYY-MM-DD", null 허용
  gender: "M" | "F" | null;
  lastLoginAt: string | null; // ISO ("YYYY-MM-DDTHH:mm:ss"), null 허용
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // 확장 필드 허용 (ex: 점수, 활동내역, 모듈 확장 등)
}
