import { useState } from "react";
import api from "../../utils/axios";
import "./SelectListModal.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../utils/axios";

const DeleteUser = ({ username, onClose }) => {
  const { logout } = useAuthStore();
  const nav = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const handleDelete = async () => {
    try {
      const res = await api.delete("/user");
      if (res.data.success) {
        alert("정상적으로 회원탈퇴 되었습니다.");
        nav("/");
        logout();
      } else {
        alert("일시적 오류");
      }
    } catch (err) {
      console.log(err);
      alert("유저삭제 서버오류");
    }
  };
  const handleBtn = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="delete">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>회원탈퇴</h3>
          <h2>장학금 추천 기록 및 개인정보는 모두 삭제됩니다.</h2>
          <input
            className="email-text-input"
            type="text"
            value={inputValue}
            onChange={handleBtn}
            placeholder="사용자명을 입력하세요"
          ></input>
          <button
            className={`email-verify-btn ${
              inputValue === username ? "active" : ""
            }`}
            onClick={handleDelete}
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteUser;
