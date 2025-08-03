import { Comment } from "@/types/comment";
import api from "@/libs/api/axios"; // axios 인스턴스 임포트

// 댓글 목록 조회 API
export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const res = await api.get(`/api/community/posts/${postId}/comments`);
  return res.data;
};

// 댓글 작성 API
export const postComment = async (
  postId: string,
  content: string,
  parentId?: number
): Promise<Comment> => {
  const res = await api.post(`/api/community/posts/${postId}/comments`, {
    content,
    parentId,
    userId: 1, // 하드코딩된 userId
    author: "GuestUser", // 하드코딩된 author
  });
  return res.data;
};

// 댓글 삭제 API
export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/api/community/comments/${commentId}`);
};