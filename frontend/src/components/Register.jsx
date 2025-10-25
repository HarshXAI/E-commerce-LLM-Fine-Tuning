import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // Toggle user/retailer
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/user/register", {
        name,
        email,
        password,
        role: userType 
      });
      
      console.log("Registration successful:", response.data);
      toast.success("Successfully registered!");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="relative flex items-center justify-center min-h-screen bg-[#1F2937] text-white">
        <div className="absolute w-72 h-72 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-[rgba(6,182,212,0.35)] rounded-full blur-[100px] top-1/2 right-10"></div>
        <div className="absolute w-48 h-48 bg-[rgba(59,130,246,0.35)] rounded-full blur-[100px] bottom-10 left-1/2 transform -translate-x-1/2"></div>
        
        {isLoading && (
          <div className="absolute z-20 h-screen top-0 left-0 bg-[#111827]/55 flex flex-col justify-center items-center w-full">
            <Loader />
          </div>
        )}
      

        <div className="relative bg-[#111827] p-8 rounded-lg shadow-xl z-10 w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl text-center mb-6 text-[#06B6D4] font-semibold">
            Register
          </h1>
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

          <form className="space-y-4 w-full mx-auto" onSubmit={registerUser}>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-[#4B5563] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] bg-[#1F2937] text-white"
            />
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
            >
              Register
            </button>
            <div className="text-center py-2 text-[#CBD5E1] text-sm sm:text-base">
              Already have an account? <a className="underline text-[#06B6D4]" href="/login">Login</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;