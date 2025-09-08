import "./ScholarShipCard.css";
import myIcon from "../../assets/Icon.svg";
import { useNavigate } from "react-router-dom";
const ScholarshipCard = ({ data, className }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/detail/${data.id}`);
  };
  const textWithBreaks = data.productName.replace(/]/g, "]\n");
  return (
    <div className={`card ${className || ""}`} onClick={handleClick}>
      <div className="card_name">{textWithBreaks}</div>
      <div className="card_agency">{data.providerName}</div>
      {!className?.includes("card--tip") && (
        <div className="card_icon">
          <img src={myIcon} alt="버튼" />
        </div>
      )}
    </div>
  );
};
export default ScholarshipCard;
