import "./Header.css";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { useEffect } from "react";
const Header = ({ setSearchText, isLoggedIn, setLogin }) => {
  const navigate = useNavigate();
  const homeHandler = () => {
    navigate("/");
    setSearchText("");
  };
  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");
      if (res.data.success) {
        navigate("/");
        setLogin(false);
        localStorage.removeItem("accessToken");
      } else {
        console.log(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {});
  return (
    <div className="header-wrapper">
      <div className="header-inner">
        <h1 onClick={homeHandler}>GranTip</h1>
        <div className="categoryFilter">
          <div>지역연고</div>
          <div>성적우수</div>
          <div>소득분위</div>
          <div>특수계층</div>
          <div>기타</div>
        </div>
        {!isLoggedIn ? (
          <div className="user-menu">
            <div onClick={() => navigate("/login")}>로그인</div>
            <div>/</div>
            <div onClick={() => navigate("/signup")}>회원가입</div>
          </div>
        ) : (
          <div className="user-menu">
            <div onClick={() => navigate("/mypage")}>마이페이지</div>
            <div>/</div>
            <div onClick={handleLogout}>로그아웃</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Header;
