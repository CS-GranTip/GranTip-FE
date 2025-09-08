import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LikeList.css";
import api from "../utils/axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TipMore = () => {
  const [Tip, setTip] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const query = useQuery();

  useEffect(() => {
    const pageParam = parseInt(query.get("page") || "1");

    if (pageParam !== currentPage) setCurrentPage(pageParam);
  }, [query]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchTipList = async () => {
      try {
        const res = await api.get("/api/scholarships/recommendation", {
          params: {
            pageNumber: currentPage,
            pageSize: 15,
          },
        });
        if (res.data.success) {
          setTip(res.data.result.content);
          setTotalPages(res.data.result.totalPages);
        }
      } catch (error) {
        console.error(error);
        alert("서버 에러 발생");
      }
    };
    fetchTipList();
  }, [currentPage]);
  /*페이지 컨트롤러*/
  const maxPageButtons = 10;
  const startPage =
    Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0 });
    navigate(`/tipmore?page=${pageNum}`);
  };
  return (
    <div className="likeList">
      <div className="search-wrapper">
        <h1>GranTip이 추천하는 장학금</h1>
        <div className="like-wrapper">
          <div className="icon-like">😎</div>
          <h3> 3000점 이상 장학금만 모았어요</h3>
          <h2 className="go-back" onClick={() => navigate("/")}>
            뒤로가기
          </h2>
        </div>
        <div className="search-list">
          {Tip.length === 0 && <div>추천 가능한 장학금이 없어요</div>}
          {Tip.map((s) => (
            <div
              className="search-card"
              key={s.id}
              onClick={() => navigate(`/detail/${s.id}`)}
            >
              <div className="card-wrapper-fa">
                <h3>{s.productName}</h3>
                <div className="card-score">추천 점수 : {s.score}</div>
              </div>
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
    </div>
  );
};
export default TipMore;
