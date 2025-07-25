export interface PostListDto {
  id: number;
  title: string;
  likes: number;
  views: number;
  createdAt: string;
  userId: number;
  regionId: number;
  regionName: string;
}
export const region: Record<string, string> = {
  "11": "서울",
  "26": "부산",
  "27": "대구",
  "28": "인천",
  "29": "광주",
  "30": "대전",
  "31": "울산",
  "36": "세종",
  "41": "경기도",
  "43": "충청북도",
  "44": "충청남도",
  "46": "전라남도",
  "47": "경상북도",
  "48": "경상남도",
  "50": "제주도",
  "51": "강원도",
  "52": "전라북도",
  "99": "전국",
};

// 게시글 상세에서 사용할 타입
export interface DetailProps {
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
  content: string;
}