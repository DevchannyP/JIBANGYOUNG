export interface AdminPost {
  id: number;
  title: string;
  user_id: number;
  created_at: string;
  region_id: number;
  views: number;
  likes: number;
  nickname: string;
  deleted: boolean;
}
