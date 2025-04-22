import React, { useEffect } from "react";
import spinner from "../../assets/white-spinner.svg";

const Loader = ({message=""}) => {
  // You can customize this message
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when loader is removed
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      style={{
        zIndex: 1300,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        pointerEvents: "auto", // Ensure loader itself is interactive if needed
      }}
      className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center"
    >
      <img src={spinner} className="w-28 h-28" alt="Loading..." />
      <p className="text-lg text-white">{message}</p>
    </div>
  );
};

export default Loader;

