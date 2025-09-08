import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useFormInput from "../hooks/useFormInput";
import SelectListModal from "../components/Modal/SelectListModal";
import universityList from "../data/universityList";
import highSchools from "../data/highSchools_labeled.js";
import RegionSelectModal from "../components/Modal/RegionSelectModal";
import EmailAuthModal from "../components/Modal/EmailAuthModal";
import axios from "axios";
import { BASE_URL } from "../api/config.js";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const handleNextStep = () => {
    alert("정확한 정보를 입력하지 않으면, 맞춤형 장학금 추천이 불가능합니다.");
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(2);
      setIsTransitioning(false);
    }, 300); // CSS transition 시간과 맞춤
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const email = useFormInput({
    initialValue: "",
    validate: (v) => emailRegex.test(v),
    errorMessage: "이메일 형식이 올바르지 않습니다",
  });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const username = useFormInput("");
  const password = useFormInput({
    initialValue: "",
    validate: (v) => v.length > 7,
    errorMessage: "비밀번호는 8자 이상이어야 합니다",
  });
  const passwordRe = useFormInput({
    initialValue: "",
    validate: (v) => v === password.value,
    errorMessage: "비밀번호가 일치하지 않습니다",
  });

  const [gender, setGender] = useState("");
  const [current_school, setSelectedUniv] = useState("");
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
  const [high_school, setSelectedHighSchool] = useState("");
  const [showUnivModal, setShowUnivModal] = useState(false);
  const [showHighModal, setShowHighModal] = useState(false);

  const [showResidentModal, setShowResidentModal] = useState(false);
  const [resident_address, setResidentAddress] = useState("");
  const [address, setAddress] = useState("");
  const [showAddressModal, setShowAddressModal] = useState("");

  const [addressId, setAddressId] = useState(0);
  const [residentAddressId, setResidentAddressId] = useState(0);

  const phone = useFormInput({
    initialValue: "",
    validate: (v) => /^01[016789]-?\d{3,4}-?\d{4}$/.test(v.replace(/-/g, "")),
    errorMessage: "전화번호 형식이 올바르지 않습니다",
  });

  const formData = {
    email: email.value,
    password: password.value,
    username: username.value,
    role: "USER",
    phone: phone.value,
    universityCategoryId: universityCategoryId.id,
    currentSchool: current_school,
    highSchool: high_school,
    universityYear: "SEVENTH_SEMESTER",
    gender: gender,
    addressId: addressId,
    residentAddressId: residentAddressId,
    available: true,
  };
  const navigate = useNavigate();

  const isFormValid =
    email.error === "" &&
    password.error === "" &&
    passwordRe.error === "" &&
    email.value.trim() !== "" &&
    password.value.trim() !== "" &&
    passwordRe.value.trim() !== "" &&
    gender !== "" &&
    emailVerified !== false;
  const handleSignup = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/signup`, formData);
      if (res.data.success) {
        alert("회원가입 성공!");
        navigate("/login");
      } else {
        alert("회원가입 실패: " + (res.data.message || "알 수 없는 이유"));
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "서버 오류 또는 네트워크 문제 발생";
      alert("회원가입 실패: " + msg);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="signup-page">
        <h1>
          회원 가입을 위해
          <br /> 정보를 입력해주세요
        </h1>
        <div className={`signup-input ${isTransitioning ? "fade-out" : ""}`}>
          {step === 1 && (
            <>
              <div className="signup-email">* 이메일</div>

              <div className="signup-email-row">
                <input
                  className="signup-email-input"
                  type="text"
                  value={email.value}
                  onChange={email.onChange}
                  onFocus={email.onFocus}
                  onBlur={email.onBlur}
                />
                <button
                  className="email-auth-btn"
                  onClick={() => setShowEmailModal(true)}
                  disabled={emailVerified || !email.isValid}
                >
                  {!emailVerified ? "이메일 인증" : "인증 완료"}
                </button>
              </div>
              <div
                className={`error-message ${
                  !email.isFocused && email.error ? "show" : ""
                }`}
              >
                {email.error}
              </div>
              <div className="signup-email-auth"></div>

              {showEmailModal && (
                <EmailAuthModal
                  email={email.value}
                  onVerified={() => setEmailVerified(true)}
                  onClose={() => setShowEmailModal(false)}
                />
              )}

              <div className="signup-user">* 이름</div>
              <input
                className="signup-user-input"
                type="text"
                value={username.value}
                onChange={username.onChange}
              />
              <div className="signup-pass">* 비밀번호</div>
              <input
                className="signup-pass-input"
                type="password"
                value={password.value}
                onChange={password.onChange}
                onFocus={password.onFocus}
                onBlur={password.onBlur}
              />
              <div
                className={`error-message ${
                  !password.isFocused && password.error ? "show" : ""
                }`}
              >
                {password.error}
              </div>
              <div className="signup-pass">* 비밀번호 확인</div>
              <input
                className="signup-pass-input"
                type="password"
                value={passwordRe.value}
                onChange={passwordRe.onChange}
                onFocus={passwordRe.onFocus}
                onBlur={passwordRe.onBlur}
              />

              <div
                className={`error-message ${
                  !passwordRe.isFocused && passwordRe.error ? "show" : ""
                }`}
              >
                {passwordRe.error}
              </div>
              <div className="signup-radio">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={gender === "MALE"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  남성
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={gender === "FEMALE"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  여성
                </label>
              </div>

              <button
                className={`signup-next-btn ${isFormValid ? "active" : ""}`}
                disabled={!isFormValid}
                onClick={handleNextStep}
              >
                다음으로
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="signup-current-school">* 재학 중인 대학교</div>
              <div className="school-wrapper">
                <div
                  className={`signup-current-school-input ${
                    current_school ? "active" : ""
                  }`}
                  onClick={() => setShowUnivModal(true)}
                >
                  {current_school || "대학교를 선택해주세요"}
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
                <select
                  className="signup-dropdown-select"
                  name="median_income_ratio"
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    const selected = UniversityCategoryIds.find(
                      (val) => val.id === id
                    );
                    setUniversityCategoryId(selected);
                  }}
                >
                  <option value="">선택</option>
                  {UniversityCategoryIds.map((val) => (
                    <option key={val.id} value={val.id}>
                      {val.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="address-info">
                특정 대학 장학금 자격 여부를 확인하기 위해 사용됩니다.
              </div>
              <div className="signup-high-school">* 출신 고등학교</div>
              <div
                className={`signup-high-school-input ${
                  high_school ? "active" : ""
                }`}
                onClick={() => setShowHighModal(true)}
              >
                {high_school ? high_school : "출신 고등학교를 선택해주세요"}
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
              <div className="address-info">
                특정 고교 대상 장학금 자격 여부를 확인하기 위해 사용됩니다.
              </div>
              <div className="signup-resident-address">* 거주지</div>
              <div
                className={`signup-high-school-input ${
                  resident_address ? "active" : ""
                }`}
                onClick={() => setShowResidentModal(true)}
              >
                {resident_address ? resident_address : "거주지를 선택해주세요"}
              </div>
              {showResidentModal && (
                <RegionSelectModal
                  onSelect={(item) => setResidentAddress(item)}
                  onClose={() => setShowResidentModal(false)}
                  onId={(item) => setResidentAddressId(item)}
                />
              )}
              <div className="address-info">
                실제 거주 지역 기반 장학금 대상 여부 확인을 위해 사용됩니다
              </div>

              <div className="signup-address">* 연고지</div>
              <div
                className={`signup-address-input ${address ? "active" : ""}`}
                onClick={() => setShowAddressModal(true)}
              >
                {address ? address : "출신 지역을 선택해주세요"}
              </div>
              {showAddressModal && (
                <RegionSelectModal
                  onSelect={(item) => setAddress(item)}
                  onClose={() => setShowAddressModal(false)}
                  onId={(item) => setAddressId(item)}
                />
              )}
              <div className="address-info">
                지자체 기준 장학금 대상 확인을 위해 사용됩니다
              </div>
              <div className="signup-phone">* 전화번호</div>
              <input
                className={`signup-phone-input ${phone.value ? "active" : ""}`}
                placeholder="전화번호를 입력해주세요"
                type="tel"
                value={phone.value}
                onChange={phone.onChange}
                onFocus={phone.onFocus}
                onBlur={phone.onBlur}
              ></input>
              <div
                className={`error-message ${
                  !phone.isFocused && phone.error ? "show" : ""
                }`}
              >
                {phone.error}
              </div>
              <button
                className={`signup-btn ${isFormValid ? "active" : ""}`}
                disabled={!isFormValid}
                onClick={handleSignup}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Signup;
