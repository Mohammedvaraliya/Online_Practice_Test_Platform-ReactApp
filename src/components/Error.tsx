import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type ErrorProps = {
  message?: string;
};

const Error = ({
  message = "Something went wrong. Please try again!",
}: ErrorProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="relative bg-gray-900 bg-opacity-80 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-lg transition duration-300 transform hover:scale-105 hover:shadow-2xl">
        {/* Background Red Glow */}
        <div className="absolute inset-0 bg-red-600 opacity-20 blur-2xl rounded-2xl"></div>

        {/* Error Content */}
        <div className="relative flex flex-col items-center text-center space-y-4">
          {/* Warning Icon */}
          <div className="bg-red-700 p-4 rounded-full shadow-md animate-pulse">
            <FaExclamationTriangle className="text-white text-6xl" />
          </div>

          {/* Error Message */}
          <h2 className="text-3xl font-bold text-red-400 drop-shadow-lg">
            Oops! Something Went Wrong
          </h2>
          <p className="text-gray-300 text-lg font-medium">{message}</p>

          {/* Go Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-110 hover:shadow-red-500/50"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
