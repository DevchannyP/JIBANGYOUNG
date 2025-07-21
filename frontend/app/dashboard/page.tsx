"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // 로그인 안 된 상태면 로그인 페이지로
      router.replace("/auth/login");
    }
  }, [user, router]);

  if (!user) return null; // or Loading...

  return (
    <div>
      <h1>{user.username}님 환영합니다!</h1>
      {/* ... */}
    </div>
  );
}
