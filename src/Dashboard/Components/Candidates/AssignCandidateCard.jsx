import React from "react";

// Normal card
export default function AssignCandidateCard({ candidate, isSelected, onSelect }) {
    return (
        <label
            className={`cursor-pointer flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md group ${
                isSelected
                    ? "bg-teal-100/70 dark:bg-teal-800 border-teal-600"
                    : "bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
            }`}
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(isSelected ? null : candidate)}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500"
                onClick={(e) => e.stopPropagation()}
            />
            <img
                src={candidate.avatarUrl}
                alt={`${candidate.first_name} ${candidate.last_name}`}
                className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
            <div className="flex flex-col">
                <p className="font-semibold text-sm">
                    {candidate.first_name} {candidate.last_name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    {candidate.designation} • {candidate.experience} yrs
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p className="text-xs">{candidate.location}</p>
                    <p className="text-xs">{candidate.email}</p>
                </div>
            </div>
        </label>
    );
}

// Skeleton version
AssignCandidateCard.Skeleton = function SkeletonCard() {
    return (
        <div className="animate-pulse flex items-center gap-4 p-3 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 bg-gray-300 dark:bg-gray-700" />
            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="flex gap-2 text-xs">
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
            </div>
        </div>
    );
};
