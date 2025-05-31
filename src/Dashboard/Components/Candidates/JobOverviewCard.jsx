import React, { useState } from "react";

export default function JobOverviewCard({ job, loading = false }) {
  console.log(job)
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showFullBenefits, setShowFullBenefits] = useState(false);

  const details = [
    { label: "Title", value: job?.job_title },
    { label: "Department", value: job?.job_department || "N/A" },
    { label: "Location", value: job?.job_location || "N/A" },
    { label: "Experience", value: job?.experience || "Not specified" },
    { label: "Employment Type", value: job?.employment_type || "N/A" },
    { label: "Key Skills", value: job?.keywords || "Not specified" },
    {
      label: "Salary",
      value:
        job
          ? `${job.from_salary} – ${job.to_salary} ${job.currency || ""}`
          : null,
    },
  ];

  if (!loading && !job) {
    return (
      <p className="text-sm text-gray-400 text-center">Job details not available.</p>
    );
  }

  // Helper function to check if text overflows 3 lines
  // We can't perfectly detect line overflow in JS here, so we rely on length heuristic:
  // You may adjust length threshold if needed.
  const isLongText = (text, threshold = 200) => text && text.length > threshold;


  return (
    <div className="bg-white rounded-2xl p-6 max-w-md mx-auto">
      <h3 className="text-md font-semibold text-gray-900 mb-5 text-center tracking-wide">
        Job Overview
      </h3>

      {/* Horizontal line */}
      <div className="border-t-2 border-gray-200 mb-4"></div>

      {/* Details */}
      <div className="space-y-3 text-gray-700">
        {(loading ? Array(details.length).fill({}) : details).map(({ label, value }, idx) => (
          <div
            key={label || idx}
            className="flex justify-between border-b border-gray-100 pb-1"
          >
            <span className="font-medium text-gray-600 text-sm">
              {loading ? (
                <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
              ) : (
                label + ":"
              )}
            </span>
            <span className="text-gray-800 max-w-[60%] text-right truncate text-sm">
              {loading ? (
                <div className="h-4 w-32 rounded bg-gray-200 animate-pulse ml-auto"></div>
              ) : (
                value
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Job Description */}
      <div className="mt-6">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Job Description</h4>
        {loading ? (
          <>
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse mb-1"></div>
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse mb-1"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse mb-1"></div>
            <div className="h-4 w-4/6 rounded bg-gray-200 animate-pulse"></div>
          </>
        ) : (
          <>
            <p
              className={`text-gray-700 text-sm ${
                !showFullDesc
                  ? "line-clamp-3 overflow-hidden"
                  : ""
              }`}
            >
              {job?.description || "No job description provided."}
            </p>
            {isLongText(job?.description) && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="mt-1 text-blue-500 text-xs font-semibold hover:underline"
                type="button"
              >
                {showFullDesc ? "Show less" : "Show more"}
              </button>
            )}
          </>
        )}
      </div>

      {/* Benefits */}
      <div className="mt-6">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Benefits</h4>
        {loading ? (
          <>
            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse mb-1"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse mb-1"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse"></div>
          </>
        ) : (
          <>
            <p
              className={`text-gray-700 text-sm whitespace-pre-wrap ${
                !showFullBenefits
                  ? "line-clamp-3 overflow-hidden"
                  : ""
              }`}
            >
              {job?.benefits || "No benefits information provided."}
            </p>
            {isLongText(job?.benefits) && (
              <button
                onClick={() => setShowFullBenefits(!showFullBenefits)}
                className="mt-1 text-blue-500 text-xs font-semibold hover:underline"
                type="button"
              >
                {showFullBenefits ? "Show less" : "Show more"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
