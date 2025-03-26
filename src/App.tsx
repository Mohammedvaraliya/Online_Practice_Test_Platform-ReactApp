import { Routes, Route } from "react-router-dom";
import "./globals.css";
import Login from "./components/_auth/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import QuizHistory from "./components/Quiz/QuizHistory";
import QuizResult from "./components/Quiz/QuizResult";

function App() {
  return (
    <>
      <main className="min-h-screen bg-dark-1">
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz-history" element={<QuizHistory />} />
          <Route path="/quiz-history/:id" element={<QuizResult />} />{" "}
          {/* ✅ Route for quiz results */}
        </Routes>
      </main>
    </>
  );
}

export default App;
