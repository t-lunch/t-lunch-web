import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/layout/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
// import MyLunchesPage from './pages/MyLunchesPage/MyLunchesPage';
// import HistoryPage from './pages/HistoryPage/HistoryPage';
// import CreateLunchPage from './pages/CreateLunchPage/CreateLunchPage';
// import LunchInfoPage from './pages/LunchInfoPage/LunchInfoPage';
// import ProfilePage from './pages/ProfilePage/ProfilePage';
// import NotFound from './pages/NotFound/NotFound';
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  return accessToken ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app-container">
      {!isAuthPage && accessToken && <Header />}

      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/register"
          element={
            <div className="auth-container">
              <RegisterPage />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="auth-container">
              <LoginPage />
            </div>
          }
        />
        {/* <Route path="/my-lunches" element={<PrivateRoute><MyLunchesPage /></PrivateRoute>} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/create-lunch" element={<PrivateRoute><CreateLunchPage /></PrivateRoute>} />
        <Route path="/lunch/:id" element={<PrivateRoute><LunchInfoPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
};

export default App;
