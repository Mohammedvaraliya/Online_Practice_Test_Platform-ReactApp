import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useEffect } from "react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  console.log(user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-1 text-white">
        Loading...
      </div>
    );
  }

  return (
    isAuthenticated && (
      <div className="min-h-screen flex flex-col bg-dark-1">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-dark-1 p-4">
          <div className="bg-dark-2 p-6 md:p-10 rounded-lg shadow-lg flex flex-col items-center w-full max-w-md">
            <img
              src={user?.picture}
              alt={user?.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-4 shadow-md"
            />
            <h2 className="text-xl md:text-2xl font-semibold text-white text-center">
              {user?.name}
            </h2>
            <p className="text-light-4 text-lg md:text-xl text-center">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
