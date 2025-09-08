import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  const location = useLocation();
  const [delayedCheck, setDelayedCheck] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedCheck(true);
    }, 3000); // ✅ 1초 딜레이

    return () => clearTimeout(timer); // cleanup
  }, []);

  useEffect(() => {
    if (delayedCheck && !isLoggedIn && location.pathname === "/mypage") {
      alert("로그인이 필요합니다");
    }
  }, [delayedCheck, isLoggedIn, location.pathname]);

  if (delayedCheck && !isLoggedIn && location.pathname === "/mypage") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
