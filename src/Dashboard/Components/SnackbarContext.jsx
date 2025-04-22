import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

// Create a context
const SnackbarContext = createContext(null);

// Provider Component
export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success"); // success, error, warning, info

  // Function to show snackbar
  const showSnackbar = (msg, type = "success") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  // Function to close snackbar
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {/* Snackbar UI */}
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleClose} severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Custom hook to use the snackbar
export const useSnackbar = () => useContext(SnackbarContext);




