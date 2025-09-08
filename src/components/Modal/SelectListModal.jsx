import { useState } from "react";

import "./SelectListModal.css"; // 꼭 import 해주고

const SelectListModal = ({ title, list, onSelect, onClose, getLabel }) => {
  const [keyword, setKeyword] = useState("");

  const filtered = list.filter((item) => getLabel(item).includes(keyword));

  return (
    <div className="select-modal-overlay" onClick={onClose}>
      <div className="select-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {title !== "학년 선택" && (
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="select-modal-input"
          />
        )}
        <ul className="select-modal-list">
          {filtered.length === 0 ? (
            <li className="select-modal-empty">검색 결과가 없습니다</li>
          ) : (
            filtered.map((item, idx) => (
              <li
                key={idx}
                className="select-modal-item"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                {getLabel(item)}
              </li>
            ))
          )}
        </ul>
        <button className="select-modal-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};
export default SelectListModal;
