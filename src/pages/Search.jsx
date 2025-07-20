import ScholarShip from "../data/Scholarship";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Search.css";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("전체");
  const categories = [
    "전체",
    "지역연고",
    "성적우수",
    "소득분위",
    "특수계층",
    "기타",
  ];
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const query = useQuery();

  const searchText = query.get("query") || ""; // 없으면 빈 문자열

  const includesQuery = (text, query) =>
    text?.toLowerCase().includes(query?.toLowerCase());

  const filteredByText = ScholarShip.filter((r) =>
    includesQuery(r.name, searchText)
  );
  const filterList =
    category === "전체"
      ? filteredByText
      : filteredByText.filter((r) => r.support_type === category);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    navigate(`/search?query=${encodeURIComponent(searchText)}&page=${pageNum}`);
  };

  const totalItems = filterList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filterList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="search-wrapper">
        <h1>🔍 {searchText} 검색 결과</h1>
        <div className="search-btn-wrapper">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`search-category-btn${
                category === cat ? " active" : ""
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
        <div className="search-list">
          {currentItems.length === 0 && <div>검색 결과가 없습니다</div>}
          {currentItems.map((scholarShip) => (
            <div className="search-card">
              <h3>{scholarShip.name}</h3>
              <div className="card-info-wrapper">
                <div className="info-category">
                  {scholarShip.agency_type} / {scholarShip.category} /{" "}
                  {scholarShip.support_type}
                </div>
                <div className="info-date">
                  모집기한 : {scholarShip.start_date} ~ {scholarShip.end_date}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="number-btn-wrapper">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : " "}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Search;
