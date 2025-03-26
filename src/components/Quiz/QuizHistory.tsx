import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

interface QuizHistoryItem {
  _id: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  date: string;
}

const QuizHistory: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user?.sub) return;

    const fetchQuizHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quiz/user-histories/${user.sub}` // ✅ Fixed API path
        );
        setHistory(response.data);
      } catch (err) {
        setError("Failed to fetch quiz history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, [isAuthenticated, user?.sub]);

  if (loading) {
    return <p className="text-white text-lg">Loading quiz history...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-dark-1 flex flex-col items-center p-8">
      <h2 className="text-3xl font-bold text-white mb-6">Quiz History</h2>

      {history.length === 0 ? (
        <p className="text-white">No quiz history found.</p>
      ) : (
        <div className="w-full max-w-3xl">
          {history.map((quiz, index) => (
            <div
              key={quiz._id}
              className="bg-dark-2 p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-800 transition transform hover:scale-105"
              onClick={() => navigate(`/quiz-history/${quiz._id}`)} // ✅ Navigate to detailed result page
            >
              <h3 className="text-xl text-white font-semibold">
                Quiz {history.length - index}
              </h3>
              <p className="text-gray-300">Score: {quiz.score}</p>
              <p className="text-gray-300">
                Correct Answers: {quiz.correctAnswers}/{quiz.totalQuestions}
              </p>
              <p className="text-gray-400 text-sm">
                {new Date(quiz.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
