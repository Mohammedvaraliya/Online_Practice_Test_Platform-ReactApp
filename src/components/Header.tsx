import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="fixed top-0 left-0 w-full bg-dark-2 px-6 py-4 flex justify-between items-center shadow-md border-b border-gray-700 z-50">
      {/* Logo / Dashboard Name */}
      <h1 className="text-xl md:text-2xl font-bold text-white hover:text-gray-300 transition">
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center"
        >
          <span className="mr-2">📊</span> {/* Icon for dashboard */}
          {isAuthenticated ? "Online Practice Test Platform" : "Home"}
        </Link>
      </h1>

      {/* User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {isAuthenticated ? (
          <>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-full transition duration-200"
            >
              <img
                src={user?.picture}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border border-gray-500"
              />
              <span>{user?.nickname}</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-gray-900 bg-opacity-90 backdrop-blur-lg border border-gray-700 rounded-md shadow-lg z-20 transition-all">
                <ul className="py-2">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-white hover:bg-gray-700 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/quiz-history"
                      className="block px-4 py-2 text-white hover:bg-gray-700 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Quiz History
                    </Link>
                  </li>
                  <li>
                    <button
                      className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition"
                      onClick={() =>
                        logout({
                          logoutParams: { returnTo: window.location.origin },
                        })
                      }
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
