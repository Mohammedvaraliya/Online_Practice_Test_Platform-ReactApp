import React, { useState, useEffect } from "react";
import QuestionOptions from "./QuestionOptions";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Question } from "../../types";
import { BeatLoader } from "react-spinners";

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingHistory, setSavingHistory] = useState<boolean>(false); // New state for saving quiz history
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [easyQuestions, setEasyQuestions] = useState<Question[]>([]);
  const [mediumQuestions, setMediumQuestions] = useState<Question[]>([]);
  const [hardQuestions, setHardQuestions] = useState<Question[]>([]);
  const [shownQuestions, setShownQuestions] = useState<Set<number>>(new Set());
  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const preloadQuestions = async () => {
    setLoading(true);
    try {
      const [easyResponse, mediumResponse, hardResponse] = await Promise.all([
        fetch(`/assets/MCQ/easy.json`).then((res) => res.json()),
        fetch(`/assets/MCQ/medium.json`).then((res) => res.json()),
        fetch(`/assets/MCQ/hard.json`).then((res) => res.json()),
      ]);
      setEasyQuestions(easyResponse);
      setMediumQuestions(mediumResponse);
      setHardQuestions(hardResponse);
    } catch (error) {
      console.error("Failed to load questions", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    preloadQuestions();
  }, []);

  useEffect(() => {
    if (easyQuestions.length > 0) {
      const nextQuestion = getNextQuestion("easy");
      if (nextQuestion) {
        setQuestions([nextQuestion]);
      }
    }
  }, [easyQuestions]);

  const getNextQuestion = (difficulty: string): Question | null => {
    let availableQuestions: Question[];

    switch (difficulty) {
      case "easy":
      default:
        availableQuestions = easyQuestions.filter(
          (_, index) => !shownQuestions.has(index)
        );
        break;
      case "medium":
        availableQuestions = mediumQuestions.filter(
          (_, index) => !shownQuestions.has(index)
        );
        break;
      case "hard":
        availableQuestions = hardQuestions.filter(
          (_, index) => !shownQuestions.has(index)
        );
        break;
    }

    if (availableQuestions.length === 0) {
      return null;
    }

    const nextQuestionIndex = Math.floor(
      Math.random() * availableQuestions.length
    );
    const nextQuestion = availableQuestions[nextQuestionIndex];
    setShownQuestions(
      new Set([
        ...Array.from(shownQuestions),
        (difficulty === "easy"
          ? easyQuestions
          : difficulty === "medium"
          ? mediumQuestions
          : hardQuestions
        ).indexOf(nextQuestion),
      ])
    );

    return {
      ...nextQuestion,
      userAnswer: null,
      userScore: null,
    };
  };

  const getNextDifficulty = (
    isCorrect: boolean,
    currentDifficulty: string
  ): string => {
    if (isCorrect) {
      switch (currentDifficulty) {
        case "easy":
          return "medium";
        case "medium":
          return "hard";
        case "hard":
          return "hard"; // No change if already at hard
        default:
          return "easy";
      }
    } else {
      switch (currentDifficulty) {
        case "medium":
          return "easy";
        case "hard":
          return "medium";
        case "easy":
          return "easy"; // No change if already at easy
        default:
          return "easy";
      }
    }
  };

  const handleAnswer = async (): Promise<void> => {
    if (selectedOption === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_answer;

    if (isCorrect) {
      const scoreIncrease =
        currentQuestion.difficulty === "easy"
          ? 2
          : currentQuestion.difficulty === "medium"
          ? 3
          : 4;
      setScore((prevScore) => prevScore + scoreIncrease);
      setCorrectAnswerCount((prevCount) => prevCount + 1);
    }

    const newDifficulty = getNextDifficulty(isCorrect, difficulty);
    setDifficulty(newDifficulty);

    const updatedQuestion = {
      ...currentQuestion,
      userAnswer: selectedOption,
      userScore: isCorrect ? 1 : 0,
    };

    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[currentQuestionIndex] = updatedQuestion;
      return updatedQuestions;
    });

    setSelectedOption(null);

    if (questions.length < 10) {
      setCompleted(false);
      const nextQuestion = getNextQuestion(newDifficulty);
      if (nextQuestion) {
        setQuestions((prevQuestions) => [...prevQuestions, nextQuestion]);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    }

    if (questions.length === 10) {
      setCompleted(true);
      await saveQuizHistory();
    }
  };

  const saveQuizHistory = async () => {
    if (!user?.sub) return;

    setSavingHistory(true);

    try {
      const quizData = {
        auth0Id: user.sub,
        score: score,
        correctAnswers: correctAnswerCount,
        totalQuestions: questions.length,
        questions: questions.map((q) => ({
          question: q.question,
          userAnswer: q.userAnswer || null,
          correct_answer: q.correct_answer || "N/A",
          explanation: q.explanation || "No explanation available",
          references: q.references || [],
          difficulty: q.difficulty || "unknown",
          tags: q.tags || [],
        })),
      };

      const response = await fetch(`${serverUrl}/api/quiz/save-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const responseData = await response.json();
      if (!responseData.quizHistory || !responseData.quizHistory._id) {
        throw new Error(
          "Invalid response from server: Missing quiz history ID"
        );
      }

      console.log(
        "✅ Quiz history saved with ID:",
        responseData.quizHistory._id
      );
      navigate(`/quiz-history/${responseData.quizHistory._id}`);
    } catch (error) {
      console.error("❌ Error saving quiz history:", error);
      navigate("/error", {
        state: {
          message: "Failed to save your quiz history. Please try again later.",
        },
      });
    } finally {
      setSavingHistory(false);
    }
  };

  if (loading || savingHistory) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <BeatLoader color="#ffffff" size={15} />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-1 px-4 pt-28">
      <div className="bg-dark-2 p-6 md:p-10 rounded-lg shadow-lg flex flex-col items-center w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          {currentQuestionIndex + 1}. {currentQuestion?.question}
        </h2>

        {/* Difficulty & Tags */}
        <div className="flex space-x-4 mb-4">
          <span
            className={`px-4 py-2 rounded-full ${
              currentQuestion?.difficulty === "easy"
                ? "bg-green-500 text-white"
                : currentQuestion?.difficulty === "medium"
                ? "bg-yellow-500 text-white"
                : "bg-red text-white"
            }`}
          >
            {currentQuestion?.difficulty}
          </span>
          <span className="bg-neutral-600 px-4 py-2 rounded-full text-white">
            {currentQuestion?.tags?.join(", ") || "General"}
          </span>
        </div>

        {/* Options */}
        <QuestionOptions
          options={currentQuestion?.options ?? []}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />

        {/* Navigation Button */}
        <button
          onClick={handleAnswer}
          className="mt-4 bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
        >
          {completed ? "Finish Quiz" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
