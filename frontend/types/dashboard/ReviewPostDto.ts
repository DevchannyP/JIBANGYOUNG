export interface ReviewPostDto {
  id: number;
  no: string;               // 백엔드에서 내려오는 순위 ("01", "02", "03")
  title: string;
  author: string;
  content: string;
  regionName: string;       // 백엔드에서 regionId 기반으로 생성된 지역명
  regionId: number;
  thumbnailUrl?: string | null;
  likes: number;
  views: number;
  createdAt: string;        // ISO 문자열 (서버에서 LocalDateTime→ISO)
  summary: string;
}

// 프론트에서 사용하는 타입 (백엔드와 동일하므로 별칭으로 사용)
export interface ReviewPostWithRank extends ReviewPostDto {}
