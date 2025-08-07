"use client";

import React, { useState } from 'react';
import styles from './Comment.module.css';
import { useAuthStore } from "@/store/authStore";

interface CommentFormProps {
  onSubmit: (content: string, parentId?: number) => void;
  parentId?: number;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, parentId, placeholder = "댓글을 입력하세요..." }) => {
  const [content, setContent] = useState('');
  const user = useAuthStore((state) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!content.trim()) return;
    onSubmit(content, parentId);
    setContent('');
  };

  if (!user) {
    return (
      <div className={styles.commentForm}>
        <div className={styles.loginMessage}>
          댓글을 작성하려면 로그인해주세요.
        </div>
      </div>
    );
  }

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
