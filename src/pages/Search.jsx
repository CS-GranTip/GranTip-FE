import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Search.css";
import { BASE_URL } from "../api/config.js";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const [scholarships, setScholarships] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("전체");
  const [totalPages, setTotalPages] = useState(1);

  const query = useQuery();
  const navigate = useNavigate();
  const searchText = query.get("query") || "";

  const categories = [
    { search: "전체", text: "전체" },
    { search: "LOCAL", text: "지역연고" },
    { search: "SPECIALTY", text: "특기자" },
    { search: "GRADE", text: "성적우수" },
    { search: "INCOME", text: "소득구분" },
    { search: "DISABILITY", text: "장애인" },
    { search: "ETC", text: "기타" },
  ];

  // ✅ query에서 page, category 초기 세팅
  useEffect(() => {
    const pageParam = parseInt(query.get("page") || "1");
    const categoryParam = query.get("category") || "전체";

    if (pageParam !== currentPage) setCurrentPage(pageParam);
    if (categoryParam !== category) setCategory(categoryParam);
  }, [query]);

  // ✅ API 호출
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/scholarships`, {
          params: {
            keyword: searchText,
            category: category !== "전체" ? category : null,
            pageNumber: currentPage,
            pageSize: 20,
          },
        });
        if (res.data.success) {
          setScholarships(res.data.result.content);
          setTotalPages(res.data.result.totalPages);
        } else {
          alert("장학금 목록을 불러오지 못했습니다.");
        }
      } catch (err) {
        console.error(err);
        alert("서버 에러 발생");
      }
    };

    fetchScholarships();
  }, [searchText, category, currentPage]);

  // ✅ 페이지 이동
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0 });
    navigate(
      `/search?query=${encodeURIComponent(
        searchText
      )}&category=${encodeURIComponent(category)}&page=${pageNum}`
    );
  };

  // ✅ 카테고리 변경
  const handleCategoryChange = (cat) => {
    setCategory(cat.search);
    setCurrentPage(1);
    navigate(
      `/search?query=${encodeURIComponent(
        searchText
      )}&category=${encodeURIComponent(cat.search)}&page=1`
    );
  };

  // ✅ 페이지네이션 범위 계산
  const maxPageButtons = 10;
  const startPage =
    Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

  return (
    <div className="search-wrapper">
      <h1>🔍 {searchText} 검색 결과</h1>

      <div className="search-btn-wrapper">
        {categories.map((cat) => (
          <div
            key={cat.search}
            className={`search-category-btn${
              category === cat.search ? " active" : ""
            }`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat.text}
          </div>
        ))}
      </div>

      <div className="search-list">
        {scholarships.length === 0 && (
          <div className="search-none">검색 결과가 없습니다</div>
        )}
        {scholarships.map((s) => (
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

      <div className="number-btn-wrapper">
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              « 처음
            </button>
            <button
              onClick={() => handlePageChange(startPage - 1)}
              disabled={currentPage === 1}
            >
              ‹ 이전
            </button>
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const pageNum = startPage + i;
          return (
            <button
              key={pageNum}
              className={currentPage === pageNum ? "active" : ""}
              onClick={() => handlePageChange(pageNum)}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {endPage < totalPages && (
          <>
            <button
              onClick={() => handlePageChange(endPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음 ›
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              마지막 »
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
