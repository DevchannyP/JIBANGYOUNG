"use client";

import { formatDetailDate } from "@/libs/utils/date";
import { Comment } from "@/types/comment";
import React, { useState } from "react";
import styles from "./Comment.module.css";
import CommentForm from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  onReplySubmit: (content: string, parentId?: number) => void;
  onDelete: (commentId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReplySubmit,
  onDelete,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = (content: string) => {
    onReplySubmit(content, comment.id);
    setShowReplyForm(false);
  };

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentItemSeparator}></div>
      {comment.isDeleted ? (
        // 삭제된 댓글일 때는 삭제 메시지만 표시
        <p className={`${styles.commentContent} ${styles.deleted}`}>
          작성자가 삭제한, 블라인드 처리된 댓글입니다.
        </p>
      ) : (
        // 삭제되지 않은 댓글일 때만 모든 UI 요소 표시
        <>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>{comment.author}</span>
            <button
              className={styles.deleteButton}
              onClick={() => onDelete(comment.id)}
            >
              삭제
            </button>
          </div>
          <p className={styles.commentContent}>{comment.content}</p>
          <div className={styles.commentActions}>
            <span className={styles.commentDate}>
              작성일: {formatDetailDate(comment.createdAt)}
            </span>
            <button
              className={styles.replyButton}
              onClick={() => setShowReplyForm((v) => !v)}
            >
              {showReplyForm ? "취소" : "답글 달기"}
            </button>
          </div>
          {showReplyForm && (
            <CommentForm
              onSubmit={handleReplySubmit}
              parentId={comment.id}
              placeholder="대댓글을 입력하세요..."
            />
          )}
        </>
      )}

      {/* 답글은 삭제 여부와 관계없이 항상 표시 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReplySubmit={onReplySubmit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
