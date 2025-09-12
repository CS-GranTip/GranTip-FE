import axios from "axios";
import { BASE_URL } from "../api/config";
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

//----------------
// Zustand Auth Store
//----------------
export const useAuthStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem("accessToken"),

  login: (token) => {
    localStorage.setItem("accessToken", token);
    set({ isLoggedIn: true });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ isLoggedIn: false });
  },
}));

//----------------
// JWT 만료 체크
//----------------
function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

//----------------
// Axios 인스턴스
//----------------
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // refreshToken 쿠키
});

//----------------
// Request Interceptor
//----------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (isTokenExpired(token)) {
        useAuthStore.getState().logout();
        throw new Error("토큰 만료");
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);
// 토큰 확인 완료 2025/09/08

//----------------
// Response Interceptor
//----------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
// 401 => 재발급 시도 및 원본 요청 재 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    // 1. accessToken 만료(401) + refresh 시도 안 한 요청이면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      isRefreshing = true;
      try {
        // refresh 요청
        const res = await axios.post(`${BASE_URL}/auth/reissue`, null, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        // raw 에 토큰 저장
        // 토큰 꺼내기
        const raw =
          res.headers["authorization"] || res.headers["Authorization"];
        if (!raw) {
          throw new Error("토큰 재발급 실패 : 응답 헤더 없음");
        }

        // "Bearer " 접두사 제거
        const newToken = raw.startsWith("Bearer ") ? raw.slice(7) : raw;

        // localStorage 저장 + api 인스턴스 갱신
        localStorage.setItem("accessToken", newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        // 기존 요청 헤더에도 적용
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // 대기중이던 요청 처리
        processQueue(null, newToken);

        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        useAuthStore.getState().logout();
        // 세션 만료 알림 추가
        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
