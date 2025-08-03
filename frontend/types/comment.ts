export interface Comment {
  id: number;
  userId: number;
  author: string; // 작성자 닉네임
  content: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  parentId: number | null;
  replies: Comment[]; // 대댓글
}
