import React, { createContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const UserDataContext = createContext();

function UserContext({ children }) {
  // ✅ Use environment variable for backend URL
  // Default to localhost for development
  const serverUrl ="https://ai-virtual-assistant-9wbw.onrender.com";


  const [userData, setUserData] = useState(null);
  const [frontendImg, setfrontendImg] = useState(null);
  const [backendImg, setbackendImg] = useState(null);
  const [selectedImg, setselectedImg] = useState(null);

  // Fetch current logged-in user
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("Current user:", result.data);
    } catch (error) {
      console.log("Error fetching current user:", error);
    }
  };

  // Call backend endpoint instead of importing gemini
  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data; // Backend returns gemini response
    } catch (error) {
      console.log("Error fetching Gemini response:", error);
      throw error;
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImg,
    setfrontendImg,
    backendImg,
    setbackendImg,
    selectedImg,
    setselectedImg,
    getGeminiResponse,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
