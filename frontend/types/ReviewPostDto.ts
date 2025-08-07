export interface ReviewPostDto {
  id: number;
  regionId: number;
  title: string;
  content: string;
  nickname: string;
  regionName: string;
  thumbnailUrl: string | null;
}
