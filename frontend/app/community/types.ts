export interface PostListDto {
  id: number;
  title: string;
  likes: number;
  views: number;
  createdAt: string;
  userId: number;
  regionId: number;
  regionName: string;
  thumbnailUrl: string;
  summary: string;
}

// 게시글 상세에서 사용할 타입
export interface DetailProps {
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
  content: string;
}
