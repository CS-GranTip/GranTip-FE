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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. accessToken 만료(401) + refresh 시도 안 한 요청이면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // 이미 리프레시 중이면 기다림
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.post(`${BASE_URL}/auth/reissue`, null, {
          withCredentials: true, // 쿠키 기반 refreshToken
        });

        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        console.log("토큰재발급");
        api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("accessToken");

        // 세션 만료 알림 추가
        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
        window.location.reload(true);
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
