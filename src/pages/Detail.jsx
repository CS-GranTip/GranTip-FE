import { parseSemesterRange } from "../utils/semesterParser";
import { useParams } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { useState, useEffect } from "react";
import AutoFitText from "../utils/AutoFitText.jsx";
import "./Detail.css";
import axios from "axios";
import { BASE_URL } from "../api/config.js";
import api from "../utils/axios.js";

const Detail = ({ isLoggedIn }) => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const token = localStorage.getItem("accessToken");
  const [animate, setAnimate] = useState(false);
  const [scholarship, setScholarship] = useState(null);
  const infoFields = [
    { key: "departmentCategory", label: "학과 구분" },
    { key: "universityCategories", label: "대학 구분" },
    { key: "gradeCategory", label: "학년 구분" },
  ];
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const scholarshipRes = await axios.get(
          `${BASE_URL}/api/scholarships/${parseInt(id)}`
        );
        if (!scholarshipRes.data.success)
          throw new Error("장학금 정보 불러오기 실패");
        setScholarship(scholarshipRes.data.result);
        if (isLoggedIn) {
          const likeRes = await api.get("/api/favorites");
          if (likeRes.data.success) {
            const likeContent = likeRes.data.result.content;
            setLikeList(likeContent);
            setLiked(likeContent.some((item) => item.id === parseInt(id)));
          }
        }
      } catch (err) {
        console.error("에러 발생:", err);
        alert("서버 오류로 장학금 목록을 불러올 수 없습니다.");
      }
    };
    fetchAll();
  }, [id, isLoggedIn, liked]);

  const handleHeart = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다");
      return;
    }

    try {
      await api.post(`${BASE_URL}/api/favorites/${parseInt(id)}`);
      setLiked(!liked);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    } catch (err) {
      console.error("좋아요 토글 실패", err);
    }
  };

  if (!scholarship) return <p>존재하지 않는 장학금입니다.</p>;

  if (scholarship.departmentCategory?.includes("제한없음")) {
    scholarship.departmentCategory = ["제한없음"];
  }
  if (scholarship.universityCategories?.includes("제한없음")) {
    scholarship.universityCategories = ["제한없음"];
  }

  return (
    <div className="detail">
      <div className="title-with-heart">
        <AutoFitText
          className="detail-h1"
          text={scholarship.productName}
          width={550}
          maxFontSize={30}
          minFontSize={15}
          fontWeights={[800, 500, 400]}
        />
        <div className="heart-container">
          <AiFillHeart
            onClick={handleHeart}
            className={`heart-icon ${liked ? "liked" : ""} ${
              animate ? "pop" : ""
            }`}
          />
          <div className="heart-info">좋아요</div>
        </div>
      </div>

      <div className="detail-wrapper">
        <div className="detail-section">
          <AutoFitText
            className="detail-name"
            text={scholarship.providerName}
          />
          <div className="detail-wrapper-info">{scholarship.providerType}</div>
        </div>
        <div className="v-line" />
        <div className="detail-section">
          <div className="detail-name">모집기간</div>
          <div className="detail-wrapper-info">
            {scholarship.applicationStartDate && scholarship.applicationEndDate
              ? `${new Date(
                  scholarship.applicationStartDate
                ).toLocaleDateString()} ~ ${new Date(
                  scholarship.applicationEndDate
                ).toLocaleDateString()}`
              : "모집기간 정보 없음"}
          </div>
        </div>
      </div>

      <div className="info-between-section">
        <div className="detail-info-wrapper">
          <h3>운영 정보</h3>
          <div className="detail-info-card">
            <h4>운영기관</h4>
            <div className="card-info">{scholarship.providerType}</div>
          </div>
          <div className="detail-info-card">
            <h4>상품 구분</h4>
            <div className="card-info">{scholarship.productType}</div>
          </div>
          <div className="detail-info-card">
            <h4>유형 구분</h4>
            <div className="card-info">{scholarship.scholarshipCategory}</div>
          </div>
        </div>
        <div className="detail-info-wrapper">
          <h3>주요 정보</h3>
          {infoFields.map(({ key, label }) => (
            <div className="detail-info-card" key={key}>
              <h4>{label}</h4>
              <div className="card-info">
                {Array.isArray(scholarship[key]) && scholarship[key].length > 0
                  ? key === "gradeCategory"
                    ? parseSemesterRange(scholarship[key])
                    : scholarship[key].join(", ")
                  : "해당사항 없음"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-more-wrapper">
        <h3>선발 인원</h3>
        <ul className="more-info-wrapper">
          <li className="more-info-dot">
            총 선발 인원 :{" "}
            {Array.isArray(scholarship.selectionPersonnelDetail)
              ? scholarship.selectionPersonnelDetail.join(", ")
              : "정보 없음"}
          </li>
        </ul>

        <h3>기타</h3>
        <ul className="more-info-wrapper">
          <li className="more-info-dot">
            {scholarship.recommendationRequired
              ? "추천서가 필요해요"
              : "추천서가 필요하지 않아요"}
          </li>
          <li className="more-info-dot">
            {scholarship.duplicateSupportRestricted
              ? "중복 수혜가 불가능해요"
              : "중복 수혜가 가능해요"}
          </li>
        </ul>
      </div>

      <h2>상세내용</h2>
      <div className="detail-more-wrapper-bottom">
        {[
          ["성적기준", "gradeCriteriaDetail", "gradeCriteriaNotes"],
          ["소득기준", "incomeCriteriaDetail", "incomeCriteriaNotes"],
          ["지원내역", "supportDetail", "supportNotes"],
          [
            "특정자격",
            "specificQualificationDetail",
            "specificQualificationNotes",
          ],
          ["지역거주", "regionResidenceDetail", "regionResidenceNotes"],
          ["선발방법", "selectionMethodDetail", "selectionMethodNotes"],
          ["선발인원", "selectionPersonnelDetail", "selectionPersonnelNotes"],
          [
            "자격제한",
            "qualificationRestrictionDetail",
            "qualificationRestrictionNotes",
          ],
          ["제출서류", "requiredDocumentsDetail", "requiredDocumentsNotes"],
        ].map(([title, detail, note]) => (
          <div key={title}>
            <h3>{title}</h3>
            <ul className="more-info-wrapper">
              {Array.isArray(scholarship[detail]) &&
              scholarship[detail].length > 0 ? (
                scholarship[detail].map((data, idx) => (
                  <li key={idx} className="more-info-dot">
                    {data}
                  </li>
                ))
              ) : (
                <li className="more-info-dot">정보 없음</li>
              )}
            </ul>
            <div className="note-info">{scholarship[note] || ""}</div>
          </div>
        ))}

        {Array.isArray(scholarship.recommendationNeededDetail) &&
          scholarship.recommendationNeededDetail.length > 0 && (
            <>
              <h3>추천서</h3>
              <ul className="more-info-wrapper">
                {scholarship.recommendationNeededDetail.map((data, idx) => (
                  <li key={idx} className="more-info-dot">
                    {data}
                  </li>
                ))}
              </ul>
              <div className="note-info">
                {scholarship.recommendationNeededNotes || ""}
              </div>
            </>
          )}
      </div>

      <div className="detail-more-wrapper">
        <h3>신청 방법</h3>
        <div
          className="more-info-wrapper-url"
          onClick={() =>
            window.open(
              scholarship.homepageUrl || "#",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <h5>{scholarship.providerName} 바로가기</h5>
        </div>
      </div>
    </div>
  );
};

export default Detail;
