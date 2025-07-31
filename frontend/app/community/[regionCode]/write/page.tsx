"use client";

import { createCommunityPost } from "@/libs/api/community/community.api";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const Editor = dynamic(() => import("./components/Editor"), {
  ssr: false,
  loading: () => <p>에디터 로딩 중...</p>,
});

const CATEGORY_OPTIONS = [
  { value: "FREE", label: "자유" },
  { value: "QUESTION", label: "질문" },
  { value: "SETTLEMENT_REVIEW", label: "정착후기" },
] as const;

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const regionCode = searchParams.get("write");

  // 1개의 상태로 관리
  const [form, setForm] = useState({
    title: "",
    category: "FREE" as (typeof CATEGORY_OPTIONS)[number]["value"],
    content: "",
  });
  const [loading, setLoading] = useState(false);

  // 공통 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Editor는 별도
  const handleContentChange = (v: string) => {
    setForm((prev) => ({ ...prev, content: v }));
  };

  const handleSubmit = async () => {
    if (!regionCode) {
      alert("지역 코드가 없습니다.");
      return;
    }
    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      await createCommunityPost({
        ...form,
        regionId: Number(regionCode),
        userId: 1, // TODO: 유저 정보 전역 상태에서 받아오기
      });
      alert("게시글이 작성되었습니다.");
      router.push(`/community/${regionCode}`);
    } catch (error) {
      console.error(error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>글 작성</h1>
      <input
        name="title"
        type="text"
        placeholder="제목을 입력하세요"
        value={form.title}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "1rem", fontSize: "1rem" }}
      />
      <select
        title="category"
        name="category"
        value={form.category}
        onChange={handleChange}
        style={{ marginBottom: "1rem" }}
      >
        {CATEGORY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Editor
        initialData="<p>내용을 입력하세요...</p>"
        onChange={handleContentChange}
      />
      <div style={{ marginTop: "2rem" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
