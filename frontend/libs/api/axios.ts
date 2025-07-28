import { useAuthStore } from "@/store/authStore";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/* ------------------------------------------------------------------ */
/* 1. 타입 선언 (AuthStore와 완전 동일하게 맞춤)                       */
/* ------------------------------------------------------------------ */
export type Tokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: string | null;
  expiresIn: number | null;
  issuedAt: string | null;
  expiresAt: string | null;
};

interface AxiosRequestConfigRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

interface ApiErrorResponse {
  code?: string;
  errorCode?: string;
  message?: string;
  [key: string]: any;
}

interface RefreshSuccessPayload {
  accessToken: string;
  refreshToken?: string;
  user: any; // 필요시 UserDto로 교체
  tokenType?: string | null;
  expiresIn?: number | null;
  issuedAt?: string | null;
  expiresAt?: string | null;
}

/* ------------------------------------------------------------------ */
/* 2. Axios 인스턴스                                                   */
/* ------------------------------------------------------------------ */
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/* ------------------------------------------------------------------ */
/* 3. 요청 인터셉터 – accessToken 주입                                 */
/* ------------------------------------------------------------------ */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* ------------------------------------------------------------------ */
/* 4. 재발급 제어 변수 및 헬퍼                                         */
/* ------------------------------------------------------------------ */
let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const subscribe = (cb: (token: string) => void) => subscribers.push(cb);
const notify = (token: string) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

/* ------------------------------------------------------------------ */
/* 5. 응답 인터셉터 – 토큰 만료 감지 & 재발급 & 강제 로그아웃          */
/* ------------------------------------------------------------------ */
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (!error.response) return Promise.reject(error); // 네트워크 오류

    const originalRequest = error.config as AxiosRequestConfigRetry;
    const status = error.response.status;
    const errCode = error.response.data?.code ?? error.response.data?.errorCode;

    // [1] accessToken 만료/오류 여부 판정
    const tokenExpired =
      status === 401 &&
      ["TOKEN_EXPIRED", "INVALID_TOKEN", "EXPIRED_ACCESS_TOKEN"].includes(errCode ?? "");

    if (!tokenExpired) return Promise.reject(error);

    // [2] refreshToken 자체가 없으면 → 강제 로그아웃 + 세션 만료 플래그
    const prevRefreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

    if (!prevRefreshToken) {
      useAuthStore.getState().logout?.();
      localStorage.setItem("sessionExpired", "true");
      return Promise.reject(error);
    }

    // [3] 이미 재발급 시도된 요청이면 반복 방지
    if (originalRequest._retry) return Promise.reject(error);
    originalRequest._retry = true;

    // [4] 토큰 리프레시 진행 중이면 큐에 대기(중복 호출 방지)
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        subscribe(async (newAccessToken) => {
          try {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            const res = await api(originalRequest);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    // [5] 실제 토큰 리프레시 시도
    isRefreshing = true;
    try {
      const refreshRes = await axios.post<
        any,
        AxiosResponse<{ data: RefreshSuccessPayload }>
      >(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
        {},
        {
          headers: {
            "Refresh-Token": prevRefreshToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const {
        accessToken,
        refreshToken: newRefreshToken,
        user,
        tokenType,
        expiresIn,
        issuedAt,
        expiresAt,
      } = refreshRes.data.data;

      // refreshToken이 오면 무조건 덮어쓰기
      const mergedRefresh = newRefreshToken ?? prevRefreshToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", mergedRefresh);

      // ✅ Tokens 구조 완전히 맞추기 (null 병합 연산자 활용)
      useAuthStore.getState().setAuth?.(user, {
        accessToken,
        refreshToken: mergedRefresh,
        tokenType: tokenType ?? null,
        expiresIn: expiresIn ?? null,
        issuedAt: issuedAt ?? null,
        expiresAt: expiresAt ?? null,
      });

      notify(accessToken);
      isRefreshing = false;

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return api(originalRequest);
    } catch (refreshErr) {
      isRefreshing = false;
      useAuthStore.getState().logout?.();
      localStorage.setItem("sessionExpired", "true");
      return Promise.reject(refreshErr);
    }
  }
);

export default api;
