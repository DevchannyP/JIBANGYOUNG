import React from 'react';
import { Comment } from '@/types/comment';
import CommentItem from './CommentItem';
import styles from './Comment.module.css';

interface CommentListProps {
  comments: Comment[];
  onReplySubmit: (content: string, parentId?: number) => void;
  onDelete: (commentId: number) => void; // onDelete props 추가
}

const CommentList: React.FC<CommentListProps> = ({ comments, onReplySubmit, onDelete }) => {
  const topLevelComments = comments.filter(comment => comment.parentId === null);

  return (
    <div className={styles.commentList}>
      {topLevelComments.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
          onReplySubmit={onReplySubmit} 
          onDelete={onDelete} // onDelete props 전달
        />
      ))}
    </div>
  );
};

export default CommentList;
