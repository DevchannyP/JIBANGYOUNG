// app/community/write/page.tsx 또는 HelloPage.tsx (라우트 엔트리 파일)

import dynamic from "next/dynamic";
import { Suspense } from "react";

const WriteForm = dynamic(() => import("./writeForm"), {
  ssr: false,
  loading: () => <div>폼 로딩 중...</div>,
});

export default function HelloPage() {
  return (
    <Suspense fallback={<div>폼 로딩 중...</div>}>
      <WriteForm />
    </Suspense>
  );
}
