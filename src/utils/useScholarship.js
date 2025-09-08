// src/hooks/useScholarships.js
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../api/config.js";

/**
 * @param {Object} options
 * @param {'전체'|'LOCAL'|'SPECIALTY'|'GRADE'|'INCOME'|'DISABILITY'|'ETC'|null} options.category  // null 또는 undefined 면 필터 안 걸림
 * @param {number} options.pageNumber
 * @param {number} options.pageSize
 */
async function fetchScholarships({
  keyword = null,
  category = null,
  pageNumber = 1,
  pageSize = 100,
}) {
  // keyword는 항상 null
  const params = {
    keyword: keyword || null,
    category: category !== "전체" ? category : null,
    pageNumber,
    pageSize,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null) delete params[k];
  });
  const res = await axios.get(`${BASE_URL}/api/scholarships`, { params });
  if (res.data.success) {
    return res.data.result.content;
  }
  console.error("API 호출 실패:", res.data.message);
  return [];
}

/**
 * @param {string|null} keyword
 * @param {'LOCAL'|'GRADE'|null} category
 * @param {number} [pageNumber]
 * @param {number} [pageSize]
 */
export default function useScholarships(
  keyword = null,
  category = "전체",
  pageNumber = 1,
  pageSize = 100
) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData([]);

    fetchScholarships({ category, pageNumber, pageSize })
      .then((list) => {
        if (!cancelled) setData(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [keyword, category, pageNumber, pageSize]);

  return { data, loading, error };
}
