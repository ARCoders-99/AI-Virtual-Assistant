import React, { useContext } from "react";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import bg from "../assets/authBg.png";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../Context/UserContext";
import axios from "axios";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(UserDataContext);
  const Navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(result);
      setUserData(result.data);
      setLoading(false);
      Navigate("/");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  return (
    <div
      className="w-full min-h-[100vh] bg-cover bg-center bg-no-repeat flex justify-center 
      items-center p-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-[500px] pt-[55px] 
        bg-[#000000a3] backdrop-blur-md shadow-lg shadow-black flex flex-col 
        items-center justify-center gap-5 p-6 rounded-2xl border border-gray-700"
      >
        <h1 className="text-white text-2xl md:text-[30px] font-semibold text-center">
          SignIn to <span className="text-blue-500">Virtual Assistant</span>
        </h1>
        
        <div className="w-full space-y-4">
          <input
            onChange={(e) => setemail(e.target.value)}
            value={email}
            required
            type="email"
            placeholder="Enter your Email"
            className="w-full h-14 outline-none border-2 border-white 
            bg-transparent text-white placeholder-gray-300 px-5 
            rounded-full text-base md:text-[18px] focus:border-blue-500 transition-colors"
          />
          
          <div className="relative">
            <input
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              required
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-14 outline-none border-2 border-white 
              bg-transparent text-white placeholder-gray-300 px-5 pr-12
              rounded-full text-base md:text-[18px] focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 
              text-white cursor-pointer hover:text-blue-300 transition-colors"
            >
              {showPassword ? (
                <IoEyeOff className="w-6 h-6" />
              ) : (
                <IoEye className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {err && <p className="text-red-400 text-sm md:text-[17px] text-center w-full">*{err}</p>}
        
        <button
          disabled={loading}
          className="w-full max-w-[200px] h-14 mt-4 text-white 
          font-semibold bg-blue-600 rounded-full text-base md:text-[19px] 
          hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed 
          transition-colors"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p className="text-white text-base md:text-[18px] text-center">
          Want to create a new account?{" "}
          <span 
            className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
            onClick={() => Navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;