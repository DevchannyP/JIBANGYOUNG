import { Comment } from "@/types/comment";
import React from "react";
import styles from "./Comment.module.css";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onReplySubmit: (content: string, parentId?: number) => void;
  onDelete: (commentId: number) => void; // onDelete props 추가
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onReplySubmit,
  onDelete,
}) => {
  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null
  );

  return (
    <div className={styles.commentList}>
      {topLevelComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReplySubmit={onReplySubmit}
          onDelete={onDelete} // onDelete props 전달
          isReply={false} // 최상위 댓글이므로 isReply는 false
        />
      ))}
    </div>
  );
};

export default CommentList;
