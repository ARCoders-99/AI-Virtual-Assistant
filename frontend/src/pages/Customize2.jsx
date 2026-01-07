import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../Context/UserContext";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5"; // React Icon

const Customize2 = () => {
  const { userData, backendImg, selectedImg, serverUrl, setUserData } =
    useContext(UserDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImg) {
        formData.append("assistantImage", backendImg);
      } else {
        formData.append("imageUrl", selectedImg);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        {
          withCredentials: true,
        }
      );
      setloading(false);

      console.log(result);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setloading(false);

      console.log(error);
    }
  };

  return (
   <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-5 relative overflow-hidden">
      {/* Back Arrow */}
      <div
        onClick={() => navigate("/customize")}
        className="absolute top-5 left-5 w-[45px] h-[45px] flex justify-center items-center 
                       bg-black/50 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 z-50 hover:scale-110"
      >
        <IoArrowBack className="text-white text-[22px]" />
      </div>

      <h1 className="text-white text-[24px] sm:text-[32px] font-bold text-center mb-10 max-w-[90%]">
        Select your <span className="text-blue-400">Assistant Name</span>
      </h1>

      <div className="w-full max-w-[500px] flex flex-col items-center gap-6">
        <input
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
          required
          type="text"
          placeholder="e.g. Robo"
          className="w-full h-[55px] outline-none border-2 border-white/30 
            bg-white/5 text-white placeholder-gray-400 px-6 py-2 
            rounded-full text-[17px] focus:border-blue-500 transition-all duration-300 backdrop-blur-sm shadow-inner"
        />

        {assistantName && (
          <button
            onClick={handleUpdateAssistant}
            disabled={loading}
            className={`min-w-[140px] h-[50px] text-white font-semibold 
              bg-blue-700 rounded-full text-[17px] hover:bg-blue-600 transition-all duration-300 shadow-lg active:scale-95 px-6 py-2
              ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {!loading ? "Create" : "Connecting..."}
          </button>
        )}
      </div>
    </div>
  );
};

export default Customize2;
