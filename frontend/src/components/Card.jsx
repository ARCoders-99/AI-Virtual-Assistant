import React, { useContext } from "react";
import { UserDataContext } from "../Context/UserContext";

const Card = ({ image }) => {
  const {
    selectedImg,
    setselectedImg,
    setfrontendImg,
    setbackendImg,
  } = useContext(UserDataContext);

  return (
    <div
      onClick={() => {
        setselectedImg(image);
        setbackendImg(null);
        setfrontendImg(null);
      }}
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden
        hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white
        ${selectedImg === image ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
    >
      <img src={image || ""} className="h-full w-full object-cover" />
    </div>
  );
};

export default Card;
