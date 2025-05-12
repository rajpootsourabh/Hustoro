import React, { useRef, useEffect, useState } from "react";

export default function Dropdown({
  label = "Dropdown",
  dropdownId = "default",
  openDropdownId,
  setOpenDropdownId,
  options = [],
  align = "right", // can be 'left' or 'right'
}) {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState("bottom");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }

    function adjustDropdownPosition() {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = options.length * 40 + 20; // approximate
        setPosition(spaceBelow < dropdownHeight ? "top" : "bottom");
      }
    }

    if (openDropdownId === dropdownId) {
      adjustDropdownPosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", adjustDropdownPosition, true);
    window.addEventListener("resize", adjustDropdownPosition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", adjustDropdownPosition, true);
      window.removeEventListener("resize", adjustDropdownPosition);
    };
  }, [dropdownId, openDropdownId, setOpenDropdownId, options.length]);

  const handleSelect = (action) => {
    setOpenDropdownId(null);
    if (typeof action === "function") action();
  };

  const dropdownPositionClasses = position === "top" ? "bottom-full mb-2" : "top-full mt-2";
  const dropdownAlignClass = align === "left" ? "left-0" : "right-0";

  return (
    <div className="relative" ref={dropdownRef}>
      {openDropdownId === dropdownId && (
        <div
          className={`dropdown-menu absolute ${dropdownPositionClasses} ${dropdownAlignClass} w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50`}
        >
          {options.map(({ label, action }, idx) => (
            <button
              key={label}
              onClick={() => handleSelect(action)}
              className={`w-full text-left px-4 py-2 hover:bg-teal-50 text-sm ${idx === 0 ? "rounded-t-lg" : idx === options.length - 1 ? "rounded-b-lg" : ""
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
