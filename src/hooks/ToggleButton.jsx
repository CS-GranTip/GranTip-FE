import "./ToggleButton.css";

const ToggleButton = ({ selected, onChange }) => {
  const handleClick = () => {
    onChange?.(!selected); // 상태 반전해서 부모에 전달
  };

  return (
    <div
      className={`toggle-btn ${selected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <button className={`toggle ${selected ? "selected" : ""}`} />
    </div>
  );
};

export default ToggleButton;
