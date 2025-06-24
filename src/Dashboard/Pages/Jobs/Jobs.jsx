import React, { useEffect, useState } from 'react'
import Job from '../../Components/job'
import { Link, useNavigate } from 'react-router-dom'
import { changeTitle } from '../../../utils/changeTitle'
import axios from 'axios'
import { useSnackbar } from '../../Components/SnackbarContext'
import UploadCandidateForm from '../../Components/Candidates/UploadCandidateForm';
import ConfirmModal from '../../Components/ConfirmModal'
import AssignJobPopup from '../../Components/Job/AssignJobPopup'

const Jobs = () => {
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()
  const [jobList, setJobList] = useState([])
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [animateOut, setAnimateOut] = useState(false);
  const navigate = useNavigate()
  const [jobStats, setJobStats] = useState([]);
  const [confirmDeleteJob, setConfirmDeleteJob] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);



  const getJobsStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/job-applications/stats`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      if (response.status === 200 && response.data.status === 'success') {
        const normalizedJobStats = response.data.data.map(stat => {
          const stages = stat.stages || {};
          return {
            job_id: stat.job_id,
            resource_count: stat.total || 0,
            applied: stages["Applied"] || 0,
            phone_screen: stages["Phone Screen"] || 0,
            assessment: stages["Assessment"] || 0,
            interview: stages["Interview"] || 0,
            offer: stages["Offer"] || 0,
            hired: stages["Hired"] || 0,
            sourced: stages["Sourced"] || 0,
            total_candidates: stat.total || 0,
          };
        });
        setJobStats(normalizedJobStats);
      } else {
        showSnackbar("Failed to fetch job stats", "error");
      }
    } catch (error) {
      console.error("Error fetching job stats:", error);
      showSnackbar("Error fetching job stats", "error");
    }
  };


  useEffect(() => {
    changeTitle("Jobs");
    fetchJobList();
  }, []);


  const handleUploadClick = (job) => {
    setSelectedJob(job);
    setShowUploadForm(true);
  };

  const handleEditJobClick = (job) => {
    console.log("Editing job:", job);
    navigate(`/dashboard/jobs/edit/${job.id}`);
  };

  const handleJobOverviewClick = (job) => {
    console.log("Viewing job overview:", job);
    navigate(`/dashboard/jobs/overview/${job.id}`);
  };

  const handleDuplicateJobClick = async (job) => {
    try {
      const fetchResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/job/${job.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const originalJob = fetchResponse.data.data;

      const duplicatedJob = {
        job_title: `${originalJob.job_title} (Copy)`,
        job_code: `${originalJob.job_code}-${Date.now()}`,
        job_workplace: originalJob.job_workplace,
        job_location: originalJob.job_location,
        job_department: originalJob.job_department,
        job_function: originalJob.job_function,
        employment_type: originalJob.employment_type,
        experience: originalJob.experience,
        education: originalJob.education,
        keywords: originalJob.keywords?.split(",").map(k => k.trim()) || [],
        annual_salary_from: originalJob.from_salary,
        annual_salary_to: originalJob.to_salary,
        currency: originalJob.currency,
        showOnCarrerPage: true,
        job_description: originalJob.description,
        job_requirements: originalJob.requirements,
        job_benefits: originalJob.benefits,
      };

      const createResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/job/create`, duplicatedJob, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (createResponse.status === 201) {
        showSnackbar("Job duplicated successfully!", "success");
        await fetchJobList();
      } else {
        showSnackbar("Failed to duplicate job", "error");
      }

    } catch (error) {
      console.error("Error duplicating job:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to duplicate job.",
        "error"
      );
    }
  };

  const handleDeleteClick = (job) => {
    setConfirmDeleteJob(job);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteJob) return;
    setConfirmDeleteLoading(true); // Start loading
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/job/delete/${confirmDeleteJob.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showSnackbar("Failed to delete job", "error");
      } else {
        setJobList((prevList) => prevList.filter((j) => j.id !== confirmDeleteJob.id));
        showSnackbar("Job deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      showSnackbar("Failed to delete job", "error");
    }
    setConfirmDeleteLoading(false);
    setIsConfirmModalOpen(false);
    setConfirmDeleteJob(null);
  };

  const handleFindCandidateClick = (job) => {
    console.log("Finding candidates for:", job);
    navigate(`/dashboard/jobs/${job.id}/candidates`);
  };

  const handleCandidateUpload = async (formData) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/job-applications`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (res.status === 201) {
        showSnackbar("Candidate uploaded successfully", "success");
        setShowUploadForm(false);
      } else {
        showSnackbar("Upload failed", "error");
      }
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Error during upload", "error");
    } finally {
      setLoading(false); // Ensures loading is turned off no matter what
    }
  };


  const handleAssignJobClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setShowAssignPopup(true);
  };

  const closeUploadForm = () => {
    setAnimateOut(true); // Trigger the fade-out animation
    setTimeout(() => {
      setShowUploadForm(false); // Hide the modal after animation ends
      setAnimateOut(false);     // Reset animation state
      setSelectedJob(null);     // Clear the selected job
    }, 300); // match this with the fadeOut duration in Tailwind (0.3s = 300ms)
  };

  const fetchJobList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/job/list`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
      });
      if (response.status === 200) {
        const sortedJobs = response.data.data.sort((a, b) => b.id - a.id);
        setJobList([...sortedJobs]);
        await getJobsStats();  // fetch stats only after jobs list is ready
      } else {
        showSnackbar(response.data.message);
        setJobList([]);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 401) {
        navigate("/signin");
        showSnackbar("Session expired, please login again", "error");
      } else {
        showSnackbar(error.response?.data?.message || "Error fetching jobs", "error");
        setJobList([]);
      }
    }
    setLoading(false);
  };

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <div className='flex bg-white w-full items-center justify-between px-32 py-4 border-b-2 shadow-sm shadow-gray-100 border-gray-200'>
        <p className='text-xl font-medium'>Jobs</p>
        <div className='flex gap-4 items-center'>
          <Link to="/dashboard/jobs/new">
            <button className='rounded-full px-4 py-1 text-sm bg-[#00756A] text-white'>
              Create a New Job
            </button>
          </Link>
        </div>
      </div>
      {
        !loading
          ? (
            <div className='w-full min-h-[78vh] grid grid-flow-row px-32 gap-8 py-10'>
              {
                jobList.length
                  ? jobList.map((item) => {
                    const stats = jobStats.find((s) => s.job_id === item.id) || {};
                    return (
                      <Job
                        key={item.id}
                        job={item}
                        stats={stats}
                        onUploadClick={handleUploadClick}
                        onFindCandidateClick={handleFindCandidateClick}
                        onFindDeleteClick={handleDeleteClick}
                        onEditJobClick={handleEditJobClick}
                        onJobOverviewClick={handleJobOverviewClick}
                        onDuplicateJobClick={handleDuplicateJobClick}
                        onAssignJobClick={handleAssignJobClick}
                        isLoading={false}
                      />
                    );
                  })
                  : <div className='bg-white h-fit flex justify-center items-center py-5 rounded-lg text-gray-800'>No Jobs</div>
              }
            </div>
          )
          : (
            <div className='w-full min-h-[78vh] grid grid-flow-row px-32 gap-8 py-10'>
              {Array.from({ length: 3 }).map((_, index) => (
                <Job key={index} isLoading={true} />
              ))}
            </div>
          )
      }

      {showUploadForm && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 z-50 overflow-y-auto flex justify-center items-start pt-8 px-4 sm:px-6 
    ${animateOut ? 'animate-shrinkToBottom' : 'animate-growFromBottom'}`}
        >
          <div className="w-full max-w-4xl">
            <UploadCandidateForm
              onClose={closeUploadForm}
              selectedJob={selectedJob}
              sourceId={1}
              loading={loading}
              onSubmit={(formData) => handleCandidateUpload(formData)}
            />
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setConfirmDeleteJob(null);
        }}
        loadingState={confirmDeleteLoading}
        onConfirm={confirmDelete}
        title={`Delete Job "${confirmDeleteJob?.job_title}"?`}
        description="Are you sure you want to delete this job? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
      />

      {showAssignPopup && (
        <AssignJobPopup
          onClose={() => setShowAssignPopup(false)}
          onAssign={(employeeId, candidate) => {
            console.log('Assigned:', employeeId, candidate);
            // Perform API call or state update
            setShowAssignPopup(false);
          }}
          employeeId={selectedEmployeeId}
        />
      )}
    </div>
  )
}

export default Jobs
