import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { QuizHistoryItem } from "../../types";
import { BeatLoader } from "react-spinners";

const QuizHistory: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    if (!isAuthenticated || !user?.sub) {
      navigate("/error", { state: { message: "Unauthorized access." } });
      return;
    }

    const fetchQuizHistory = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/quiz/user-histories/${user.sub}`
        );

        if (!Array.isArray(response.data)) {
          throw new Error("Unexpected response format.");
        }

        if (response.data.length === 0) {
          navigate("/error", {
            state: { message: "No quiz history found." },
          });
          return;
        }

        // 🔥 Sort quizzes by date (newest first)
        const sortedHistory = response.data.sort(
          (a: QuizHistoryItem, b: QuizHistoryItem) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setHistory(sortedHistory);
      } catch (err) {
        console.error("❌ Error fetching quiz history:", err);
        navigate("/error", {
          state: { message: "Failed to load quiz history. Please try again." },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, [isAuthenticated, user?.sub, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <BeatLoader color="#ffffff" size={15} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-1 flex flex-col items-center p-8 pt-28">
      <h2 className="text-4xl font-extrabold text-white mb-6">
        📜 Quiz History
      </h2>

      <div className="w-full max-w-3xl space-y-4">
        {history.map((quiz, index) => (
          <div
            key={quiz._id}
            className="bg-dark-2 p-5 rounded-lg shadow-md cursor-pointer transition-all transform hover:scale-105 hover:bg-gray-800 border border-gray-600"
            onClick={() => navigate(`/quiz-history/${quiz._id}`)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">
                Quiz {history.length - index}
              </h3>
              <span
                className={`text-lg font-semibold px-3 py-1 rounded-md ${
                  quiz.score > 70
                    ? "bg-green-500 text-white"
                    : "bg-red text-white"
                }`}
              >
                {quiz.score}%
              </span>
            </div>
            <p className="text-gray-300 mt-2">
              ✅ Correct: {quiz.correctAnswers}/{quiz.totalQuestions}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              📅 {new Date(quiz.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizHistory;
