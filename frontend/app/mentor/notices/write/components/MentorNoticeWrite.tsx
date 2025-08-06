"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { createMentorNotice } from "@/libs/api/mentor/mentor.api";
import { getRegionsBoard } from "@/libs/api/region.api";
import type { Region } from "@/types/api/region.d";
import styles from "../MentorNoticeWrite.module.css";

const MentorNoticeEditor = dynamic(() => import("./MentorNoticeEditor"), {
  ssr: false,
  loading: () => <p>에디터 로딩 중...</p>,
});

export default function MentorNoticeWrite() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [regions, setRegions] = useState<Region[]>([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    regionId: searchParams.get("regionId") || "", // 기본값 없음
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionData = await getRegionsBoard();
        setRegions(regionData);
      } catch (error) {
        console.error("지역 목록을 불러오지 못했습니다:", error);
      }
    };
    fetchRegions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setForm(prev => ({ ...prev, content }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!form.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (!form.regionId) {
      alert("지역을 선택해주세요.");
      return;
    }

    setLoading(true);
    try {
      const noticeId = await createMentorNotice({
        title: form.title,
        content: form.content,
        regionId: Number(form.regionId),
      });
      
      alert("공지사항이 작성되었습니다.");
      router.push(`/mentor/notices/${noticeId}`);
    } catch (error) {
      console.error(error);
      alert("작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className={styles.form}>
      {/* 지역 선택 */}
      <div className={styles.formRow}>
        <label className={styles.label}>지역선택</label>
        <select
          name="regionId"
          value={form.regionId}
          onChange={handleChange}
          className={styles.regionSelect}
        >
          <option value="">지역을 선택하세요</option>
          {regions.map((region) => (
            <option key={region.regionCode} value={region.regionCode}>
              {region.sido}
              {region.guGun && ` ${region.guGun}`}
            </option>
          ))}
        </select>
      </div>

      {/* 제목 입력 */}
      <div className={styles.formRow}>
        <label className={styles.label}>제목</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          className={styles.titleInput}
        />
      </div>

      {/* CKEditor */}
      <div className={styles.editorContainer}>
        <MentorNoticeEditor 
          initialData={form.content}
          onChange={handleContentChange}
        />
      </div>

      {/* 액션 버튼 */}
      <div className={styles.actions}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "작성 중..." : "작성"}
        </button>
        <button
          onClick={handleCancel}
          className={styles.cancelButton}
        >
          취소
        </button>
      </div>
    </div>
  );
}