import { useState, useEffect } from "react";

function useFormInput({
  initialValue = "",
  validate = () => true,
  errorMessage = "",
}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const onChange = (e) => {
    setValue(e.target.value);
    if (!touched) setTouched(true);
  };

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  useEffect(() => {
    if (!touched || value === "") {
      setError("");
    } else if (!validate(value)) {
      setError(isFocused ? "" : errorMessage); // 포커스 중엔 안 보여줘
    } else {
      setError("");
    }
  }, [value, validate, errorMessage, isFocused, touched]);

  const isValid = value !== "" && validate(value); // ✅ 핵심 수정

  return {
    value,
    onChange,
    onFocus,
    onBlur,
    error,
    isFocused,
    isValid, // 여기 기준으로 버튼 활성화 판단
    setValue,
  };
}

export default useFormInput;
