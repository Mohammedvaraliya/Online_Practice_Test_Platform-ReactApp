import { Routes, Route } from "react-router-dom";
import "./globals.css";
import Login from "./components/_auth/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import QuizHistory from "./components/Quiz/QuizHistory";
import QuizResult from "./components/Quiz/QuizResult";
import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen bg-dark-1 flex flex-col">
      {/* ✅ Header stays on top */}
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz-history" element={<QuizHistory />} />
          <Route path="/quiz-history/:id" element={<QuizResult />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
