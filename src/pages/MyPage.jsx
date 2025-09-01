import { useEffect, useState } from "react";
import ScholarshipCalendar from "../components/Modal/ScholarshipCalendar";
import "./MyPage.css";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import DeleteUser from "../components/Modal/DeleteUser";
const MyPage = ({ setIsLogged }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [likeInfo, setLikeInfo] = useState([]);
  const [deleteUser, setDeleteUser] = useState(false);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const [userRes, likeRes] = await Promise.all([
          api.get("user/mypage"),
          api.get("/api/favorites"),
        ]);

        if (userRes.data.success && likeRes.data.success) {
          setUserInfo(userRes.data.result);
          setLikeInfo(likeRes.data.result.content);
        } else {
          alert("유저 정보를 찾을 수 없습니다.");
          setIsLogged(false);
          navigate("/");
        }
      } catch (error) {
        alert("서버 오류.");
        // navigate("/");
      }
    };
    fetchUserInfo();
  }, []);
  if (!userInfo) return <div>로딩 중...</div>;
  return (
    <div className="my-page">
      <div className="user-header">
        <h1>{userInfo.username} 님의 마이페이지</h1>
        <div
          className="user-info-editing"
          onClick={() => {
            navigate("/edit");
          }}
        >
          나의정보편집
        </div>
      </div>
      <div className="user-info">
        <div className="user-info-section">
          <div className="user-info-name">{userInfo.username}</div>
          <div className="user-info-school">{userInfo.userUniversity}</div>
        </div>
        <div className="v-line"></div>
        <div className="user-info-section">
          <div className="scholar-mark">좋아요한 장학금</div>
          <div className="scholar-mark-num">
            {likeInfo.length
              ? `${likeInfo.length}개`
              : "좋아요한 장학금이 없어요"}
          </div>
        </div>
      </div>
      <div className="scholar-info">
        <h3>마감 임박 장학금</h3>
        <div className="tip-more" onClick={() => navigate("/like")}>
          더보기
        </div>
        <div className="scholar-info-list">
          {likeInfo.length > 0 &&
            [...likeInfo] // 원본 변경 방지용 복사
              .sort(
                (a, b) =>
                  new Date(a.applicationEndDate) -
                  new Date(b.applicationEndDate)
              )
              .map((e) => (
                <div
                  className="scholar-info-card"
                  onClick={() => navigate(`/detail/${e.id}`)}
                  key={e.id}
                >
                  <div className="scholar-info-name">{e.productName}</div>
                  <div className="scholar-info-date">
                    {e.applicationEndDate}
                  </div>
                </div>
              ))}

          {likeInfo.length === 0 && <div>좋아요한 장학금이 없어요</div>}
        </div>
      </div>
      <div className="scholar-calendar">
        <div className="calender-section">
          <ScholarshipCalendar subscribedScholarships={likeInfo} />
        </div>
      </div>
      <div className="user-delete" onClick={() => setDeleteUser(true)}>
        회원탈퇴
      </div>
      {deleteUser && (
        <DeleteUser
          username={userInfo.username}
          onClose={() => setDeleteUser(false)}
          setIsLogged={setIsLogged}
        />
      )}
    </div>
  );
};
export default MyPage;
