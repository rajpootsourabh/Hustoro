import { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import {
    BiChevronDown,
    BiChevronUp,
    BiArrowBack,
    BiChevronRight,
    BiX,
} from "react-icons/bi";

export default function MultiLevelSelect({
    label,
    optionsList = {},
    placeholder = "",
    showSearch = false,
    required = false,
    error,
    value,
    onChange,
}) {
    const [query, setQuery] = useState("");
    const [selectedValue, setSelectedValue] = useState(value ||"");
    const [expandedGroup, setExpandedGroup] = useState(null);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [open, setOpen] = useState(false);

    const containerRef = useRef(null);
    const allGroups = Object.keys(optionsList);

    useEffect(() => {
        if (value !== undefined) {
          setSelectedValue(value);
        }
      }, [value]);
      

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setExpandedGroup(null);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (value) => {
        setQuery(value);
        const lowerQuery = value.toLowerCase();

        if (!value) {
            setFilteredOptions(allGroups.map((g) => ({ label: g, type: "group" })));
            return;
        }

        const filtered = [];

        for (const group of allGroups) {
            if (group.toLowerCase().includes(lowerQuery)) {
                filtered.push({ label: group, type: "group" });
            }
            for (const item of optionsList[group]) {
                if (item.toLowerCase().includes(lowerQuery)) {
                    filtered.push({ label: item, type: "item", parent: group });
                }
            }
        }

        setExpandedGroup(null);
        setFilteredOptions(filtered);
    };

    const handleGroupClick = (group) => {
        setExpandedGroup(group);
        setFilteredOptions(
            optionsList[group].map((item) => ({
                label: item,
                type: "item",
                parent: group,
            }))
        );
    };

    const handleBack = () => {
        setExpandedGroup(null);
        setFilteredOptions(allGroups.map((g) => ({ label: g, type: "group" })));
    };

    const handleSelect = (item) => {
        setSelectedValue(item.label);
        if (onChange) onChange(item.label);
        setQuery("");
        setExpandedGroup(null);
        setOpen(false);
    };


    useEffect(() => {
        if (open && !query && !expandedGroup) {
            setFilteredOptions(allGroups.map((group) => ({ label: group, type: "group" })));
        }
    }, [open]);

    return (
        <div className="relative w-full" ref={containerRef}>
            {label && (
                <label className="text-[14px] text-black mb-1 block">
                    {required && <span className="text-red-500 mr-1">*</span>}
                    {label}
                </label>
            )}
    
            <div
                onClick={() => setOpen(!open)}
                className={`border rounded-md px-3 h-10 flex justify-between items-center cursor-pointer text-sm ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
            >
                <span className={`text-sm ${selectedValue ? "" : "text-gray-400"}`}>
                    {selectedValue || placeholder}
                </span>
                {selectedValue ? (
                    <FiX
                        className="w-4 h-4 text-gray-500 hover:text-gray-600 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedValue("");
                        }}
                    />
                ) : (
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
    
            {/* Add this block just below the main select box */}
            {error && typeof error === "string" && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
    
            {open && (
                <div className="absolute w-full z-10 mt-1 border rounded-md shadow bg-white max-h-64 overflow-auto">
                    {showSearch && (
                        <div className="sticky top-0 bg-white px-2 py-4">
                            <div className="flex items-center gap-2 border px-2 py-[6px] rounded-md">
                                <FiSearch className="text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full text-sm outline-none py-1"
                                />
                            </div>
                        </div>
                    )}
    
                    {expandedGroup && (
                        <li
                            onClick={handleBack}
                            className="flex items-center px-4 mb-4 cursor-pointer text-sm"
                        >
                            <BiArrowBack className="mr-2 text-gray-500 text-xl" />
                            <span className="text-sm text-gray-800">{expandedGroup}</span>
                        </li>
                    )}
    
                    <ul className="text-sm">
                        {(filteredOptions.length > 0
                            ? filteredOptions
                            : [{ label: "No results found", type: "info" }]
                        ).map((item, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    if (item.type === "group") handleGroupClick(item.label);
                                    else if (item.type === "item") handleSelect(item);
                                }}
                                className={`px-4 py-[6px] hover:bg-yellow-100 cursor-pointer ${
                                    item.type === "info" && "text-gray-400 cursor-default"
                                }`}
                            >
                                {item.type === "group" ? (
                                    <div className="flex items-center justify-between w-full group">
                                        <span className="text-sm">{item.label}</span>
                                        <div className="p-[4px] rounded-md transition-colors duration-200 group-hover:bg-yellow-300">
                                            <BiChevronRight className="text-xl text-gray-700" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-sm">{item.label}</span>
                                        <div className="w-[24px] h-[24px]"></div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
    
}
