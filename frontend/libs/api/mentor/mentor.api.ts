const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

// 백엔드 API 응답 래퍼 타입
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface CreateMentorApplicationRequest {
  regionId: number;
  reason: string;
  governmentAgency: boolean;
  documentUrl?: string;
}

export type MentorApplicationStatus =
  | "FINAL_APPROVED"
  | "SECOND_APPROVED"
  | "FIRST_APPROVED"
  | "REQUESTED"
  | "PENDING"
  | "REJECTED";

export interface MentorApplicationResponse {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  regionId: number;
  reason: string;
  governmentAgency: boolean;
  documentUrl?: string;
  status: MentorApplicationStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: number;
  rejectionReason?: string;
}

// 멘토 신청 제출
export async function createMentorApplication(
  payload: CreateMentorApplicationRequest
): Promise<void> {
  const res = await fetch(`${BASE}/api/mentor/application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error ||
        errorData.message ||
        "멘토 신청 중 오류가 발생했습니다."
    );
  }
}

// 멘토 신청 상태 조회
export async function getMentorApplicationStatus(): Promise<MentorApplicationResponse | null> {
  const res = await fetch(`${BASE}/api/mentor/application/status`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("멘토 신청 상태를 불러오지 못했습니다.");
  }

  const result: ApiResponse<MentorApplicationResponse> = await res.json();
  return result.data;
}

// 멘토 신청 여부 확인
export async function checkMentorApplication(): Promise<boolean> {
  const res = await fetch(`${BASE}/api/mentor/application/check`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (!res.ok) {
    throw new Error("멘토 신청 여부 확인 중 오류가 발생했습니다.");
  }

  const result: ApiResponse<boolean> = await res.json();
  return result.data;
}

// 멘토 신청용 파일 업로드 presigned URL 발급
export async function getMentorDocumentPresignedUrl(
  file: File
): Promise<{ url: string; publicUrl: string }> {
  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const res = await fetch(`${BASE}/api/mentor/application/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({
      fileName,
      contentType: file.type,
    }),
  });

  if (!res.ok) {
    throw new Error("Presigned URL 발급 실패");
  }

  const result: ApiResponse<{ url: string; publicUrl: string }> =
    await res.json();
  return result.data;
}

// S3에 파일 직접 업로드
export async function uploadFileToS3(
  presignedUrl: string,
  file: File
): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error("파일 업로드 실패");
  }
}

// === 멘토 공지사항 관련 API ===

export interface MentorNotice {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName?: string;
  regionId: number;
  regionCode?: string;
  regionName?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MentorNoticeNavigation {
  current: MentorNotice;
  previous?: {
    id: number;
    title: string;
  };
  next?: {
    id: number;
    title: string;
  };
}

export interface MentorNoticeCreateRequest {
  title: string;
  content: string;
  regionId: number;
  fileUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 멘토 공지사항 목록 조회
export async function getMentorNotices(
  regionId?: number,
  page: number = 1,
  size: number = 10,
  keyword?: string
): Promise<PageResponse<MentorNotice>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (regionId) {
    params.append("regionId", regionId.toString());
  }

  if (keyword) {
    params.append("keyword", keyword);
  }

  const res = await fetch(`${BASE}/api/mentor/notices?${params}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API 에러 응답:", {
      status: res.status,
      statusText: res.statusText,
      body: errorText,
      url: res.url
    });
    throw new Error(`멘토 공지사항 목록을 불러오지 못했습니다. (${res.status}: ${res.statusText})`);
  }

  const result: ApiResponse<PageResponse<MentorNotice>> = await res.json();
  return result.data;
}

// 멘토 공지사항 상세 조회 (네비게이션 포함)
export async function getMentorNoticeDetail(
  noticeId: number
): Promise<MentorNoticeNavigation> {
  const res = await fetch(`${BASE}/api/mentor/notices/${noticeId}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (!res.ok) {
    throw new Error("멘토 공지사항을 불러오지 못했습니다.");
  }

  const result: ApiResponse<MentorNoticeNavigation> = await res.json();
  return result.data;
}

// 멘토 공지사항 작성
export async function createMentorNotice(
  payload: MentorNoticeCreateRequest
): Promise<number> {
  const res = await fetch(`${BASE}/api/mentor/notices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error ||
        errorData.message ||
        "멘토 공지사항 작성 중 오류가 발생했습니다."
    );
  }

  const result: ApiResponse<number> = await res.json();
  return result.data;
}

// 멘토 공지사항 삭제
export async function deleteMentorNotice(noticeId: number): Promise<void> {
  const res = await fetch(`${BASE}/api/mentor/notices/${noticeId}/delete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error ||
        errorData.message ||
        "멘토 공지사항 삭제 중 오류가 발생했습니다."
    );
  }
}

// 최신 멘토 공지사항 조회 (대시보드용)
export async function getRecentMentorNotices(
  regionId: number,
  limit: number = 5
): Promise<MentorNotice[]> {
  const res = await fetch(
    `${BASE}/api/mentor/notices/recent?regionId=${regionId}&limit=${limit}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("최신 멘토 공지사항을 불러오지 못했습니다.");
  }

  const result: ApiResponse<MentorNotice[]> = await res.json();
  return result.data;
}
