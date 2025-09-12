import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../api/config.js";
import { useAuthStore } from "../utils/axios.js";

const Login = () => {
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFormValid = emailRegex.test(email) && password.length > 7;

  const handleEmailBlur = () => {
    setIsFocused(false);
    if (email === "" || emailRegex.test(email)) {
      setEmailError("");
    } else {
      setEmailError("이메일 형식으로 작성해주세요");
    }
  };
  const handleEmailFocus = () => setIsFocused(true);

  const handleLogin = async (loginData) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, loginData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const { success, message } = res.data;
      if (!success) {
        alert(message || "로그인 실패 \n 이메일 및 비밀번호를 확인해주세요");
      }
      const accessToken = res.headers["authorization"];
      if (!accessToken) {
        console.error("토큰이 헤더에 없습니다.");
        return;
      }
      login(accessToken);
      navigate("/");
    } catch (error) {
      console.error("로그인 오류", error.message);
      alert("서버 오류입니다. 잠시 후 다시 시도해주세요");
    }
  };

  const loginProcess = (e) => {
    e.preventDefault();
    handleLogin({ email, password });
  };
  const speedLoginProcess = (e) => {
    e.preventDefault();
    handleLogin({
      email: "lgm04@naver.com",
      password: "@newddong868123",
    });
  };
  const signupProcess = () => navigate("/signup");

  return (
    <div className="page-wrapper">
      <div className="page">
        <h1>로그인</h1>
        <div className="login-input">
          <div className="login-email">* 이메일</div>
          <input
            className="login-email-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
          />

          <div
            className={`error-message ${
              !isFocused && emailError ? "show" : ""
            }`}
          >
            {!isFocused && emailError ? emailError : ""}
          </div>

          <div className="login-pass">* 비밀번호</div>
          <input
            className="login-pass-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <button
          className={`login-btn ${isFormValid ? "active" : ""}`}
          disabled={!isFormValid}
          onClick={loginProcess}
        >
          로그인
        </button>
        <div className="login-tip">
          <div className="login-signup">GranTip 회원이 아니신가요?</div>
          <div className="login-signup-btn" onClick={signupProcess}>
            회원가입
          </div>
          <button onClick={speedLoginProcess}>바로로그인</button>
        </div>
      </div>
    </div>
  );
};
export default Login;
