import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ResultEvaluationWithPiChart from "./ResultEvaluationWithPiChart";
import { QuizHistoryDetail } from "../../types";
import { BeatLoader } from "react-spinners";

const QuizResult: React.FC = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState<QuizHistoryDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const serverUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    if (!id) return;

    const fetchQuizDetail = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/quiz/user-history/${id}`
        );
        setQuizData(response.data);
      } catch (err) {
        setError("Failed to load quiz details.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetail();
  }, [id]);

  // Function to process quiz data for Pie Chart
  const processQuizData = () => {
    if (!quizData || !quizData.questions) return [];

    console.log("Processing Quiz Data for Pie Chart:", quizData.questions);

    const tagCounts: { [key: string]: { correct: number; total: number } } = {};

    quizData.questions.forEach((question) => {
      if (!question.tags || question.tags.length === 0) return; // Ensure tags exist

      question.tags.forEach((tag) => {
        if (!tagCounts[tag]) {
          tagCounts[tag] = { correct: 0, total: 0 };
        }
        tagCounts[tag].total += 1;

        if (question.userAnswer === question.correct_answer) {
          tagCounts[tag].correct += 1;
        }
      });
    });

    console.log("Processed Tag Data:", tagCounts);

    return Object.keys(tagCounts).map((tag, index) => ({
      id: index,
      value: tagCounts[tag].correct,
      label: `${tag} ${tagCounts[tag].correct}/${tagCounts[tag].total}`,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <BeatLoader color="#ffffff" size={15} />
      </div>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>;
  if (!quizData) return <p className="text-white">Quiz data not found.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-1 px-4 pt-28">
      <div className="bg-dark-2 p-6 md:p-10 rounded-lg shadow-lg flex flex-col items-center w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Quiz Completed 🎉
        </h2>

        {/* Score & Stats */}
        <div className="bg-dark-3 w-full p-5 rounded-lg shadow-lg mb-6 text-center">
          <p className="text-xl text-white font-semibold">
            Score: <span className="text-primary-500">{quizData.score}</span>
          </p>
          <p className="text-lg text-gray-300">
            Correct Answers:{" "}
            <span className="text-green-400">
              {quizData.correctAnswers} / {quizData.totalQuestions}
            </span>
          </p>
        </div>

        {/* Pie Chart */}
        <div className="w-full flex justify-center mb-6">
          <ResultEvaluationWithPiChart data={processQuizData()} />
        </div>

        {/* Questions Review */}
        <div className="w-full space-y-5">
          {quizData.questions.map((question, index) => {
            const isCorrect = question.userAnswer === question.correct_answer;

            return (
              <div
                key={index}
                className={`p-5 rounded-lg shadow-md border-4 ${
                  isCorrect ? "border-green-500" : "border-red-500"
                } bg-dark-3`}
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {index + 1}. {question.question}
                </h3>

                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-bold text-blue-400">
                      Your Answer:{" "}
                    </span>
                    <span className="text-white">
                      {question.userAnswer ?? "No Answer Provided"}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-bold text-yellow-400">
                      Correct Answer:{" "}
                    </span>
                    <span className="text-white">
                      {question.correct_answer}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-bold text-gray-400 underline">
                      Explanation:
                    </span>{" "}
                    <span className="text-gray-300">
                      {question.explanation}
                    </span>
                  </p>
                </div>

                {/* References */}
                {question.userAnswer !== question.correct_answer &&
                  question.references.length > 0 && (
                    <div className="text-sm mt-3">
                      {question.references.map((ref, i) => (
                        <p key={i}>
                          <a
                            href={ref}
                            className="font-bold text-blue-400 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Reference {i + 1}
                          </a>
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
