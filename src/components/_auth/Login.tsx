import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Profile from "../Profile";
import { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const saveUser = async () => {
      if (!user) return;

      setIsProcessing(true);

      try {
        const { sub: auth0Id, name, email, picture } = user;

        let userExists = false;

        // Step 1: Check if user already exists
        try {
          const response = await axios.get(
            `http://localhost:5000/api/users/${auth0Id}`
          );
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
          await axios.post("http://localhost:5000/api/users/auth", {
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
          <h3 className="text-xl font-semibold mb-4">Processing login...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-1">
      <div className="bg-dark-2 p-10 rounded-lg shadow-lg flex flex-col items-center">
        {isAuthenticated ? (
          <Profile />
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-4">Please Login</h3>
            <button
              onClick={() => loginWithRedirect()}
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition"
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
