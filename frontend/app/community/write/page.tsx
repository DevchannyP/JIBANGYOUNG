"use client";

import { createCommunityPost } from "@/libs/api/community/community.api";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const Editor = dynamic(() => import("./components/Editor"), {
  ssr: false,
  loading: () => <p>에디터 로딩 중...</p>,
});

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const regionCode = searchParams.get("regionCode");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<
    "FREE" | "QUESTION" | "SETTLEMENT_REVIEW"
  >("FREE");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!regionCode) {
      alert("지역 코드가 없습니다.");
      return;
    }

    try {
      await createCommunityPost({
        title,
        category,
        content,
        regionId: Number(regionCode),
        userId: 1,
      });

      alert("게시글이 성공적으로 등록되었습니다.");
      router.push(`/community/${regionCode}`);
    } catch (error) {
      console.error(error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>글 작성</h1>

      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", fontSize: "1rem" }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as any)}
        style={{ marginBottom: "1rem" }}
      >
        <option value="FREE">자유</option>
        <option value="QUESTION">질문</option>
        <option value="SETTLEMENT_REVIEW">정착후기</option>
      </select>

      <Editor initialData="<p>내용을 입력하세요...</p>" onChange={setContent} />

      <div style={{ marginTop: "2rem" }}>
        <button onClick={handleSubmit}>저장</button>
      </div>
    </div>
  );
}
