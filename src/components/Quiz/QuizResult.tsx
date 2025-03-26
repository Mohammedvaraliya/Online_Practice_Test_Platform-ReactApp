import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ResultEvaluationWithPiChart from "./ResultEvaluationWithPiChart";

interface Question {
  question: string;
  userAnswer: string | null;
  correct_answer: string;
  explanation: string;
  references: string[];
  difficulty: string;
  tags: string[];
  userScore: number;
}

interface QuizHistoryDetail {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  questions: Question[];
}

const QuizResult: React.FC = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState<QuizHistoryDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchQuizDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quiz/user-history/${id}`
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

  if (loading)
    return <p className="text-white text-lg">Loading quiz details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!quizData) return <p className="text-white">Quiz data not found.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-1 px-4">
      <div className="bg-dark-2 p-6 md:p-10 rounded-lg shadow-lg flex flex-col items-center w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Quiz Completed</h2>
        <p className="text-xl mb-2 text-center">Score: {quizData.score}</p>
        <p className="text-xl mb-4 text-center">
          Correct Answers: {quizData.correctAnswers} / {quizData.totalQuestions}
        </p>

        {/* Render Pie Chart */}
        <div className="w-full flex justify-center mb-6">
          <ResultEvaluationWithPiChart data={processQuizData()} />
        </div>

        <ul className="w-full space-y-4">
          {quizData.questions.map((question, index) => (
            <li
              key={index}
              className={`p-4 rounded-2xl ${
                question.userAnswer === question.correct_answer
                  ? "border-8 border-green-600"
                  : "border-8 border-gray-600"
              }`}
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {index + 1}. {question.question}
                </h3>
              </div>
              <div className="mb-2 ml-2">
                <p className="text-sm">
                  <span className="font-bold text-green-500">
                    Your Answer:{" "}
                  </span>
                  <span className="text-white">
                    {question.userAnswer ?? "No Answer Provided"}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-bold text-yellow-500">
                    Correct Answer:{" "}
                  </span>
                  <span className="text-white">{question.correct_answer}</span>
                </p>
                <p className="text-sm">
                  <span className="font-bold text-zinc-400 underline">
                    Explanation:
                  </span>
                  <span className="text-neutral-400">
                    {" "}
                    {question.explanation}
                  </span>
                </p>

                {question.userAnswer !== question.correct_answer &&
                  question.references.length > 0 && (
                    <div className="text-sm">
                      {question.references.map((ref, i) => (
                        <p key={i}>
                          <a
                            href={ref}
                            className="font-bold text-blue-300 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Additional Reference {i + 1}
                          </a>
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizResult;
