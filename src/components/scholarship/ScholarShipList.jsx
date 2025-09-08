import "./ScholarShipList.css";
import Card from "./ScholarShipCard";
import useRandomScholarships from "../../utils/useRandomScholarships";

const ScholarShipList = () => {
  const {
    randomList: localList,
    loading: localLoading,
    error: localError,
  } = useRandomScholarships("LOCAL", 5);
  const {
    randomList: gradeList,
    loading: gradeLoading,
    error: gradeError,
  } = useRandomScholarships("GRADE", 5);
  if (localLoading || gradeLoading) return <p>불러오는 중…</p>;
  if (localError || gradeError) return <p>데이터 조회 중 오류 발생</p>;

  return (
    <div className="list">
      <div className="list-left">
        <h1>#성적우수</h1>
        {gradeList.map((data) => (
          <Card key={data.id} data={data} />
        ))}
      </div>
      <div className="list-right">
        <h1>#지역연고</h1>
        {localList.map((data) => (
          <Card key={data.id} data={data} />
        ))}
      </div>
    </div>
  );
};
export default ScholarShipList;
