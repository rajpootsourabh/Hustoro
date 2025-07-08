import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, MoreVertical } from "lucide-react";
import axios from "axios";
import { useSnackbar } from "../../Components/SnackbarContext";

const sampleJobs = [
  {
    id: "sample-1",
    job_title: "Frontend Developer",
    job_location: "Remote",
    job_workplace: "Work from Home",
    isSample: true,
  },
  {
    id: "sample-2",
    job_title: "Backend Engineer",
    job_location: "Mumbai",
    job_workplace: "Onsite",
    isSample: true,
  },
  {
    id: "sample-3",
    job_title: "Product Designer",
    job_location: "Bangalore",
    job_workplace: "Hybrid",
    isSample: true,
  },
];

const JobsCard = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuIndex, setMenuIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const [jobRes, statsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/job/list`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/job-applications/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const jobList = jobRes.data?.data || [];

        if (Array.isArray(jobList) && jobList.length > 0) {
          const sorted = jobList.sort((a, b) => b.id - a.id).slice(0, 3);
          setJobs(sorted.map((job) => ({ ...job, isSample: false })));
        } else {
          setJobs(sampleJobs);
        }

        setStats(statsRes.data.data || []);
      } catch (err) {
        console.error("Error loading job data:", err);
        setJobs(sampleJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getApplicantCount = (jobId) => {
    const jobStat = stats.find((stat) => stat.job_id === jobId);
    return jobStat?.total || 0;
  };

  const handlePreview = (jobId) => {
    navigate(`/dashboard/jobs/overview/${jobId}`);
  };

  const handleEdit = (jobId) => {
    navigate(`/dashboard/jobs/edit/${jobId}`);
  };

  const handleDuplicate = async (job) => {
    setMenuIndex(null);
    try {
      const token = localStorage.getItem("access_token");

      const fetchRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/job/${job.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const original = fetchRes.data.data;

      const duplicate = {
        job_title: `${original.job_title} (Copy)`,
        job_code: `${original.job_code}-${Date.now()}`,
        job_workplace: original.job_workplace,
        job_location: original.job_location,
        job_department: original.job_department,
        job_function: original.job_function,
        employment_type: original.employment_type,
        experience: original.experience,
        education: original.education,
        keywords: original.keywords?.split(",").map((k) => k.trim()) || [],
        annual_salary_from: original.from_salary,
        annual_salary_to: original.to_salary,
        currency: original.currency,
        showOnCarrerPage: true,
        job_description: original.description,
        job_requirements: original.requirements,
        job_benefits: original.benefits,
      };

      const createRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/job/create`,
        duplicate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (createRes.status === 201) {
        showSnackbar("Job duplicated successfully!", "success");

        const updatedJobsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/job/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedJobs = (updatedJobsRes.data.data || []).sort((a, b) => b.id - a.id);
        setJobs(sortedJobs.slice(0, 3).map((job) => ({ ...job, isSample: false })));
      }
    } catch (err) {
      console.error("Error duplicating job:", err);
      showSnackbar("Failed to duplicate job", "error");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow">
        {/* ✅ Real Header (not skeleton) */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#007a6e] rounded-full flex items-center justify-center text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-black">Jobs</h2>
          </div>
          <button
            className="px-5 py-1.5 rounded-full text-sm font-medium bg-gray-300 text-white cursor-not-allowed"
            disabled
          >
            Create Job
          </button>

        </div>

        {/* 🔄 Skeleton Rows */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-6 py-4 border-b animate-pulse"
          >
            <div>
              <div className="h-4 w-40 bg-gray-300 rounded mb-2" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-6 w-6 bg-gray-300 rounded" />
            </div>
          </div>
        ))}

        {/* Skeleton for "View All Jobs" button */}
        <div className="text-center px-6 py-3 animate-pulse">
          <div className="h-4 w-28 mx-auto bg-gray-300 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow">
      {/* Header always visible */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#007a6e] rounded-full flex items-center justify-center text-white">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-black">Jobs</h2>
        </div>
        <button
          onClick={() => navigate("/dashboard/jobs/new")}
          disabled={loading}
          className={`px-5 py-1.5 rounded-full text-sm font-medium ${loading
            ? "bg-gray-300 text-white cursor-not-allowed"
            : "bg-[#007A6E] hover:bg-[#006a60] text-white"
            }`}
        >
          Create Job
        </button>

      </div>

      {/* Content */}
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-6 py-4 border-b animate-pulse"
          >
            <div>
              <div className="h-4 w-40 bg-gray-300 rounded mb-2" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-6 w-6 bg-gray-300 rounded" />
            </div>
          </div>
        ))
      ) : (
        jobs.map((job, i) => (
          <div
            key={job.id}
            className="flex justify-between items-center px-6 py-4 border-b relative"
          >
            <div>
              <p className="text-sm font-semibold text-black flex items-center gap-2">
                {job.job_title}
                {job.isSample && (
                  <span className="text-[10px] bg-[#E8FBF7] text-[#007a6e] px-2 py-0.5 rounded-full font-medium">
                    SAMPLE
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                {job.job_location} – {job.job_workplace}
              </p>
            </div>
            {!job.isSample && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <Users className="w-4 h-4" /> {getApplicantCount(job.id)}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setMenuIndex(menuIndex === i ? null : i)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {menuIndex === i && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-44 bg-white shadow rounded-md text-sm z-10 border"
                    >
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          handlePreview(job.id);
                          setMenuIndex(null);
                        }}
                      >
                        Preview Job Post
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          handleEdit(job.id);
                          setMenuIndex(null);
                        }}
                      >
                        Edit Job
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={async () => {
                          await handleDuplicate(job);
                          setMenuIndex(null);
                        }}
                      >
                        Duplicate Job
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* View All Button */}
      <div className="text-center px-6 py-3">
        <button
          className="text-sm text-[#0e079a] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => navigate("/dashboard/jobs")}
          disabled={loading}
        >
          View All Jobs
        </button>
      </div>
    </div>
  );

};

export default JobsCard;
