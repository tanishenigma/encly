import React from "react";

const Loading = () => {
  return (
    <div className="flex mt-50  justify-center items-center gap-x-10">
      <div className="circlePosition rounded-full z-50 bg-purple-400 w-20 h-20  overflow-y-hidden border-2 border-pink-100/40 overflow-x-hidden animate-ping transition-transform duration-500 ease-out pointer-events-none"></div>
      <div className="circlePosition rounded-full z-50 bg-purple-400 w-20 h-20 overflow-y-hidden border-2 border-pink-100/40  overflow-x-hidden animate-ping transition-transform duration-500 ease-out pointer-events-none"></div>
      <div className="circlePosition rounded-full z-50 bg-purple-400 w-20 h-20 overflow-y-hidden border-2 border-pink-100/40 overflow-x-hidden animate-ping transition-transform duration-500 ease-out pointer-events-none"></div>
    </div>
  );
};

export default Loading;
