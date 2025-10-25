import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Set states for role and user
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user and role from localStorage
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole("");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-blue-400 font-bold text-xl">DataInsight</span>
          </div>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {role === "user" ? (
                  <a href="/user" className="text-gray-300 hover:text-white">
                    User Dashboard
                  </a>
                ) : (
                  <>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 cursor-pointer text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="#features" className="text-gray-300 font-medium hover:text-blue-400">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-300 font-medium hover:text-blue-400">
                  How It Works
                </a>
                <a 
                  href="/login"
                  className="px-4 py-2 cursor-pointer text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300"
                >
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;