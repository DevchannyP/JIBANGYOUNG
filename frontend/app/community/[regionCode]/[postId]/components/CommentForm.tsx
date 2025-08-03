"use client";

import React, { useState } from 'react';
import styles from './Comment.module.css';

interface CommentFormProps {
  onSubmit: (content: string, parentId?: number) => void;
  parentId?: number;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, parentId, placeholder = "댓글을 입력하세요..." }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content, parentId);
    setContent('');
  };

  return (
    <form className={styles.commentForm} onSubmit={handleSubmit}>
      <textarea
        className={styles.commentTextarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
      />
      <button className={styles.commentSubmitButton} type="submit">등록</button>
    </form>
  );
};

export default CommentForm;
