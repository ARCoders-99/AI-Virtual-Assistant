import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/Customize";
import { useContext } from "react";
import UserContext, { UserDataContext } from "./Context/UserContext";
import Customize2 from "./pages/Customize2";
import Home from "./pages/Home";
const App = () => {
  const { userData, setUserData } = useContext(UserDataContext);
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            userData?.assistantImage && userData?.assistantName ? (
              <Home />
            ) : (
              <Navigate to="/customize" />
            )
          }
        />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/" />}
        />
        <Route
          path="/customize"
          element={userData ? <Customize /> : <Navigate to="/signup" />}
        />
        <Route
          path="/customize2"
          element={userData ? <Customize2 /> : <Navigate to="/signup" />}
        />
      </Routes>
    </div>
  );
};

export default App;
