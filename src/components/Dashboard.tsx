import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Quiz from "./Quiz/Quiz";

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const [startQuiz, setStartQuiz] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-dark-1">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        {startQuiz ? (
          <Quiz />
        ) : (
          <div className="bg-dark-2 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 rounded-lg shadow-lg flex flex-col items-center w-full max-w-md">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-white text-center">
              Welcome to the Quiz!
            </h1>
            <button
              onClick={() => setStartQuiz(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 lg:py-4 lg:px-8 rounded transition w-full sm:w-auto"
            >
              Start Quiz
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
