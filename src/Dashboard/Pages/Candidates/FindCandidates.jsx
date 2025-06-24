import React, { useEffect, useState } from "react";
import axios from "axios";
import FindCandidateCard from "../../Components/Candidates/FindCandidateCard";
import { useParams } from "react-router-dom";

export default function CandidateList() {
   const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState({ stage_id: "", status: "" });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchCandidates = async (page = 1) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/job-applications/job/${jobId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            Accept: "application/json",
          },
          params: {
            page,
            search,
            location,
            stage_id: filters.stage_id,
            status: filters.status,
          },
        }
      );

      const data = response.data || {};
      setJob(data.job || null);
      setJobApplications(data.job_application || []);
      setCandidates(data.candidates || []);
      setPagination(data.pagination || { current_page: 1, last_page: 1 });
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(1);
  }, []);

  const handleSearch = () => {
    fetchCandidates(1);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const clearLocation = () => {
    setLocation("");
  };

  useEffect(() => {
    const isReset =
      !search.trim() && !location.trim() && !filters.stage_id && !filters.status;

    if (isReset) {
      fetchCandidates(1);
    }
  }, [search, location, filters]);


  // Disable Find Candidate if no filter is set
  const isFindDisabled =
    !search.trim() && !location.trim() && !filters.stage_id && !filters.status;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Find Candidates</h2>

        {/* Search Filters */}
        <div className="flex gap-4 mb-6">
          {/* Search input with clear icon */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 pr-10 text-sm py-[10px] border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-700"
                aria-label="Clear search input"
              >
                &#x2715;
              </button>
            )}
          </div>

          {/* Location input with clear icon */}
          <div className="relative">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 pr-10 text-sm py-[10px] border rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
            {location && (
              <button
                onClick={clearLocation}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-700"
                aria-label="Clear location input"
              >
                &#x2715;
              </button>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={isFindDisabled}
            className={`text-sm px-6 py-[10px] bg-teal-700 text-white rounded-md transition ${isFindDisabled
              ? "cursor-not-allowed disabled:opacity-50"
              : "hover:bg-teal-800"
              }`}
          >
            Find Candidate
          </button>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Applications</h3>
          </div>

          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <FindCandidateCard key={i} isLoading />
            ))
          ) : candidates.length > 0 ? (
            candidates.map((candidate, index) => {
              const application = jobApplications[index];
              return (
                <FindCandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  application={application}
                  job={job}
                />
              );
            })
          ) : (
            <p className="text-gray-500">No candidates found.</p>
          )}

          <div className="flex justify-end mt-6 space-x-2 items-center">
            <button
              disabled={pagination.current_page <= 1}
              onClick={() => fetchCandidates(pagination.current_page - 1)}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-teal-700 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="px-3 py-1 text-sm text-gray-700">
              Page {pagination.current_page} of {pagination.last_page}
            </span>

            <button
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() => fetchCandidates(pagination.current_page + 1)}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-teal-700 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
