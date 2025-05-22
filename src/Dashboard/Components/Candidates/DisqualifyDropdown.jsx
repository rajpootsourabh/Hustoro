import React, { useState, useRef, useEffect } from "react";
import { Hand, ChevronDown } from "lucide-react";

export default function DisqualifyDropdown({ onSelectReason }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  const reasons = [
    "Lack of experience",
    "Failed assessment",
    "Unresponsive",
    "Not a cultural fit",
    "Other",
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Position dropdown smartly: drop up if not enough space below
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = reasons.length * 40; // 40px per item approx.
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        data-tooltip-id="tooltip"
        data-tooltip-content="Disqualify candidate"
        className="px-2 py-[10px] rounded-md bg-red-100 text-red-600 flex items-center space-x-2"
      >
        <Hand size={16} />
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-56 bg-white border border-gray-200 rounded-xl shadow-lg animate-fade-in right-0 ${
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {reasons.map((reason, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectReason(reason);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition"
            >
              {reason}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
