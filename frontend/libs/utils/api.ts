// utils/api.ts

import axios from "axios";

// ✅ 기본 환경: /api 경로, 쿠키(세션/JWT) 자동 포함
export const api = axios.create({
  baseURL: "http://localhost:8080/api", // ✅ 절대 경로로 직접 설정
  withCredentials: true, // 백엔드가 httpOnly 쿠키/JWT 세션을 사용하는 경우
  timeout: 10000,
});

// ✅ 요청 시 accessToken 자동 첨부
// ✅ 요청 시 accessToken 자동 첨부
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        // ✅ Axios v1 이상에서는 headers를 직접 덮어쓰지 말고 set() 또는 객체 접근 방식 사용
        if (config.headers && typeof config.headers.set === "function") {
          config.headers.set("Authorization", `Bearer ${token}`);
        } else {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
