import React, { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";

function Home() {
  const navigate = useNavigate();
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const [lastHeard, setLastHeard] = useState("");
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const synth = window.speechSynthesis;
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(UserDataContext);
  const userDataRef = useRef(userData);

  // Keep userDataRef updated
  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const startRecognition = () => {
    if (isRecognizingRef.current || !recognitionRef.current) return;

    try {
      recognitionRef.current.start();
      isRecognizingRef.current = true;
      setStatus("Listening...");
      console.log("Recognition started");
    } catch (error) {
      console.error("Start recognition error:", error);
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current && isRecognizingRef.current) {
      try {
        recognitionRef.current.stop();
        isRecognizingRef.current = false;
      } catch (error) {
        // Silent error handling
      }
    }
  };

  const safeRestartRecognition = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }

    restartTimeoutRef.current = setTimeout(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        startRecognition();
      }
    }, 1000);
  };

  const speak = (text) => {
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();

    // Voice selection logic
    let selectedVoice =
      voices.find((v) => v.lang === "ur-PK") ||
      voices.find((v) => v.lang === "hi-IN") ||
      voices.find((v) => v.lang === "en-IN");

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    isSpeakingRef.current = true;
    stopRecognition();

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setStatus("Listening...");
      setTimeout(() => {
        safeRestartRecognition();
      }, 1000);
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      setTimeout(() => {
        safeRestartRecognition();
      }, 1000);
    };

    synth.speak(utterance);
  };

  const handleCommand = async (data) => {
    const { type, userInput, response } = data;

    speak(response);

    setAiText(response);
    setStatus("Speaking...");

    // Handle command actions
    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      setTimeout(() => {
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
      }, 500);
    } else if (type === "calculator-open") {
      setTimeout(() => {
        window.open("https://www.google.com/search?q=calculator", "_blank");
      }, 500);
    } else if (type === "instagram-open") {
      setTimeout(() => {
        window.open("https://www.instagram.com/", "_blank");
      }, 500);
    } else if (type === "facebook-open") {
      setTimeout(() => {
        window.open("https://www.facebook.com/", "_blank");
      }, 500);
    } else if (type === "weather-show") {
      setTimeout(() => {
        window.open("https://www.google.com/search?q=weather", "_blank");
      }, 500);
    } else if (type === "youtube-open") {
      setTimeout(() => {
        window.open("https://www.youtube.com/", "_blank");
      }, 500);
    } else if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      setTimeout(() => {
        window.open(
          `https://www.youtube.com/results?search_query=${query}`,
          "_blank"
        );
      }, 500);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setStatus("Listening...");
      console.log("Microphone is ON");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      if (!isSpeakingRef.current) {
        setStatus("Waiting...");
        safeRestartRecognition();
      }
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      console.error("Recognition error:", event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setStatus("Error: Permission Denied");
        return;
      }

      setStatus(`Error: ${event.error}`);

      if (
        !isSpeakingRef.current &&
        event.error !== "aborted" &&
        event.error !== "no-speech"
      ) {
        safeRestartRecognition();
      }
    };

    recognition.onresult = async (e) => {
      let currentTranscript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        currentTranscript += e.results[i][0].transcript;
      }
      
      const transcript = currentTranscript.trim();
      console.log("Heard:", transcript);
      setLastHeard(transcript);

      const currentName = userDataRef.current?.assistantName;
      if (
        currentName &&
        transcript.toLowerCase().includes(currentName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        setLastHeard(""); // Clear debug info on successful match
        stopRecognition();
        setStatus("Processing...");

        try {
          const data = await getGeminiResponse(transcript);
          await handleCommand(data);
          setUserText("");
        } catch (error) {
          console.error("Gemini error:", error);
          setStatus("Error: Connection Failed");
          safeRestartRecognition();
        }
      }
    };

    // Initial start with delay
    setTimeout(() => {
      startRecognition();
    }, 2000);

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      stopRecognition();
      if (synth.speaking) {
        synth.cancel();
      }
      recognitionRef.current = null;
    };
  }, [userData?.assistantName]);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col items-center relative overflow-hidden">
      {/* Mobile Hamburger */}
      <HiOutlineMenu
        onClick={toggleMenu}
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[50px] h-[25px] cursor-pointer transition-transform duration-300 hover:scale-110 z-40"
      />

      {/* DESKTOP BUTTONS */}
      <button
        onClick={toggleHistory}
        className="hidden lg:block min-w-[140px] h-[45px] text-white cursor-pointer font-semibold bg-blue-700 rounded-full text-[17px] hover:bg-blue-600 absolute top-[20px] left-[20px] transition-all duration-300 z-30 px-4 py-2"
      >
        History
      </button>

      <button
        onClick={handleLogOut}
        className="hidden lg:block min-w-[140px] h-[45px] text-white cursor-pointer font-semibold bg-blue-700 rounded-full text-[17px] hover:bg-blue-600 absolute top-[20px] right-[20px] transition-all duration-300 z-30 px-4 py-2"
      >
        LogOut
      </button>

      <button
        onClick={() => navigate("/customize")}
        className="hidden lg:flex items-center justify-center min-w-[170px] h-[45px] text-white font-semibold text-[17px] bg-blue-700 hover:bg-blue-600 rounded-full absolute top-[80px] right-[20px] transition-all duration-300 z-30 px-4 py-2 shadow-md active:scale-95"
      >
        Customize Assistant
      </button>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-0 left-0 w-full h-full bg-[#000000cc] backdrop-blur-lg p-5 flex flex-col items-start gap-5 z-50 overflow-y-auto">
          <RxCross1
            onClick={toggleMenu}
            className="text-white absolute top-5 right-5 w-10 h-10 cursor-pointer p-2 rounded-full bg-black/50 hover:bg-red-600 shadow-lg transition-all duration-300"
          />

          <button
            onClick={handleLogOut}
            className="w-full max-w-[250px] min-h-[55px] text-white cursor-pointer font-semibold bg-blue-700 rounded-full text-[19px] hover:bg-blue-600 transition-all duration-300 mt-16 px-6 py-3"
          >
            LogOut
          </button>

          <button
            onClick={() => {
              navigate("/customize");
              setIsMenuOpen(false);
            }}
            className="w-full max-w-[250px] min-h-[55px] flex items-center justify-center text-white font-semibold text-[19px] bg-blue-700 hover:bg-blue-600 rounded-full transition-all duration-300 px-6 py-3"
          >
            Customize Assistant
          </button>

          <div className="w-full h-[2px] bg-gray-500 mt-4"></div>

          <h2 className="text-white text-[22px] font-bold mt-4">History</h2>

          <div className="w-full max-h-[350px] overflow-y-auto flex flex-col gap-3 pr-2">
            {userData?.history?.length > 0 ? (
              userData.history.map((his, index) => (
                <div
                  key={index}
                  className="text-gray-200 font-medium text-[16px] px-4 py-3 rounded-xl bg-gray-800/50 break-words hover:bg-gray-700/60 transition-colors duration-200 border border-gray-600/30"
                >
                  {his}
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-[16px] px-4 py-3 text-center">
                No history available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* DESKTOP HISTORY SIDEBAR */}
      {isHistoryOpen && (
        <div className="hidden lg:block absolute top-0 left-0 w-80 h-full bg-[#000000cc] backdrop-blur-lg p-6 flex flex-col gap-6 z-40 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-[24px] font-bold">History</h2>
            <RxCross1
              onClick={toggleHistory}
              className="text-white w-8 h-8 cursor-pointer p-1 rounded-full bg-black/50 hover:bg-red-600 shadow-lg transition-all duration-300"
            />
          </div>

          <div className="w-full h-[2px] bg-gray-500"></div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 mt-5">
            {userData?.history?.length > 0 ? (
              userData.history.map((his, index) => (
                <div
                  key={index}
                  className="text-gray-200 font-medium text-[16px] px-4 py-3 rounded-xl bg-gray-800/50 break-words hover:bg-gray-700/60 transition-colors duration-200 border border-gray-600/30"
                >
                  {his}
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-[16px] px-4 py-3 text-center">
                No history available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN ASSISTANT CENTERED */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 z-20 w-full max-w-4xl mx-auto px-4 py-4 overflow-hidden">
        {/* Assistant Image */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-[180px] h-[250px] sm:w-[220px] sm:h-[300px] md:w-[260px] md:h-[350px] lg:w-[280px] lg:h-[380px] overflow-hidden rounded-3xl shadow-2xl shadow-blue-900/50 border-4 border-blue-500/30">
            <img
              src={userData?.assistantImage}
              alt="Assistant"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-white text-[18px] sm:text-[22px] font-bold bg-black/40 px-6 py-2 rounded-full border border-white/20 backdrop-blur-sm text-center">
            {userData?.assistantName}
          </h1>
          
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-blue-900/40 border border-blue-500/30">
            <div className={`w-2 h-2 rounded-full ${status.includes("Error") ? "bg-red-500" : status === "Listening..." ? "bg-green-500" : "bg-yellow-500"} animate-pulse`}></div>
            <span className="text-blue-200 text-xs font-medium uppercase tracking-wider">{status}</span>
          </div>
        </div>

        {/* AI / USER Response Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center">
            {!aiText ? (
              <img src={userImg} className="w-[100px] sm:w-[120px]" />
            ) : (
              <img src={aiImg} className="w-[100px] sm:w-[120px]" />
            )}
          </div>

          <div className="min-h-[50px] max-w-[95%] sm:max-w-[80%] flex flex-col items-center justify-center gap-2">
            <h1 className="text-white font-semibold text-[14px] sm:text-[16px] text-center px-5 py-3 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm leading-tight break-words">
              {userText || aiText || "Say your assistant's name to start..."}
            </h1>
            {lastHeard && !userText && !aiText && (
              <p className="text-gray-400 text-[12px] italic animate-pulse">
                Heard: "{lastHeard}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
