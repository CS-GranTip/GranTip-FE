import githubImage from "../../assets/github.svg";
import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-text">
          <h3>GranTip</h3>

          <p>Copyright &copy;2025 </p>

          <p>세종대 2025 여름 창의학기제</p>
        </div>
        <div className="v-line"></div>
        <div className="footer-icons">
          <button
            className="footer-icon"
            onClick={() => window.open("https://github.com/CS-GranTip")}
          >
            <img src={githubImage} alt="로고" height="36" width="36" />
          </button>

          <div className="footer-icon">I</div>

          <div className="footer-icon">T</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
