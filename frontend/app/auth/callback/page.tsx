"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-primary"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const provider = searchParams.get("provider"); // 사용 중 아니지만 향후 확장 대비
      const error = searchParams.get("error");

      // 에러 메시지 전달된 경우
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
              router.replace("/");
              return;
            }
          }
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
    // searchParams는 App Router에서 URL 변경 시 새 객체가 되므로 deps에 포함
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

  // 로딩 화면은 Suspense fallback에서 처리되므로 여기서는 렌더링할 게 없음
  return null;
}
