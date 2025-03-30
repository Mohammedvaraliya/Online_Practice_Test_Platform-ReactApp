import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import Profile from "../Profile";
import Error from "../Error";

const Login = () => {
  const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serverUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    if (isAuthenticated && user) {
      saveUser();
    }
  }, [isAuthenticated]);

  const saveUser = async () => {
    if (!user) return;

    setIsProcessing(true);
    setError(null); // Reset error before new attempt

    try {
      const { sub: auth0Id, name, given_name, email, picture } = user;

      let userExists = false;

      // Step 1: Check if user exists
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
          logoutUser("Error verifying user. Please try again later.");
          return;
        }
      }

      // Step 2: Save user if they don’t exist
      if (!userExists) {
        try {
          await axios.post(`${serverUrl}/api/users/auth`, {
            auth0Id,
            name,
            given_name,
            email,
            picture,
          });
          console.log("✅ New user saved!");
        } catch (error) {
          console.error("❌ Error saving user:", error);
          logoutUser("Failed to save user data. Please try again later.");
          return;
        }
      } else {
        console.log("✅ User already exists.");
      }

      navigate("/dashboard");
    } finally {
      setIsProcessing(false);
    }
  };

  // Logout user from Auth0 and show error
  const logoutUser = (message: string) => {
    logout({ logoutParams: { returnTo: window.location.origin } }); // Force logout
    setError(message); // Show error message
  };

  // Show error component if there's an error
  if (error) {
    return <Error message={error} />;
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-1">
        <div className="bg-dark-2 p-10 rounded-xl shadow-lg flex flex-col items-center animate-fade-in">
          <BeatLoader color="#ffffff" size={15} />
          <h3 className="text-xl font-semibold mt-4 text-white">
            Processing login...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 bg-gradient-to-br from-gray-900 to-black animate-gradient">
      <div className="relative p-8 sm:p-10 bg-white bg-opacity-5 backdrop-blur-md rounded-xl shadow-lg border border-gray-700/50 text-center w-full max-w-sm sm:max-w-md transition transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-gray-400/50">
        <div className="absolute inset-0 w-full h-full bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg transition duration-300 hover:bg-opacity-20"></div>

        {isAuthenticated ? (
          <Profile />
        ) : (
          <>
            <h2 className="relative z-10 text-2xl sm:text-3xl font-bold text-white mb-4 animate-fade-in">
              Welcome Back!
            </h2>
            <p className="relative z-10 text-gray-300 mb-6 text-sm sm:text-base animate-fade-in">
              Login to continue to your dashboard
            </p>
            <button
              onClick={() => loginWithRedirect()}
              className="relative z-10 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-700 text-white font-bold py-2 px-6 rounded-full transition transform hover:scale-105 shadow-lg animate-fade-in"
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
