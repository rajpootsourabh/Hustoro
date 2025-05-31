import React from 'react';
import { GoPerson } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

const CandidateCard = ({ candidate, isSelected, onSelect, isLoading = false }) => {
    const navigate = useNavigate();

    if (isLoading || !candidate) {
        return (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b-2 last:border-0 gap-4 sm:gap-6 animate-pulse">
                {/* Left Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 bg-gray-300 rounded" />
                        <div className="w-12 h-12 bg-gray-300 rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>

                {/* Right Skeleton */}
                <div className="space-y-2 sm:w-[300px] flex-shrink-0">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => navigate(`/dashboard/candidates/profile/${candidate.id}`)}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b-2 last:border-0 gap-4 sm:gap-6 hover:bg-gray-50 transition-colors cursor-pointer"
        >
            {/* Left */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center gap-4">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={onSelect}
                        className="w-5 h-5 accent-green-500 rounded-none"
                    />

                    {candidate.img ? (
                        <img
                            src={candidate.img}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <GoPerson className="w-6 h-6 text-gray-500" />
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <div className="font-semibold text-md text-gray-800 truncate">{candidate.name}</div>
                    <div className="text-sm text-gray-500 truncate">
                        {candidate.designation ? `${candidate.designation} | ` : ''}
                        {candidate.location}
                        {candidate.country ? `, ${candidate.country}` : ''}
                    </div>
                    <div className="text-xs mt-1 text-gray-400 truncate">{candidate.tag}</div>
                </div>
            </div>

            {/* Right - Job Status */}
            <div className="text-sm text-gray-600 space-y-1 sm:w-[300px] flex-shrink-0">
                <div className="text-sm text-gray-800 truncate">{candidate.jobTitle}</div>
                <div className="text-sm text-gray-800 truncate">{candidate.jobLocation}</div>
                <div className="text-sm text-gray-800 truncate">
                    At <span className="text-sm text-black font-semibold">{candidate.stage}</span> Stage
                </div>
                <div className="text-sm text-gray-800 truncate">
                    Via <span className="text-sm text-black font-semibold">{candidate.source}</span>, {candidate.time}
                </div>
            </div>
        </div>
    );
};

export default CandidateCard;
