"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import LoadingCenter from "./components/LoadingCenter";

const RegisterForm = dynamic(() => import("./components/RegisterForm"), {
  ssr: false,
  loading: () => <LoadingCenter text="회원가입 폼 불러오는 중..." />,
});

export default function RegisterPageClient() {
  return (
    <Suspense fallback={<LoadingCenter text="회원가입 폼 불러오는 중..." />}>
      <RegisterForm />
    </Suspense>
  );
}
