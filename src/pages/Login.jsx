import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../api/config.js";
const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

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

  const handleEmailFocus = () => {
    setIsFocused(true);
  };

  const loginProcess = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { success, message, result } = res.data;
      console.log(res.data);

      if (!success) {
        alert(message || "로그인 실패\n이메일 및 비밀번호를 확인해주세요");
        return;
      }
      const accessToken = res.headers["authorization"];
      localStorage.setItem("accessToken", accessToken);
      console.log(accessToken);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error("❌ 로그인 오류:", error.message);
      alert("서버 오류입니다. 잠시 후 다시 시도해주세요.", error.message);
    }
  };

  const signupProcess = () => {
    navigate("/signup");
  };
  const speedLoginProcess = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          email: "lgm04@naver.com",
          password: "@newddong868123",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const accessToken = res.headers["authorization"];
      localStorage.setItem("accessToken", accessToken);
      console.log(accessToken);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error("❌ 로그인 오류:", error.message);
      alert("서버 오류입니다. 잠시 후 다시 시도해주세요.", error.message);
    }
  };
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
            onChange={handleEmailChange}
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
            onChange={handlePasswordChange}
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
