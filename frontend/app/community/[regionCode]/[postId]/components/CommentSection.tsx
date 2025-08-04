"use client";

import {
  deleteComment,
  fetchComments,
  postComment,
} from "@/libs/api/community/comment.api";
import { Comment } from "@/types/comment";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Comment.module.css";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

import { useAuthStore } from "@/store/authStore";

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await fetchComments(postId);
      setComments(fetchedComments);
      setError(null);
    } catch (err) {
      setError("댓글을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleCommentSubmit = async (content: string, parentId?: number) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      await postComment(postId, content, parentId);
      await loadComments();
    } catch (err) {
      alert("댓글 작성에 실패했습니다.");
      console.error(err);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        await deleteComment(commentId);
        await loadComments(); // 목록 새로고침
      } catch (err) {
        alert("댓글 삭제에 실패했습니다.");
        console.error(err);
      }
    }
  };

  if (isLoading) return <div>댓글을 불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.commentTitle}>댓글 ({comments.length})</h3>
      <CommentForm onSubmit={handleCommentSubmit} />
      <CommentList
        comments={comments}
        onReplySubmit={handleCommentSubmit}
        onDelete={handleCommentDelete}
      />
    </div>
  );
};

export default CommentSection;
