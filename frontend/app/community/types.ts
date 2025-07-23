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
  "11": "서울특별시",
  "26": "부산광역시",
  "27": "대구광역시",
  "28": "인천광역시",
  "29": "광주광역시",
  "30": "대전광역시",
  "31": "울산광역시",
  "36": "세종시",
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
