  import React, { useContext, useRef } from "react";
  import Card from "../components/Card";
  import image1 from "../assets/image1.png";
  import image2 from "../assets/image2.jpg";
  import image4 from "../assets/image4.png";
  import image5 from "../assets/image5.png";
  import image6 from "../assets/image6.jpeg";
  import image7 from "../assets/image7.jpeg";
  import { RiImageAddLine } from "react-icons/ri";
  import { UserDataContext } from "../Context/UserContext";
  import { useNavigate } from "react-router-dom";
  import { IoArrowBack } from "react-icons/io5";

  const Customize = () => {
    const {
      serverUrl,
      userData,
      setUserData,
      frontendImg,
      setfrontendImg,
      backendImg,
      setbackendImg,
      selectedImg,
      setselectedImg,
    } = useContext(UserDataContext);
    const inputImg = useRef();
    const navigate = useNavigate();

    const handleImg = (e) => {
      const file = e.target.files[0];
      setbackendImg(file);
      setfrontendImg(URL.createObjectURL(file));
    };

    return (
   <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-5 relative overflow-y-auto">
      {/* Back Arrow */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 w-[45px] h-[45px] flex justify-center items-center 
                       bg-black/50 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 z-50 hover:scale-110"
      >
        <IoArrowBack className="text-white text-[22px]" />
      </div>

      <h1 className="text-white text-[24px] sm:text-[32px] font-bold text-center mb-10 max-w-[90%]">
        Select your <span className="text-blue-400">Assistant Image</span>
      </h1>

      <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-4 px-2">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div
          onClick={() => {
            inputImg.current.click();
            setselectedImg("input");
          }}
          className={`w-[75px] h-[130px] sm:w-[120px] sm:h-[190px] lg:w-[150px] lg:h-[240px] bg-[#020220] border-2 border-blue-500/40 rounded-2xl overflow-hidden
            hover:shadow-2xl hover:shadow-blue-900/50 cursor-pointer hover:border-white transition-all duration-300 flex items-center justify-center ${
              selectedImg === "input"
                ? "border-4 border-white shadow-2xl shadow-blue-900"
                : ""
            }`}
        >
          {!frontendImg && (
            <RiImageAddLine className="text-white w-8 h-8 opacity-70" />
          )}
          {frontendImg && (
            <img src={frontendImg} className="w-full h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={inputImg}
          onChange={handleImg}
        />
      </div>

      {selectedImg && (
        <button
          onClick={() => navigate("/customize2")}
          className="min-w-[140px] h-[50px] mt-10 text-white 
            font-semibold bg-blue-700 rounded-full text-[17px] hover:bg-blue-600 transition-all duration-300 shadow-lg active:scale-95 px-6 py-2"
        >
          Next
        </button>
      )}
    </div>
    );
  };

  export default Customize;
