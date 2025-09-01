import ToggleButton from "../hooks/ToggleButton";
import highSchools from "../data/highSchools_labeled.js";
import universityList from "../data/universityList.js";
import SelectListModal from "../components/Modal/SelectListModal.jsx";
import RegionSelectModal from "../components/Modal/RegionSelectModal.jsx";
import "./UserInfoEdit.css";
import { useState } from "react";
import { useEffect } from "react";
import api from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
const UserInfoEdit = ({ username }) => {
  const nav = useNavigate();
  const [userInfo, setUserInfo] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  /*대학교 팝업 관련 */
  const [showUnivModal, setShowUnivModal] = useState(false);
  const [current_school, setSelectedUniv] = useState("");
  /*고등학교 팝업 관련 */
  const [showHighModal, setShowHighModal] = useState(false);
  const [high_school, setSelectedHighSchool] = useState("");
  /* 학년 팝업 관련 */
  const [showGradeModal, setShowGradeModal] = useState(false);
  const universityYearLabels = [
    "대학1학기",
    "대학2학기",
    "대학3학기",
    "대학4학기",
    "대학5학기",
    "대학6학기",
    "대학7학기",
    "대학8학기이상",
  ];
  const universityYearMap = {
    대학1학기: "FIRST_SEMESTER",
    대학2학기: "SECOND_SEMESTER",
    대학3학기: "THIRD_SEMESTER",
    대학4학기: "FOURTH_SEMESTER",
    대학5학기: "FIFTH_SEMESTER",
    대학6학기: "SIXTH_SEMESTER",
    대학7학기: "SEVENTH_SEMESTER",
    대학8학기이상: "EIGHTH_SEMESTER_OR_ABOVE",
  };
  const [university_year, setSelectedUnivYear] = useState("");
  /*거주지*/
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [resident_address, setResidentAddress] = useState("");
  const [resident_addressId, setResidentAddressId] = useState(0);
  /*연고지*/

  const [showAddressModal, setShowAddressModal] = useState("");
  const [address, setAddress] = useState("");
  const [addressId, setAddressId] = useState(0);

  /* 학력 정보 */
  const [overallGpa, setOverallGpa] = useState("");
  const [highSchoolGrade, setHighSchoolGrade] = useState(""); // 고등학교 내신 평균 등급
  const [csatGrade, setCsatGrade] = useState(""); // 수능 등급
  /*성적 관련*/
  const [recentGrade, setRecentGrade] = useState({
    credit: "", // 이수 학점
    average: "", // 평균 학점
    scale: 4.5, // 성적 기준 (4.5 or 4.3)
  });
  const [previousGrade, setPreviousGrade] = useState({
    credit: "",
    average: "",
    scale: 4.5,
  });
  /*특수계층*/
  const [isDisabled, setIsDisabled] = useState(false); // 장애인
  const [isMultiChild, setIsMultiChild] = useState(false); // 다자녀
  const [isVeteran, setIsVeteran] = useState(false); // 국가유공자 또는 보훈자
  const [isSingleParent, setIsSingleParent] = useState(false); // 한부모
  const [isOrphan, setIsOrphan] = useState(false); // 소년소녀 가장
  const [isLowIncome, setIsLowIncome] = useState(false); // 저소득층
  const [isMulticultural, setIsMulticultural] = useState(false); // 다문화
  const [isNorthKoreanDefector, setIsNorthKoreanDefector] = useState(false); // 북한이탈주민
  /*소득정보*/
  const [scholarshipSupportLevel, setScholarshipSupportLevel] = useState(""); // 한국장학재단 학자금 지원구간 (1~9)
  const [medianIncomeRatio, setMedianIncomeRatio] = useState(""); // 기준 중위소득 비율 (예: "130")
  const [incomePercentile, setIncomePercentile] = useState(""); // 소득 분위 (예: "5")
  /*대학카테고리*/
  const UniversityCategoryIds = [
    { id: 1, name: "4년제(5~6년제포함)" },
    { id: 2, name: "전문대(2~3년제)" },
    { id: 3, name: "학점은행제 대학" },
    { id: 4, name: "일반대학원" },
    { id: 5, name: "전문대학원" },
    { id: 6, name: "기술대학" },
    { id: 7, name: "원격대학" },
    { id: 8, name: "해외대학" },
    { id: 9, name: "특정대학" },
    { id: 10, name: "제한없음" },
  ];
  const [universityCategoryId, setUniversityCategoryId] = useState(0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoRes = await api.get("/user");
        if (userInfoRes.data.success) {
          const user = userInfoRes.data.result;
          setUserInfo(user);
          setEmail(user.email);
          setPhone(user.phone);
          setGender(user.gender);
          setSelectedUniv(user.currentSchool);
          setSelectedHighSchool(user.highSchool);
          setSelectedUnivYear(user.universityYear);
          setAddress(user.address);
          setAddressId(user.addressId);
          setResidentAddress(user.residentAddress);
          setResidentAddressId(user.residentAddressId);
          setHighSchoolGrade(user.highSchoolGrade);
          setCsatGrade(user.satAverageGrade);
          setOverallGpa(user.overallGpa);
          setUniversityCategoryId(user.universityCategoryId);
          setRecentGrade({
            credit: user.previousSemesterCredits,
            average: user.previousSemesterGpa,
            scale: user.gpaScale,
          });

          setPreviousGrade({
            credit: user.twoSemestersAgoCredits,
            average: user.twoSemestersAgoGpa,
            scale: user.gpaScale,
          });

          setScholarshipSupportLevel(user.scholarshipSupportInterval);
          setMedianIncomeRatio(user.medianIncomeRatio);
          setIncomePercentile(user.incomePercentileBand);

          const codes = user.qualificationCodes || [];
          setIsDisabled(codes.includes("DISABILITY"));
          setIsMultiChild(codes.includes("MULTI_CHILD"));
          setIsVeteran(codes.includes("VETERAN"));
          setIsSingleParent(codes.includes("SINGLE_PARENT"));
          setIsOrphan(codes.includes("ORPHAN"));
          setIsLowIncome(codes.includes("LOW_INCOME"));
          setIsMulticultural(codes.includes("MULTICULTURAL"));
          setIsNorthKoreanDefector(codes.includes("NORTH_KOREAN_DEFECTOR"));
        } else {
          alert("유저 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        alert("서버 오류");
      }
    };
    fetchUserInfo();
  }, []);
  const handleSubmit = async () => {
    const qualificationCodes = [
      isDisabled && "DISABLED",
      isMultiChild && "MULTI_CHILD",
      isVeteran && "NATIONAL_MERIT",
      isSingleParent && "SINGLE_PARENT",
      isOrphan && "BOY_GIRL_HEADED",
      isLowIncome && "LOW_INCOME",
      isMulticultural && "MULTICULTURAL",
      isNorthKoreanDefector && "NORTH_KOREAN_SETTLER",
    ].filter(Boolean);
    const formData = {
      phone: phone,

      universityCategoryId: universityCategoryId,
      currentSchool: current_school,
      highSchool: high_school,
      universityYear: universityYearMap[university_year],
      gender: gender,
      addressId: addressId,
      residentAddressId: resident_addressId,
      qualificationCodes: qualificationCodes,
      highSchoolGrade: isNaN(parseFloat(highSchoolGrade))
        ? 0
        : parseFloat(highSchoolGrade),
      satAverageGrade: isNaN(parseFloat(csatGrade))
        ? 4.5
        : parseFloat(csatGrade),
      gpaScale: isNaN(parseFloat(recentGrade?.scale))
        ? 4.5
        : parseFloat(recentGrade.scale),
      overallGpa: isNaN(parseFloat(overallGpa)) ? 0 : parseFloat(overallGpa),
      previousSemesterCredits: isNaN(parseFloat(recentGrade?.credit))
        ? 0
        : parseFloat(recentGrade.credit),
      previousSemesterGpa: isNaN(parseFloat(recentGrade?.average))
        ? 0
        : parseFloat(recentGrade.average),
      twoSemestersAgoCredits: isNaN(parseFloat(previousGrade?.credit))
        ? 0
        : parseFloat(previousGrade.credit),
      twoSemestersAgoGpa: isNaN(parseFloat(previousGrade?.average))
        ? 0
        : parseFloat(previousGrade.average),
      scholarshipSupportInterval: isNaN(parseInt(scholarshipSupportLevel))
        ? 0
        : parseInt(scholarshipSupportLevel),
      medianIncomeRatio: isNaN(parseInt(medianIncomeRatio))
        ? 0
        : parseInt(medianIncomeRatio),
      incomePercentileBand: isNaN(parseInt(incomePercentile))
        ? 0
        : parseInt(incomePercentile),
    };
    try {
      const res = await api.post("/user/update", formData);
      if (res.data.success) {
        alert("정보 수정 성공!");
        nav("/mypage");
      } else {
        alert("정보 수정 실패!");
        console.error(
          "정보 수정 실패: " + (res.data.message || "알 수 없는 이유")
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onClickUpdatePW = () => {
    nav("/update-password");
  };
  return (
    <div className="user-info-edit-container">
      <div className="edit-header">
        <h1 className="edit-title">나의 정보 수정</h1>
        <div className="edit-subtext">최신 정보로 업데이트 해주세요</div>
      </div>

      <div className="info-section">
        <div className="label-text">• 이메일</div>
        <div className="static-field">{email}</div>

        <div className="label-text">• 전화번호</div>
        <div className="static-field">{phone}</div>

        <div className="label-text">• 소속 학교</div>
        <div className="select-wrapper">
          <div className="select-value-display">{current_school}</div>
          <button className="select-btn" onClick={() => setShowUnivModal(true)}>
            선택
          </button>
          <select
            className={`signup-dropdown-select ${
              universityCategoryId ? "active" : ""
            }`}
            value={universityCategoryId}
            name="median_income_ratio"
            onChange={(e) => {
              const id = parseInt(e.target.value);
              const selected = UniversityCategoryIds.find(
                (val) => val.id === id
              );
              setUniversityCategoryId(selected);
            }}
          >
            <option value="">대학구분</option>
            {UniversityCategoryIds.map((val) => (
              <option key={val.id} value={val.id}>
                {val.name}
              </option>
            ))}
          </select>
        </div>
        {showUnivModal && (
          <SelectListModal
            title="대학교 검색"
            list={universityList}
            getLabel={(item) => item}
            onSelect={(item) => setSelectedUniv(item)}
            onClose={() => setShowUnivModal(false)}
          />
        )}
        <div className="label-text">• 학년</div>
        <div className="select-wrapper">
          <div className="select-value-display">{university_year}</div>
          <button
            className="select-btn"
            onClick={() => setShowGradeModal(true)}
          >
            선택
          </button>
        </div>
        {showGradeModal && (
          <SelectListModal
            title="학년 선택"
            list={universityYearLabels}
            getLabel={(item) => item}
            onSelect={(item) => setSelectedUnivYear(item)}
            onClose={() => setShowGradeModal(false)}
          />
        )}

        <div className="label-text">• 출신 학교</div>
        <div className="select-wrapper">
          <div className="select-value-display">{high_school}</div>
          <button className="select-btn" onClick={() => setShowHighModal(true)}>
            선택
          </button>
        </div>
        {showHighModal && (
          <SelectListModal
            title="학교명 검색"
            list={highSchools}
            getLabel={(item) => item}
            onSelect={(item) => setSelectedHighSchool(item)}
            onClose={() => setShowHighModal(false)}
          />
        )}

        <div className="label-text">• 거주지</div>
        <div className="select-wrapper">
          <div className="select-value-display">{resident_address}</div>
          <button
            className="select-btn"
            onClick={() => setShowResidentModal(true)}
          >
            선택
          </button>
        </div>
        {showResidentModal && (
          <RegionSelectModal
            onSelect={(item) => setResidentAddress(item)}
            onClose={() => setShowResidentModal(false)}
            onId={(item) => setResidentAddressId(item)}
          />
        )}
        <div className="label-text">• 연고지</div>
        <div className="select-wrapper">
          <div className="select-value-display">{address}</div>
          <button
            className="select-btn"
            onClick={() => setShowAddressModal(true)}
          >
            선택
          </button>
        </div>
        {showAddressModal && (
          <RegionSelectModal
            onSelect={(item) => setAddress(item)}
            onClose={() => setShowAddressModal(false)}
            onId={(item) => setAddressId(item)}
          />
        )}
      </div>

      <div className="toggle-section">
        <div className="label-text">• 특수 계층</div>
        <div className="select-list">
          <div className="toggle-row">
            <div className="toggle-label">장애인에 해당돼요</div>
            <ToggleButton selected={isDisabled} onChange={setIsDisabled} />
          </div>
          <div className="section" />

          <div className="toggle-row">
            <div className="toggle-label">다자녀 가정에 해당돼요</div>
            <ToggleButton selected={isMultiChild} onChange={setIsMultiChild} />
          </div>
          <div className="section" />

          <div className="toggle-row">
            <div className="toggle-label">
              국가유공자 또는 보훈자에 해당돼요
            </div>
            <ToggleButton selected={isVeteran} onChange={setIsVeteran} />
          </div>
          <div className="section" />

          <div className="toggle-row">
            <div className="toggle-label">한부모 가정에 해당돼요</div>
            <ToggleButton
              selected={isSingleParent}
              onChange={setIsSingleParent}
            />
          </div>
          <div className="section" />

          <div className="toggle-row">
            <div className="toggle-label">소년소녀 가장에 해당돼요</div>
            <ToggleButton selected={isOrphan} onChange={setIsOrphan} />
          </div>
          <div className="section" />

          <div className="toggle-row">
            <div className="toggle-label">저소득층에 해당돼요</div>
            <ToggleButton selected={isLowIncome} onChange={setIsLowIncome} />
          </div>
          <div className="section" />

          <div className="toggle-row">
            <div className="toggle-label">다문화 가정 해당돼요</div>
            <ToggleButton
              selected={isMulticultural}
              onChange={setIsMulticultural}
            />
          </div>
          <div className="section" />

          <div className="toggle-row">
            <div className="toggle-label">북한이탈주민에 해당돼요</div>
            <ToggleButton
              selected={isNorthKoreanDefector}
              onChange={setIsNorthKoreanDefector}
            />
          </div>
        </div>
      </div>

      <div className="grade-section">
        <div className="label-text">• 학력 정보</div>
        <div className="select-list">
          <div className="toggle-row">
            <div className="toggle-label">고등학교 내신 평균 등급</div>
            <input
              className="grade-input-field"
              value={highSchoolGrade}
              onChange={(e) => setHighSchoolGrade(e.target.value)}
            />
          </div>
          <div className="section" />

          <div className="toggle-row">
            <div className="toggle-label">수능 등급</div>
            <input
              className="grade-input-field"
              value={csatGrade}
              onChange={(e) => setCsatGrade(e.target.value)}
            />
          </div>
        </div>
        <div className="label-text">• 기이수 학기 성적 (전체 학기)</div>
        <div className="select-list">
          <div className="toggle-row">
            <div className="toggle-label">평균 학점</div>
            <input
              className="grade-input-field"
              type="number"
              min="0"
              max="4.5"
              step="0.01"
              placeholder="예: 3.75"
              value={overallGpa}
              onChange={(e) => setOverallGpa(e.target.value)}
            />
          </div>
        </div>
        <div className="label-text">• 직전 학기 성적</div>
        <div className="select-list">
          <div className="toggle-row">
            <div className="toggle-label">이수 학점</div>
            <input
              className="grade-input-field"
              type="number"
              min="0"
              max="30"
              placeholder="예: 18"
              value={recentGrade.credit}
              onChange={(e) =>
                setRecentGrade((prev) => ({ ...prev, credit: e.target.value }))
              }
            />
          </div>
          <div className="section" />
          <div className="toggle-row">
            <div className="toggle-label">평균 학점</div>
            <input
              className="grade-input-field"
              type="number"
              min="0"
              max="4.5"
              step="0.01"
              placeholder="예: 3.75"
              value={recentGrade.average}
              onChange={(e) =>
                setRecentGrade((prev) => ({ ...prev, average: e.target.value }))
              }
            />
          </div>
          <div className="section" />
          <div className="toggle-row">
            <div className="toggle-label">성적 기준</div>
            <select
              className="dropdown-select"
              value={recentGrade.scale}
              onChange={(e) =>
                setRecentGrade((prev) => ({
                  ...prev,
                  scale: parseFloat(e.target.value),
                }))
              }
            >
              <option value="4.5">4.5</option>
              <option value="4.3">4.3</option>
            </select>
          </div>
        </div>
        <div className="label-text">• 2학기 전 성적 (직전전 학기)</div>
        <div className="select-list">
          <div className="toggle-row">
            <div className="toggle-label">이수 학점</div>
            <input
              className="grade-input-field"
              type="number"
              min="0"
              max="30"
              placeholder="예: 18"
              value={previousGrade.credit}
              onChange={(e) =>
                setPreviousGrade((prev) => ({
                  ...prev,
                  credit: e.target.value,
                }))
              }
            />
          </div>
          <div className="section" />
          <div className="toggle-row">
            <div className="toggle-label">평균 학점</div>
            <input
              className="grade-input-field"
              type="number"
              min="0"
              max="4.5"
              step="0.01"
              placeholder="예: 3.75"
              value={previousGrade.average}
              onChange={(e) =>
                setPreviousGrade((prev) => ({
                  ...prev,
                  average: e.target.value,
                }))
              }
            />
          </div>
          <div className="section" />
          <div className="toggle-row">
            <div className="toggle-label">성적 기준</div>
            <select
              className="dropdown-select"
              value={previousGrade.scale}
              onChange={(e) =>
                setPreviousGrade((prev) => ({
                  ...prev,
                  scale: parseFloat(e.target.value),
                }))
              }
            >
              <option value="4.5">4.5</option>
              <option value="4.3">4.3</option>
            </select>
          </div>
        </div>
      </div>

      <div className="income-section">
        <div className="label-text">• 소득 정보</div>
        <div className="select-list">
          <div className="toggle-row">
            <div className="toggle-label">한국장학재단 학자금 지원구간</div>
            <select
              className="dropdown-select"
              name="scholarship_support_interval"
              value={scholarshipSupportLevel}
              onChange={(e) => setScholarshipSupportLevel(e.target.value)}
            >
              <option value="">선택</option>
              {[...Array(9)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}구간
                </option>
              ))}
            </select>
          </div>
          <div className="section" />

          <div className="toggle-row">
            <div className="toggle-label">기준 중위소득 비율</div>
            <select
              className="dropdown-select"
              name="median_income_ratio"
              value={medianIncomeRatio}
              onChange={(e) => setMedianIncomeRatio(e.target.value)}
            >
              <option value="">선택</option>
              {["50", "70", "100", "130", "150", "180", "200"].map((val) => (
                <option key={val} value={val}>
                  {val}%
                </option>
              ))}
            </select>
          </div>
          <div className="section" />

          <div className="toggle-row">
            <div className="toggle-label">소득 분위</div>
            <select
              className="dropdown-select"
              name="income_percentile_band"
              value={incomePercentile}
              onChange={(e) => setIncomePercentile(e.target.value)}
            >
              <option value="">선택</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}분위
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="user-info-footer">
        <button className="cancel-btn">취소</button>
        <button className="check-btn" onClick={handleSubmit}>
          확인
        </button>
      </div>
      <div className="password-edit" onClick={onClickUpdatePW}>
        비밀번호 변경
      </div>
    </div>
  );
};

export default UserInfoEdit;
