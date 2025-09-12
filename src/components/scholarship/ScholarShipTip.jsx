import "./ScholarShipTip.css";
import ScholarshipCard from "./ScholarShipCard";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
const ScholarshipTip = () => {
  const [scholarTip, setScholarTip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await api.get("/api/scholarships/recommendation", {
          params: {
            pageNumber: 1,
            pageSize: 4,
          },
        });
        if (res.data.success) {
          setScholarTip(res.data.result.content);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);
  if (loading) return <div>장학금 추천 중...</div>;
  if (error) return <div>장학금 추천 중 에러 발생 새로고침 해주세요</div>;
  return (
    <div className="tip">
      <h1>🎓GranTip이 추천하는 맞춤 장학금</h1>
      {scholarTip.length !== 0 && (
        <div className="tip-more" onClick={() => nav("/tipmore")}>
          더보기
        </div>
      )}
      <div className="tip-scroll">
        {scholarTip.length === 0 && (
          <div className="tip-card">
            로그인 후 GranTip이 추천하는 장학금을 확인해 보세요
          </div>
        )}
        {scholarTip.map((data) => (
          <ScholarshipCard key={data.id} data={data} className={"card--tip"} />
        ))}
      </div>
    </div>
  );
};
export default ScholarshipTip;
