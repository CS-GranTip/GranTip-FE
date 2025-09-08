import "./MainBanner.css";

const MainBanner = () => {
  /*
    메인배너 컴포넌트 입니다.
    새로 추가된 장학금이나 중요한 장학금의 정보를 나타냅니다.
    */
  return (
    <div className="banner-wrapper">
      <div className="banner-inner">
        <div className="scholarship">이런장학금이있습니다</div>
        <div className="info">
          세종대학교 소프트웨어학과 재학생에게 1000만원 지급
        </div>
      </div>
    </div>
  );
};
export default MainBanner;
