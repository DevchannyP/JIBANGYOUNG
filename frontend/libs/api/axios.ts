// libs/api/axios.ts
import { useAuthStore } from "@/store/authStore";
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

/* ------------------------------------------------------------------ */
/* 1. 타입 선언                                                        */
/* ------------------------------------------------------------------ */
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
  user: any; // 필요하면 UserDto로 교체
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  issuedAt: string;
  expiresAt: string;
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
/* 5. 응답 인터셉터 – 토큰 만료 감지 & 재발급                          */
/* ------------------------------------------------------------------ */
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (!error.response) return Promise.reject(error); // 네트워크 오류

    const originalRequest = error.config as AxiosRequestConfigRetry;
    const status = error.response.status;
    const errCode = error.response.data?.code ?? error.response.data?.errorCode;

    const tokenExpired =
      status === 401 &&
      ["TOKEN_EXPIRED", "INVALID_TOKEN", "EXPIRED_ACCESS_TOKEN"].includes(
        errCode ?? ""
      );

    if (!tokenExpired) return Promise.reject(error);

    /* 이미 한 번 재시도했다면 그대로 에러 반환 */
    if (originalRequest._retry) return Promise.reject(error);
    originalRequest._retry = true;

    const refreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

    if (!refreshToken) {
      useAuthStore.getState().logout();
      localStorage.setItem("sessionExpired", "true");
      return Promise.reject(error);
    }

    /* ----- ① 재발급 진행 중이면 큐에 보관 ----- */
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        subscribe(async (newToken) => {
          try {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            const res = await api(originalRequest);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    /* ----- ② 실제 리프레시 호출 ----- */
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
            "Refresh-Token": refreshToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const {
        accessToken,
        refreshToken: newRefreshToken,
        user,
      } = refreshRes.data.data;

      /* 로컬·상태 갱신 */
      localStorage.setItem("accessToken", accessToken);
      const mergedRefresh = newRefreshToken ?? refreshToken;
      localStorage.setItem("refreshToken", mergedRefresh);

      // ✅ setAuth(user, tokens) 두 인자 호출
      useAuthStore
        .getState()
        .setAuth(user, { accessToken, refreshToken: mergedRefresh } as Tokens);

      notify(accessToken);
      isRefreshing = false;

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return api(originalRequest);
    } catch (refreshErr) {
      isRefreshing = false;
      useAuthStore.getState().logout();
      localStorage.setItem("sessionExpired", "true");
      return Promise.reject(refreshErr);
    }
  }
);

export default api;
