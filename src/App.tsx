import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
// import MyLunchesPage from './pages/MyLunchesPage/MyLunchesPage';
// import HistoryPage from './pages/HistoryPage/HistoryPage';
// import CreateLunchPage from './pages/CreateLunchPage/CreateLunchPage';
// import LunchInfoPage from './pages/LunchInfoPage/LunchInfoPage';
// import ProfilePage from './pages/ProfilePage/ProfilePage';
// import NotFound from './pages/NotFound/NotFound';
import './App.css'
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  return accessToken ? children : <Navigate to="/login" />;
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/my-lunches" element={<PrivateRoute><MyLunchesPage /></PrivateRoute>} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/create-lunch" element={<PrivateRoute><CreateLunchPage /></PrivateRoute>} />
      <Route path="/lunch/:id" element={<PrivateRoute><LunchInfoPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default App
