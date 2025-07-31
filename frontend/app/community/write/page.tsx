import dynamic from "next/dynamic";
import { Suspense } from "react";

// 💡 파일명 정확하게 맞추세요: writeForm.tsx (소문자 w) 
// 만약 실제 파일명이 WriteForm.tsx(대문자 W)면, 아래도 똑같이 대문자로!
const WriteForm = dynamic(() => import("./writeForm"), {
  ssr: false,
  loading: () => <div>폼 로딩 중...</div>,
});

export default function Page() {
  return (
    <Suspense fallback={<div>폼 로딩 중...</div>}>
      <WriteForm />
    </Suspense>
  );
}
