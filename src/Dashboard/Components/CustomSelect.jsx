import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function CustomSelect({
  label,
  optionsList = [],
  placeholder = "",
  showSearch = false,
  required = false,
  error,
  value,
  onChange = () => {},
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(value || "");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredOptions = optionsList.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedValue("");
    setSearchTerm("");
  };

  const handleSelect = (option) => {
    setSelectedValue(option);
    setOpen(false);
    setSearchTerm("");
    onChange(option);
  };

  const borderStyle = `border ${error ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="relative w-full">
      <label className="block text-sm mb-1">
        {required && <span className="text-red-500 mr-1">*</span>}
        {label}
      </label>

      <div
        onClick={() => setOpen(!open)}
        ref={inputRef}
        className={`rounded-md px-3 h-10 flex justify-between items-center cursor-pointer text-sm bg-white w-full ${borderStyle}`}
      >
        <span
          className={`text-sm ${selectedValue ? "" : "text-gray-400"} w-full truncate`}
        >
          {selectedValue || placeholder}
        </span>

        <div className="flex items-center gap-1">
          {selectedValue && (
            <FiX
              className="w-4 h-4 text-gray-500 hover:text-grey-600 cursor-pointer"
              onClick={handleClear}
            />
          )}
          {!selectedValue && (
            <svg
              className={`w-4 h-4 transform transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>

      {error && typeof error === "string" && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {open && (
        <div
          ref={dropdownRef}
          className="absolute mt-1 w-full border rounded-md bg-white shadow-md z-10 max-h-60 overflow-y-auto"
        >
          {showSearch && (
            <div className="sticky top-0 bg-white p-3">
              <div className="flex items-center gap-2 px-2 py-[2px] rounded-md border">
                <FiSearch className="text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className="outline-none text-sm w-full py-2"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}

          <ul className="p-3">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className={`text-sm px-4 py-2 hover:bg-yellow-50 cursor-pointer ${
                    option === selectedValue ? "bg-yellow-100" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
