import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Profile from "../Profile";
import { useEffect, useState } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";

const Login = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const serverUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    const saveUser = async () => {
      if (!user) return;

      setIsProcessing(true);

      try {
        const { sub: auth0Id, name, email, picture } = user;

        let userExists = false;

        // Step 1: Check if user already exists
        try {
          const response = await axios.get(`${serverUrl}/api/users/${auth0Id}`);
          if (response.status === 200 && response.data) {
            userExists = true;
          }
        } catch (error: any) {
          if (error.response?.status === 404) {
            userExists = false;
          } else {
            console.error("❌ Error checking user:", error);
            return;
          }
        }

        // Step 2: Save user if not exists
        if (!userExists) {
          await axios.post(`${serverUrl}/api/users/auth`, {
            auth0Id,
            name,
            email,
            picture,
          });
          console.log("✅ New user saved!");
        } else {
          console.log("✅ User already exists.");
        }

        navigate("/dashboard");
      } catch (error) {
        console.error("❌ Error in authentication process:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    if (isAuthenticated) {
      saveUser();
    }
  }, [isAuthenticated, user, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-1">
        <div className="bg-dark-2 p-10 rounded-lg shadow-lg flex flex-col items-center">
          <BeatLoader color="#ffffff" size={15} />
          <h3 className="text-xl font-semibold mt-4 text-white">
            Processing login...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 bg-gradient-to-br from-black via-gray-900 to-gray-800 animate-gradient">
      <div className="relative p-8 sm:p-10 bg-white bg-opacity-5 backdrop-blur-md rounded-xl shadow-lg border border-gray-700/50 text-center w-full max-w-sm sm:max-w-md transition transform duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-400/50">
        <div className="absolute inset-0 w-full h-full bg-white bg-opacity-5 backdrop-blur-lg rounded-xl shadow-lg transition duration-300 hover:bg-opacity-10 hover:border-gray-500/50"></div>

        {isAuthenticated ? (
          <Profile />
        ) : (
          <>
            <h2 className="relative z-10 text-2xl sm:text-3xl font-bold text-white mb-4">
              Welcome Back!
            </h2>
            <p className="relative z-10 text-gray-300 mb-6 text-sm sm:text-base">
              Login to continue to your dashboard
            </p>
            <button
              onClick={() => loginWithRedirect()}
              className="relative z-10 bg-gradient-to-r from-gray-700 to-black hover:from-black hover:to-gray-700 text-white font-bold py-2 px-6 rounded-full transition transform hover:scale-105 shadow-lg"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
