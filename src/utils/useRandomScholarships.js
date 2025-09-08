import { useState, useEffect } from "react";
import useScholarships from "./useScholarship";

/** 배열에서 중복 없이 count개 항목 랜덤 추출 */
function sampleArray(arr, count) {
  const copy = [...arr];
  const result = [];
  while (result.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

/**
 * 카테고리별로 count개 랜덤 장학금 반환
 * @param {'LOCAL'|'GRADE'|null} category
 * @param {number} count
 */
export default function useRandomScholarships(category = null, count = 5) {
  const { data, loading, error } = useScholarships(null, category);
  const [randomList, setRandomList] = useState([]);

  useEffect(() => {
    if (!loading && !error) {
      // 실제 데이터 길이만큼만 샘플링
      setRandomList(sampleArray(data, count));
    }
  }, [data, loading, error, count]);

  return { randomList, loading, error };
}
