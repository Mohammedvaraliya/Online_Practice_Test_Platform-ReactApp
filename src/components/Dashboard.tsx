import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners"; // Import loading spinner
import Header from "./Header";
import Error from "./Error";

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth0();
  const [isUserSaved, setIsUserSaved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/");
      return;
    }

    const checkUser = async () => {
      setLoading(true);
      try {
        const { sub: auth0Id } = user;
        const response = await axios.get(`${serverUrl}/api/users/${auth0Id}`);

        if (response.status === 200 && response.data) {
          setIsUserSaved(true);
        } else {
          setIsUserSaved(false);
        }
      } catch (err) {
        console.error("❌ Error verifying user:", err);
        setError("Error verifying user. Please try again.");
        setIsUserSaved(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [isAuthenticated, user, navigate]);

  // Show error page if there's an error
  if (error) {
    return <Error message={error} />;
  }

  // Show loading state while checking user
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md p-10 rounded-lg shadow-lg text-center text-white">
          <BeatLoader color="#ffffff" size={15} />
          <h2 className="mt-4 text-xl font-semibold">Checking User...</h2>
        </div>
      </div>
    );
  }

  // If user is not saved in DB, redirect to login
  if (isUserSaved === false) {
    return (
      <Error message="Your account is not recognized. Please log in again." />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 rounded-lg shadow-lg flex flex-col items-center w-full max-w-md border border-gray-800 transition transform duration-300 hover:scale-105 hover:shadow-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-white text-center">
            Welcome to the Quiz!
          </h1>
          <button
            onClick={() => navigate("/quiz")} // Navigate to Quiz.tsx
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 lg:py-4 lg:px-8 rounded transition transform hover:scale-105 shadow-lg"
          >
            Start Quiz
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
