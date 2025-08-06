export interface PolicyCard {
  NO: number;             // 정책 번호
  plcy_nm: string;        // 정책명
  aply_ymd?: string;      // 신청 기간 원본 문자열
  sidoName: String;    //지역코드에 해당하는 시도명
  plcy_kywd_nm: string;   // 정책 키워드
  plcy_no: string;
  deadline: string;       // 마감일 (YYYY-MM-DD)
  d_day: number;          // 마감까지 남은 일수
  favorites: number;      // 총 추천 개수
}