import React from "react";
import { User, CalendarDays, Briefcase, MapPin, GraduationCap, FileText, Search } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils"
import { useNavigate } from 'react-router-dom';


export default function FindCandidateCard({ candidate, job, application, isLoading = false }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 p-4 border rounded-xl mb-4 bg-white animate-fade-in">
            {/* Left: Image */}
            {isLoading ? (
                <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            ) : candidate?.profile_pic ? (
                <img
                    src={candidate.profile_pic}
                    alt={candidate.first_name}
                    className="w-16 h-16 rounded-full object-cover"
                />
            ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200">
                    <User className="text-gray-400 w-9 h-9" />
                </div>
            )}

            {/* Middle: Candidate Details */}
            <div className="flex-1 min-w-0 w-full sm:w-auto">
                {isLoading ? (
                    <>
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-3 animate-pulse" />
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-3 bg-gray-200 rounded w-full animate-pulse"
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h4 className="text-md font-semibold truncate">{candidate.designation}</h4>
                        <div className="grid grid-cols-2 gap-y-1 text-sm mt-1 min-w-0">
                            <p className="flex items-center gap-1 text-sm truncate">
                                <User className="w-4 h-4" /> {candidate.first_name} {candidate.last_name}
                            </p>
                            <p className="flex items-center gap-1 text-sm truncate">
                                <CalendarDays className="w-4 h-4" /> Applied: {formatDate(candidate.created_at)}
                            </p>
                            <p className="flex items-center gap-1 text-sm truncate">
                                <Briefcase className="w-4 h-4" /> Experience: {candidate.experience} Years
                            </p>
                            <p className="flex items-center gap-1 text-sm truncate">
                                <MapPin className="w-4 h-4" /> Location: {candidate.location}
                            </p>
                            <p className="flex items-center gap-1 text-sm col-span-2 truncate">
                                <GraduationCap className="w-4 h-4" /> Education: {candidate.education}
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Right: Actions */}
            <div className="w-full sm:w-auto grid grid-cols-2 gap-4 items-center text-sm min-w-[220px] sm:min-w-[220px]">
                {isLoading ? (
                    <>
                        <div className="space-y-2">
                            {/* Skeleton for Resume line */}
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded bg-gray-200 animate-pulse translate-y-[1px]" /> {/* icon */}
                                <div className="flex gap-1 items-center">
                                    <div className="h-4 rounded bg-gray-200 w-14 animate-pulse" /> {/* label */}
                                    <div className="h-4 rounded bg-gray-200 w-16 animate-pulse" /> {/* link */}
                                </div>
                            </div>
                            {/* Skeleton for Profile line */}
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded bg-gray-200 animate-pulse translate-y-[1px]" /> {/* icon */}
                                <div className="flex gap-1 items-center">
                                    <div className="h-4 rounded bg-gray-200 w-10 animate-pulse" /> {/* label */}
                                    <div className="h-4 rounded bg-gray-200 w-12 animate-pulse" /> {/* link */}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-2">
                            <p className="text-sm flex items-center gap-1 leading-none">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">Resume</span>
                                <button
                                    onClick={() => window.open(candidate.resume, '_blank')}
                                    className="text-teal-600 text-sm no-underline pl-1 leading-none hover:underline"
                                >
                                    [View PDF]
                                </button>
                            </p>

                            <p className="text-sm flex items-center gap-1 leading-none">
                                <Search className="w-4 h-4" />
                                <span className="text-sm">Profile</span>
                                <button
                                    onClick={() =>
                                        window.open(`/dashboard/candidates/profile/${application.id}`, '_blank')
                                    }
                                    className="text-teal-600 text-sm no-underline pl-1 leading-none hover:underline"
                                >
                                    [View]
                                </button>
                            </p>

                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {/* <button className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs font-medium">
                                Rejected
                            </button> */}
                            <button className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                                {application.status}
                            </button>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}
