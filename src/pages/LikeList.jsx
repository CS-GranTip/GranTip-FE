import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LikeList.css";
import ScholarshipTip from "../components/scholarship/ScholarShipTip";
import api from "../utils/axios";
const LikeList = () => {
  const [likeScholarships, setLikeScholarships] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLikeList = async () => {
      try {
        const res = await api.get("/api/favorites");
        if (res.data.success) {
          setLikeScholarships(res.data.result.content);
        }
      } catch (error) {
        console.error(error);
        alert("서버 에러 발생");
      }
    };
    fetchLikeList();
  }, []);

  return (
    <div className="likeList">
      <div className="search-wrapper">
        <h1>좋아요한 장학금</h1>
        <h2 className="go-back-like" onClick={() => navigate("/mypage")}>
          뒤로가기
        </h2>
        <div className="search-list">
          {likeScholarships.length === 0 && <div>좋아요한 장학금이 없어요</div>}
          {likeScholarships.map((s) => (
            <div
              className="search-card"
              key={s.id}
              onClick={() => navigate(`/detail/${s.id}`)}
            >
              <h3>{s.productName}</h3>
              <div className="card-info-wrapper">
                <div className="info-category">
                  {s.providerName} / {s.productType} / {s.scholarshipCategory}
                </div>
                <div className="info-date">
                  모집기한 : {s.applicationStartDate} ~ {s.applicationEndDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ScholarshipTip />
    </div>
  );
};
export default LikeList;
