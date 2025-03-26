import React, { useState, useEffect } from "react";
// import QuizResult from "./QuizResult";
import QuestionOptions from "./QuestionOptions";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Question } from "../../types";

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [easyQuestions, setEasyQuestions] = useState<Question[]>([]);
  const [mediumQuestions, setMediumQuestions] = useState<Question[]>([]);
  const [hardQuestions, setHardQuestions] = useState<Question[]>([]);
  const [shownQuestions, setShownQuestions] = useState<Set<number>>(new Set());
  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Function to preload all questions from each difficulty level
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

  const handleAnswer = (): void => {
    if (selectedOption === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_answer;

    if (isCorrect && currentQuestion.difficulty === "easy") {
      setScore((prevScore) => prevScore + 2);
      setCorrectAnswerCount(
        (prevCorrectAnswerCount) => prevCorrectAnswerCount + 1
      );
    } else if (isCorrect && currentQuestion.difficulty === "medium") {
      setScore((prevScore) => prevScore + 3);
      setCorrectAnswerCount(
        (prevCorrectAnswerCount) => prevCorrectAnswerCount + 1
      );
    } else if (isCorrect && currentQuestion.difficulty === "hard") {
      setScore((prevScore) => prevScore + 4);
      setCorrectAnswerCount(
        (prevCorrectAnswerCount) => prevCorrectAnswerCount + 1
      );
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

    console.log(questions);

    setSelectedOption(null);
    // console.log("Questions length:", questions.length);
    // console.log("Current Question Index:", currentQuestionIndex);

    if (questions.length < 10) {
      setCompleted(false);
      const nextQuestion = getNextQuestion(newDifficulty);
      if (nextQuestion) {
        setQuestions((prevQuestions) => [...prevQuestions, nextQuestion]);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        console.log("Next Question:", nextQuestion);
      }
    }

    if (questions.length === 10) {
      setCompleted(true);
      saveQuizHistory();
      console.log(questions);
    }
  };

  const saveQuizHistory = async () => {
    if (!user?.sub) return;

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

      const response = await fetch(
        "http://localhost:5000/api/quiz/save-history",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quizData),
        }
      );

      const responseData = await response.json();
      console.log("🚀 Full Response Data:", responseData); // Debugging

      if (!responseData.quizHistory.userId) {
        throw new Error("Missing _id in response");
      }

      console.log("✅ Quiz history saved with ID:", responseData._id);
      setTimeout(() => {
        navigate(`/quiz-history/${responseData.quizHistory._id}`);
      }, 500);
    } catch (error) {
      console.error("❌ Error saving quiz history:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-0 flex items-center justify-center bg-dark-1">
        Loading...
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-0 flex items-center justify-center bg-dark-1">
      <div className="bg-dark-2 md:p-6 p-10 rounded-lg shadow-lg flex flex-col items-start md:w-465 max-w-2xl sm:w-auto h-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
          {currentQuestion &&
            `${currentQuestionIndex + 1}. ${currentQuestion.question} `}
        </h2>
        <div className="flex space-x-4 mb-4 ml-6">
          <p
            className={
              currentQuestion?.difficulty === "easy"
                ? "text-green-500 bg-dark-4 rounded-full p-2 pl-4 pr-4"
                : currentQuestion?.difficulty === "medium"
                ? "text-yellow-500 bg-dark-4 rounded-full p-2 pl-4 pr-4"
                : currentQuestion?.difficulty === "hard"
                ? "text-red bg-dark-4 rounded-full p-2 pl-4 pr-4"
                : ""
            }
          >
            {currentQuestion && `${currentQuestion.difficulty}`}
          </p>
          <p className="bg-neutral-600 rounded-full p-2 pl-4 pr-4">
            {currentQuestion && `${currentQuestion.tags}`}
          </p>
        </div>
        <QuestionOptions
          options={currentQuestion?.options ?? []}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className="flex justify-end w-full">
          <button
            onClick={handleAnswer}
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
