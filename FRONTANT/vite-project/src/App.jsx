import React, { useEffect } from 'react';
import "tailwindcss";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import Navbar from './components/Navbar.jsx';
import { useAuthStore } from './stor/useAuthStor.js';
import { useThemeStore } from './stor/useThemeStor.js';
import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast';

function App() {
  const { authUser, checkAuth, isCheckingAuth,onlineUsers } = useAuthStore();
  const {theme}= useThemeStore();

  
  useEffect(() => {
    checkAuth();
  }, []);
  useEffect(() => {
  if (authUser?._id) {
    useAuthStore.getState().connectSocket();
  }
}, [authUser]);
  console.log({onlineUsers});

  

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
