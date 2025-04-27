import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi"; 

export default function CustomSelect({ label, optionsList = [], placeholder = "", showSearch = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredCountries = optionsList.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown if clicked outside of the component
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

    // Listen for click events on the document
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Label with consistent text size */}
      <label className="block text-sm mb-1">
        {label}
      </label>

      {/* Dropdown Button */}
      <div
        onClick={() => setOpen(!open)}
        ref={inputRef}
        className="border rounded-md px-3 h-10 flex justify-between items-center cursor-pointer text-sm bg-white w-full"
      >
        <span className={`text-sm ${selectedCountry ? "" : "text-gray-400"} w-full`}>
          {selectedCountry || placeholder}
        </span>
        <svg
          className={`w-4 h-4 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
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
      </div>

      {/* Dropdown list */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute mt-1 w-full border rounded-md bg-white shadow-md z-10 max-h-60 overflow-y-auto"
        >
          {/* Conditionally render search bar based on showSearch prop */}
          {showSearch && (
            <div className="sticky top-0 bg-white p-3">
              <div className="flex items-center gap-2 px-2 py-[2px] rounded-md border">
                <FiSearch className="text-gray-400 w-5 h-5" />
                {/* Search Input with placeholder */}
                <input
                  type="text"
                  className="outline-none text-sm w-full py-2" // Adjusted to match other inputs
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* List of optionsList */}
          <ul className="p-3">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => (
                <li
                  key={index}
                  className={`text-sm px-4 py-2 hover:bg-yellow-50 cursor-pointer ${
                    country === selectedCountry ? "bg-yellow-100" : ""
                  }`}
                  onClick={() => {
                    setSelectedCountry(country);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {country}
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
