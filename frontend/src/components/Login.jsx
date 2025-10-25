import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios"; // Added axios import
import "ldrs/momentum";
import "ldrs/helix";
import Loader from "../Loader/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("user"); // New state for user type

  const loginHandle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Make API call with axios
      const response = await axios.post('http://localhost:5000/user/login', {
        email,
        password,
        role: userType // Pass the selected role to the backend
      });
      
      // Handle successful login
      toast.success(`Successfully logged in as ${userType}`);
      
      // Store the token/user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', userType);
      
      // Redirect to appropriate page based on role after a short delay
      setTimeout(() => {
        window.location.href = userType === 'user' ? '/user' : '/upload';
      }, 1000);
      
    } catch (error) {
      // Handle error
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#1F2937] text-white">
        {/* Background circles */}
        <div className="absolute w-72 h-72 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] top-10 left-10 sm:w-96 sm:h-96 md:w-[350px] md:h-[350px] lg:w-72 lg:h-72"></div>
        <div className="absolute w-96 h-96 bg-[rgba(6,182,212,0.35)] rounded-full blur-[100px] top-1/2 right-10 sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] lg:w-96 lg:h-96"></div>
        <div className="absolute w-48 h-48 bg-[rgba(59,130,246,0.35)] rounded-full blur-[100px] bottom-10 left-1/2 transform -translate-x-1/2 sm:w-72 sm:h-72 md:w-[250px] md:h-[250px] lg:w-48 lg:h-48"></div>
        
        {isLoading && (
          <div className="absolute z-20 h-screen top-0 left-0 bg-[#111827]/55 flex flex-col justify-center items-center w-full">
            <Loader />
          </div>
        )}

        
        {/* Login Card */}
        <div className="relative bg-[#111827] p-8 rounded-lg shadow-xl z-10 w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl text-center mb-6 text-[#06B6D4] font-semibold">
            Login
          </h1>

          {/* User Type Selection */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setUserType("user")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                userType === "user"
                  ? "bg-[#3B82F6] text-white"
                  : "bg-[#374151] text-[#CBD5E1] hover:bg-[#4B5563]"
              }`}
            >
              User
            </button>
            <button
              type="button" // Added type button to prevent form submission
              onClick={() => setUserType("retailer")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                userType === "retailer"
                  ? "bg-[#3B82F6] text-white"
                  : "bg-[#374151] text-[#CBD5E1] hover:bg-[#4B5563]"
              }`}
            >
              Retailer
            </button>
          </div>

          <form
            className="space-y-4 w-full mx-auto"
            onSubmit={loginHandle}
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-[#4B5563] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] bg-[#1F2937] text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-[#4B5563] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] bg-[#1F2937] text-white"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
              disabled={isLoading}
            >
              Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>
            <div className="text-center py-2 text-[#CBD5E1] text-sm sm:text-base">
              Don't have an account yet?{" "}
              <a className="underline text-[#06B6D4]" href="/register">
                Register now
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
