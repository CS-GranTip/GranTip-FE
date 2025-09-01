import "./EmailAuthModal.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/config";
const EmailAuthModal = ({ email, onVerified, onClose }) => {
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  useEffect(() => {
    if (!canResend && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  const handleSend = async () => {
    try {
      await axios.post(`${BASE_URL}/email/send`, { email });
      alert("인증 코드가 전송되었습니다.");
      setSent(true);
      setCanResend(false);
      setResendTimer(30);
    } catch {
      alert("전송 실패");
    }
  };
  const handleVerify = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/email/verify`, { email, code });
      if (res.data.success) {
        alert("인증완료");
        onVerified();
        onClose();
      } else {
        alert("인증 실패");
      }
    } catch {
      alert("이메일 인증 서버 오류");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>이메일 인증</h3>
        <div className="email-wrapper">
          <div className="email-info">
            {!sent
              ? "아래 메일 주소로 인증 코드를 전송합니다"
              : "아래 메일 주소로 인증 코드를 발송했습니다"}
          </div>
          <div className="email-result">{email}</div>
          {!sent && (
            <button className="send-btn" onClick={handleSend}>
              인증 메일 전송
            </button>
          )}

          {sent && (
            <>
              <input
                className="email-text-input"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="인증 코드 입력"
              />
              <div className="email-send-btn" onClick={handleSend}>
                {canResend
                  ? "인증 코드 다시 보내기"
                  : `다시 보내기 (${resendTimer}s)`}
              </div>
            </>
          )}
          <div className="email-btn-send-wrapper">
            <button className="close-btn" onClick={onClose}>
              닫기
            </button>
            {sent && (
              <button className="email-verify-btn" onClick={handleVerify}>
                인증 확인
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAuthModal;
