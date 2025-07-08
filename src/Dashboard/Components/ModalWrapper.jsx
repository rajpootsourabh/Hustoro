// src/components/ModalWrapper.jsx
import React from "react";
import ReactDOM from "react-dom";

const ModalWrapper = ({ children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {children}
    </div>,
    document.body
  );
};
export default ModalWrapper;
