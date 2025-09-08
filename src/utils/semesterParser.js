export function parseSemesterRange(inputList) {
  const fullList = [
    "대학신입생",
    "대학2학기",
    "대학3학기",
    "대학4학기",
    "대학5학기",
    "대학6학기",
    "대학7학기",
    "대학8학기이상",
  ];

  if (!Array.isArray(inputList) || inputList.length === 0) {
    return "공고 참조";
  }

  const inputSorted = fullList.filter((s) => inputList.includes(s));

  if (inputSorted.length === fullList.length) return "제한 없음";
  // N학기 이상 처리
  for (let i = 1; i < fullList.length; i++) {
    const slice = fullList.slice(i);
    if (
      slice.length === inputSorted.length &&
      slice.every((v, idx) => v === inputSorted[idx])
    ) {
      return `${fullList[i]} 이상`;
    }
  }
  // 연속 구간 처리
  const startIdx = fullList.indexOf(inputSorted[0]);
  const endIdx = fullList.indexOf(inputSorted[inputSorted.length - 1]);
  const isContinuous = inputSorted.length === endIdx - startIdx + 1;
  if (isContinuous) {
    if (startIdx === endIdx) return inputSorted[0];
    return `${inputSorted[0]}부터 ${inputSorted[inputSorted.length - 1]}까지`;
  }
  // 그냥 나열
  return inputSorted.join(", ");
}
