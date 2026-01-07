import React, { createContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import geminiResponse from "../../../backend/gemini";

// eslint-disable-next-line react-refresh/only-export-components
export const UserDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";

  const [userData, setUserData] = useState(null);
  const [frontendImg, setfrontendImg] = useState(null);
  const [backendImg, setbackendImg] = useState(null);
  const [selectedImg, setselectedImg] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log(error);
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
    getGeminiResponse
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
