import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import axios from "axios";
import { BASE_URL } from "../../api/config";
const EditPW = () => {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [reRePassword, setReRePassword] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  useEffect(() => {
    const editPassword = async () => {
      try {
        const emailRes = await api.get("/user");
        if (emailRes.data.success) {
          const user = emailRes.data.result;
          setEmail(user.email);
        }
      } catch (error) {
        console.error(error);
        alert("비밀번호 변경 에러");
      }
    };
    editPassword();
  }, []);
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const isFormPw = rePassword === reRePassword && rePassword.length > 7;
  const isFormValid = password.length > 7;
  const loginProcess = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email: email,
        password: password,
      });
      console.log(res.data);
      const { success, message, result } = res.data;
      if (success) {
        setIsTransitioning(true);
        setTimeout(() => {
          setStep(2);
          setIsTransitioning(false);
        }, 300); // CSS transition 시간과 맞춤
      } else {
        alert(message || "로그인 실패\n이메일 및 비밀번호를 확인해주세요");
      }
    } catch (error) {
      console.error("❌ 로그인 오류:", error.message);
      alert("서버 오류입니다. 잠시 후 다시 시도해주세요.", error.message);
    }
  };
  const editPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/password/update", {
        newPassword: rePassword,
      });
      console.log("서버 응답:", res.data);
      if (res.data.success) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        nav("/mypage");
      } else {
        alert("실패");
      }
    } catch (error) {
      console.error("비밀번호 변경 서버 오류");
    }
  };
  return (
    <div className="page-wrapper">
      <div className="signup-page">
        <div className={`signup-input ${isTransitioning ? "fade-out" : ""}`}>
          {step === 1 && (
            <div>
              <h1>
                비밀번호 변경을 위해
                <br /> 다시 로그인해주세요
              </h1>
              <div>
                <div className="login-email">* 이메일</div>
                <div className="login-email-input" type="text">
                  {email}
                </div>
                <div className="login-pass">* 비밀번호</div>
                <input
                  className="login-pass-input"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <button
                className={`login-btn ${isFormValid ? "active" : ""}`}
                disabled={!isFormValid}
                onClick={loginProcess}
              >
                다음으로
              </button>
            </div>
          )}
          {step === 2 && (
            <>
              <h1>
                변경할 비밀번호를
                <br /> 입력해주세요
              </h1>
              <div>
                <div className="login-email">* 비밀번호</div>
                <input
                  className="login-pass-input"
                  type="password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
                <div className="login-pass">* 비밀번호 확인</div>
                <input
                  className="login-pass-input"
                  type="password"
                  value={reRePassword}
                  onChange={(e) => setReRePassword(e.target.value)}
                />
              </div>
              <button
                className={`login-btn ${isFormPw ? "active" : ""}`}
                disabled={!isFormPw}
                onClick={editPassword}
              >
                변경하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPW;
