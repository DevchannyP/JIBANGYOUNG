"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Editor 컴포넌트를 동적으로 임포트 (SSR 비활성화)
const Editor = dynamic(() => import("./components/Editor"), {
  ssr: false,
  loading: () => (
    <div>
      <p>에디터 로딩 중...</p>
    </div>
  ),
});

export default function Page() {
  const [content, setContent] = useState("");

  return (
    <div>
      <h1>글 작성</h1>

      <Editor initialData="<p>내용을 입력하세요...</p>" onChange={setContent} />

      <div>
        <button onClick={() => console.log(content)}>저장</button>
      </div>
    </div>
  );
}
