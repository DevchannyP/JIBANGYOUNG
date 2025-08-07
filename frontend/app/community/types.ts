export interface PostListDto {
  id: number;
  title: string;
  likes: number;
  views: number;
  createdAt: string;
  userId: number;
  category: string;
  regionId: number;
  regionName: string;
  thumbnailUrl: string;
  summary: string;
  isNotice: boolean;
}

// 게시글 상세에서 사용할 타입
export interface DetailProps {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
  content: string;
}
