"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const provider = searchParams.get("provider");
      const error = searchParams.get("error");

      // ✅ 에러일 때 /login 으로 보내지 말고 현재 페이지에서 처리
      if (error) {
        setErrorMsg(decodeURIComponent(error));
        return;
      }

      if (accessToken && refreshToken) {
        try {
          const decodedAccessToken = decodeURIComponent(accessToken);
          const decodedRefreshToken = decodeURIComponent(refreshToken);

          localStorage.setItem("accessToken", decodedAccessToken);
          localStorage.setItem("refreshToken", decodedRefreshToken);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
            { headers: { Authorization: `Bearer ${decodedAccessToken}` } }
          );

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              setAuth(result.data, {
                accessToken: decodedAccessToken,
                refreshToken: decodedRefreshToken,
                tokenType: "Bearer",
                expiresIn: 3600,
                issuedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
              });
              router.replace("/"); // ✅ 성공 시 홈으로
              return;
            }
          }
          // 실패 시 에러 표시
          setErrorMsg("사용자 정보 조회 실패");
        } catch (e) {
          console.error("콜백 처리 실패:", e);
          setErrorMsg("콜백 처리 중 오류가 발생했습니다");
        }
      } else {
        setErrorMsg("토큰 정보가 없습니다");
      }
    };

    handleCallback();
  }, [searchParams, router, setAuth]);

  if (errorMsg) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mt-4 text-red-600">로그인 실패: {errorMsg}</p>
          <button
            className="mt-6 px-4 py-2 rounded bg-gray-800 text-white"
            onClick={() => router.replace("/")}
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-primary"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
