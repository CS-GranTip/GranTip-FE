import axios from "axios";
import { BASE_URL } from "../api/config";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ← refreshToken이 쿠키에 있을 경우
});

// accessToken 붙이기
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);
// 토큰 확인 완료 2025/09/08

// 401 → accessToken 재발급 시도
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
// 401 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("인터셉터 에러 잡힘:", error.response?.status);
    console.log("원요청:", error.config);
    const originalRequest = error.config || {};

    // 1. accessToken 만료(401) + refresh 시도 안 한 요청이면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("👉 401 조건 진입");
      if (isRefreshing) {
        console.log("토큰");
        // 이미 리프레시 중이면 기다림
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      console.log(isRefreshing);
      try {
        // refresh 전용 인스턴스
        console.log("🔵 /auth/reissue 요청 시작");
        const res = await axios.post(`${BASE_URL}/auth/reissue`, null, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        const { success, message, result } = res.data;
        console.log(res);
        console.log("🟢 /auth/reissue 응답:", res.status);
        // raw 에 토큰 저장
        // 토큰 꺼내기
        const raw =
          res.headers["authorization"] || res.headers["Authorization"];
        if (!raw) {
          console.error("토큰이 응답 헤더에 없음:", res.headers);
          processQueue(new Error("토큰 재발급 실패"), null);
          return Promise.reject(new Error("토큰재발급 실패"));
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

        console.log("토큰 재발급 완료:", newToken);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("accessToken");
        // 세션 만료 알림 추가
        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
