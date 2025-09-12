import "./App.css";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageTransitionWrapper from "./components/layout/PageTransitionWrapper";
import { AnimatePresence } from "framer-motion";
import MyPage from "./pages/MyPage";
import UserInfoEdit from "./pages/UserInfoEdit";
import Search from "./pages/Search";
import SearchBar from "./components/common/SearchBar";
import Detail from "./pages/Detail";
import { useState, useEffect } from "react";
import ProtectedRoute from "./hooks/ProtectedRoute";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./utils/ScrollToTop";
import LikeList from "./pages/LikeList";
import TipMore from "./pages/TipMore.jsx";
import EditPW from "./components/Modal/EditPW.jsx";
import { useAuthStore } from "./utils/axios.js";
function AppContent() {
  const [inputText, setInputText] = useState("");
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/signup", "/update-password"];
  const hideHeader = hideHeaderRoutes.includes(location.pathname);
  const { isLoggedIn } = useAuthStore();
  return (
    <>
      <AnimatePresence>
        {!hideHeader && (
          <PageTransitionWrapper>
            <Header setSearchText={setInputText} />
          </PageTransitionWrapper>
        )}
      </AnimatePresence>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransitionWrapper>
                <Home inputText={inputText} setInputText={setInputText} />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransitionWrapper>
                <Login />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/signup"
            element={
              <PageTransitionWrapper>
                <Signup />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/mypage"
            element={
              <PageTransitionWrapper>
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <MyPage />
                </ProtectedRoute>
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/edit"
            element={
              <PageTransitionWrapper>
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <UserInfoEdit />
                </ProtectedRoute>
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/search"
            element={
              <>
                <SearchBar
                  inputText={inputText}
                  setInputText={setInputText}
                  customClassActive={"this"}
                />
                <Search />
              </>
            }
          />
          <Route
            path="/detail/:id"
            element={
              <PageTransitionWrapper>
                <Detail isLoggedIn={isLoggedIn} />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/like"
            element={
              <PageTransitionWrapper>
                <LikeList />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/tipmore"
            element={
              <PageTransitionWrapper>
                <TipMore />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/update-password"
            element={
              <PageTransitionWrapper>
                <EditPW />
              </PageTransitionWrapper>
            }
          />
        </Routes>

        {!hideHeader && (
          <PageTransitionWrapper>
            <Footer />
          </PageTransitionWrapper>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
