export interface PolicyCard {
  NO: number;             // 정책 번호
  plcy_nm: string;        // 정책명
  aply_ymd?: string;      // 신청 기간 원본 문자열
  plcy_kywd_nm: string;   // 정책 키워드
  deadline: string;       // 마감일 (YYYY-MM-DD)
  d_day: number;          // 마감까지 남은 일수
}