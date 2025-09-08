import { useRef, useEffect, useState } from "react";

const AutoFitText = ({
  text,
  maxFontSize = 24,
  minFontSize = 12,
  width = 200,
  fontWeights = [700, 500, 400],
  className = "",
}) => {
  const textRef = useRef();
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [fontWeight, setFontWeight] = useState(fontWeights[0]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let currentFontSize = maxFontSize;
    let currentFontWeightIdx = 0;

    el.style.fontSize = `${currentFontSize}px`;
    el.style.fontWeight = fontWeights[currentFontWeightIdx];

    // 폰트 사이즈 줄이기
    while (el.scrollWidth > width && currentFontSize > minFontSize) {
      currentFontSize -= 1;
      el.style.fontSize = `${currentFontSize}px`;

      // 특정 크기 이하가 되면 font-weight 줄이기
      if (
        currentFontSize <= minFontSize + 2 &&
        currentFontWeightIdx < fontWeights.length - 1
      ) {
        currentFontWeightIdx += 1;
        el.style.fontWeight = fontWeights[currentFontWeightIdx];
      }
    }

    setFontSize(currentFontSize);
    setFontWeight(fontWeights[currentFontWeightIdx]);
  }, [text, width, maxFontSize, minFontSize, fontWeights]);

  return (
    <div
      ref={textRef}
      className={className}
      style={{
        width: `${width}px`,
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
};

export default AutoFitText;
