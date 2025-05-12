import React, { useState, useEffect, useRef } from "react";
import { Search, MoreVertical, Mail, Phone, ChevronDown } from "lucide-react";
import Loader from "../../Components/Loader";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { GoPerson } from "react-icons/go";

export default function Employee() {
    const [isFocused, setIsFocused] = useState(false);
    const [activeTab, setActiveTab] = useState("People Directory");
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState(null); // Track which dropdown is open
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get("http://127.0.0.1:8000/api/v.1/employee/all", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
        })
            .then((res) => {
                setEmployees(res.data.data);
                console.log(res.data.data)
            })
            .catch((err) => {
                console.error("Error fetching employee data:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            const isInsideDropdown = event.target.closest(".dropdown-menu");
            if (!isInsideDropdown) {
                setOpenDropdownId(null); // Close only if clicked outside all dropdowns
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    const tabs = ["People Directory", "ORG Chart", "Onboarding", "Performance"];

    const filteredEmployees = employees.filter((emp) => {
        const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    const handleDropdownSelect = (option) => {
        setOpenDropdownId(null); // Close dropdown when an option is selected
        if (option === "Add manually") {
            navigate("/dashboard/employee/new");
        } else if (option === "Import from CSV") {
            navigate("/employee/import");
        }
    };

    const handleMoreVerticalClick = (employee) => {
        setOpenDropdownId(prevId => prevId === employee.id ? null : employee.id); // Toggle dropdown
    };

    if (loading) return <Loader message="Fetching employee data..." />;

    return (
        <div className="min-h-screen flex flex-col bg-[#fef2f2]">
            <div className="w-full max-w-6xl mx-auto py-8 px-4 flex-grow flex flex-col space-y-8">
                {/* Main Card */}
                <div className="bg-white rounded-xl shadow p-6 space-y-6">
                    {/* Tabs */}
                    <div className="overflow-x-auto">
                        <div className="flex space-x-3 sm:space-x-6 md:space-x-10 lg:space-x-14 border-b border-gray-300 pb-2 mb-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-sm pb-2 transition-colors whitespace-nowrap ${activeTab === tab
                                        ? "text-teal-700 font-semibold"
                                        : "text-black hover:text-teal-600"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Top Bar */}
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <h2 className="text-xl font-semibold">People Directory</h2>

                        {/* Dropdown Button */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() =>
                                    setOpenDropdownId((prevId) => (prevId === null ? "add" : null))
                                }
                                className="text-sm px-6 py-[8px] border-[1.5px] border-teal-700 text-teal-700 rounded-full font-semibold hover:bg-teal-50 flex items-center gap-2"
                            >
                                Add Employee
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {openDropdownId === "add" && (
                                <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                                    <button
                                        onClick={() => handleDropdownSelect("Add manually")}
                                        className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm rounded-t-lg"
                                    >
                                        Add manually
                                    </button>
                                    <button
                                        onClick={() => handleDropdownSelect("Import from CSV")}
                                        className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm rounded-b-lg"
                                    >
                                        Import from CSV
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full max-w-lg">
                        <div className="flex items-center border-[1.5px] border-gray-400 rounded-xl overflow-hidden focus-within:border-black transition">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="flex-grow bg-transparent px-4 py-[10px] text-gray-800 focus:outline-none"
                                placeholder="Search Employee"
                            />
                            <div className="px-4 py-2">
                                <Search className="w-5 h-5 text-black" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employee List */}
                {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                        <div
                            key={employee.id}
                            className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-sm"
                        >
                            {/* Left: Image + Name */}
                            <div className="flex items-center space-x-4 w-full md:flex-[2] min-w-0">
                                {employee.profile_image ? (
                                    <img
                                        src={employee.profile_image}
                                        alt={employee.preferred_name || `${employee.first_name} ${employee.last_name}`}
                                        className="w-14 h-14 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-200">
                                        <GoPerson className="text-gray-400 w-9 h-9" />
                                    </div>
                                )}
                                <div>
                                    <div className="font-semibold text-sm">
                                        {employee.first_name && employee.last_name && `${employee.first_name} ${employee.last_name}`}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {employee.job_detail?.job_title || "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Middle: Contact Info */}
                            <div className="text-gray-500 space-y-1 text-left w-full md:flex-[2] min-w-0">
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-xs break-all">{employee.work_email || "N/A"}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-xs">{employee.phone || "N/A"}</span>
                                </div>
                            </div>

                            {/* Right: Reporting Line */}
                            <div className="text-xs text-gray-500 whitespace-nowrap w-full md:flex-[1] min-w-0">
                                Report to {employee.job_detail?.manager || "N/A"}
                            </div>

                            {/* Menu */}
                            <div className="relative self-end md:self-auto">
                                <MoreVertical
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => handleMoreVerticalClick(employee)}
                                />
                                {openDropdownId === employee.id && (
                                    <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                                        <button className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm rounded-b-lg">
                                            Publish Profile
                                        </button>
                                        <button
                                            onClick={() => navigate(`/dashboard/employee/${employee.id}/edit`, { state: { employee } })}
                                            className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm rounded-t-lg"
                                        >
                                            Edit Profile
                                        </button>
                                        <button className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm rounded-b-lg">
                                            View Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    ))
                ) : (
                    <div className="flex justify-center items-center h-64 text-gray-500 text-lg font-medium">
                        No employee data available.
                    </div>
                )}
            </div>
        </div>
    );

}

