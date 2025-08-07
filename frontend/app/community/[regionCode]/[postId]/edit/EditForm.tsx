"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { updateCommunityPost } from "@/libs/api/community/community.api";
import dynamic from "next/dynamic";
import styles from "../../../write/components/Write.module.css";

const Editor = dynamic(() => import("../../../write/components/Editor"), {
  ssr: false,
  loading: () => <p>에디터 로딩 중...</p>,
});

const CATEGORY_OPTIONS = [
  { value: "FREE", label: "자유" },
  { value: "QUESTION", label: "질문" },
  { value: "SETTLEMENT_REVIEW", label: "정착후기" },
] as const;

const ADMIN_CATEGORY_OPTIONS = [
  { value: "FREE", label: "자유" },
  { value: "QUESTION", label: "질문" },
  { value: "SETTLEMENT_REVIEW", label: "정착후기" },
  { value: "NOTICE", label: "공지사항" },
] as const;

interface Props {
  regionCode: string;
  postId: string;
  initialData: any;
}

export default function EditForm({ regionCode, postId, initialData }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();

  // 유저 권한 확인
  const isPrivilegedUser = user?.role && ["ADMIN", "MENTOR_A", "MENTOR_B", "MENTOR_C"].includes(user.role);
  const availableCategories = isPrivilegedUser ? ADMIN_CATEGORY_OPTIONS : CATEGORY_OPTIONS;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "FREE",
    content: initialData?.content || "",
  });
  const [isNotice, setIsNotice] = useState(initialData?.isNotice || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 작성자가 아니면 접근 불가
    if (user && initialData?.author && user.username !== initialData.author) {
      alert("본인이 작성한 게시글만 수정할 수 있습니다.");
      router.back();
    }
  }, [user, initialData, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // 공지사항 카테고리 선택 시 isNotice를 true로 설정
    if (name === "category") {
      if (value === "NOTICE") {
        setIsNotice(true);
      } else {
        setIsNotice(false);
      }
    }
  };

  const handleContentChange = (v: string) => {
    setForm((prev) => ({ ...prev, content: v }));
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("로그인 상태를 확인할 수 없습니다.");
      return;
    }
    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    
    setLoading(true);
    try {
      await updateCommunityPost(postId, {
        ...form,
        isNotice: form.category === "NOTICE" ? isNotice : false,
      });
      
      alert("게시글이 수정되었습니다.");
      router.push(`/community/${regionCode}/${postId}`);
    } catch (error) {
      console.error(error);
      alert("게시글 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.writeForm}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          로그인이 필요합니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.writeForm}>
      <div className={styles.writeHeader}>
        <h1 className={styles.writeTitle}>글 수정</h1>
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>제목 및 카테고리</label>
        <div className={styles.titleCategoryRow}>
          <div className={styles.categorySection}>
            <select
              title="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={styles.categorySelect}
            >
              {availableCategories.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            
            {form.category === "NOTICE" && (
              <div className={styles.noticeOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isNotice}
                    onChange={(e) => setIsNotice(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>최상단 고정</span>
                </label>
              </div>
            )}
          </div>
          
          <div className={styles.titleSection}>
            <input
              name="title"
              type="text"
              placeholder="제목을 입력하세요"
              value={form.title}
              onChange={handleChange}
              className={styles.titleInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>내용</label>
        <div className={styles.editorWrapper}>
          <Editor 
            onChange={handleContentChange} 
            initialData={initialData?.content || ""}
          />
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button 
          type="button" 
          className={styles.cancelButton}
          onClick={() => router.back()}
        >
          취소
        </button>
        <button 
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? "수정 중..." : "수정 완료"}
        </button>
      </div>
    </div>
  );
}