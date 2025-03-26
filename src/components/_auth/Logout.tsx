import { useAuth0 } from "@auth0/auth0-react";

const Logout = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
    >
      Log Out
    </button>
  );
};

export default Logout;
