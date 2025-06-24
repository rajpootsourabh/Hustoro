import React from "react";
import { Mail, Phone, MoreVertical } from "lucide-react";
import { GoPerson } from "react-icons/go";

export default function EmployeeCard({
    employee,
    isLoading = false,
    openDropdownId,
    handleMoreVerticalClick,
    handleAssignJobClick,
    navigate
}) {
    const handleCardClick = () => {
        navigate(`/dashboard/employee/${employee.id}/view`);
    };

    return (
        <div
            key={employee?.id}
            onClick={handleCardClick}
            className="bg-white rounded-xl border border-gray-200 p-4 md:px-4 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-sm cursor-pointer animate-fade-in"
        >
            {/* Left: Image + Name */}
            <div className="flex items-center space-x-4 w-full md:flex-[2] min-w-0">
                {isLoading ? (
                    <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                ) : employee?.profile_image ? (
                    <img
                        src={employee.profile_image}
                        alt={employee.preferred_name || `${employee.first_name} ${employee.last_name}`}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200">
                        <GoPerson className="text-gray-400 w-9 h-9" />
                    </div>
                )}

                <div className="space-y-1 min-w-0">
                    {isLoading ? (
                        <>
                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="w-24 h-3 bg-gray-100 rounded animate-pulse" />
                        </>
                    ) : (
                        <>
                            <div className="font-semibold text-sm truncate">
                                {employee?.first_name && employee?.last_name && `${employee.first_name} ${employee.last_name}`}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                                {employee?.job_detail?.job_title || "N/A"}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Middle: Contact Info */}
            <div className="text-gray-500 space-y-2 text-left w-full md:flex-[2] min-w-0">
                {isLoading ? (
                    <>
                        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                    </>
                ) : (
                    <>
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span className="text-xs break-all">{employee?.work_email || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span className="text-xs">{employee?.phone || "N/A"}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Right: Reporting Line */}
            <div className="text-xs text-gray-500 whitespace-nowrap w-full md:flex-[1] min-w-0">
                {isLoading ? (
                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                ) : (
                    <>Report to {employee?.job_detail?.manager || "N/A"}</>
                )}
            </div>

            {/* Menu */}
            {!isLoading && (
                <div
                    className="relative self-end md:self-auto z-20"
                    onClick={(e) => e.stopPropagation()} // Prevent card click
                >
                    <MoreVertical
                        className="text-gray-500 cursor-pointer"
                        onClick={() => handleMoreVerticalClick(employee)}
                    />
                    {openDropdownId === employee?.id && (
                        <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-30">
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm rounded-t-lg"
                                onClick={() =>
                                    navigate(`/dashboard/employee/${employee.id}/edit`, { state: { employee } })
                                }
                            >
                                Edit Profile
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm"
                                onClick={() =>
                                    navigate(`/dashboard/employee/${employee.id}/view`, { state: { employee } })
                                }
                            >
                                View Profile
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm rounded-b-lg"
                                onClick={() => handleAssignJobClick(employee)}
                            >
                                Assign Candidate
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
