// utils/api.ts

import axios from "axios";

// ✅ 기본 환경: /api 경로, 쿠키(세션/JWT) 자동 포함
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // 백엔드가 httpOnly 쿠키/JWT 세션을 사용하는 경우
  timeout: 10000,
});

// ✅ 전역 에러 처리(선택, 필요시)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // 네트워크/권한 등 공통 에러 로그 처리
    if (err.response?.status === 401) {
      // 예: 토큰 만료/로그인 필요시 → 자동 로그아웃 등
      // window.location.href = "/login"; // 자동 리다이렉트 예시
    }
    return Promise.reject(err);
  }
);

export default api;
