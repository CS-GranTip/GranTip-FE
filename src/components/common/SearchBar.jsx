import "./SearchBar.css";
import { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
const SearchBar = ({
  inputText,
  setInputText,
  customClassActive,
  //   scholarshipData,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [recentKeywords, setRecentKeywords] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchBoxRef = useRef(null);
  const navigate = useNavigate();
  const navigatePageHandle = (text) => {
    navigate(`/search?query=${encodeURIComponent(text)}`);
  };

  //   const lastOpened = useRef("");
  const includesQuery = (text, query) =>
    text?.toLowerCase().includes(query?.toLowerCase());

  //최근 검색어 저장
  const saveKeyword = (text) => {
    //JSON으로 저장된 localStorage을 변환하여 saved에 저장
    let saved = JSON.parse(localStorage.getItem("recentKeywords")) || [];
    // 중복 제거
    saved = [text, ...saved.filter((k) => k !== text)].slice(0, 5);
    //saved를 JSON으로 바꿔서 localStorage에 저장
    localStorage.setItem("recentKeywords", JSON.stringify(saved));
    //saved를 저장
    setRecentKeywords(saved);
  };

  const onChangeContent = (e) => {
    //변경된 값 실시간 리랜더링
    const keyword = e.target.value;
    setInputText(keyword);
    //검색창이 공백일 시 최근 검색어만 출력
    if (!keyword.trim()) {
      const saved = JSON.parse(localStorage.getItem("recentKeywords")) || [];
      setRecentKeywords(saved);
      //자동완성X
      setSuggestions([]);
      return;
    }
    // 입력어가 포함된 검색어로 자동완성
    // const filtered = scholarshipData.filter((r) =>
    //   includesQuery(r.name, keyword)
    // );
    // setSuggestions(filtered);
  };

  // 엔터키를 누르면 검색
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      //이벤트 버블링 방지(새로고침 방지)
      e.preventDefault();
      e.target.blur();
      triggerSearch(inputText);
    }
  };
  // 자동완성 된 검색어를 누르면 해당 페이지로 이동
  const handleSuggestionClick = (text) => {
    setInputText(text); // inputText를 업데이트
    setSuggestions([]);
    //순서보장
    triggerSearch(text);
  };

  const triggerSearch = (text) => {
    //공백 검색 방지
    const trimmed = text.trim();
    if (!trimmed) return;
    saveKeyword(trimmed);
    navigatePageHandle(text);
    setIsFocused(false);
  };

  //최근검색어
  const handleInputFocus = () => {
    setIsFocused(true);
    const saved = JSON.parse(localStorage.getItem("recentKeywords")) || [];
    setRecentKeywords(saved);
    if (!inputText.trim()) setSuggestions([]);
  };
  //최근검색어 삭제
  const deleteKeyword = (target, e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = recentKeywords.filter((k) => k !== target);
    localStorage.setItem("recentKeywords", JSON.stringify(updated));
    setRecentKeywords(updated);
  };
  //바깥 클릭시 검색어 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const showRecent = isFocused && suggestions.length === 0;

  return (
    <div className="searchbar-wrapper">
      <div
        ref={searchBoxRef}
        className={`search ${customClassActive ? "custom" : ""}
        ${showRecent ? "action" : ""}`}
      >
        {!showRecent && !customClassActive && (
          <>
            <h1>장학금명 또는 운영기관명으로 검색</h1>
            <h2>
              장학금명, 운영기관 또는 지역 이름으로 원하는 장학금을 찾아보세요.
            </h2>
          </>
        )}
        <div
          className={`searchbox-wrapper ${
            showRecent || customClassActive ? "action" : ""
          }`}
        >
          <input
            className={`searchbar ${showRecent ? "action" : ""}`}
            type="text"
            placeholder="#장학금"
            value={inputText}
            onChange={onChangeContent}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
          />
          <CiSearch
            type="button"
            className={`search-btn ${showRecent ? "action" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerSearch(inputText);
            }}
          />
        </div>
        {showRecent && (
          <div className="suggestion-list">
            <div className="suggestion-header">
              <span>최근 검색</span>
            </div>
            {recentKeywords.length > 0 ? (
              <ul>
                {recentKeywords.map((item, index) => (
                  <li key={index} className="suggestion-wrapper">
                    <span
                      className="keyword-name"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </span>
                    <button
                      className="delete-keyword"
                      tabIndex={-1}
                      onClick={(e) => deleteKeyword(item, e)}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-recent">최근 검색어가 없습니다.</div>
            )}
          </div>
        )}
        {suggestions.length > 0 && (
          <div className="suggestion-list">
            <ul>
              {suggestions.map((item, index) => (
                <li key={index}>
                  <span
                    className="keyword-name"
                    onClick={() => handleSuggestionClick(item)}
                  ></span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchBar;
