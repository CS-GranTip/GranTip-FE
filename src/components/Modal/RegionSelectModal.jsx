import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import "./RegionSelectModal.css";

const RegionSelectModal = ({ onSelect, onClose, onId }) => {
  const [provinces, setProvinces] = useState([]); // 시/도
  const [cities, setCities] = useState([]); // 시/군/구
  const [towns, setTowns] = useState([]); // 읍/면/동

  const [selectedProvince, setSelectedProvince] = useState(null); // { id, regionName }
  const [selectedCity, setSelectedCity] = useState(null); // { id, regionName }

  // 1단계: 시/도 로드
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/regions/root`)
      .then((res) => {
        setProvinces(res.data.result || []);
      })
      .catch((err) => {
        console.error("시도 불러오기 실패", err);
        setProvinces([]); // 방어
      });
  }, []);

  // 2단계: 시/군/구 로드
  useEffect(() => {
    if (!selectedProvince) return;
    axios
      .get(`${BASE_URL}/api/regions/${selectedProvince.id}/children`)
      .then((res) => setCities(res.data.result))
      .catch((err) => console.error("시/군/구 불러오기 실패", err));
  }, [selectedProvince]);

  // 3단계: 읍/면/동 로드
  useEffect(() => {
    if (!selectedCity) return;
    axios
      .get(`${BASE_URL}/api/regions/${selectedCity.id}/children`)
      .then((res) => setTowns(res.data.result))
      .catch((err) => console.error("읍/면/동 불러오기 실패", err));
  }, [selectedCity]);

  const handleSelectTown = (town) => {
    const full = `${selectedProvince.regionName} ${selectedCity.regionName} ${town.regionName}`;
    onSelect?.(full);
    onClose?.();
    onId?.(town.id);
  };

  const handleBack = () => {
    if (selectedCity) {
      setSelectedCity(null);
      setTowns([]);
    } else if (selectedProvince) {
      setSelectedProvince(null);
      setCities([]);
    }
  };

  return (
    <div className="region-modal-overlay" onClick={onClose}>
      <div
        className="region-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="region-modal-header">
          <h3>지역 선택</h3>
          {(selectedProvince || selectedCity) && (
            <button className="region-back-btn" onClick={handleBack}>
              뒤로
            </button>
          )}
        </div>

        {/* 1단계: 시/도 */}
        {!selectedProvince && (
          <ul className="region-list">
            {provinces.map((prov) => (
              <li
                key={prov.id}
                className="region-item"
                onClick={() => setSelectedProvince(prov)}
              >
                {prov.regionName}
              </li>
            ))}
          </ul>
        )}

        {/* 2단계: 시/군/구 */}
        {selectedProvince && !selectedCity && (
          <ul className="region-list">
            {cities.map((city) => (
              <li
                key={city.id}
                className="region-item"
                onClick={() => setSelectedCity(city)}
              >
                {city.regionName}
              </li>
            ))}
          </ul>
        )}

        {/* 3단계: 읍/면/동 */}
        {selectedProvince && selectedCity && (
          <ul className="region-list">
            {towns.map((town) => (
              <li
                key={town.id}
                className="region-item"
                onClick={() => handleSelectTown(town)}
              >
                {town.regionName}
              </li>
            ))}
          </ul>
        )}

        <button className="region-close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default RegionSelectModal;
