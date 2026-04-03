import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Donate from "./pages/Donate";
import Profile from "./pages/Profile";
import CommunityPage from "./pages/CommunityPage";
import Assignment from "./pages/Assignment";
import ChatRoom from "./pages/ChatRoom";
import Resources from "./pages/Resources";
import QuizPage from "./pages/QuizPage";
import Teacher from "./pages/Teacher";
import VideoResources from "./pages/VideoResources";
import GradePage from "./pages/GradePage";
import NewsFeed from "./pages/NewsFeed";
import Courses from "./pages/Courses";
import StressRelief from "./pages/StressRelief";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/header" element={<Header />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:chatId" element={<ChatRoom />} />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <RoleProtectedRoute allowedRoles={["teacher"]}>
              <Teacher />
            </RoleProtectedRoute>
          }
        />
        <Route path="/video-resources" element={<VideoResources />} />
        <Route path="/gradepage" element={<GradePage />} />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <NewsFeed />
            </ProtectedRoute>
          }
        />
        <Route path="/courses" element={<Courses />} />
        <Route path="/stressed" element={<StressRelief />} />
      </Routes>
    </Router>
  );
}