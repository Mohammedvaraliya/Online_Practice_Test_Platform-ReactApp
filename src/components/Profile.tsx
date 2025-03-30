import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { BeatLoader } from "react-spinners";
import { UserData } from "../types"; // Import the type

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_APP_BACKEND_URL;
  const [userData, setUserData] = useState<UserData | null>(null); // Set correct type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      if (!user) return;

      try {
        const response = await axios.get<UserData>(
          `${serverUrl}/api/users/${user.sub}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, navigate]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <BeatLoader color="#ffffff" size={15} />
          <p className="text-lg mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    isAuthenticated &&
    userData && (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black">
        <Header />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="relative bg-gray-900 bg-opacity-80 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800 w-full max-w-lg transition duration-300 transform hover:scale-105 hover:shadow-2xl">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-lg rounded-xl"></div>

            {/* Profile Content */}
            <div className="relative flex flex-col items-center">
              <img
                src={`${userData.picture}?timestamp=${new Date().getTime()}`}
                alt={userData.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full mb-4 shadow-lg border-2 border-gray-700"
                crossOrigin="anonymous"
              />
              <h2 className="text-2xl font-semibold text-white">
                {userData.name}
              </h2>
              <p className="text-gray-400 text-lg">{userData.email}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
