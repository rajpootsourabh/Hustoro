import React, { useState, useRef, useEffect } from "react";
import { Hand, ChevronDown, ArrowLeft } from "lucide-react";
import { useRoleEnabled } from '../../../hooks/useRoleEnabled'; // Import the hook

export default function DisqualifyDropdown({ onSelectReason, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [customReasonError, setCustomReasonError] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  const buttonClasses = "w-10 h-9 flex items-center justify-center hover:bg-red-200 transition-colors disabled:hover:bg-red-100";
  const isEnabled = useRoleEnabled(5) && !disabled; // Use hook and fallback

  const reasons = [
    "Lack of experience",
    "Failed assessment",
    "Unresponsive",
    "Not a cultural fit",
    "Other",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setShowCustomInput(false);
        setCustomReason("");
        setCustomReasonError(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = showCustomInput ? 160 : 200;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    }
  }, [isOpen, showCustomInput]);

  const handleReasonClick = (reason) => {
    if (!isEnabled) return;
    if (reason === "Other") {
      setShowCustomInput(true);
    } else {
      onSelectReason(reason);
      setIsOpen(false);
    }
  };

  const handleCustomSubmit = () => {
    if (!isEnabled) return;
    if (customReason.trim() === "") {
      setCustomReasonError(true);
    } else {
      setCustomReasonError(false);
      onSelectReason(customReason.trim());
      setIsOpen(false);
      setCustomReason("");
      setShowCustomInput(false);
    }
  };

  const handleBack = () => {
    setShowCustomInput(false);
    setCustomReason("");
    setCustomReasonError(false);
  };

  const handleImmediateReject = () => {
    if (!isEnabled) return;
    onSelectReason(""); // No reason provided
    setIsOpen(false);
    setShowCustomInput(false);
    setCustomReason("");
    setCustomReasonError(false);
  };

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <div
        ref={buttonRef}
        className={`rounded-md flex items-center overflow-hidden bg-red-100 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <button
          onClick={handleImmediateReject}
          data-tooltip-id="tooltip"
          data-tooltip-content="Disqualify candidate immediately"
          disabled={!isEnabled}
          className={buttonClasses}
        >
          <Hand size={16} />
        </button>

        <button
          onClick={() => isEnabled && setIsOpen((prev) => !prev)}
          data-tooltip-id="tooltip"
          data-tooltip-content="Select disqualification reason"
          disabled={!isEnabled}
          className={buttonClasses}
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${!isEnabled ? "text-gray-400" : "text-gray-600"}`}
          />
        </button>

      </div>

      {isOpen && isEnabled && (
        <div
          className={`absolute z-50 w-64 bg-white py-2 border border-gray-200 rounded-xl shadow-lg animate-fade-in right-0 ${dropUp ? "bottom-full mb-2" : "top-full mt-2"
            }`}
        >
          {!showCustomInput ? (
            <div className="max-h-60 overflow-y-auto">
              {reasons.map((reason, index) => (
                <button
                  key={index}
                  onClick={() => handleReasonClick(reason)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition"
                >
                  {reason}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <button
                onClick={handleBack}
                className="flex items-center text-sm text-gray-600 hover:text-red-600 mb-4"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to reasons
              </button>
              <textarea
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setCustomReasonError(false);
                  }
                }}
                placeholder="Enter custom reason"
                className={`w-full h-[80px] border rounded-md px-2 py-2 text-sm resize-none focus:outline-none focus:ring-2 ${customReasonError
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 focus:ring-red-200"
                  }`}
              />
              <button
                onClick={handleCustomSubmit}
                className="mt-2 w-full bg-red-600 text-white text-sm rounded-md py-2 hover:bg-red-700 transition"
              >
                Submit Reason
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
