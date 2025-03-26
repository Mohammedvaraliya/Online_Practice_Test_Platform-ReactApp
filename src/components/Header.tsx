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
    <header className="bg-dark-2 p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
        <Link to="/dashboard">User Dashboard</Link>
      </h1>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition"
        >
          {user?.nickname}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <ul className="py-1">
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  onClick={() => setDropdownOpen(false)}
                >
                  View your Profile
                </Link>
              </li>
              <li>
                {isAuthenticated && (
                  <Link
                    to="/quiz-history"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Quiz History
                  </Link>
                )}
              </li>
              <li>
                <button
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
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
      </div>
    </header>
  );
};

export default Header;
