"use client";

import React, { useState } from 'react';
import { Comment } from '@/types/comment';
import styles from './Comment.module.css';
import CommentForm from './CommentForm';

const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

interface CommentItemProps {
  comment: Comment;
  onReplySubmit: (content: string, parentId?: number) => void;
  onDelete: (commentId: number) => void; // onDelete props 추가
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReplySubmit, onDelete }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = (content: string) => {
    onReplySubmit(content, comment.id);
    setShowReplyForm(false); // 답글 작성 후 폼 숨기기
  }

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentItemSeparator}></div>
      <div className={styles.commentHeader}>
        <span className={styles.commentAuthor}>{comment.author}</span>
        {!comment.isDeleted && (
          <button 
            className={styles.deleteButton} 
            onClick={() => onDelete(comment.id)}
          >
            삭제
          </button>
        )}
      </div>
      <p className={`${styles.commentContent} ${comment.isDeleted ? styles.deleted : ''}`}>{comment.isDeleted ? "삭제된 댓글입니다." : comment.content}</p>
      
      {!comment.isDeleted && (
        <div className={styles.commentActions}>
          <span className={styles.commentDate}>작성일: {formatDateTime(comment.createdAt)}</span>
          <button 
            className={styles.replyButton}
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? '취소' : '답글 달기'}
          </button>
        </div>
      )}

      {showReplyForm && <CommentForm onSubmit={handleReplySubmit} parentId={comment.id} placeholder="대댓글을 입력하세요..." />}

      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onReplySubmit={onReplySubmit} 
              onDelete={onDelete} // onDelete props 전달
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;