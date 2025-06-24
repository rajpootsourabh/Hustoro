import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "../../Components/SnackbarContext";
import EmployeeCard from "../../Components/Employee/EmployeeCard";
import AssignCandidatePopup from "../../Components/Employee/AssignCandidatePopup";

export default function Employee() {
    const [isFocused, setIsFocused] = useState(false);
    const [activeTab, setActiveTab] = useState("People Directory");
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [showAssignPopup, setShowAssignPopup] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const { showSnackbar } = useSnackbar();

    //Find out permanent solution 
    const [role, setRole] = useState(null);

    // Read role from localStorage once after mount
    useEffect(() => {
        const userString = localStorage.getItem("user");
        console.log("Loaded userString:", userString);

        if (userString) {
            const user = JSON.parse(userString);
            console.log("Parsed user:", user);
            console.log("User role:", user.role);
            setRole(Number(user.role));

            // If role is 5, close dropdown:
            if (Number(user.role) === 5) {
                setOpenDropdownId(null);
            }
        }
    }, []);


    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/employee/all`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
        })
            .then((res) => {
                setEmployees(res.data.data);
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
                setOpenDropdownId(null);
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

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDropdownSelect = (option) => {
        setOpenDropdownId(null);
        if (option === "Add manually") {
            navigate("/dashboard/employee/new");
        } else if (option === "Import from CSV") {
            navigate("/employee/import");
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    const handleAssignJobClick = (employee) => {
        setSelectedEmployee(employee);
        setShowAssignPopup(true);
    };

    const handleCandidateAssignment = async (candidateId) => {
        console.log("Assigning", candidateId, "to employee", selectedEmployee.id);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/candidate/${candidateId}/assignments`,
                {
                    employee_id: selectedEmployee.id,
                    notes: "Initial assignment"
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            showSnackbar(response.data.message || "Assignment successful", "success");
            console.log("Assignment successful:", response.data);
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || "Assignment failed";
            showSnackbar(`Assignment failed: ${message}`, "error");
            console.error("Assignment failed:", message);
        } finally {
            setShowAssignPopup(false);
        }
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

                            {role !== 5 && openDropdownId === "add" && (
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
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
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

                {/* Per Page Selector */}
                <div className="flex justify-end">
                    <div className="flex items-center gap-4">
                        <label className="text-sm text-gray-700">Per page:</label>
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                            {[6, 12, 24].map(size => (
                                <option className="text-sm" key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Employee List */}
                {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee) => (
                        <EmployeeCard
                            key={employee.id}
                            employee={employee}
                            openDropdownId={openDropdownId}
                            handleMoreVerticalClick={() =>
                                setOpenDropdownId(prev => prev === employee.id ? null : employee.id)
                            }
                            handleAssignJobClick={handleAssignJobClick}
                            navigate={navigate}
                        />
                    ))
                ) : (
                    <div className="flex justify-center items-center h-64 text-gray-500 text-lg font-medium">
                        No employee data available.
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 text-sm border rounded ${currentPage === index + 1
                                    ? "bg-teal-600 text-white"
                                    : "hover:bg-teal-50"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            {showAssignPopup && selectedEmployee && (
                <AssignCandidatePopup
                    onClose={() => setShowAssignPopup(false)}
                    onAssign={handleCandidateAssignment}
                />
            )}
        </div>
    );
}
